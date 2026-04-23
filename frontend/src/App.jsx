import { useState, useCallback } from "react";
import Uploader from "./components/Uploader";
import ResultPanel from "./components/ResultPanel";
import Header from "./components/Header";
import StatusBar from "./components/StatusBar";
import "./App.css";

// Set VITE_API_URL in Vercel environment variables to your HF Space URL
// e.g. https://your-username-sole-id.hf.space
const API = import.meta.env.VITE_API_URL || "http://localhost:7860";

export default function App() {
  const [state, setState]   = useState("idle"); // idle | loading | result | error
  const [preview, setPreview] = useState(null);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const handleImage = useCallback(async (file) => {
    if (!file) return;

    // Instant preview
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
      // Handle HF Spaces cold start (can take ~30s)
      if (err.message.includes("Failed to fetch")) {
        setError("Space is waking up — please try again in 30 seconds");
      } else {
        setError(err.message);
      }
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
        <span>Fine-Tuned CLIP · ViT-B/32</span>
        <span className="dot">·</span>
        <span>HF Spaces + Vercel</span>
      </footer>
    </div>
  );
}
