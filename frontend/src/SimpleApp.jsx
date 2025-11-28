import React, { useState, useEffect, useRef } from "react";

export default function SimpleApp() {
  const [potholeCount, setPotholeCount] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  const [statusText, setStatusText] = useState("Connecting...");
  const [hasImage, setHasImage] = useState(false);
  const imgRef = useRef(null);
  const wsRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const WS_URL = "ws://localhost:8000/ws/pothole";
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsConnected(true);
      setStatusText("Connected");
    };

    ws.onclose = () => {
      setWsConnected(false);
      setStatusText("Disconnected");
    };

    ws.onerror = () => {
      setStatusText("Connection error");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { frame, count } = data;
        
        setPotholeCount(count || 0);
        
        if (imgRef.current && frame) {
          imgRef.current.src = "data:image/jpeg;base64," + frame;
          setHasImage(true);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    return () => ws.close();
  }, []);

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const videoEl = document.createElement("video");
      videoEl.src = reader.result;
      videoEl.muted = true;
      videoEl.playsInline = true;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      videoEl.addEventListener("loadedmetadata", () => {
        canvas.width = 640;
        canvas.height = 480;
        videoEl.play();

        const sendFrame = () => {
          if (videoEl.paused || videoEl.ended) return;
          
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            const reader2 = new FileReader();
            reader2.onloadend = () => {
              const base64 = reader2.result.replace(/^data:image\/(png|jpeg);base64,/, "");
              if (wsRef.current?.readyState === 1) {
                wsRef.current.send(base64);
              }
            };
            reader2.readAsDataURL(blob);
          }, "image/jpeg", 0.7);
          
          setTimeout(sendFrame, 100);
        };
        sendFrame();
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      color: "white",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "30px" }}>
        🛣️ Pothole Detection System
      </h1>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "300px 1fr", 
        gap: "20px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "20px",
        padding: "20px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h3>Upload Video</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              disabled={!wsConnected}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "2px dashed #ccc",
                background: "rgba(255,255,255,0.1)",
                color: "white"
              }}
            />
          </div>

          <div style={{
            padding: "15px",
            borderRadius: "10px",
            background: wsConnected ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
            border: `1px solid ${wsConnected ? "#22c55e" : "#ef4444"}`,
            color: wsConnected ? "#22c55e" : "#ef4444",
            textAlign: "center"
          }}>
            Status: {statusText}
          </div>

          <div style={{
            padding: "20px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.1)",
            textAlign: "center"
          }}>
            <h3>Potholes Detected</h3>
            <div style={{ fontSize: "3rem", fontWeight: "bold" }}>
              {potholeCount}
            </div>
          </div>
        </div>

        <div style={{
          borderRadius: "15px",
          overflow: "hidden",
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "500px"
        }}>
          {hasImage ? (
            <img
              ref={imgRef}
              alt="Detection Feed"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          ) : (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
              <div style={{ fontSize: "4rem" }}>📹</div>
              <p>Upload a video to start detection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}