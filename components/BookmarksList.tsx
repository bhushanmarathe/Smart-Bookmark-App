"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/utils/supabaseClient";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at: string;
}

export default function BookmarksList({
  userId,
  onRefresh,
}: {
  userId: string;
  onRefresh?: () => void;
}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchBookmarks = async () => {
    console.log("🔄 Fetching bookmarks for user:", userId);
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    console.log("📊 Bookmarks data:", data?.length, "Error:", error);
    if (!error && data) {
      setBookmarks(data);
      onRefresh?.();
    }
    setLoading(false);
  };

  const deleteBookmark = async (bookmarkId: string) => {
    if (!confirm("Delete this bookmark?")) return;

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmarkId)
      .eq("user_id", userId);

    if (!error) {
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
      onRefresh?.();
      console.log("🗑️ Deleted:", bookmarkId);
    } else {
      console.error("Delete error:", error);
      fetchBookmarks(); // Refresh on error
    }
  };

  useEffect(() => {
    fetchBookmarks();

    console.log("🔔 Setting up realtime subscription");
    channelRef.current = supabase
      .channel(`bookmarks:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("🎉 INSERT:", payload.new);
          const newBookmark = payload.new as Bookmark;
          setBookmarks((prev) => {
            if (prev.some((b) => b.id === newBookmark.id)) return prev;
            return [newBookmark, ...prev];
          });
          onRefresh?.();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          console.log("🗑️ DELETE sync");
          fetchBookmarks();
        },
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId, onRefresh]);

  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
        Loading bookmarks...
      </div>
    );

  return (
    <div>
      {/* PERFECT HEADER */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1.5rem 0",
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              margin: 0,
              color: "#111827",
              fontWeight: 600,
            }}
          >
            Your Bookmarks ({bookmarks.length})
          </h2>
          <button
            onClick={fetchBookmarks}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.75rem",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: 500,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.background = "#2563eb";
              (e.target as HTMLButtonElement).style.transform =
                "translateY(-2px)";
              (e.target as HTMLButtonElement).style.boxShadow =
                "0 4px 12px rgba(59, 130, 246, 0.4)";
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.background = "#3b82f6";
              (e.target as HTMLButtonElement).style.transform = "translateY(0)";
              (e.target as HTMLButtonElement).style.boxShadow =
                "0 2px 8px rgba(59, 130, 246, 0.3)";
            }}
          >
            🔄 Refresh
            <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>
              ({bookmarks.length})
            </span>
          </button>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div
          style={{
            padding: "4rem 2rem",
            textAlign: "center",
            color: "#9ca3af",
            fontSize: "1.2rem",
          }}
        >
          No bookmarks yet. Add one above!
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              style={{
                padding: "1.5rem",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "white",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.15)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 1px 3px rgba(0, 0, 0, 0.1)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    margin: "0 0 0.5rem 0",
                    color: "#111827",
                    fontWeight: 600,
                  }}
                >
                  {bookmark.title}
                </h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#3b82f6",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  }}
                >
                  🔗 {bookmark.url}
                </a>
              </div>
              <button
                onClick={() => deleteBookmark(bookmark.id)}
                style={{
                  padding: "0.75rem 1.25rem",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.background = "#dc2626";
                  (e.target as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.background = "#ef4444";
                  (e.target as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
