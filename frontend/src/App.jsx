import { useState, useCallback } from "react";
import Uploader from "./components/Uploader";
import ResultPanel from "./components/ResultPanel";
import Header from "./components/Header";
import StatusBar from "./components/StatusBar";
import HowToUse from "./components/HowToUse";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:7860";

export default function App() {
  const [state, setState]     = useState("idle");
  const [preview, setPreview] = useState(null);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const handleImage = useCallback(async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    setState("loading");
    setResult(null);
    setError(null);
    try {
      const form = new FormData();
      form.append("image", file);
      const res  = await fetch(`${API}/predict`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || data.detail) throw new Error(data.detail || "Server error");
      setResult(data);
      setState("result");
    } catch (err) {
      setError(err.message.includes("Failed to fetch")
        ? "Space is waking up — please try again in 30 seconds"
        : err.message);
      setState("error");
    }
  }, []);

  const handleReset = () => {
    setState("idle");
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <div className="grain" />
      <Header />
      <StatusBar apiUrl={API} />
      {state !== "result" && <HowToUse />}
      <main className="main">
        {(state === "idle" || state === "loading" || state === "error") && (
          <Uploader
            onImage={handleImage}
            loading={state === "loading"}
            preview={preview}
            error={error}
            onReset={state === "error" ? handleReset : null}
          />
        )}
        {state === "result" && result && (
          <ResultPanel result={result} onReset={handleReset} />
        )}
      </main>
      <footer className="footer">
        <span>SoleID · Fine-Tuned CLIP ViT-L/14</span>
        <span className="dot">·</span>
        <span>10 shoe models · 2001 training images</span>
      </footer>
    </div>
  );
}
