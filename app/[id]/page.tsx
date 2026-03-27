"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ViewSecret() {
  const { id } = useParams();
  const [secret, setSecret] = useState("");
  const [password, setPassword] = useState("");
  const [needPassword, setNeedPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSecret();
  }, [id]);

  const fetchSecret = async (pwd?: string) => {
    try {
      const res = await fetch(`/api/secret/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });

      const data = await res.json();

      if (res.status === 402) {
        setNeedPassword(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error);
      }

      setSecret(data.text);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "secret not found");
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchSecret(password);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="secret-box">
          <div className="secret-text">loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <Link href="/">
          <button style={{ marginTop: "1rem" }}>make new secret</button>
        </Link>
      </div>
    );
  }

  if (needPassword) {
    return (
      <div className="container">
        <div className="label">this secret is protected</div>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter password"
            autoFocus
          />
          <button type="submit" style={{ marginTop: "1rem" }}>
            reveal
          </button>
        </form>
        <Link href="/">
          <button style={{ marginTop: "1rem", background: "#222" }}>
            back
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="secret-box">
        <div className="secret-text">{secret}</div>
      </div>
      <div className="success">this secret has been destroyed</div>
      <small>refreshing will not bring it back</small>
      <Link href="/">
        <button style={{ marginTop: "1rem" }}>make new secret</button>
      </Link>
    </div>
  );
}
