"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function AddBookmarkForm({
  userId,
  onBookmarkAdded,
}: {
  userId: string;
  onBookmarkAdded?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizeUrl = (input: string): string => {
    let normalized = input.trim();

    normalized = normalized.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    const urlPatterns = [
      { test: /^www\./i, replace: "https://$&" },
      { test: /^ftp\./i, replace: "ftp://$&" },
      { test: /^[a-z0-9.-]+\.[a-z]{2,}$/i, replace: "https://$&" },
      { test: /^([a-z]+):\/\//i, replace: "$1://" },
    ];

    for (const pattern of urlPatterns) {
      if (pattern.test.test(normalized)) {
        return normalized.replace(pattern.test, pattern.replace);
      }
    }

    return "https://" + normalized;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const normalizedUrl = normalizeUrl(url);

    const { error } = await supabase
      .from("bookmarks")
      .insert([{ title, url: normalizedUrl, user_id: userId }]);

    if (!error) {
      setTitle("");
      setUrl("");
      onBookmarkAdded?.();
      console.log("✅ Added bookmark:", normalizedUrl);
    } else {
      console.error("❌ Add error:", error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        background: "#f8f9fa",
        padding: "2rem",
        borderRadius: "12px",
        marginBottom: "2rem",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#333" }}>
        ➕ Add Bookmark
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          placeholder="Google, GitHub, YouTube..."
          style={{
            padding: "1rem",
            fontSize: "1.1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#4285f4")}
          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          required
        />
        {/* CHANGED: type="text" + Better placeholder */}
        <input
          type="text"
          value={url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUrl(e.target.value)
          }
          placeholder="www.google.com, google.com, ftp.site.com, or full URL"
          style={{
            padding: "1rem",
            fontSize: "1.1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontFamily: "monospace",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#4285f4")}
          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          required
        />

        {/*  URL PREVIEW */}
        {url && (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "#e3f2fd",
              border: "1px solid #bbdefb",
              borderRadius: "6px",
              fontSize: "0.9rem",
              fontFamily: "monospace",
              color: "#1976d2",
            }}
          >
            Preview: <strong>{normalizeUrl(url)}</strong>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "1rem",
            fontSize: "1.1rem",
            background: loading ? "#ccc" : "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
        >
          {loading ? "⏳ Adding..." : "✨ Add Bookmark"}
        </button>
      </form>
    </div>
  );
}
