import "./HowToUse.css";

const STEPS = [
  {
    num: "01",
    icon: "📸",
    title: "Get a clear photo",
    desc: "Use a well-lit image showing the full side profile of the shoe. Avoid heavy cropping or extreme angles.",
  },
  {
    num: "02",
    icon: "⬆️",
    title: "Upload or drag & drop",
    desc: "Drop your image onto the upload zone below, or click it to browse. Supports JPG, PNG, and WEBP.",
  },
  {
    num: "03",
    icon: "⚡",
    title: "Get instant results",
    desc: "SoleID runs the image through a fine-tuned CLIP ViT-L/14 model and returns ranked predictions with confidence scores.",
  },
  {
    num: "04",
    icon: "📊",
    title: "Explore the details",
    desc: "View pricing, colorways, release info, and where to buy for the top predicted model.",
  },
];

export default function HowToUse() {
  return (
    <section className="howto">
      <div className="howto-inner">

        {/* About */}
        <div className="about-band">
          <div className="about-badge">About SoleID</div>
          <h2 className="about-title">
            AI-powered sneaker<br />identification
          </h2>
          <p className="about-desc">
            SoleID uses a fine-tuned <strong>OpenAI CLIP ViT-L/14</strong> model trained on
            2,001 labeled sneaker images across 10 models from Adidas and Nike.
            Upload any photo of a supported shoe and get an instant identification
            with confidence scores, pricing, and product details.
          </p>
          <div className="about-chips">
            <span className="chip">ViT-L/14 backbone</span>
            <span className="chip">768-d embeddings</span>
            <span className="chip">10 shoe models</span>
            <span className="chip">Adidas · Nike</span>
          </div>
        </div>

        {/* Steps */}
        <div className="steps-grid">
          {STEPS.map((s) => (
            <div className="step-card" key={s.num}>
              <div className="step-num">{s.num}</div>
              <div className="step-icon">{s.icon}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="tips-row">
          <div className="tips-label">📌 Tips for best results</div>
          <div className="tips-list">
            <span className="tip">✓ Side profile view</span>
            <span className="tip">✓ Good lighting</span>
            <span className="tip">✓ Clean background</span>
            <span className="tip">✓ Full shoe visible</span>
            <span className="tip tip--bad">✗ Extreme angles</span>
            <span className="tip tip--bad">✗ Heavy occlusion</span>
            <span className="tip tip--bad">✗ Blurry photos</span>
          </div>
        </div>

      </div>
    </section>
  );
}
