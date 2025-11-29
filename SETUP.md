# Detailed Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account (free tier works)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in your project details:
   - Name: Mental Health Platform (or any name you prefer)
   - Database Password: Choose a strong password (save this!)
   - Region: Choose the closest region
4. Wait for the project to be created (takes 1-2 minutes)

### 3. Configure Database

1. In your Supabase project, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open the `database/schema.sql` file from this project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click "Run" (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

### 4. Get API Credentials

1. In Supabase, go to **Settings** > **API**
2. You'll see:
   - **Project URL**: Copy this
   - **anon public** key: Copy this

### 5. Configure Environment Variables

1. Create a `.env` file in the root directory of the project
2. Add the following (replace with your actual values):

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6. Run the Application

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 7. Create Your First Admin User

1. Sign up through the application with your email
2. Go to Supabase Dashboard > **Table Editor** > **profiles**
3. Find your user (by email)
4. Click on the row to edit
5. Change `role` from `student` to `admin`
6. Save
7. Refresh the application - you should now see "Admin Dashboard" in the navbar

## Features Overview

### Student Features
- **Resources**: Browse mental health articles, videos, PDFs, and links
- **Therapy Sessions**: Schedule virtual therapy sessions with counselors
- **Support Groups**: Join support groups and participate in forums
- **Forums**: Create posts and comments in support group forums

### Admin Features
- **Manage Resources**: Add, edit, and delete mental health resources
- **Manage Sessions**: View all scheduled sessions and update their status
- **Manage Support Groups**: Create and manage support groups
- **Full Access**: View all user data and manage the platform

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file is in the root directory
- Check that variable names start with `VITE_`
- Restart the dev server after creating/updating `.env`

### Database connection errors
- Verify your Supabase URL and anon key are correct
- Check that you've run the schema.sql script
- Ensure Row Level Security (RLS) policies are enabled

### Authentication not working
- Check that email confirmation is disabled in Supabase (Settings > Auth > Email Auth)
- Or enable email confirmation and check your email

### Can't access admin dashboard
- Make sure you've updated your role to `admin` in the profiles table
- Sign out and sign back in after changing your role

## Project Structure

```
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts (Auth)
│   ├── lib/              # Supabase client
│   ├── pages/            # Page components
│   ├── App.jsx           # Main app component with routing
│   └── main.jsx          # Entry point
├── database/
│   └── schema.sql        # Database schema
├── public/               # Static assets
└── package.json          # Dependencies
```

## Next Steps

- Customize the UI colors and branding
- Add more resource categories
- Integrate video conferencing for therapy sessions
- Add email notifications
- Implement search functionality
- Add analytics dashboard

