"use client";
import { useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabaseClient";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarksList from "@/components/BookmarksList";

export default function BookmarksPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const handleRefreshBookmarks = useCallback(() => {
    console.log("🔄 Parent refresh triggered");
  }, []);

  if (loading)
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>Loading...</div>
    );
  if (!user)
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        Please sign in with Google.
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        maxWidth: "1000px",
        margin: "0 auto",
        background: "#f8fafc",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Welcome back, {user.email?.split("@")[0]}
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#6b7280", margin: 0 }}>
          Real-time sync enabled across tabs
        </p>
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <AddBookmarkForm
          userId={user.id}
          onBookmarkAdded={handleRefreshBookmarks}
        />
      </div>

      <BookmarksList userId={user.id} onRefresh={handleRefreshBookmarks} />
    </div>
  );
}
