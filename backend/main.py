from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import base64
import cv2
import numpy as np
import logging
from typing import Optional

# ultralytics import
try:
    from ultralytics import YOLO
except Exception as e:
    YOLO = None

app = FastAPI()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pothole-backend")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Pothole Detection Backend is running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": model is not None}

# Path to your model - update accordingly
MODEL_PATH = "./best.pt"

model = None
if YOLO is not None:
    try:
        model = YOLO(MODEL_PATH)
        logger.info("YOLO model loaded.")
    except Exception as e:
        logger.exception("Failed to load YOLO model: %s", e)
else:
    logger.warning("ultralytics.YOLO not available. Install ultralytics package.")

async def encode_frame(frame: np.ndarray) -> str:
    # Encode to JPEG with reasonable quality
    success, jpg = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
    if not success:
        raise RuntimeError("Failed to encode frame")
    return base64.b64encode(jpg.tobytes()).decode('utf-8')

def safe_resize(frame: np.ndarray, max_side: int = 1024) -> np.ndarray:
    h, w = frame.shape[:2]
    max_dim = max(h, w)
    if max_dim <= max_side:
        return frame
    scale = max_side / max_dim
    return cv2.resize(frame, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

@app.websocket("/ws/pothole")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("Client connected via WebSocket")
    try:
        while True:
            try:
                data = await websocket.receive_text()
            except WebSocketDisconnect:
                logger.info("Client disconnected")
                break

            if not data:
                continue
            try:
                # Decode base64 image (no dataURL prefix expected)
                nparr = np.frombuffer(base64.b64decode(data), np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                if frame is None:
                    logger.warning("Empty frame after decode")
                    continue

                # Optionally resize to protect memory (backend side)
                frame_for_model = safe_resize(frame, max_side=1024)

                num_potholes = 0
                detected_boxes = []
                
                try:
                    if model is None:
                        logger.warning("Model not loaded - skipping inference")
                        results = []
                    else:
                        # ultralytics models accept numpy frame directly
                        results = model(frame_for_model)[0]  # results object
                except Exception as e:
                    logger.exception("Model inference error: %s", e)
                    results = []

                # For testing - add fake detection if no model
                if model is None:
                    # Add fake pothole detection for testing
                    num_potholes = 2
                    h, w = frame_for_model.shape[:2]
                    cv2.rectangle(frame_for_model, (50, 50), (150, 150), (0, 0, 255), 2)
                    cv2.putText(frame_for_model, "Test Pothole", (50, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                else:
                    # Real model detection with lower threshold
                    if hasattr(results, "boxes") and results.boxes is not None:
                        for box in results.boxes:
                            try:
                                xyxy = box.xyxy[0].cpu().numpy() if hasattr(box, "xyxy") else None
                                conf = float(box.conf[0]) if hasattr(box, "conf") else None
                                
                                # Lower confidence threshold to 0.1
                                if xyxy is not None and (conf is None or conf > 0.1):
                                    x1, y1, x2, y2 = int(xyxy[0]), int(xyxy[1]), int(xyxy[2]), int(xyxy[3])
                                    detected_boxes.append({
                                        'coords': (x1, y1, x2, y2),
                                        'conf': conf
                                    })
                                    num_potholes += 1
                            except Exception as e:
                                logger.exception("Error processing box: %s", e)

                    # Draw boxes for detected potholes
                    for box_info in detected_boxes:
                        x1, y1, x2, y2 = box_info['coords']
                        conf = box_info['conf']
                        cv2.rectangle(frame_for_model, (x1, y1), (x2, y2), (0, 0, 255), 2)
                        label = f"Pothole {conf:.2f}" if conf is not None else "Pothole"
                        cv2.putText(frame_for_model, label, (x1, max(10, y1 - 10)),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

                # encode and send
                encoded = await encode_frame(frame_for_model)
                message = {"frame": encoded, "count": num_potholes}
                await websocket.send_json(message)

                # throttle ~ 12-20 fps backend side as well
                await asyncio.sleep(0.04)
            except Exception as e:
                logger.exception("Frame processing error: %s", e)
                # send a small error message optionally (avoid spamming)
                try:
                    await websocket.send_json({"frame": "", "count": 0, "error": "server_error"})
                except Exception:
                    pass

    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
    except Exception as e:
        logger.exception("Unexpected server error: %s", e)
    finally:
        try:
            await websocket.close()
        except Exception:
            pass
        logger.info("Connection cleanup done")