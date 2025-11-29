# How to Find Your Supabase URL and Keys

## Step 1: Go to Your Supabase Dashboard

1. Open your browser and go to: **https://supabase.com**
2. Sign in to your account
3. You should see your project: **"Mental Health Platform"** (or whatever you named it)
4. Click on your project to open it

## Step 2: Find Your Project URL

1. In your Supabase project dashboard, look at the **left sidebar**
2. Click on **"Settings"** (gear icon at the bottom)
3. Click on **"API"** in the settings menu
4. You'll see a section called **"Project URL"**
   - It should look like: `https://xxxxxxxxxxxxx.supabase.co`
   - This is your `VITE_SUPABASE_URL`

## Step 3: Find Your Anon Key

1. Still in **Settings → API**
2. Look for **"Project API keys"** section
3. Find the key labeled **"anon"** or **"anon public"**
4. Click the **eye icon** or **"Reveal"** button to show the key
5. Copy this key - this is your `VITE_SUPABASE_ANON_KEY`

## Step 4: Verify Your .env File

Your `.env` file should be in the project root folder and contain:

```
VITE_SUPABASE_URL=https://glbmnfbcqbqpttbtmpbh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Check Authentication Settings

1. In Supabase dashboard, go to **"Authentication"** (left sidebar)
2. Click on **"Settings"** (under Authentication)
3. Make sure:
   - ✅ **"Enable Email Signup"** is ON
   - ✅ **"Confirm email"** - You can turn this OFF for testing (or leave it ON and check your email)

## Troubleshooting

### If you can't find the URL:
- Make sure you're logged into the correct Supabase account
- Make sure your project is active (not paused)
- The URL format is always: `https://[project-ref].supabase.co`

### If connection still fails:
1. Open browser console (Press F12)
2. Look for error messages
3. Check the Network tab to see if requests are being made
4. Verify your `.env` file is in the root directory (same folder as `package.json`)

### Quick Test:
After setting up, restart your dev server:
```bash
npm run dev
```

Then check the browser console - you should see:
- ✅ Supabase connection successful!

If you see errors, they will tell you what's wrong.

