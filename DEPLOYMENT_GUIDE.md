# Deployment Guide - Running on a New System

## Step-by-Step Commands to Run the App

### 1. Navigate to Project Directory
```bash
cd /path/to/hackathaon
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

**On Windows (PowerShell):**
```powershell
@"
VITE_SUPABASE_URL=your_new_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_new_anon_key_here
"@ | Out-File -FilePath .env -Encoding utf8
```

**On Windows (CMD):**
```cmd
echo VITE_SUPABASE_URL=your_new_supabase_url_here > .env
echo VITE_SUPABASE_ANON_KEY=your_new_anon_key_here >> .env
```

**On Linux/Mac:**
```bash
cat > .env << EOF
VITE_SUPABASE_URL=your_new_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_new_anon_key_here
EOF
```

**Or manually create `.env` file:**
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Set Up Database

1. Go to your new Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the main schema: Copy and paste contents of `database/schema.sql` and run it
4. Run the questionnaire schema: Copy and paste contents of `database/questionnaire_schema.sql` and run it

### 5. Run the Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`

### 6. Build for Production (Optional)

```bash
npm run build
```

This creates a `dist` folder with production-ready files.

### 7. Preview Production Build (Optional)

```bash
npm run preview
```

---

## Quick Setup Script (All-in-One)

**On Windows (PowerShell):**
```powershell
# Install dependencies
npm install

# Create .env file (replace with your credentials)
@"
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
"@ | Out-File -FilePath .env -Encoding utf8

# Start dev server
npm run dev
```

**On Linux/Mac:**
```bash
# Install dependencies
npm install

# Create .env file (replace with your credentials)
cat > .env << EOF
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
EOF

# Start dev server
npm run dev
```

---

## Getting Your Supabase Credentials

1. Go to https://supabase.com
2. Sign in and select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`

---

## Important Notes

- Make sure Node.js is installed (v16 or higher)
- The `.env` file must be in the root directory (same folder as `package.json`)
- After creating/updating `.env`, restart the dev server
- Run the database schemas in Supabase SQL Editor before using the app
- The app will automatically open at `http://localhost:3000`

---

## Troubleshooting

### Port Already in Use
If port 3000 is busy, Vite will automatically use the next available port (3001, 3002, etc.)

### Environment Variables Not Loading
- Make sure `.env` file is in the root directory
- Restart the dev server after creating/updating `.env`
- Check that variable names start with `VITE_`

### Database Connection Errors
- Verify your Supabase URL and anon key are correct
- Make sure you've run the database schemas
- Check that your Supabase project is active (not paused)

---

## Commands Summary

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with your Supabase credentials
# (Use one of the methods above)

# 3. Run database schemas in Supabase SQL Editor
# - database/schema.sql
# - database/questionnaire_schema.sql

# 4. Start development server
npm run dev

# 5. Open browser to http://localhost:3000
```

