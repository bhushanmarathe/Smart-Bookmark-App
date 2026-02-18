import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const BookmarkForm = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // Get the current session using supabase.auth.getSession()
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error getting session:", sessionError.message);
      return;
    }

    // Check if session exists and contains a valid user
    if (!sessionData?.session?.user) {
      console.error("User not logged in");
      return;
    }

    // Access user information from session
    const user = sessionData.session.user;

    // Insert bookmark
    const { data, error } = await supabase
      .from("bookmarks")
      .insert([{ title, url, user_id: user.id }]);

    if (error) {
      console.error("Error adding bookmark:", error.message);
    } else {
      console.log("Bookmark added:", data);
      setTitle("");
      setUrl("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Bookmark Title"
        required
      />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Bookmark URL"
        required
      />
      <button type="submit">Add Bookmark</button>
    </form>
  );
};

export default BookmarkForm;
