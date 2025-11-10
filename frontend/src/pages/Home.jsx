import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Home() {
  const { user, logout } = useAuth();

  // form state
  const [form, setForm] = useState({
    fullName: "", title: "", company: "", phone: "", email: "",
    website: "", linkedIn: "", github: "", twitter: "", address: "",
    theme: "light", color: "#0078ff"
  });
  const [imgUrl, setImgUrl] = useState("https://via.placeholder.com/80");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  // load existing card (if any)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/auth/card");
        if (data?.card) setForm((f) => ({ ...f, ...data.card }));
      } catch {}
    })();
  }, []);

  // computed header color/class
  const headerStyle = useMemo(
    () => ({ background: form.color || "#00bfff" }),
    [form.color]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // file -> preview
  const onImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImgUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const saveCard = async () => {
    setSaving(true);
    setStatus({ type: "", text: "" });
    try {
      await api.post("/auth/card", form);
      setStatus({ type: "ok", text: "Saved to MongoDB ✔" });
    } catch {
      setStatus({ type: "err", text: "Failed to save. Check backend logs." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav>
        <div className="logo">💼 <span>DigiCard</span></div>
        <ul>
          <li><a className="active" href="#">Home</a></li>
          <li><a href="#">Generator</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <div className="right">
          <span>Hi, {user?.name}</span>
          <button className="logout" onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="container">
        <section className="hero">
          <div className="overlay">
            <h1>Welcome to <span>DigiCard</span></h1>
            <p>Create your personalized digital business card in minutes.</p>
          </div>
        </section>

        {/* Generator Layout */}
        <div className="main">
          {/* Left: Form */}
          <section className="panel form">
            <h2>Digital Business Card Generator</h2>
            <p className="subtitle">Fill your details and generate your unique card instantly!</p>

            <label>Upload Profile Image</label>
            <input type="file" accept="image/*" onChange={onImage} />

            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={onChange} placeholder="Enter your name" />

            <label>Job Title</label>
            <input name="title" value={form.title} onChange={onChange} placeholder="e.g. Software Engineer" />

            <label>Email</label>
            <input name="email" value={form.email} onChange={onChange} placeholder="e.g. you@example.com" />

            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={onChange} placeholder="e.g. +91 9876543210" />

            <label>Company / Organization</label>
            <input name="company" value={form.company} onChange={onChange} placeholder="e.g. Ampere Showroom" />

            <label>Website</label>
            <input name="website" value={form.website} onChange={onChange} placeholder="e.g. example.com" />

            <label>LinkedIn</label>
            <input name="linkedIn" value={form.linkedIn} onChange={onChange} placeholder="LinkedIn URL" />

            <label>GitHub</label>
            <input name="github" value={form.github} onChange={onChange} placeholder="GitHub URL" />

            <label>Twitter / X</label>
            <input name="twitter" value={form.twitter} onChange={onChange} placeholder="Twitter/X URL" />

            <label>Address</label>
            <textarea name="address" value={form.address} onChange={onChange} placeholder="Your address" />

            <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
              <select name="theme" value={form.theme} onChange={onChange}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <input type="color" name="color" value={form.color} onChange={onChange} />
            </div>

            <button className="save" onClick={saveCard} disabled={saving}>
              {saving ? "Saving..." : "Save Card"}
            </button>

            {status.text && (
              <p className={`alert ${status.type === "ok" ? "ok" : "err"}`}>{status.text}</p>
            )}
          </section>

          {/* Right: Preview */}
          <section className="panel preview">
            <h2>Preview</h2>

            <div className="business-card">
              <div className="card-top" style={headerStyle}>
                <img src={imgUrl} alt="Profile" />
                <div>
                  <h3 style={{ textTransform: "capitalize", fontWeight: 800 }}>{form.fullName || "Your Name"}</h3>
                  <div className="small">{form.title || "Your Title"}</div>
                </div>
              </div>
              <div className="card-bottom">
                <p><strong>Email:</strong> {form.email || "you@example.com"}</p>
                <p><strong>Phone:</strong> {form.phone || "+91 0000000000"}</p>
                <p><strong>Company:</strong> {form.company || "Company"}</p>
                {form.website && <p><strong>Website:</strong> {form.website}</p>}
                {form.linkedIn && <p><strong>LinkedIn:</strong> {form.linkedIn}</p>}
                {form.github && <p><strong>GitHub:</strong> {form.github}</p>}
                {form.twitter && <p><strong>Twitter:</strong> {form.twitter}</p>}
                {form.address && <p><strong>Address:</strong> {form.address}</p>}
              </div>
            </div>

            <p className="small">Tip: Change theme color to see the header update live.</p>
          </section>
        </div>
      </div>
    </>
  );
}
