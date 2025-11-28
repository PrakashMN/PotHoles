import React, { useState, useEffect, useRef } from "react";

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)",
    fontFamily:
      "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#ffffff",
    padding: "0",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  backgroundOrbs: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    zIndex: 0,
    pointerEvents: "none",
  },
  orb: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.3,
    animation: "float 20s ease-in-out infinite",
    willChange: "transform",
  },
  orb1: {
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
    top: "-200px",
    left: "-200px",
    animationDelay: "0s",
  },
  orb2: {
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
    bottom: "-250px",
    right: "-250px",
    animationDelay: "5s",
  },
  orb3: {
    width: "450px",
    height: "450px",
    background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
    top: "50%",
    right: "-175px",
    animationDelay: "10s",
  },
  content: {
    position: "relative",
    zIndex: 1,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
    width: "100%",
    maxWidth: "none",
    boxSizing: "border-box",
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "2rem",
    animation: "slideDown 0.8s ease-out",
  },
  logo: {
    width: "60px",
    height: "60px",
    position: "relative",
    animation: "logoSpin 8s linear infinite",
  },
  logoRing: {
    position: "absolute",
    borderRadius: "50%",
    border: "3px solid transparent",
  },
  logoOuterRing: {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)",
    padding: "3px",
    borderRadius: "50%",
    animation: "logoRotate 6s linear infinite",
  },
  logoInnerRing: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logoIcon: {
    fontSize: "24px",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "logoIconPulse 2s ease-in-out infinite",
  },
  header: {
    fontSize: "3.5rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.03em",
    willChange: "transform, opacity",
  },
  unifiedPanel: {
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
    backdropFilter: "blur(32px)",
    borderRadius: "24px",
    padding: "2.5rem",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: "0 32px 100px rgba(0, 0, 0, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.15)",
    display: "grid",
    gridTemplateColumns: "350px 1fr",
    gap: "3rem",
    minHeight: "700px",
    animation: "fadeInUp 0.8s ease-out 0.2s both",
    alignItems: "stretch",
  },
  leftControls: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    animation: "slideInLeft 0.6s ease-out 0.4s both",
  },
  rightContent: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    animation: "slideInRight 0.6s ease-out 0.6s both",
  },
  controlSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    animation: "fadeInUp 0.5s ease-out both",
  },
  buttonGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  sectionTitle: {
    fontSize: "0.9rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: "rgba(255, 255, 255, 0.8)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    animation: "glow 3s ease-in-out infinite alternate",
  },
  input: {
    width: "100%",
    padding: "1rem 1.5rem",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",
    backdropFilter: "blur(8px)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  },
  inputHover: {
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)",
    borderColor: "rgba(59, 130, 246, 0.5)",
    transform: "translateY(-2px) scale(1.01)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 15px 40px rgba(59, 130, 246, 0.2)",
  },
  inputDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    cursor: "not-allowed",
    opacity: 0.5,
  },
  button: {
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "600",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    outline: "none",
    backdropFilter: "blur(12px)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    whiteSpace: "nowrap",
    animation: "buttonFloat 4s ease-in-out infinite",
  },
  buttonStop: {
    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#ef4444",
  },
  buttonStopHover: {
    background: "rgba(239, 68, 68, 0.3)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(239, 68, 68, 0.3)",
  },
  buttonRestart: {
    background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    color: "#22c55e",
  },
  buttonRestartHover: {
    background: "rgba(34, 197, 94, 0.3)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)",
  },
  buttonDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
    transform: "none",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    animation: "fadeIn 0.5s ease",
    minHeight: "50px",
    width: "100%",
    justifyContent: "center",
    backdropFilter: "blur(12px)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  },
  statusConnected: {
    background: "rgba(34, 197, 94, 0.15)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    color: "#22c55e",
  },
  statusDisconnected: {
    background: "rgba(251, 146, 60, 0.15)",
    border: "1px solid rgba(251, 146, 60, 0.3)",
    color: "#fb923c",
  },
  statusError: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#ef4444",
  },
  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    animation: "pulse 2s ease-in-out infinite",
  },
  alert: {
    padding: "1.5rem",
    borderRadius: "16px",
    fontSize: "1rem",
    fontWeight: "600",
    textAlign: "center",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    minHeight: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(16px)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  },
  alertGreen: {
    background: "rgba(34, 197, 94, 0.2)",
    border: "2px solid rgba(34, 197, 94, 0.4)",
    color: "#22c55e",
    boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
    animation: "alertPulse 2s ease-in-out infinite",
  },
  alertRed: {
    background: "rgba(239, 68, 68, 0.2)",
    border: "2px solid rgba(239, 68, 68, 0.4)",
    color: "#ef4444",
    boxShadow: "0 0 30px rgba(239, 68, 68, 0.3)",
    animation: "alertPulseUrgent 1s ease-in-out infinite",
  },
  infoBox: {
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)",
    backdropFilter: "blur(16px)",
    borderRadius: "16px",
    padding: "1.5rem",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    willChange: "transform",
    minHeight: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15)",
  },
  infoBoxHover: {
    transform: "translateY(-2px) scale(1.01)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 15px 40px rgba(59, 130, 246, 0.2)",
    borderColor: "rgba(59, 130, 246, 0.4)",
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)",
  },
  infoBoxTitle: {
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: "0.5rem",
    fontWeight: "600",
  },
  infoBoxValue: {
    fontSize: "2rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: "0.25rem 0",
    lineHeight: 1.2,
    transition: "all 0.3s ease",
    animation: "numberPulse 2s ease-in-out infinite",
  },
  videoWrapper: {
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 32px 80px rgba(0, 0, 0, 0.7), inset 0 2px 0 rgba(255, 255, 255, 0.08)",
    minHeight: "400px",
    width: "100%",
    flex: 1,
    backdropFilter: "blur(20px)",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    width: "auto",
    height: "auto",
    objectFit: "contain",
    display: "block",
  },
  placeholder: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.5rem",
    color: "rgba(255, 255, 255, 0.5)",
  },
  placeholderIcon: {
    fontSize: "5rem",
    opacity: 0.4,
    animation: "float 3s ease-in-out infinite",
  },
  placeholderText: {
    fontSize: "1.1rem",
    fontWeight: "500",
  },
  footer: {
    textAlign: "center",
    padding: "1.5rem",
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: "0.9rem",
    animation: "fadeIn 0.8s ease-out 0.4s both",
    marginTop: "1rem",
  },
};

