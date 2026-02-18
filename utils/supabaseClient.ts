// // utils/supabaseClient.ts
// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// utils/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Fetch environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Error handling for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or anon key is missing in the environment variables",
  );
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
