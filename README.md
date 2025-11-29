# Mental Health Platform

A comprehensive web application providing mental health resources, counseling services, and support groups for students.

## Features

- **Authentication**: Secure login and signup
- **User Dashboard**: Access resources, schedule therapy sessions, join support groups
- **Admin Dashboard**: Manage resources, services, and counseling sessions
- **Virtual Therapy Sessions**: Schedule and manage therapy appointments
- **Support Groups**: Join and participate in peer support forums
- **Self-Help Resources**: Access mental health articles and resources

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Set up your Supabase database (see database setup instructions below)

4. Run the development server:
```bash
npm run dev
```

## Database Setup

1. Create a Supabase project at https://supabase.com
2. Go to your Supabase project dashboard
3. Navigate to the SQL Editor
4. Copy and paste the entire contents of `database/schema.sql` into the SQL editor
5. Run the SQL script (this will create all necessary tables, policies, and triggers)
6. Go to Settings > API to get your project URL and anon key
7. Update your `.env` file with these credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Creating an Admin User

After setting up the database, you can create an admin user:

1. Sign up normally through the application
2. Go to your Supabase dashboard > Table Editor > `profiles` table
3. Find your user profile and change the `role` field from `student` to `admin`
4. Now you'll have access to the Admin Dashboard at `/admin`

## Tech Stack

- React 18
- Vite
- Supabase (PostgreSQL + Authentication)
- React Router
- React Icons

"# FINALPROJECT-MENTALHEALTH" 
