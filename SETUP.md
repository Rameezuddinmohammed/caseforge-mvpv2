# Caseforge Login System Setup

This project uses Supabase for authentication with Google OAuth. Follow these steps to set up the login system:

## 1. Supabase Setup

### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new account or sign in
2. Create a new project
3. Wait for the project to be set up (this may take a few minutes)

### Get Your Project Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**
3. You'll need these for the environment variables

## 2. Environment Configuration

Create a `.env.local` file in the root of your project with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace the placeholder values with your actual Supabase credentials.

## 3. Google OAuth Setup

### Configure Google OAuth in Supabase
1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click **Enable**
3. You'll need to set up OAuth credentials in Google Cloud Console

### Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** (if not already enabled)
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Choose **Web application** as the application type
6. Add your authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://your-domain.com/auth/callback` (for production)
7. Copy the **Client ID** and **Client Secret**

### Complete Supabase Google Configuration
1. Back in Supabase, paste your Google **Client ID** and **Client Secret**
2. Save the configuration

## 4. Install Dependencies

```bash
npm install
```

## 5. Run the Development Server

```bash
npm run dev
```

## 6. Test the Login System

1. Open your browser and go to `http://localhost:3000`
2. You should be redirected to the login page
3. Click "Sign in with Google"
4. Complete the Google OAuth flow
5. You should be redirected to the dashboard

## Features

- ✅ Google OAuth authentication
- ✅ Protected routes with middleware
- ✅ Automatic redirects based on auth status
- ✅ Loading states and error handling
- ✅ Timeout protection (10-second limit)
- ✅ Logout functionality
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Server-side session validation

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   ├── dashboard/page.tsx        # Protected dashboard page
│   ├── login/page.tsx            # Login page with Google OAuth
│   ├── page.tsx                  # Home page with auth redirects
│   └── layout.tsx                # Root layout with AuthProvider
├── components/
│   └── ProtectedRoute.tsx        # Route protection component
├── lib/
│   ├── auth-context.tsx          # Authentication context
│   └── supabase.ts              # Supabase client configuration
└── middleware.ts                 # Route-level authentication
```

## Security Features

- **Timeout Protection**: 10-second timeout prevents infinite loading
- **Multiple Redirect Prevention**: Prevents redirect loops
- **Server-Side Validation**: Middleware validates sessions at the route level
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Session Management**: Automatic token refresh and cleanup

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**: Make sure your environment variables are correctly set
2. **OAuth redirect error**: Verify your redirect URIs in Google Cloud Console
3. **"Provider not enabled" error**: Enable Google provider in Supabase dashboard
4. **Infinite loading**: Check network connectivity and Supabase project status
5. **Middleware errors**: Ensure environment variables are available at build time

### Development vs Production

- For development: Use `http://localhost:3000/auth/callback`
- For production: Use `https://your-domain.com/auth/callback`

Make sure to update both Google Cloud Console and Supabase settings when deploying to production.

## Security Notes

- Never commit your `.env.local` file to version control
- The `NEXT_PUBLIC_` prefix makes these variables available in the browser (required for Supabase client)
- Supabase handles token refresh and session management automatically
- Middleware provides server-side session validation for additional security 