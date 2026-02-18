Smart Bookmark App ⭐
🌐 Live Demo
https://smart-bookmark-app-weld-pi.vercel.app/
Any Google account → Instant login → Real-time bookmarks

✨ Features
✅ Google OAuth (Any Gmail works instantly)

✅ Real-time bookmark sync across devices

✅ Add/Edit/Delete bookmarks with live updates

✅ Glass morphism UI with smooth animations

✅ Fully responsive (Mobile → Desktop)

✅ Auto-save with offline support

🛠 Tech Stack
Frontend: Next.js 14 | React 18 | Tailwind CSS | Framer Motion
Backend: Supabase (Postgres + Auth)
Auth: Google OAuth 2.0 + Supabase Auth
Deployment: Vercel (Git auto-deploy)
Database: Supabase Postgres + RLS Policies

🚨 Deployment Challenges & Solutions
1. Google Cloud Console OAuth Configuration
PROBLEM: "Can't reach this page" after Google account selection
Root Cause: Missing Vercel URL in Authorized Redirect URIs

SOLUTION:
Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client
Added: https://smart-bookmark-app-weld-pi.vercel.app/auth/callback
Propagation: 5-15 mins (normal)

2. Supabase RLS Policies - Zero Access (Assisted by ChatGPT)
PROBLEM: Bookmarks saved, but the list is empty
🔍 Root Cause: RLS enabled without user policies

SOLUTION:
sql
-- Users read own bookmarks
CREATE POLICY "View own" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
-- Users insert own bookmarks  
CREATE POLICY "Insert own" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Users update own bookmarks
CREATE POLICY "Update own" ON bookmarks FOR UPDATE USING (auth.uid() = user_id); 

3. Supabase Auth Callback Loop
PROBLEM: Google picker → /auth/callback → Back to login
Root Cause: Empty Supabase URL Configuration

SOLUTION:
Site URL: https://smart-bookmark-app-weld-pi.vercel.app
Redirect URLs:
https://smart-bookmark-app-weld-pi.vercel.app/**
https://smart-bookmark-app-weld-pi.vercel.app/auth/callback

4. Vercel Environment Variables
PROBLEM: NEXT_PUBLIC_SUPABASE_* undefined in production
Root Cause: Missing Vercel dashboard env vars

SOLUTION:
Vercel → Settings → Environment Variables:
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
→ Redeploy → BUILD SUCCESS

5. UI/UX Beautification (ChatGPT Assisted)
Before: Plain forms, no animations
After: Glass morphism, gradients, Framer Motion

6. Production Error Handling
✅ Network retry (3s intervals)
✅ Offline bookmark queue
✅ Auth persistence
✅ Loading skeletons
✅ Toast notifications
✅ Error boundaries