const keyframes = `
* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  padding: 0;
  width: 100%;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.95); }
}

@keyframes alertPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.01); }
}

@keyframes alertPulseUrgent {
  0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(239, 68, 68, 0.3); }
  50% { transform: scale(1.02); box-shadow: 0 0 60px rgba(239, 68, 68, 0.5); }
}

@keyframes countUp {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes glow {
  from {
    text-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
  }
  to {
    text-shadow: 0 0 10px rgba(59, 130, 246, 0.6), 0 0 15px rgba(139, 92, 246, 0.4);
  }
}

@keyframes buttonFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-1px);
  }
}

@keyframes numberPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes logoSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes logoRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

@keyframes logoIconPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@media (max-width: 1200px) {
  .responsive-card { 
    grid-template-columns: 1fr !important; 
    gap: 1.5rem !important;
  }
}

.responsive-card {
  width: 100% !important;
  max-width: none !important;
}

::-webkit-scrollbar {
  display: none;
}

* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;

export default function App() {
  const [potholeCount, setPotholeCount] = useState(0);
  const [totalPotholes, setTotalPotholes] = useState(0);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVariant, setAlertVariant] = useState("green");
  const [wsConnected, setWsConnected] = useState(false);
  const [statusText, setStatusText] = useState("Connecting...");
  const [error, setError] = useState("");
  const [inputHover, setInputHover] = useState(false);
  const [stopHover, setStopHover] = useState(false);
  const [restartHover, setRestartHover] = useState(false);
  const [currentHover, setCurrentHover] = useState(false);
  const [totalHover, setTotalHover] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const imgRef = useRef(null);
  const wsRef = useRef(null);
  const sendQueueRef = useRef([]);
  const prevCountRef = useRef(0);
  const lastAlertTimeRef = useRef(0);
  const audioContextRef = useRef(null);
  const videoElRef = useRef(null);
  const processingStoppedRef = useRef(false);
  const fileInputRef = useRef(null);
  const currentVideoFileRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const cameraVideoRef = useRef(null);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = keyframes;
    document.head.appendChild(styleTag);

    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();

    setWsConnected(true);
    setStatusText("Ready");
    
    const WS_URL = "ws://127.0.0.1:8000/ws/pothole";
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsConnected(true);
      setStatusText("Connected");
      setError("");
    };

    ws.onclose = () => {
      setWsConnected(false);
      setStatusText("Disconnected");
    };

    ws.onerror = (ev) => {
      setError("Connection error");
      setStatusText("Connection error");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { frame, count } = data;
        const currentCount = count ?? 0;

        setPotholeCount(currentCount);

        if (currentCount > 0) {
          if (currentCount > prevCountRef.current) {
            const newPotholes = currentCount - prevCountRef.current;
            setTotalPotholes((prev) => prev + newPotholes);
          }
          prevCountRef.current = currentCount;

          setAlertVariant("red");
          setAlertMsg(`🚨 ${currentCount} Pothole${currentCount > 1 ? 's' : ''} Detected!`);
          if (currentCount >= 3) playVoiceAlert();
        } else {
          prevCountRef.current = 0;
          setAlertVariant("green");
          setAlertMsg("✅ Road Conditions: Clear");
        }

        if (imgRef.current && frame) {
          imgRef.current.src = "data:image/jpeg;base64," + frame;
          setHasImage(true);
        }
      } catch (err) {
        console.error("Error handling message:", err);
      }
    };

    return () => {
      try {
        ws.close();
      } catch (e) {}
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      document.head.removeChild(styleTag);
    };
  }, []);

  const getAlertStyle = () => {
    if (alertVariant === "red") return { ...styles.alert, ...styles.alertRed };
    return { ...styles.alert, ...styles.alertGreen };
  };

  const getStatusStyle = () => {
    if (error) return { ...styles.statusBadge, ...styles.statusError };
    if (wsConnected)
      return { ...styles.statusBadge, ...styles.statusConnected };
    return { ...styles.statusBadge, ...styles.statusDisconnected };
  };

  const getStatusDotColor = () => {
    if (error) return "#ef4444";
    if (wsConnected) return "#22c55e";
    return "#fb923c";
  };

  const playVoiceAlert = () => {
    const now = Date.now();
    if (now - lastAlertTimeRef.current < 5000) return;
    lastAlertTimeRef.current = now;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(
        "Potholes ahead, be careful"
      );
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    currentVideoFileRef.current = file;
    handleStop();
    startVideoProcessing(file);
  };

  const startVideoProcessing = (file) => {
    setPotholeCount(0);
    setTotalPotholes(0);
    prevCountRef.current = 0;
    processingStoppedRef.current = false;
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = () => {
      const videoUrl = reader.result;
      const videoEl = document.createElement("video");
      videoElRef.current = videoEl;
      videoEl.src = videoUrl;
      videoEl.muted = true;
      videoEl.playsInline = true;

      const TARGET_FPS = 12;
      const FRAME_INTERVAL_MS = 1000 / TARGET_FPS;
      let lastSendTime = 0;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      videoEl.addEventListener("loadedmetadata", () => {
        const MAX_WIDTH = 640;
        const scale = Math.min(1, MAX_WIDTH / videoEl.videoWidth);
        canvas.width = Math.round(videoEl.videoWidth * scale);
        canvas.height = Math.round(videoEl.videoHeight * scale);

        videoEl.play().catch((err) => {
          console.warn("video play error:", err);
        });

        const frameLoop = () => {
          if (videoEl.paused || videoEl.ended || processingStoppedRef.current) {
            if (videoEl.ended || processingStoppedRef.current) {
              setIsProcessing(false);
            }
            return;
          }

          const now = performance.now();
          if (now - lastSendTime >= FRAME_INTERVAL_MS) {
            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
              (blob) => {
                if (!blob) return;
                const reader2 = new FileReader();
                reader2.onloadend = () => {
                  const dataUrl = reader2.result;
                  const base64 = dataUrl.replace(
                    /^data:image\/(png|jpeg);base64,/,
                    ""
                  );
                  if (wsRef.current && wsRef.current.readyState === 1) {
                    try {
                      wsRef.current.send(base64);
                    } catch (err) {
                      console.error("send error", err);
                    }
                  } else {
                    sendQueueRef.current.push(base64);
                    if (sendQueueRef.current.length > 30)
                      sendQueueRef.current.shift();
                  }
                };
                reader2.readAsDataURL(blob);
              },
              "image/jpeg",
              0.7
            );
            lastSendTime = now;
          }
          requestAnimationFrame(frameLoop);
        };

        frameLoop();
      });
    };
    reader.readAsDataURL(file);
  };

  const handleStop = () => {
    processingStoppedRef.current = true;
    setIsProcessing(false);

    if (videoElRef.current) {
      videoElRef.current.pause();
      videoElRef.current.currentTime = 0;
    }
    
    if (isCameraActive) {
      stopCamera();
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleRestart = () => {
    if (!currentVideoFileRef.current) return;

    handleStop();
    setPotholeCount(0);
    setTotalPotholes(0);
    prevCountRef.current = 0;
    startVideoProcessing(currentVideoFileRef.current);
  };

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      console.log('Camera access granted, setting up video...');
      cameraStreamRef.current = stream;
      setIsCameraActive(true);
      setIsProcessing(true);
      
      setPotholeCount(0);
      setTotalPotholes(0);
      prevCountRef.current = 0;
      processingStoppedRef.current = false;
      
      const video = document.createElement('video');
      cameraVideoRef.current = video;
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const TARGET_FPS = 8;
      const FRAME_INTERVAL_MS = 1000 / TARGET_FPS;
      let lastSendTime = 0;
      
      const startFrameLoop = () => {
        console.log('Starting frame capture loop...');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        console.log('Canvas size:', canvas.width, 'x', canvas.height);
        
        const frameLoop = () => {
          if (processingStoppedRef.current) {
            console.log('Frame loop stopped - processing stopped');
            return;
          }
          if (!cameraStreamRef.current) {
            console.log('Frame loop stopped - no camera stream');
            return;
          }
          
          const now = performance.now();
          if (now - lastSendTime >= FRAME_INTERVAL_MS) {
            try {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              canvas.toBlob((blob) => {
                if (!blob) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  const dataUrl = reader.result;
                  const base64 = dataUrl.replace(/^data:image\/(png|jpeg);base64,/, '');
                  
                  if (imgRef.current) {
                    imgRef.current.src = dataUrl;
                    if (!hasImage) {
                      setHasImage(true);
                      console.log('First camera frame displayed');
                    }
                  }
                  
                  if (wsRef.current && wsRef.current.readyState === 1) {
                    try {
                      wsRef.current.send(base64);
                    } catch (err) {
                      console.error('WebSocket send error:', err);
                    }
                  }
                };
                reader.readAsDataURL(blob);
              }, 'image/jpeg', 0.8);
              lastSendTime = now;
            } catch (err) {
              console.error('Error capturing frame:', err);
            }
          }
          requestAnimationFrame(frameLoop);
        };
        
        frameLoop();
      };
      
      video.onloadedmetadata = () => {
        console.log('Video metadata loaded:', video.videoWidth, 'x', video.videoHeight);
        video.play().then(() => {
          console.log('Video playing successfully');
          setTimeout(startFrameLoop, 500);
        }).catch(err => {
          console.error('Error playing video:', err);
        });
      };
      
    } catch (err) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);
      setIsProcessing(false);
      alert('Camera access denied. Please allow camera permissions and try again.');
    }
  };
  
  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setHasImage(false);
    processingStoppedRef.current = true;
    setIsProcessing(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundOrbs}>
        <div style={{ ...styles.orb, ...styles.orb1 }} />
        <div style={{ ...styles.orb, ...styles.orb2 }} />
        <div style={{ ...styles.orb, ...styles.orb3 }} />
      </div>

      <div style={styles.content}>
        <div style={styles.headerContainer}>
          <div style={styles.logo}>
            <div style={styles.logoOuterRing}>
              <div style={styles.logoInnerRing}>
                <div style={styles.logoIcon}>🛣️</div>
              </div>
            </div>
          </div>
          <h1 style={styles.header}>RoadVision AI</h1>
        </div>

        <div style={styles.unifiedPanel}>
          <div style={styles.leftControls}>
            <div style={styles.controlSection}>
              <div style={styles.sectionTitle}>📤 Upload Video</div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                onMouseEnter={() => setInputHover(true)}
                onMouseLeave={() => setInputHover(false)}
                disabled={isCameraActive}
                style={{
                  ...styles.input,
                  ...(inputHover && !isCameraActive ? styles.inputHover : {}),
                  ...(isCameraActive ? styles.inputDisabled : {}),
                  cursor: isCameraActive ? "not-allowed" : "pointer"
                }}
              />
            </div>
            
            <div style={styles.controlSection}>
              <div style={styles.sectionTitle}>📹 Live Camera</div>
              <button
                onClick={isCameraActive ? stopCamera : startCamera}
                disabled={isProcessing && !isCameraActive}
                style={{
                  ...styles.button,
                  ...(isCameraActive ? styles.buttonStop : styles.buttonRestart),
                  cursor: "pointer",
                }}
              >
                {isCameraActive ? "🛑 Stop Camera" : "📹 Start Camera"}
              </button>
            </div>
            
            <div style={styles.buttonGroup}>
              <button
                onClick={handleStop}
                disabled={!isProcessing}
                onMouseEnter={() => setStopHover(true)}
                onMouseLeave={() => setStopHover(false)}
                style={{
                  ...styles.button,
                  ...styles.buttonStop,
                  ...(stopHover && isProcessing ? styles.buttonStopHover : {}),
                  ...(!isProcessing ? styles.buttonDisabled : {}),
                }}
              >
                ⏸️ Stop
              </button>
              
              <button
                onClick={handleRestart}
                disabled={!currentVideoFileRef.current}
                onMouseEnter={() => setRestartHover(true)}
                onMouseLeave={() => setRestartHover(false)}
                style={{
                  ...styles.button,
                  ...styles.buttonRestart,
                  ...(restartHover && currentVideoFileRef.current
                    ? styles.buttonRestartHover
                    : {}),
                  ...(!currentVideoFileRef.current
                    ? styles.buttonDisabled
                    : {}),
                }}
              >
                🔄 Restart
              </button>
            </div>
            
            <div style={getStatusStyle()}>
              <div
                style={{
                  ...styles.statusDot,
                  backgroundColor: getStatusDotColor(),
                }}
              />
              {error || statusText}
            </div>
            
            {alertMsg && <div style={getAlertStyle()}>{alertMsg}</div>}
            
            <div style={styles.statsGrid}>
              <div
                style={{
                  ...styles.infoBox,
                  ...(currentHover ? styles.infoBoxHover : {}),
                }}
                onMouseEnter={() => setCurrentHover(true)}
                onMouseLeave={() => setCurrentHover(false)}
              >
                <div style={styles.infoBoxTitle}>Current</div>
                <div style={styles.infoBoxValue}>{potholeCount}</div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.4)",
                    marginTop: "0.25rem",
                  }}
                >
                  In View
                </div>
              </div>

              <div
                style={{
                  ...styles.infoBox,
                  ...(totalHover ? styles.infoBoxHover : {}),
                }}
                onMouseEnter={() => setTotalHover(true)}
                onMouseLeave={() => setTotalHover(false)}
              >
                <div style={styles.infoBoxTitle}>Total</div>
                <div style={styles.infoBoxValue}>{totalPotholes}</div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.4)",
                    marginTop: "0.25rem",
                  }}
                >
                  Detected
                </div>
              </div>
            </div>
          </div>
          
          <div style={styles.rightContent}>
            <div style={styles.videoWrapper}>
              <div style={styles.imageContainer}>
                <img
                  ref={imgRef}
                  alt="Live Detection Feed"
                  style={{
                    ...styles.image,
                    opacity: hasImage ? 1 : 0,
                  }}
                />
              </div>
              {!hasImage && (
                <div style={styles.placeholder}>
                  <div style={{...styles.placeholderIcon, fontSize: "4rem"}}>
                    <div style={styles.logo}>
                      <div style={styles.logoOuterRing}>
                        <div style={styles.logoInnerRing}>
                          <div style={styles.logoIcon}>🛣️</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={styles.placeholderText}>
                    {isCameraActive ? "Camera active - Waiting for feed..." : "Upload video or start camera for detection"}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    AI-powered real-time analysis
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer style={styles.footer}>
          © 2025 RoadVision AI · Intelligent Road Monitoring · Real-time Detection
        </footer>
      </div>
    </div>
  );
}