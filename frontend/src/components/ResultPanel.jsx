import { useState } from "react";
import "./ResultPanel.css";

const SHOE_INFO = {
  adidas_samba: {
    full_name:"Adidas Samba OG",category:"Lifestyle / Originals",silhouette:"Low-top court",
    price_php:"₱6,800",price_usd:"$100",
    colorways:"4 colorways (Core Black, White, Brown, Cloud White/Gum)",
    material:"Full-grain leather upper, suede T-toe overlay, gum rubber outsole",
    origin:"Originally designed in 1950 as an indoor football trainer",
    fit:"Runs true to size. Slightly narrow — wide-footers may want to go half up.",
    where_to_buy:["Adidas.com","Foot Locker","Sneakers.ph","SNS"],
    buy_url:"https://www.adidas.com/ph/samba_og_shoes/B75806.html",
    tags:["Best Seller","Heritage","Versatile"],
    verdict:"The Samba is one of Adidas's most enduring silhouettes. Its slim profile and gum sole make it a go-to for everyday wear and outfit pairing.",
  },
  adidas_stan_smith: {
    full_name:"Adidas Stan Smith",category:"Lifestyle / Originals",silhouette:"Low-top court",
    price_php:"₱5,500",price_usd:"$90",
    colorways:"12+ colorways (Cloud White/Green, White/White, Navy, various collabs)",
    material:"Smooth leather or vegan leather upper, perforated 3-stripe panel",
    origin:"Introduced in 1973, named after tennis champion Stan Smith",
    fit:"Runs half a size large. Consider sizing down.",
    where_to_buy:["Adidas.com","Zalora PH","Foot Locker","Shiekh"],
    buy_url:"https://www.adidas.com/ph/stan_smith_shoes/FX5502.html",
    tags:["Iconic","Clean","Minimalist"],
    verdict:"The Stan Smith is a clean, minimalist court shoe that has transcended sport. Its simple design makes it one of the most versatile sneakers ever made.",
  },
  adidas_superstar: {
    full_name:"Adidas Superstar",category:"Lifestyle / Originals",silhouette:"Low-top basketball",
    price_php:"₱5,750",price_usd:"$90",
    colorways:"20+ colorways (Core Black/White, White/Black, White/Gold, collabs)",
    material:"Full-grain leather upper, rubber shell toe, herringbone outsole",
    origin:"Launched in 1969 as a basketball shoe, adopted by hip-hop culture in the 80s",
    fit:"Runs true to size. Wide toe box — good for wider feet.",
    where_to_buy:["Adidas.com","Zalora PH","Stadium Goods","Foot Locker"],
    buy_url:"https://www.adidas.com/ph/superstar_shoes/EG4958.html",
    tags:["Iconic","Hip-Hop Heritage","Wide Fit"],
    verdict:"The Superstar's shell toe is one of the most recognizable design elements in sneaker history. A cultural icon that works across generations and subcultures.",
  },
  adidas_gazelle: {
    full_name:"Adidas Gazelle",category:"Lifestyle / Originals",silhouette:"Low-top trainer",
    price_php:"₱5,500",price_usd:"$90",
    colorways:"8+ colorways (Bold Green, Core Black, Preloved Yellow, Blue)",
    material:"Suede upper, synthetic lining, gum rubber outsole",
    origin:"Introduced in 1966 as a training shoe, revived multiple times since",
    fit:"Runs slightly small. Half size up recommended.",
    where_to_buy:["Adidas.com","Foot Locker","ASOS","Sneakers.ph"],
    buy_url:"https://www.adidas.com/ph/gazelle_shoes/BB5476.html",
    tags:["Retro","Suede","Trending"],
    verdict:"The Gazelle is having a major resurgence. Its suede construction and bold colorways make it a standout against the leather-heavy Samba and Stan Smith.",
  },
  adidas_campus: {
    full_name:"Adidas Campus 00s",category:"Lifestyle / Originals",silhouette:"Low-top trainer",
    price_php:"₱5,500",price_usd:"$90",
    colorways:"6+ colorways (Core Black, Wonder White, Trace Brown, collabs)",
    material:"Suede upper, EVA midsole, rubber outsole",
    origin:"Debuted in 1979, relaunched as Campus 00s with a chunkier sole in 2022",
    fit:"Runs true to size.",
    where_to_buy:["Adidas.com","SNKRS","Zalora PH","Foot Locker"],
    buy_url:"https://www.adidas.com/ph/campus_00s_shoes/HQ8708.html",
    tags:["Y2K","Chunky Sole","Trending"],
    verdict:"The Campus 00s is a thicker-soled revival of the original Campus. A key piece in the current Y2K sneaker wave, often seen in Adidas x Pharrell collaborations.",
  },
  adidas_spezial: {
    full_name:"Adidas Handball Spezial",category:"Lifestyle / Originals",silhouette:"Low-top indoor court",
    price_php:"₱6,000",price_usd:"$95",
    colorways:"9+ colorways (Navy/Light Blue, Core Black, Gum, Collegiate Orange)",
    material:"Suede upper, slim gum outsole, contrast toe cap",
    origin:"Originally a 1979 handball court shoe, rediscovered by UK terrace culture",
    fit:"Runs true to size. Very slim — may be tight for wide feet.",
    where_to_buy:["Adidas.com","END. Clothing","SNS","Sneakers.ph"],
    buy_url:"https://www.adidas.com/ph/handball_spezial_shoes/B24124.html",
    tags:["Terrace Culture","Slim Profile","Best Seller"],
    verdict:"Often confused with the Samba due to similar silhouettes, but its suede construction and slimmer last set it apart. A cult favourite among sneaker purists.",
  },
  nike_air_force_1: {
    full_name:"Nike Air Force 1 '07",category:"Lifestyle / Basketball Heritage",silhouette:"Low-top basketball",
    price_php:"₱5,595",price_usd:"$110",
    colorways:"30+ colorways (Triple White, Black, University Red, many collabs)",
    material:"Full-grain leather or synthetic leather upper, Air-Sole unit",
    origin:"First basketball shoe with Nike Air cushioning, launched in 1982",
    fit:"Runs half a size large. Go half down for a snug fit.",
    where_to_buy:["Nike.com","Foot Locker PH","Zalora PH","SNKRS App"],
    buy_url:"https://www.nike.com/ph/t/air-force-1-07-shoes/CW2288-111",
    tags:["Best Seller","Iconic","Versatile"],
    verdict:"One of the best-selling shoes of all time and a cornerstone of sneaker culture. The triple white is a wardrobe essential — durable, clean, and endlessly wearable.",
  },
  nike_dunk_low: {
    full_name:"Nike Dunk Low",category:"Lifestyle / Basketball Heritage",silhouette:"Low-top basketball",
    price_php:"₱5,595",price_usd:"$110",
    colorways:"50+ colorways (Panda, Syracuse, Kentucky, Reverse Panda, collabs)",
    material:"Leather or synthetic upper, rubber cupsole, padded collar",
    origin:"Designed in 1985 for NCAA basketball, revived as a lifestyle shoe in 2020",
    fit:"Runs true to size. Slightly wide — narrow-footers may want half down.",
    where_to_buy:["Nike.com","SNKRS App","Foot Locker","StockX"],
    buy_url:"https://www.nike.com/ph/t/dunk-low-retro-shoes/DD1391-100",
    tags:["Trending","Collector","Wide Variety"],
    verdict:"The Dunk Low exploded in popularity during 2020–2021 and remains one of Nike's most hyped silhouettes. The Panda colorway is particularly iconic for its versatility.",
  },
  nike_dunk_high: {
    full_name:"Nike Dunk High",category:"Lifestyle / Basketball Heritage",silhouette:"High-top basketball",
    price_php:"₱6,295",price_usd:"$120",
    colorways:"20+ colorways (Syracuse, Kentucky, Black/White, Baroque Brown)",
    material:"Leather upper with suede overlays, rubber cupsole, padded ankle collar",
    origin:"Launched alongside the Dunk Low in 1985 for NCAA college basketball",
    fit:"Runs true to size. High ankle collar — allow break-in time.",
    where_to_buy:["Nike.com","SNKRS App","Foot Locker PH","Kicks Crew"],
    buy_url:"https://www.nike.com/ph/t/dunk-high-retro-shoes/DD1399-105",
    tags:["High-Top","Bold","College Colors"],
    verdict:"Offers more ankle coverage and a bolder look than its low counterpart. University color schemes make it a standout, though it requires more outfit planning.",
  },
  nike_air_max_90: {
    full_name:"Nike Air Max 90",category:"Lifestyle / Running Heritage",silhouette:"Low-top running",
    price_php:"₱6,895",price_usd:"$130",
    colorways:"40+ colorways (White/Infrared, Triple White, Triple Black, various collabs)",
    material:"Mesh and synthetic leather upper, visible Max Air heel unit, waffle outsole",
    origin:"Designed by Tinker Hatfield, released in 1990 as the Air Max III",
    fit:"Runs true to size. Wide toe box accommodates most foot shapes.",
    where_to_buy:["Nike.com","Foot Locker PH","Zalora PH","SNKRS App"],
    buy_url:"https://www.nike.com/ph/t/air-max-90-shoes/CN8490-100",
    tags:["Air Cushioning","Running Heritage","Bold Design"],
    verdict:"Defined by its large visible Air unit and bold colour-blocking. One of the most recognisable running silhouettes ever made, equally at home on track or street.",
  },
};

