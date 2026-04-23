import { useState, useRef, useCallback } from "react";
import Uploader from "./components/Uploader";
import ResultPanel from "./components/ResultPanel";
import Header from "./components/Header";
import "./App.css";

const API = "http://localhost:5000";

export default function App() {
  const [state, setState] = useState("idle"); // idle | uploading | loading | result | error
  const [preview, setPreview] = useState(null);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const handleImage = useCallback(async (file) => {
    if (!file) return;

    // Show preview immediately
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

      if (!res.ok || data.error) throw new Error(data.error || "Server error");

      setResult(data);
      setState("result");
    } catch (err) {
      setError(err.message);
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

      <main className="main">
        {(state === "idle" || state === "loading" || state === "error") && (
          <Uploader
            onImage={handleImage}
            loading={state === "loading"}
            preview={preview}
            error={error}
          />
        )}

        {state === "result" && result && (
          <ResultPanel result={result} onReset={handleReset} />
        )}
      </main>

      <footer className="footer">
        <span>Fine-Tuned CLIP · ViT-B/32</span>
        <span className="dot">·</span>
        <span>Zero cloud tokens</span>
      </footer>
    </div>
  );
}
