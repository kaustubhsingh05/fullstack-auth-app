import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(form.email, form.password);
      nav("/");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to login");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} style={{ width: "100%", padding: 10, margin: "8px 0" }}/>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} style={{ width: "100%", padding: 10, margin: "8px 0" }}/>
        <button type="submit" style={{ width: "100%", padding: 10 }}>Login</button>
      </form>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <p>New here? <Link to="/signup">Create account</Link></p>
    </div>
  );
}
