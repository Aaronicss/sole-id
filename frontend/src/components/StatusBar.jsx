import { useEffect, useState } from "react";
import "./StatusBar.css";

export default function StatusBar({ apiUrl }) {
  const [status, setStatus] = useState("checking"); // checking | online | offline | sleeping
  const [info, setInfo]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res  = await fetch(`${apiUrl}/health`, { signal: AbortSignal.timeout(8000) });
        const data = await res.json();
        if (!cancelled) {
          setStatus("online");
          setInfo(data);
        }
      } catch {
        if (!cancelled) setStatus("sleeping");
      }
    };

    check();
    const interval = setInterval(check, 30000); // re-check every 30s
    return () => { cancelled = true; clearInterval(interval); };
  }, [apiUrl]);

  const dot = {
    checking: { color: "#888",    label: "Checking…" },
    online:   { color: "#4ade80", label: "Online" },
    offline:  { color: "#f87171", label: "Offline" },
    sleeping: { color: "#fbbf24", label: "Space sleeping — first request wakes it (~30s)" },
  }[status];

  return (
    <div className="status-bar">
      <div className="status-inner">
        <div className="status-left">
          <span className="status-dot" style={{ background: dot.color }} />
          <span className="status-label">{dot.label}</span>
          {info && (
            <>
              <span className="status-sep">·</span>
              <span className="status-chip">{info.classes} classes</span>
              <span className="status-chip">{info.val_acc}% val acc</span>
              <span className="status-chip">{info.gpu ? "GPU" : "CPU"}</span>
            </>
          )}
        </div>
        <a
          href={apiUrl}
          target="_blank"
          rel="noreferrer"
          className="status-link"
        >
          HF Space ↗
        </a>
      </div>
    </div>
  );
}
