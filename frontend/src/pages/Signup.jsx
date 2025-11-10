import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signup(form.name, form.email, form.password);
      nav("/");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to signup");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h2>Create account</h2>
      <form onSubmit={onSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} style={{ width: "100%", padding: 10, margin: "8px 0" }}/>
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} style={{ width: "100%", padding: 10, margin: "8px 0" }}/>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} style={{ width: "100%", padding: 10, margin: "8px 0" }}/>
        <button type="submit" style={{ width: "100%", padding: 10 }}>Sign up</button>
      </form>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
