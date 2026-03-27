"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Write something first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          password: password.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create secret");
      }

      if (!data.id) {
        throw new Error("No ID returned from server");
      }

      setLink(`${window.location.origin}/${data.id}`);
    } catch (err) {
      console.error("Frontend error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="container">
      <h1 className="title">make a secret</h1>

      {!link ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="label">your secret</div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="write anything..."
            />
          </div>

          <div className="form-group">
            <div className="label">password (optional)</div>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="leave empty for no password"
            />
            <small>recipient will need this password to read</small>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "creating..." : "make a secret →"}
          </button>

          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <div>
          <div className="success">✓ secret created. share this link:</div>
          <div className="link-box">
            <input type="text" value={link} readOnly />
            <button onClick={copyLink}>copy link</button>
          </div>
          <small>dies after one view or 24 hours</small>
          <button 
            onClick={() => {
              setLink("");
              setText("");
              setPassword("");
            }}
            style={{ marginTop: "1rem", background: "#6b7280" }}
          >
            make another
          </button>
        </div>
      )}
    </div>
  );
}
