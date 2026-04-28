import { useState, useRef, useEffect } from "react";
import {
  Shield, Sun, Moon, Phone, Star, Send,
  X, Home, Map, Users, LogOut, Bot,
  Flag, AlertTriangle, Plus, Trash2,
} from "lucide-react";
import "./Dashboard.css";

const AREA_TAGS = [
  { id: "safe",     label: "Safe",           icon: "✅", color: "bg-green-500",  hex: "#22c55e" },
  { id: "unsafe",   label: "Unsafe",          icon: "⚠️", color: "bg-red-500",    hex: "#ef4444" },
  { id: "lighting", label: "Poor Lighting",   icon: "💡", color: "bg-yellow-500", hex: "#eab308" },
  { id: "crowded",  label: "Crowded",         icon: "👥", color: "bg-blue-500",   hex: "#3b82f6" },
  { id: "police",   label: "Police Presence", icon: "👮", color: "bg-indigo-500", hex: "#6366f1" },
];

const POLICE_STATIONS = [
  { name: "Central Police Station", dist: "0.8 km", phone: "100" },
  { name: "Connaught Place PS",     dist: "1.2 km", phone: "011-23344444" },
  { name: "New Delhi PS",           dist: "2.1 km", phone: "011-23344556" },
];

const AI_RESPONSES = {
  default: "I'm SheSafe AI, your personal safety assistant. How can I help you stay safe today?",
  sos:     "🚨 SOS mode activated! Sharing your location with emergency contacts. Stay calm, help is on the way. Call 112 for immediate police assistance.",
  route:   "I suggest taking the well-lit main road via MG Road. Avoid the underpass near Park Street after 8 PM. Current safety rating: 4.2/5 ⭐",
  tip:     "💡 Safety Tip: Share your live location with a trusted contact before traveling at night. Use SheSafe's check-in feature every 30 minutes.",
  help:    "I can help you with: Safe route suggestions, Emergency contacts, SOS alerts, Safety tips, Nearby police stations, Community safety reports.",
  hindi:   "नमस्ते! मैं SheSafe AI हूँ। आपकी सुरक्षा के लिए यहाँ हूँ। कृपया बताइए आपको क्या सहायता चाहिए?",
};

function getAIResponse(msg) {
  const l = msg.toLowerCase();
  if (l.includes("sos") || l.includes("emergency") || l.includes("help")) return AI_RESPONSES.sos;
  if (l.includes("route") || l.includes("way") || l.includes("road"))     return AI_RESPONSES.route;
  if (l.includes("tip")   || l.includes("advice") || l.includes("safe"))  return AI_RESPONSES.tip;
  if (l.includes("hindi") || l.includes("हिंदी")  || l.includes("namaste")) return AI_RESPONSES.hindi;
  if (l.includes("what")  || l.includes("how")   || l.includes("can"))    return AI_RESPONSES.help;
  return "I understand your concern. In case of emergency, press the SOS button immediately. I'm here 24/7.";
}

const DEFAULT_USER = { name: "User" };

