"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/bookmarks`,
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            color: "white",
            marginBottom: "1rem",
          }}
        >
          Smart Bookmarks
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "rgba(255,255,255,0.9)",
            marginBottom: "2rem",
          }}
        >
          Sign in to manage your private bookmarks
        </p>
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.1rem",
            background: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
            fontWeight: "500",
          }}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