const normalizeClassId = (id) => {
  const map = {
    'samba':       'adidas_samba',
    'stan_smith':  'adidas_stan_smith',
    'superstar':   'adidas_superstar',
    'gazelle':     'adidas_gazelle',
    'campus':      'adidas_campus',
    'spezial':     'adidas_spezial',
    'air_force_1': 'nike_air_force_1',
    'dunk_low':    'nike_dunk_low',
    'dunk_high':   'nike_dunk_high',
    'air_max_90':  'nike_air_max_90',
  };
  return map[id] || id;
};

const confColor = (c) => c >= 70 ? "var(--accent)" : c >= 40 ? "#f0a030" : "var(--muted)";

export default function ResultPanel({ result, onReset }) {
  const [showAll, setShowAll]     = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { top, predictions, thumbnail, image_size } = result;

  const info  = SHOE_INFO[normalizeClassId(top.class_id)] || null;
  const visible = showAll ? predictions : predictions.slice(0, 5);
  const maxConf = predictions[0].confidence;

  return (
    <div className="result-wrap">

      {/* Hero card */}
      <div className="top-card">
        <div className="top-image-wrap">
          <img src={thumbnail} alt="classified shoe" className="top-image" />
          <div className="img-corner tl"/><div className="img-corner tr"/>
          <div className="img-corner bl"/><div className="img-corner br"/>
        </div>
        <div className="top-info">
          <p className="top-rank">TOP MATCH</p>
          <h1 className="top-label">{info ? info.full_name : top.label}</h1>
          {info && (
            <div className="tag-row">
              {info.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
          <div className="conf-badge" style={{"--c": confColor(top.confidence)}}>
            <span className="conf-value">{top.confidence.toFixed(1)}%</span>
            <span className="conf-word">confidence</span>
          </div>
          {info && (
            <div className="price-row">
              <div className="price-block">
                <span className="price-label">PH Price</span>
                <span className="price-val">{info.price_php}</span>
              </div>
              <div className="price-divider"/>
              <div className="price-block">
                <span className="price-label">US Price</span>
                <span className="price-val">{info.price_usd}</span>
              </div>
              <a href={info.buy_url} target="_blank" rel="noreferrer" className="buy-btn">
                Shop now ↗
              </a>
            </div>
          )}
          <div className="meta-row">
            <span className="meta-chip">{image_size[0]}×{image_size[1]}px</span>
            <span className="meta-chip">CLIP ViT-L/14</span>
            {info && <span className="meta-chip">{info.category}</span>}
          </div>
          <button className="reset-btn" onClick={onReset}>← Classify another</button>
        </div>
      </div>

      {/* Detail tabs */}
      {info && (
        <div className="detail-card">
          <div className="tab-bar">
            {["overview","fit & sizing","where to buy"].map(t => (
              <button key={t} className={`tab-btn ${activeTab===t?"tab-btn--active":""}`} onClick={()=>setActiveTab(t)}>
                {t}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="tab-content">
              <div className="detail-grid">
                <div className="detail-item"><span className="detail-key">Silhouette</span><span className="detail-val">{info.silhouette}</span></div>
                <div className="detail-item"><span className="detail-key">Material</span><span className="detail-val">{info.material}</span></div>
                <div className="detail-item"><span className="detail-key">Colorways</span><span className="detail-val">{info.colorways}</span></div>
                <div className="detail-item detail-item--full"><span className="detail-key">Origin</span><span className="detail-val">{info.origin}</span></div>
                <div className="detail-item detail-item--full verdict"><span className="detail-key">Verdict</span><span className="detail-val verdict-text">{info.verdict}</span></div>
              </div>
            </div>
          )}

          {activeTab === "fit & sizing" && (
            <div className="tab-content">
              <div className="fit-box">
                <div className="fit-icon">👟</div>
                <p className="fit-text">{info.fit}</p>
              </div>
              <div className="detail-grid">
                <div className="detail-item"><span className="detail-key">Category</span><span className="detail-val">{info.category}</span></div>
                <div className="detail-item"><span className="detail-key">Silhouette</span><span className="detail-val">{info.silhouette}</span></div>
              </div>
            </div>
          )}

          {activeTab === "where to buy" && (
            <div className="tab-content">
              <div className="buy-grid">
                {info.where_to_buy.map(store => (
                  <div key={store} className="store-chip">
                    <span className="store-dot"/>
                    {store}
                  </div>
                ))}
              </div>
              <a href={info.buy_url} target="_blank" rel="noreferrer" className="buy-cta">
                View on official store ↗
              </a>
            </div>
          )}
        </div>
      )}

      {/* Probability bars */}
      <div className="bars-section">
        <h3 className="bars-title">Full probability distribution</h3>
        <div className="bars-list">
          {visible.map((pred, i) => {
            const pInfo = SHOE_INFO[normalizeClassId(pred.class_id)];
            return (
              <div key={pred.class_id} className={`bar-row ${i===0?"bar-row--top":""}`} style={{animationDelay:`${i*60}ms`}}>
                <div className="bar-meta">
                  <span className="bar-rank">#{pred.rank}</span>
                  <span className="bar-label">{pInfo ? pInfo.full_name : pred.label}</span>
                  {pInfo && <span className="bar-price">{pInfo.price_php}</span>}
                  <span className="bar-conf" style={{color:confColor(pred.confidence)}}>{pred.confidence.toFixed(1)}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{
                    width:`${(pred.confidence/maxConf)*100}%`,
                    background: i===0 ? "var(--accent)" : `rgba(232,240,74,${0.12+(pred.confidence/maxConf)*0.25})`
                  }}/>
                </div>
              </div>
            );
          })}
        </div>
        {predictions.length > 5 && (
          <button className="show-all-btn" onClick={()=>setShowAll(!showAll)}>
            {showAll ? "Show less ↑" : `Show all ${predictions.length} classes ↓`}
          </button>
        )}
      </div>

    </div>
  );
}