export default function Dashboard({ theme = "light", toggleTheme, setScreen, user = DEFAULT_USER }) {
  const dark = theme === "dark";

  const [tab,     setTab]     = useState("home");
  const [aiOpen,  setAiOpen]  = useState(false);
  const [aiClosing, setAiClosing] = useState(false);

  const [sosActive,    setSosActive]    = useState(false);
  const [sosCountdown, setSosCountdown] = useState(3);

  const [contacts,       setContacts]       = useState([
    { id: "1", name: "Mom",          phone: "9876543210", relation: "Mother" },
    { id: "2", name: "Sister Priya", phone: "9123456789", relation: "Sister" },
  ]);
  const [newContact,     setNewContact]     = useState({ name: "", phone: "", relation: "" });
  const [showAddContact, setShowAddContact] = useState(false);

  const [feedbacks,        setFeedbacks]        = useState([
    { id: "1", area: "MG Road",               tag: "safe",   rating: 5, comment: "Well lit, police patrolling" },
    { id: "2", area: "Park Street Underpass",  tag: "unsafe", rating: 2, comment: "Very dark at night" },
  ]);
  const [feedbackForm,     setFeedbackForm]     = useState({ area: "", tag: "safe", rating: 5, comment: "" });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [filterTag,        setFilterTag]        = useState("all");

  const [selectedRoute, setSelectedRoute] = useState("safe");

  const [messages,  setMessages]  = useState([{ role: "ai", text: AI_RESPONSES.default }]);
  const [aiInput,   setAiInput]   = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiOpen]);

  const closeAI = () => {
    setAiClosing(true);
    setTimeout(() => { setAiOpen(false); setAiClosing(false); }, 240);
  };

  const handleSOS = () => {
    setSosActive(true);
    setSosCountdown(3);
    let c = 3;
    const t = setInterval(() => {
      c--;
      setSosCountdown(c);
      if (c <= 0) clearInterval(t);
    }, 1000);
  };

  const cancelSOS = () => { setSosActive(false); setSosCountdown(3); };

  const sendAI = () => {
    if (!aiInput.trim()) return;
    const msg = aiInput.trim();
    setAiInput("");
    setMessages(m => [...m, { role: "user", text: msg }]);
    setAiLoading(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: "ai", text: getAIResponse(msg) }]);
      setAiLoading(false);
    }, 900);
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setContacts(c => [...c, { ...newContact, id: Date.now().toString() }]);
    setNewContact({ name: "", phone: "", relation: "" });
    setShowAddContact(false);
  };

  const addFeedback = () => {
    if (!feedbackForm.area) return;
    setFeedbacks(f => [...f, { ...feedbackForm, id: Date.now().toString() }]);
    setFeedbackForm({ area: "", tag: "safe", rating: 5, comment: "" });
    setShowFeedbackForm(false);
  };

  const bg = dark
    ? "linear-gradient(135deg,#0f0a1e 0%,#1a0533 50%,#0a1020 100%)"
    : "linear-gradient(135deg,#f5f3ff 0%,#ede9fe 40%,#e0f2fe 100%)";

  const cardCls = dark ? "card card-dark" : "card card-light";
  const textCls = dark ? "text-dark" : "text-light";
  const subCls  = dark ? "sub-dark"  : "sub-light";
  const inputCls = dark
    ? "form-input input-dark"
    : "form-input input-light";

  const filteredFeedbacks = filterTag === "all" ? feedbacks : feedbacks.filter(f => f.tag === filterTag);

  return (
    <div className="dashboard" style={{ background: bg }}>

      {/* SOS Overlay */}
      {sosActive && (
        <div className="sos-overlay">
          {sosCountdown > 0 ? (
            <>
              <div className="sos-countdown">{sosCountdown}</div>
              <p style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>SOS Alert Sending…</p>
              <p style={{ color: "#fca5a5", fontSize: "0.875rem", marginBottom: "2rem" }}>Notifying your emergency contacts</p>
              <button onClick={cancelSOS} className="sos-cancel-btn">Cancel</button>
            </>
          ) : (
            <>
              <div className="sos-sent-icon">🚨</div>
              <p style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>SOS Alert Sent!</p>
              <p style={{ color: "#fca5a5", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Location shared with {contacts.length} contacts</p>
              <p style={{ color: "#fca5a5", fontSize: "0.875rem", marginBottom: "2rem" }}>Emergency services notified</p>
              <button onClick={cancelSOS} className="sos-cancel-btn">I'm Safe Now</button>
            </>
          )}
        </div>
      )}

      {/* AI Panel */}
      {aiOpen && (
        <>
          <div className="ai-backdrop" onClick={closeAI} />
          <div className={`ai-panel ${dark ? "ai-panel-dark" : "ai-panel-light"} ${aiClosing ? "closing" : ""}`}>

            <div className={`ai-panel-header ${dark ? "divider-dark" : "divider-light"}`}>
              <div className="ai-header-icon">
                <Bot size={20} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: dark ? "white" : "#1e293b" }}>SheSafe AI</p>
                <div className="ai-online-row">
                  <div className="ai-online-dot" />
                  <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>Online · English / हिंदी</p>
                </div>
              </div>
              <button onClick={closeAI} className={`close-btn ${dark ? "close-btn-dark" : "close-btn-light"}`}>
                <X size={16} color={dark ? "white" : "#1e293b"} />
              </button>
            </div>

            <div className={`quick-prompts ${dark ? "divider-dark" : "divider-light"}`} style={{ borderBottom: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #f5f3ff" }}>
              {["SOS help", "Safe route", "Safety tip", "Hindi", "What can you do"].map(p => (
                <button key={p} onClick={() => setAiInput(p)}
                  className={`quick-prompt-btn ${dark ? "quick-prompt-dark" : "quick-prompt-light"}`}>
                  {p}
                </button>
              ))}
            </div>

            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-msg ${m.role}`}>
                  {m.role === "ai" && (
                    <div className="chat-avatar">
                      <Bot size={14} color="white" />
                    </div>
                  )}
                  <div className={`chat-bubble ${m.role === "user" ? "user" : dark ? "ai-dark" : "ai-light"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="chat-msg ai">
                  <div className="chat-avatar">
                    <Bot size={14} color="white" />
                  </div>
                  <div className={`typing-indicator ${dark ? "card-dark" : ""}`} style={!dark ? { background: "#f5f3ff", border: "1px solid #ede9fe" } : {}}>
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className={`chat-input-area ${dark ? "" : ""}`} style={{ borderTop: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #ede9fe", background: dark ? "#1a0d30" : "white" }}>
              <div className={`chat-input-row ${dark ? "chat-input-row-dark" : "chat-input-row-light"}`}>
                <input
                  type="text"
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendAI()}
                  placeholder="Ask anything about safety…"
                  className={`chat-input ${dark ? "chat-input-dark" : "chat-input-light"}`}
                />
                <button onClick={sendAI} className="send-btn">
                  <Send size={14} color="white" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Background orbs */}
      <div className="orb orb-top" style={{ opacity: dark ? 0.1 : 0.2 }} />
      <div className="orb orb-bottom" style={{ opacity: dark ? 0.1 : 0.15 }} />

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-logo">
              <Shield size={20} color="white" />
            </div>
            <div>
              <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>Hello, {user?.name?.split(" ")[0]} 👋</p>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: dark ? "white" : "#1e293b" }}>SheSafe</span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={() => setAiOpen(true)} className="icon-btn ai-btn">
              <Bot size={16} color="white" />
              <span className="online-dot" />
            </button>
            <button onClick={toggleTheme} className="icon-btn" style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }}>
              {dark ? <Sun size={16} color="#fcd34d" /> : <Moon size={16} color="#64748b" />}
            </button>
            <button onClick={() => setScreen && setScreen("login")} className="icon-btn" style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }}>
              <LogOut size={16} color={dark ? "white" : "#1e293b"} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">

        

        {/* HOME */}
        {tab === "home" && (
          <div className="tab-content">
            <div className={`${cardCls} status-bar`}>
              <div className="status-dot" />
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: dark ? "white" : "#1e293b" }}>Protection Active</span>
              <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>Location: Sharing</span>
            </div>

            <div className={`${dark ? "card card-dark" : "card card-light"} card-lg sos-section`}>
              <p className="sos-label" style={{ color: dark ? "#94a3b8" : "#64748b" }}>Emergency SOS</p>
              <button onClick={handleSOS} className="sos-btn">
                <div className="sos-ring" />
                <AlertTriangle size={40} color="white" style={{ position: "relative", zIndex: 1, marginBottom: 4 }} />
                <span className="sos-text">SOS</span>
              </button>
              <p className="sos-hint" style={{ color: dark ? "#94a3b8" : "#64748b" }}>Tap to alert emergency contacts & authorities</p>
            </div>

            <div className="stats-grid">
              {[
                { icon: "📍", label: "Location",    val: "Sharing",           color: "#4ade80" },
                { icon: "👥", label: "Contacts",    val: `${contacts.length} Added`, color: "#60a5fa" },
                { icon: "⭐", label: "Area Rating", val: "4.2 / 5",           color: "#fbbf24" },
                { icon: "🛡️", label: "Safe Routes", val: "2 Found",           color: "#a78bfa" },
              ].map(s => (
                <div key={s.label} className={`${cardCls} stat-card`}>
                  <div className="stat-icon">{s.icon}</div>
                  <p className="stat-label" style={{ color: dark ? "#94a3b8" : "#64748b" }}>{s.label}</p>
                  <p className="stat-value" style={{ color: s.color }}>{s.val}</p>
                </div>
              ))}
            </div>

            <div className={cardCls}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.125rem" }}>👮</span>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b" }}>Nearby Police Stations</p>
              </div>
              {POLICE_STATIONS.map(ps => (
                <div key={ps.name} className="station-row" style={{ background: dark ? "rgba(255,255,255,0.05)" : "rgba(245,243,255,0.6)" }}>
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: 500, color: dark ? "white" : "#1e293b" }}>{ps.name}</p>
                    <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>{ps.dist}</p>
                  </div>
                  <a href={`tel:${ps.phone}`}>
                    <div className="call-btn">
                      <Phone size={14} color="white" />
                    </div>
                  </a>
                </div>
              ))}
            </div>

            <button onClick={() => setAiOpen(true)} className={`${cardCls} ai-quick-card`}>
              <div className="ai-icon-box">
                <Bot size={24} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b" }}>SheSafe AI Assistant</p>
                <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>Ask for safety tips, routes & more</p>
              </div>
              <div className="ai-chat-badge">Chat →</div>
            </button>
          </div>
        )}

        {/* MAP */}
        {tab === "map" && (
          <div className="tab-content">
            <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: dark ? "white" : "#1e293b" }}>Live Map</h2>

            <div className={`${dark ? "card card-dark" : "card card-light"}`} style={{ borderRadius: "1.5rem", overflow: "hidden", padding: 0 }}>
              <div className="map-container" style={{ background: dark ? "linear-gradient(135deg,#1a2535,#0f1f30)" : "linear-gradient(135deg,#e8f4e8,#d4ecd4)" }}>
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.3 }} viewBox="0 0 400 240">
                  {[0,1,2,3,4,5].map(i => <line key={`h${i}`} x1="0" y1={40*i} x2="400" y2={40*i} stroke={dark?"#ffffff":"#4ade80"} strokeWidth="0.5"/>)}
                  {[0,1,2,3,4,5,6,7,8,9].map(i => <line key={`v${i}`} x1={40*i} y1="0" x2={40*i} y2="240" stroke={dark?"#ffffff":"#4ade80"} strokeWidth="0.5"/>)}
                  <path d="M40 120 L120 80 L200 100 L280 60 L360 90" stroke="#22c55e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
                  <path d="M40 160 L120 140 L200 170 L280 150 L360 180" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8,4" opacity="0.7"/>
                  {[0,1].map(i => (
                    <g key={i}>
                      <circle cx={80+i*160} cy={90+i*50} r="8" fill={i===0?"#22c55e":"#ef4444"} opacity="0.85"/>
                      <text x={80+i*160} y={94+i*50} textAnchor="middle" fontSize="8" fill="white">{i===0?"✓":"!"}</text>
                    </g>
                  ))}
                </svg>
                <div className="map-location-pin">
                  <div className="location-dot">
                    <div style={{ width: "0.75rem", height: "0.75rem", borderRadius: "50%", background: "white" }} />
                  </div>
                </div>
                <div className="map-legends">
                  <div className="map-legend-badge" style={{ background: "rgba(34,197,94,0.2)", color: "#22c55e" }}>
                    <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "#22c55e" }} />
                    Safe Route
                  </div>
                  <div className="map-legend-badge" style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444" }}>
                    <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "#ef4444" }} />
                    Avoid
                  </div>
                </div>
              </div>

              <div style={{ padding: "1rem" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: dark ? "#94a3b8" : "#64748b", marginBottom: "0.75rem" }}>Route Preference</p>
                <div className="route-options">
                  {[
                    { id: "safe", label: "🛡️ Safest Route", desc: "8 min longer" },
                    { id: "fast", label: "⚡ Fastest Route", desc: "Moderate safety" },
                  ].map(r => (
                    <button key={r.id} onClick={() => setSelectedRoute(r.id)} className="route-option"
                      style={{
                        background: selectedRoute === r.id ? (dark ? "rgba(139,92,246,0.25)" : "#f5f3ff") : (dark ? "rgba(255,255,255,0.05)" : "#f8fafc"),
                        borderColor: selectedRoute === r.id ? (dark ? "#a78bfa" : "#8b5cf6") : (dark ? "rgba(255,255,255,0.1)" : "#e2e8f0"),
                      }}>
                      <p style={{ fontSize: "0.75rem", fontWeight: 600, color: dark ? "white" : "#1e293b" }}>{r.label}</p>
                      <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={cardCls}>
              <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>👮</span> Nearby Police Stations
              </p>
              {POLICE_STATIONS.map(ps => (
                <div key={ps.name} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: "0.75rem", marginBottom: "0.5rem", background: dark ? "rgba(255,255,255,0.05)" : "rgba(245,243,255,0.6)" }}>
                  <div className="station-icon">👮</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 500, color: dark ? "white" : "#1e293b" }}>{ps.name}</p>
                    <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>{ps.dist} away</p>
                  </div>
                  <a href={`tel:${ps.phone}`} className="call-pill">Call</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {tab === "contacts" && (
          <div className="tab-content">
            <div className="section-header">
              <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: dark ? "white" : "#1e293b" }}>Emergency Contacts</h2>
              <button onClick={() => setShowAddContact(!showAddContact)} className="action-btn">
                <Plus size={14} /> Add
              </button>
            </div>

            {showAddContact && (
              <div className={`${cardCls} add-contact-form`}>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b", marginBottom: "0.75rem" }}>Add Emergency Contact</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { key: "name",     ph: "Name",                icon: "👤" },
                    { key: "phone",    ph: "Phone Number",         icon: "📱" },
                    { key: "relation", ph: "Relation (e.g. Mom)", icon: "💝" },
                  ].map(f => (
                    <div key={f.key} className="input-wrap">
                      <span className="input-icon">{f.icon}</span>
                      <input
                        type="text"
                        placeholder={f.ph}
                        value={newContact[f.key]}
                        onChange={e => setNewContact(p => ({ ...p, [f.key]: e.target.value }))}
                        className={inputCls}
                        style={{ paddingLeft: "2.25rem" }}
                      />
                    </div>
                  ))}
                  <div className="form-actions">
                    <button onClick={() => setShowAddContact(false)} className={dark ? "form-cancel-dark" : "form-cancel-light"}>Cancel</button>
                    <button onClick={addContact} className="form-submit">Save</button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {contacts.map(c => (
                <div key={c.id} className={`${cardCls} contact-card`}>
                  <div className="contact-avatar">{c.name.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b" }}>{c.name}</p>
                    <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>{c.relation} • {c.phone}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <a href={`tel:${c.phone}`}>
                      <div className="call-btn">
                        <Phone size={14} color="white" />
                      </div>
                    </a>
                    <button onClick={() => setContacts(c2 => c2.filter(x => x.id !== c.id))}
                      className={`delete-btn ${dark ? "delete-btn-dark" : "delete-btn-light"}`}>
                      <Trash2 size={14} color="#f87171" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={cardCls}>
              <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b", marginBottom: "0.75rem" }}>National Emergency Numbers</p>
              {[
                { name: "Police",             num: "100",  icon: "👮", bg: "#3b82f6" },
                { name: "Women Helpline",     num: "1091", icon: "🌸", bg: "#ec4899" },
                { name: "Ambulance",          num: "108",  icon: "🚑", bg: "#ef4444" },
                { name: "National Emergency", num: "112",  icon: "🚨", bg: "#f97316" },
              ].map(e => (
                <div key={e.name} className="emergency-row" style={{ background: dark ? "rgba(255,255,255,0.05)" : "#f8fafc" }}>
                  <div className="emergency-icon" style={{ background: e.bg }}>{e.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 500, color: dark ? "white" : "#1e293b" }}>{e.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#8b5cf6", fontWeight: 700 }}>{e.num}</p>
                  </div>
                  <a href={`tel:${e.num}`} className="call-pill">Call</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEEDBACK */}
        {tab === "feedback" && (
          <div className="tab-content">
            <div className="section-header">
              <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: dark ? "white" : "#1e293b" }}>Community Safety</h2>
              <button onClick={() => setShowFeedbackForm(!showFeedbackForm)} className="action-btn">
                <Flag size={14} /> Report
              </button>
            </div>

            <div className="filter-bar">
              {["all", ...AREA_TAGS.map(t => t.id)].map(t => {
                const tag = AREA_TAGS.find(x => x.id === t);
                return (
                  <button key={t} onClick={() => setFilterTag(t)}
                    className="filter-btn"
                    style={{
                      background: filterTag === t ? "#8b5cf6" : (dark ? "rgba(255,255,255,0.1)" : "#f5f3ff"),
                      color: filterTag === t ? "white" : (dark ? "#cbd5e1" : "#7c3aed"),
                    }}>
                    {tag ? `${tag.icon} ${tag.label}` : "All Areas"}
                  </button>
                );
              })}
            </div>

            {showFeedbackForm && (
              <div className={`${cardCls} add-contact-form`}>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b", marginBottom: "0.75rem" }}>Report an Area</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <input
                    type="text"
                    placeholder="Area name / location"
                    value={feedbackForm.area}
                    onChange={e => setFeedbackForm(p => ({ ...p, area: e.target.value }))}
                    className={inputCls}
                  />
                  <div>
                    <p style={{ fontSize: "0.75rem", color: dark ? "#94a3b8" : "#64748b", marginBottom: "0.5rem" }}>Tag this area:</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {AREA_TAGS.map(t => (
                        <button key={t.id} onClick={() => setFeedbackForm(p => ({ ...p, tag: t.id }))}
                          style={{
                            display: "flex", alignItems: "center", gap: "0.25rem",
                            padding: "0.375rem 0.75rem", borderRadius: "999px",
                            fontSize: "0.75rem", fontWeight: 500, cursor: "pointer",
                            border: feedbackForm.tag === t.id ? "none" : `1px solid ${dark ? "rgba(255,255,255,0.2)" : "#e2e8f0"}`,
                            background: feedbackForm.tag === t.id ? t.hex : (dark ? "rgba(255,255,255,0.1)" : "white"),
                            color: feedbackForm.tag === t.id ? "white" : (dark ? "#cbd5e1" : "#475569"),
                          }}>
                          {t.icon} {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: dark ? "#94a3b8" : "#64748b", marginBottom: "0.5rem" }}>Safety Rating:</p>
                    <div className="stars-row">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setFeedbackForm(p => ({ ...p, rating: n }))} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
                          <Star size={24} style={{ fill: n <= feedbackForm.rating ? "#fbbf24" : "none", color: n <= feedbackForm.rating ? "#fbbf24" : (dark ? "rgba(255,255,255,0.2)" : "#e2e8f0") }} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Short review (optional)"
                    value={feedbackForm.comment}
                    onChange={e => setFeedbackForm(p => ({ ...p, comment: e.target.value }))}
                    className={inputCls}
                  />
                  <div className="form-actions">
                    <button onClick={() => setShowFeedbackForm(false)} className={dark ? "form-cancel-dark" : "form-cancel-light"}>Cancel</button>
                    <button onClick={addFeedback} className="form-submit">Submit</button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filteredFeedbacks.map(f => {
                const tag = AREA_TAGS.find(t => t.id === f.tag);
                return (
                  <div key={f.id} className={cardCls}>
                    <div className="feedback-card-inner">
                      <div className="feedback-tag-icon" style={{ background: tag?.hex || "#6b7280" }}>{tag?.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b" }}>{f.area}</p>
                          <div className="stars-row">
                            {[1,2,3,4,5].map(n => (
                              <Star key={n} size={12} style={{ fill: n <= f.rating ? "#fbbf24" : "none", color: n <= f.rating ? "#fbbf24" : "#cbd5e1" }} />
                            ))}
                          </div>
                        </div>
                        <span className="tag-pill" style={{ background: tag?.hex || "#6b7280" }}>{tag?.label}</span>
                        {f.comment && <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b", marginTop: "0.25rem" }}>{f.comment}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredFeedbacks.length === 0 && (
                <div className={`${cardCls} empty-state`}>
                  <div className="empty-icon">📍</div>
                  <p style={{ fontSize: "0.875rem", color: dark ? "#94a3b8" : "#64748b" }}>No reports for this tag yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating SOS */}
      <button onClick={handleSOS} className="floating-sos">
        <div className="floating-sos-ring" />
        <AlertTriangle size={24} color="white" style={{ position: "relative", zIndex: 1 }} />
      </button>

      {/* Bottom Navigation */}
      <div className={`bottom-nav ${dark ? "bottom-nav-dark" : "bottom-nav-light"}`}>
        <div className="bottom-nav-inner">
          {[
            { id: "home",     Icon: Home,  label: "Home" },
            { id: "map",      Icon: Map,   label: "Map" },
            { id: "contacts", Icon: Users, label: "Contacts" },
            { id: "feedback", Icon: Star,  label: "Feedback" },
          ].map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`nav-btn ${tab === id ? "active" : (dark ? "nav-btn-dark" : "nav-btn-light")}`}>
              <Icon size={20} />
              <span className="nav-label">{label}</span>
            </button>
          ))}
          <button onClick={() => setAiOpen(true)}
            className={`nav-btn ${aiOpen ? "active" : (dark ? "nav-btn-dark" : "nav-btn-light")}`}>
            <Bot size={20} />
            <span className="nav-label">AI</span>
            <span className="nav-online-dot" />
          </button>
        </div>
      </div>
    </div>
  );
}
