import { useState, useEffect, createContext, useContext } from "react";

// ─── API BASE ────────────────────────────────────────────────────────────────
const API = "https://nexerp-backend.onrender.com/api";

const api = async (path, method = "GET", body = null) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
};

// ─── AUTH CONTEXT ────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch { return {}; }
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    employees: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    departments: "M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z",
    attendance: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z",
    leaves: "M17 8C8 10 5.9 16.17 3.82 21H5.71C8.09 15.56 12.55 13.27 18 13v4l5-5-5-5v4z",
    finance: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
    inventory: "M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z",
    sales: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.43 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z",
    logout: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
    add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    delete: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    search: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d={icons[name] || icons.dashboard} />
    </svg>
  );
};

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      padding: "12px 20px", borderRadius: 8, color: "#fff", fontWeight: 600,
      background: type === "error" ? "#ef4444" : "#10b981",
      boxShadow: "0 4px 20px rgba(0,0,0,.3)", animation: "slideUp .3s ease",
      display: "flex", alignItems: "center", gap: 8
    }}>
      {msg}
      <span onClick={onClose} style={{ cursor: "pointer", opacity: .8 }}>✕</span>
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.6)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      backdropFilter: "blur(4px)"
    }}>
      <div style={{
        background: "#1e2030", border: "1px solid #2d3150",
        borderRadius: 16, padding: 28, width: "100%", maxWidth: 520,
        maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.5)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#e2e8f0", fontSize: 18, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── FORM FIELD ──────────────────────────────────────────────────────────────
const Field = ({ label, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 13, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase" }}>{label}</label>
    <input style={{
      width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #2d3150",
      background: "#0f1120", color: "#e2e8f0", fontSize: 14, outline: "none",
      boxSizing: "border-box", transition: "border-color .2s"
    }}
      onFocus={e => e.target.style.borderColor = "#6366f1"}
      onBlur={e => e.target.style.borderColor = "#2d3150"}
      {...props}
    />
  </div>
);

const SelectField = ({ label, children, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 13, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase" }}>{label}</label>
    <select style={{
      width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #2d3150",
      background: "#0f1120", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box"
    }} {...props}>{children}</select>
  </div>
);

// ─── BTN ──────────────────────────────────────────────────────────────────────
const Btn = ({ variant = "primary", children, ...props }) => {
  const styles = {
    primary: { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff" },
    danger: { background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff" },
    success: { background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff" },
    ghost: { background: "transparent", border: "1px solid #2d3150", color: "#94a3b8" },
  };
  return (
    <button style={{
      padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer",
      fontWeight: 600, fontSize: 13, transition: "opacity .2s, transform .1s",
      display: "inline-flex", alignItems: "center", gap: 6,
      ...styles[variant]
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      {...props}
    >{children}</button>
  );
};

// ─── TABLE ───────────────────────────────────────────────────────────────────
const Table = ({ cols, rows, actions }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {cols.map(c => (
            <th key={c} style={{ padding: "12px 16px", textAlign: "left", color: "#6366f1", fontSize: 12, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", borderBottom: "1px solid #2d3150" }}>{c}</th>
          ))}
          {actions && <th style={{ padding: "12px 16px", color: "#6366f1", fontSize: 12, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", borderBottom: "1px solid #2d3150" }}>ACTIONS</th>}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={cols.length + (actions ? 1 : 0)} style={{ padding: 40, textAlign: "center", color: "#4a5568" }}>No records found</td></tr>
        ) : rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: "1px solid #1a1e35" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1a1e35"}
            onMouseLeave={e => e.currentTarget.style.background = ""}
          >
            {row.cells.map((c, j) => (
              <td key={j} style={{ padding: "12px 16px", color: "#cbd5e1", fontSize: 14 }}>{c}</td>
            ))}
            {actions && <td style={{ padding: "12px 16px" }}>{actions(row.data)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── STAT CARD ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color = "#6366f1", icon }) => (
  <div style={{
    background: "#1e2030", border: "1px solid #2d3150", borderRadius: 16,
    padding: 24, position: "relative", overflow: "hidden"
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: "16px 16px 0 0" }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ margin: "0 0 8px", color: "#64748b", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>{label}</p>
        <p style={{ margin: 0, color: "#f1f5f9", fontSize: 32, fontWeight: 800 }}>{value}</p>
      </div>
      <div style={{ background: `${color}22`, color, padding: 12, borderRadius: 12 }}>
        <Icon name={icon} size={24} />
      </div>
    </div>
  </div>
);

// ─── CARD ─────────────────────────────────────────────────────────────────────
const Card = ({ title, children, action }) => (
  <div style={{ background: "#1e2030", border: "1px solid #2d3150", borderRadius: 16, padding: 24, marginBottom: 24 }}>
    {(title || action) && (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        {title && <h3 style={{ margin: 0, color: "#e2e8f0", fontSize: 16, fontWeight: 700 }}>{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);

// ─── BADGE ────────────────────────────────────────────────────────────────────
const Badge = ({ label, color }) => {
  const map = { APPROVED: "#10b981", REJECTED: "#ef4444", PENDING: "#f59e0b", PRESENT: "#10b981", ABSENT: "#ef4444", INCOME: "#10b981", EXPENSE: "#ef4444" };
  const c = color || map[label] || "#6366f1";
  return <span style={{ background: `${c}22`, color: c, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{label}</span>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("login"); // login | register

  const handle = async () => {
    setLoading(true); setErr("");
    try {
      if (tab === "login") {
        const token = await api("/auth/login", "POST", form);
        onLogin(token);
      } else {
        await api("/auth/register", "POST", { ...form, username: form.email.split("@")[0] });
        setTab("login");
        setErr("Registered! Please login.");
      }
    } catch (e) { setErr(e.message); }
    setLoading(false);
  };

  return (
    <div style={{
      width: "100vw", height: "100vh", background: "#0f1120",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Sora', 'Segoe UI', sans-serif", overflow: "auto"
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
      @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      `}</style>
      {/* BG decorations */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,#6366f133,transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,#8b5cf622,transparent 70%)" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 420, padding: 16, animation: "slideUp .5s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>
            <Icon name="dashboard" size={32} />
          </div>
          <h1 style={{ margin: 0, color: "#f1f5f9", fontSize: 28, fontWeight: 800, letterSpacing: "-1px" }}>NexERP</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>Enterprise Resource Planning</p>
        </div>

        <div style={{ background: "#1e2030", border: "1px solid #2d3150", borderRadius: 20, padding: 32, boxShadow: "0 24px 80px rgba(0,0,0,.4)" }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "#0f1120", borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {["login", "register"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "8px 0", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14,
                background: tab === t ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                color: tab === t ? "#fff" : "#64748b", transition: "all .2s", fontFamily: "inherit"
              }}>{t === "login" ? "Sign In" : "Register"}</button>
            ))}
          </div>

          <Field label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Field label="Password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

          {err && <p style={{ color: err.includes("Registered") ? "#10b981" : "#ef4444", fontSize: 13, margin: "0 0 16px", textAlign: "center" }}>{err}</p>}

          <button onClick={handle} disabled={loading} style={{
            width: "100%", padding: "12px", border: "none", borderRadius: 10,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff",
            fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? .7 : 1, fontFamily: "inherit", letterSpacing: ".3px"
          }}>
            {loading ? "Loading..." : tab === "login" ? "Sign In →" : "Create Account"}
          </button>

          <div style={{ textAlign: "center", marginTop: 20, padding: "16px", background: "#0f1120", borderRadius: 10 }}>
            <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>
              Default employee password: <strong style={{ color: "#6366f1" }}>123456</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api("/dashboard").then(setStats).catch(() => {}); }, []);
  if (!stats) return <div style={{ color: "#64748b", padding: 40, textAlign: "center" }}>Loading dashboard...</div>;

  const fmt = n => typeof n === "number" ? n.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : n;

  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22, margin: "0 0 24px" }}>Dashboard Overview</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Employees" value={stats.employees} color="#6366f1" icon="employees" />
        <StatCard label="Departments" value={stats.departments} color="#8b5cf6" icon="departments" />
        <StatCard label="Attendance Records" value={stats.attendance} color="#06b6d4" icon="attendance" />
        <StatCard label="Leave Requests" value={stats.leaves} color="#f59e0b" icon="leaves" />
        <StatCard label="Inventory Items" value={stats.inventoryItems} color="#10b981" icon="inventory" />
        <StatCard label="Total Sales" value={`₹${fmt(stats.totalSales)}`} color="#ec4899" icon="sales" />
        <StatCard label="Total Income" value={`₹${fmt(stats.totalIncome)}`} color="#10b981" icon="finance" />
        <StatCard label="Total Expense" value={`₹${fmt(stats.totalExpense)}`} color="#ef4444" icon="finance" />
        <StatCard label="Net Profit" value={`₹${fmt(stats.profit)}`} color={stats.profit >= 0 ? "#10b981" : "#ef4444"} icon="finance" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMPLOYEES
// ═══════════════════════════════════════════════════════════════════════════════
function Employees() {
  const [data, setData] = useState([]);
  const [depts, setDepts] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const load = async (q = "", p = 0) => {
    try {
      const path = q ? `/employees/search?name=${q}&page=${p}&size=10` : `/employees?page=${p}&size=10`;
      const res = await api(path);
      setData(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch {}
  };

  useEffect(() => { load(search, page); api("/departments").then(setDepts).catch(() => {}); }, []);

  const save = async () => {
    try {
      if (modal === "edit") await api(`/employees/${form.id}`, "PUT", form);
      else await api("/employees", "POST", { ...form, department: form.departmentId ? { id: form.departmentId } : null });
      setModal(null); load(search, page);
      setToast({ msg: "Saved successfully!", type: "success" });
    } catch (e) { setToast({ msg: e.message, type: "error" }); }
  };

  const del = async (id) => {
    if (!confirm("Deactivate this employee?")) return;
    try { await api(`/employees/${id}`, "DELETE"); load(search, page); setToast({ msg: "Employee deactivated", type: "success" }); }
    catch (e) { setToast({ msg: e.message, type: "error" }); }
  };

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22, margin: 0 }}>Employees</h2>
        <Btn onClick={() => { setForm({}); setModal("add"); }}><Icon name="add" size={16} /> Add Employee</Btn>
      </div>
      <Card>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }}><Icon name="search" size={18} /></span>
            <input placeholder="Search by name..." value={search}
              onChange={e => { setSearch(e.target.value); load(e.target.value, 0); setPage(0); }}
              style={{ width: "100%", padding: "10px 14px 10px 40px", borderRadius: 8, border: "1px solid #2d3150", background: "#0f1120", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>
        <Table
          cols={["ID", "Name", "Email", "Phone", "Salary", "Department"]}
          rows={data.map(e => ({ data: e, cells: [e.id, e.name, e.email, e.phone, `₹${e.salary?.toLocaleString()}`, e.department?.name || "—"] }))}
          actions={row => (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" onClick={() => { setForm({ ...row, departmentId: row.department?.id }); setModal("edit"); }}><Icon name="edit" size={14} /></Btn>
              <Btn variant="danger" onClick={() => del(row.id)}><Icon name="delete" size={14} /></Btn>
            </div>
          )}
        />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <Btn variant="ghost" onClick={() => { setPage(p => Math.max(0, p - 1)); load(search, Math.max(0, page - 1)); }} disabled={page === 0}>← Prev</Btn>
          <span style={{ color: "#94a3b8", padding: "9px 0" }}>Page {page + 1} / {totalPages}</span>
          <Btn variant="ghost" onClick={() => { setPage(p => p + 1); load(search, page + 1); }} disabled={page >= totalPages - 1}>Next →</Btn>
        </div>
      </Card>

      {modal && (
        <Modal title={modal === "edit" ? "Edit Employee" : "Add Employee"} onClose={() => setModal(null)}>
          <Field label="Name" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Field label="Email" type="email" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Field label="Phone" value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Field label="Salary" type="number" value={form.salary || ""} onChange={e => setForm({ ...form, salary: parseFloat(e.target.value) })} />
          <SelectField label="Department" value={form.departmentId || ""} onChange={e => setForm({ ...form, departmentId: parseInt(e.target.value) })}>
            <option value="">Select Department</option>
            {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </SelectField>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEPARTMENTS
// ═══════════════════════════════════════════════════════════════════════════════
function Departments() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => { api("/departments").then(setData).catch(() => {}); }, []);

  const save = async () => {
    try {
      await api("/departments", "POST", form);
      setModal(false); api("/departments").then(setData);
      setToast({ msg: "Department created!", type: "success" });
    } catch (e) { setToast({ msg: e.message, type: "error" }); }
  };

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22, margin: 0 }}>Departments</h2>
        <Btn onClick={() => { setForm({}); setModal(true); }}><Icon name="add" size={16} /> Add Department</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
        {data.map(d => (
          <div key={d.id} style={{ background: "#1e2030", border: "1px solid #2d3150", borderRadius: 16, padding: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#6366f122", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon name="departments" size={22} />
            </div>
            <h3 style={{ margin: "0 0 6px", color: "#e2e8f0", fontSize: 16, fontWeight: 700 }}>{d.name}</h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>{d.description || "No description"}</p>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title="Add Department" onClose={() => setModal(false)}>
          <Field label="Name" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Field label="Description" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Create</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ATTENDANCE
// ═══════════════════════════════════════════════════════════════════════════════
function Attendance() {
  const [data, setData] = useState([]);
  const [toast, setToast] = useState(null);
  const { roles } = useAuth();
  const isEmployee = roles.includes("EMPLOYEE");

  useEffect(() => { if (isEmployee) api("/attendance/my").then(setData).catch(() => {}); }, []);

  const checkIn = async () => {
    try { await api("/attendance/check-in", "POST"); setToast({ msg: "Checked in!", type: "success" }); api("/attendance/my").then(setData); }
    catch (e) { setToast({ msg: e.message, type: "error" }); }
  };
  const checkOut = async () => {
    try { await api("/attendance/check-out", "POST"); setToast({ msg: "Checked out!", type: "success" }); api("/attendance/my").then(setData); }
    catch (e) { setToast({ msg: e.message, type: "error" }); }
  };

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22, margin: "0 0 24px" }}>Attendance</h2>
      {isEmployee && (
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <Btn variant="success" onClick={checkIn}><Icon name="check" size={16} /> Check In</Btn>
          <Btn onClick={checkOut}>Check Out</Btn>
        </div>
      )}
      <Card title="Attendance Records">
        <Table
          cols={["Date", "Check In", "Check Out", "Status"]}
          rows={data.map(a => ({
            data: a,
            cells: [
              a.date,
              a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString() : "—",
              a.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString() : "—",
              <Badge label={a.status} />
            ]
          }))}
        />
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEAVES
// ═══════════════════════════════════════════════════════════════════════════════
function Leaves() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const { roles } = useAuth();
  const isEmployee = roles.includes("EMPLOYEE");
  const isAdmin = roles.includes("ADMIN") || roles.includes("HR");

  const load = () => {
    if (isAdmin) api("/leaves/all").then(setData).catch(() => {});
    else api("/leaves/my").then(setData).catch(() => {});
  };
  useEffect(load, []);

  const apply = async () => {
    try {
      await api("/leaves/apply", "POST", form);
      setModal(false); load();
      setToast({ msg: "Leave applied!", type: "success" });
    } catch (e) { setToast({ msg: e.message, type: "error" }); }
  };

  const updateStatus = async (id, action) => {
    try {
      await api(`/leaves/${id}/${action}`, "PUT");
      load(); setToast({ msg: `Leave ${action}d!`, type: "success" });
    } catch (e) { setToast({ msg: e.message, type: "error" }); }
  };

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22, margin: 0 }}>Leave Management</h2>
        {isEmployee && <Btn onClick={() => { setForm({}); setModal(true); }}><Icon name="add" size={16} /> Apply Leave</Btn>}
      </div>
      <Card title="Leave Requests">
        <Table
          cols={["From", "To", "Reason", "Status"]}
          rows={data.map(l => ({
            data: l,
            cells: [l.fromDate, l.toDate, l.reason, <Badge label={l.status} />]
          }))}
          actions={isAdmin ? row => row.status === "PENDING" ? (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="success" onClick={() => updateStatus(row.id, "approve")}><Icon name="check" size={14} /></Btn>
              <Btn variant="danger" onClick={() => updateStatus(row.id, "reject")}><Icon name="close" size={14} /></Btn>
            </div>
          ) : null : null}
        />
      </Card>
      {modal && (
        <Modal title="Apply Leave" onClose={() => setModal(false)}>
          <Field label="From Date" type="date" value={form.fromDate || ""} onChange={e => setForm({ ...form, fromDate: e.target.value })} />
          <Field label="To Date" type="date" value={form.toDate || ""} onChange={e => setForm({ ...form, toDate: e.target.value })} />
          <Field label="Reason" value={form.reason || ""} onChange={e => setForm({ ...form, reason: e.target.value })} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={apply}>Apply</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FINANCE
// ═══════════════════════════════════════════════════════════════════════════════
function Finance() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const [loadErr, setLoadErr] = useState("");

  const load = () => {
    setLoadErr("");
    api("/finance").then(setData).catch(e => setLoadErr(e.message));
  };
  useEffect(load, []);

  const save = async () => {
    try {
      if (modal === "edit") await api(`/finance/${form.id}`, "PUT", form);
      else await api("/finance", "POST", form);
      setModal(null); load(); setToast({ msg: "Saved!", type: "success" });
    } catch (e) { setToast({ msg: e.message, type: "error" }); }
  };

  const del = async (id) => {
    if (!confirm("Delete?")) return;
    await api(`/finance/${id}`, "DELETE"); load(); setToast({ msg: "Deleted", type: "success" });
  };

  const income = data.filter(f => f.type === "INCOME").reduce((s, f) => s + f.amount, 0);
  const expense = data.filter(f => f.type === "EXPENSE").reduce((s, f) => s + f.amount, 0);

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {loadErr && (
        <div style={{ background: "#ef444422", border: "1px solid #ef4444", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#ef4444", fontSize: 13 }}>
          ⚠️ <strong>Backend Error:</strong> {loadErr}
          <br /><span style={{ color: "#94a3b8", fontSize: 12 }}>Fix: Add <code style={{color:"#f59e0b"}}>.requestMatchers("/api/finance/**").authenticated()</code> and ensure JWT token is sent. Or add <code style={{color:"#f59e0b"}}>.permitAll()</code> for testing.</span>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22, margin: 0 }}>Finance</h2>
        <Btn onClick={() => { setForm({}); setModal("add"); }}><Icon name="add" size={16} /> Add Record</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Income" value={`₹${income.toLocaleString()}`} color="#10b981" icon="finance" />
        <StatCard label="Total Expense" value={`₹${expense.toLocaleString()}`} color="#ef4444" icon="finance" />
        <StatCard label="Net Profit" value={`₹${(income - expense).toLocaleString()}`} color={income >= expense ? "#10b981" : "#ef4444"} icon="finance" />
      </div>
      <Card title="Finance Records">
        <Table
          cols={["Type", "Amount", "Description", "Date"]}
          rows={data.map(f => ({ data: f, cells: [<Badge label={f.type} />, `₹${f.amount.toLocaleString()}`, f.description, f.date] }))}
          actions={row => (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" onClick={() => { setForm(row); setModal("edit"); }}><Icon name="edit" size={14} /></Btn>
              <Btn variant="danger" onClick={() => del(row.id)}><Icon name="delete" size={14} /></Btn>
            </div>
          )}
        />
      </Card>
      {modal && (
        <Modal title={modal === "edit" ? "Edit Record" : "Add Finance Record"} onClose={() => setModal(null)}>
          <SelectField label="Type" value={form.type || ""} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="">Select Type</option>
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </SelectField>
          <Field label="Amount" type="number" value={form.amount || ""} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) })} />
          <Field label="Description" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} />
          <Field label="Date" type="date" value={form.date || ""} onChange={e => setForm({ ...form, date: e.target.value })} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVENTORY
// ═══════════════════════════════════════════════════════════════════════════════
function Inventory() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const [loadErr, setLoadErr] = useState("");

  const load = () => {
    setLoadErr("");
    api("/inventory").then(setData).catch(e => setLoadErr(e.message));
  };
  useEffect(load, []);

  const save = async () => {
    try {
      if (modal === "edit") await api(`/inventory/${form.id}`, "PUT", form);
      else await api("/inventory", "POST", form);
      setModal(null); load(); setToast({ msg: "Saved!", type: "success" });
    } catch (e) { setToast({ msg: e.message, type: "error" }); }
  };

  const del = async (id) => {
    if (!confirm("Delete item?")) return;
    await api(`/inventory/${id}`, "DELETE"); load(); setToast({ msg: "Deleted", type: "success" });
  };

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {loadErr && <div style={{ background: "#ef444422", border: "1px solid #ef4444", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#ef4444", fontSize: 13 }}>⚠️ <strong>Backend Error:</strong> {loadErr}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22, margin: 0 }}>Inventory</h2>
        <Btn onClick={() => { setForm({}); setModal("add"); }}><Icon name="add" size={16} /> Add Item</Btn>
      </div>
      <Card title="Inventory Items">
        <Table
          cols={["Item Name", "Quantity", "Price", "Supplier", "Date"]}
          rows={data.map(i => ({ data: i, cells: [i.itemName, i.quantity, `₹${i.price}`, i.supplier, i.createdDate] }))}
          actions={row => (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" onClick={() => { setForm(row); setModal("edit"); }}><Icon name="edit" size={14} /></Btn>
              <Btn variant="danger" onClick={() => del(row.id)}><Icon name="delete" size={14} /></Btn>
            </div>
          )}
        />
      </Card>
      {modal && (
        <Modal title={modal === "edit" ? "Edit Item" : "Add Item"} onClose={() => setModal(null)}>
          <Field label="Item Name" value={form.itemName || ""} onChange={e => setForm({ ...form, itemName: e.target.value })} />
          <Field label="Quantity" type="number" value={form.quantity || ""} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) })} />
          <Field label="Price" type="number" value={form.price || ""} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} />
          <Field label="Supplier" value={form.supplier || ""} onChange={e => setForm({ ...form, supplier: e.target.value })} />
          <Field label="Date" type="date" value={form.createdDate || ""} onChange={e => setForm({ ...form, createdDate: e.target.value })} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SALES
// ═══════════════════════════════════════════════════════════════════════════════
function Sales() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const [loadErr, setLoadErr] = useState("");

  const load = () => {
    setLoadErr("");
    api("/sales").then(setData).catch(e => setLoadErr(e.message));
  };
  useEffect(load, []);

  const save = async () => {
    try {
      if (modal === "edit") await api(`/sales/${form.id}`, "PUT", form);
      else await api("/sales", "POST", form);
      setModal(null); load(); setToast({ msg: "Saved!", type: "success" });
    } catch (e) { setToast({ msg: e.message, type: "error" }); }
  };

  const del = async (id) => {
    if (!confirm("Delete sale?")) return;
    await api(`/sales/${id}`, "DELETE"); load(); setToast({ msg: "Deleted", type: "success" });
  };

  const total = data.reduce((s, i) => s + i.totalAmount, 0);

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {loadErr && <div style={{ background: "#ef444422", border: "1px solid #ef4444", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#ef4444", fontSize: 13 }}>⚠️ <strong>Backend Error:</strong> {loadErr}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22, margin: 0 }}>Sales</h2>
        <Btn onClick={() => { setForm({}); setModal("add"); }}><Icon name="add" size={16} /> Add Sale</Btn>
      </div>
      <div style={{ marginBottom: 24 }}>
        <StatCard label="Total Revenue" value={`₹${total.toLocaleString()}`} color="#ec4899" icon="sales" />
      </div>
      <Card title="Sales Records">
        <Table
          cols={["Product", "Qty", "Price", "Total", "Date"]}
          rows={data.map(s => ({ data: s, cells: [s.productName, s.quantity, `₹${s.price}`, `₹${s.totalAmount}`, s.saleDate] }))}
          actions={row => (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" onClick={() => { setForm(row); setModal("edit"); }}><Icon name="edit" size={14} /></Btn>
              <Btn variant="danger" onClick={() => del(row.id)}><Icon name="delete" size={14} /></Btn>
            </div>
          )}
        />
      </Card>
      {modal && (
        <Modal title={modal === "edit" ? "Edit Sale" : "Add Sale"} onClose={() => setModal(null)}>
          <Field label="Product Name" value={form.productName || ""} onChange={e => setForm({ ...form, productName: e.target.value })} />
          <Field label="Quantity" type="number" value={form.quantity || ""} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) })} />
          <Field label="Price" type="number" value={form.price || ""} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} />
          <Field label="Sale Date" type="date" value={form.saleDate || ""} onChange={e => setForm({ ...form, saleDate: e.target.value })} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MY PROFILE (Employee)
// ═══════════════════════════════════════════════════════════════════════════════
function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => { api("/employees/me").then(p => { setProfile(p); setForm(p); }).catch(() => {}); }, []);

  const save = async () => {
    try {
      await api("/employees/me", "PUT", form);
      setEdit(false); api("/employees/me").then(setProfile);
      setToast({ msg: "Profile updated!", type: "success" });
    } catch (e) { setToast({ msg: e.message, type: "error" }); }
  };

  if (!profile) return <div style={{ color: "#64748b", padding: 40 }}>Loading...</div>;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22, margin: "0 0 24px" }}>My Profile</h2>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff" }}>
            {profile.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 style={{ margin: "0 0 4px", color: "#f1f5f9", fontSize: 20, fontWeight: 700 }}>{profile.name}</h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>{profile.email}</p>
            <Badge label={profile.department?.name || "No Dept"} color="#6366f1" />
          </div>
        </div>
        {edit ? (
          <>
            <Field label="Phone" value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Field label="Salary" type="number" value={form.salary || ""} onChange={e => setForm({ ...form, salary: parseFloat(e.target.value) })} />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={save}>Save Changes</Btn>
              <Btn variant="ghost" onClick={() => setEdit(false)}>Cancel</Btn>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[["Phone", profile.phone], ["Salary", `₹${profile.salary?.toLocaleString()}`], ["Department", profile.department?.name], ["Status", profile.active ? "Active" : "Inactive"]].map(([k, v]) => (
                <div key={k} style={{ background: "#0f1120", borderRadius: 10, padding: 16 }}>
                  <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>{k}</p>
                  <p style={{ margin: 0, color: "#e2e8f0", fontSize: 15, fontWeight: 600 }}>{v || "—"}</p>
                </div>
              ))}
            </div>
            <Btn onClick={() => setEdit(true)}><Icon name="edit" size={16} /> Edit Profile</Btn>
          </>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP SHELL
// ═══════════════════════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard", roles: ["ADMIN"] },
  { key: "employees", label: "Employees", icon: "employees", roles: ["ADMIN", "HR"] },
  { key: "departments", label: "Departments", icon: "departments", roles: ["ADMIN", "HR"] },
  { key: "attendance", label: "Attendance", icon: "attendance", roles: ["ADMIN", "EMPLOYEE"] },
  { key: "leaves", label: "Leaves", icon: "leaves", roles: ["ADMIN", "HR", "EMPLOYEE"] },
  { key: "finance", label: "Finance", icon: "finance", roles: ["ADMIN"] },
  { key: "inventory", label: "Inventory", icon: "inventory", roles: ["ADMIN"] },
  { key: "sales", label: "Sales", icon: "sales", roles: ["ADMIN", "HR"] },
  { key: "profile", label: "My Profile", icon: "employees", roles: ["EMPLOYEE"] },
];

const PAGE_MAP = { dashboard: Dashboard, employees: Employees, departments: Departments, attendance: Attendance, leaves: Leaves, finance: Finance, inventory: Inventory, sales: Sales, profile: MyProfile };

function AppShell() {
  const { email, roles, logout } = useAuth();
  const [page, setPage] = useState(null);
  const [sideOpen, setSideOpen] = useState(true);

  const visible = NAV_ITEMS.filter(n => n.roles.some(r => roles.includes(r)));
  useEffect(() => { if (visible.length) setPage(visible[0].key); }, []);

  const PageComp = PAGE_MAP[page] || (() => null);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#0f1120", fontFamily: "'Sora','Segoe UI',sans-serif", overflow: "hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
      html,body,#root{margin:0;padding:0;width:100%;height:100%}
      *{box-sizing:border-box}
      @keyframes slideUp{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
      ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#0f1120} ::-webkit-scrollbar-thumb{background:#2d3150;border-radius:3px}
      `}</style>

      {/* SIDEBAR */}
      <aside style={{
        width: sideOpen ? 240 : 72, height: "100vh",
        background: "#1e2030", borderRight: "1px solid #2d3150",
        transition: "width .3s ease", overflow: "hidden", flexShrink: 0,
        display: "flex", flexDirection: "column"
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #2d3150", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="dashboard" size={20} />
          </div>
          {sideOpen && <span style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 18, whiteSpace: "nowrap" }}>NexERP</span>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {visible.map(n => (
            <button key={n.key} onClick={() => setPage(n.key)} style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%",
              padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
              background: page === n.key ? "linear-gradient(135deg,#6366f122,#8b5cf622)" : "transparent",
              color: page === n.key ? "#a5b4fc" : "#64748b",
              borderLeft: page === n.key ? "3px solid #6366f1" : "3px solid transparent",
              marginBottom: 2, fontFamily: "inherit", transition: "all .15s", textAlign: "left"
            }}
              onMouseEnter={e => { if (page !== n.key) e.currentTarget.style.background = "#ffffff08"; }}
              onMouseLeave={e => { if (page !== n.key) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ flexShrink: 0 }}><Icon name={n.icon} size={20} /></span>
              {sideOpen && <span style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>{n.label}</span>}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid #2d3150" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: "#0f1120", marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 14, flexShrink: 0 }}>
              {email?.[0]?.toUpperCase()}
            </div>
            {sideOpen && (
              <div style={{ overflow: "hidden" }}>
                <p style={{ margin: 0, color: "#e2e8f0", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{email}</p>
                <p style={{ margin: 0, color: "#64748b", fontSize: 11 }}>{roles.join(", ")}</p>
              </div>
            )}
          </div>
          <button onClick={logout} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "transparent", color: "#ef4444", fontFamily: "inherit",
            fontWeight: 600, fontSize: 13, transition: "background .15s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#ef444411"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Icon name="logout" size={20} />{sideOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ padding: "16px 28px", borderBottom: "1px solid #2d3150", display: "flex", alignItems: "center", gap: 16, background: "#1e2030", flexShrink: 0, zIndex: 100 }}>
          <button onClick={() => setSideOpen(o => !o)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4 }}>
            <Icon name="menu" size={22} />
          </button>
          <h1 style={{ margin: 0, color: "#f1f5f9", fontSize: 16, fontWeight: 700 }}>
            {NAV_ITEMS.find(n => n.key === page)?.label || ""}
          </h1>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28, animation: "slideUp .25s ease" }}>
          <PageComp />
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [auth, setAuth] = useState(() => {
    const t = localStorage.getItem("token");
    if (!t) return null;
    const p = parseJwt(t);
    return { email: p.sub, roles: (p.roles || []) };
  });

  const login = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
    const p = parseJwt(t);
    setAuth({ email: p.sub, roles: p.roles || [] });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuth(null);
  };

  if (!token || !auth) return <LoginPage onLogin={login} />;

  return (
    <AuthCtx.Provider value={{ ...auth, logout }}>
      <AppShell />
    </AuthCtx.Provider>
  );
}
