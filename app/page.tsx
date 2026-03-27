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
      setError("write something");
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
        throw new Error(data.error || "failed to create");
      }

      setLink(`${window.location.origin}/${data.id}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="container">
      <h1 className="title">makeasecret</h1>

      {!link ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="label">secret</div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="write here"
            />
          </div>

          <div className="form-group">
            <div className="label">password (optional)</div>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="leave empty for none"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "creating..." : "make a secret"}
          </button>

          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <div>
          <div className="success">secret created</div>
          <div className="link-box">
            <input type="text" value={link} readOnly />
            <button onClick={copyLink}>copy</button>
          </div>
          <small>dies after one view or 24 hours</small>
        </div>
      )}
    </div>
  );
}
