# Clerk + MongoDB Sync Setup Guide

This guide will help you set up automatic synchronization between Clerk authentication and your MongoDB database.

## Setup Steps

### 1. Install Required Package

```bash
npm install svix
```

### 2. Configure Clerk Webhook

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to **Webhooks** in the left sidebar
4. Click **Add Endpoint**
5. Enter your endpoint URL:
   - Development: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - Production: `https://your-domain.com/api/webhooks/clerk`

6. Subscribe to these events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`

7. Copy the **Signing Secret** (starts with `whsec_`)

### 3. Add Environment Variable

Add to your `.env.local` file:

```env
WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 4. Test Webhooks Locally (Development)

For local testing, use ngrok to expose your localhost:

```bash
# Install ngrok (if not already installed)
npm install -g ngrok

# Start your Next.js app
npm run dev

# In another terminal, expose port 3000
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and use it in Clerk webhook settings.

### 5. How It Works

#### Automatic Sync (Recommended)

When a user signs up, updates their profile, or deletes their account in Clerk, the webhook automatically:

- Creates a new user in MongoDB with all details
- Updates existing user information
- Removes deleted users from MongoDB

#### Manual Sync (Fallback)

If webhooks fail, users are automatically synced when they:

- Access the dashboard
- Make their first API call
- Or you can manually trigger sync by calling: `POST /api/sync-user`

### 6. Verify Setup

After setup, test by:

1. **Create a new user**: Sign up through your app
2. **Check MongoDB**: Verify the user appears in your `users` collection
3. **Check Clerk Dashboard**: Go to Webhooks → Your Endpoint → Logs to see successful requests

### 7. User Data Synced

The following data is synced from Clerk to MongoDB:

- `clerkId`: Unique Clerk user ID
- `email`: Primary email address
- `name`: First + Last name
- `profileImage`: User's profile picture URL
- `createdAt`: Timestamp (auto-generated)
- `updatedAt`: Timestamp (auto-updated)

## Troubleshooting

### Webhook Not Receiving Events

- Ensure ngrok is running (for local dev)
- Check that the webhook URL is correct
- Verify `WEBHOOK_SECRET` is in `.env.local`
- Check Clerk webhook logs for errors

### User Not Syncing

- Call the manual sync endpoint: `POST /api/sync-user`
- Check server console for error messages
- Verify MongoDB connection is working

### 500 Error on Webhook

- Check that `svix` package is installed
- Verify webhook secret is correct
- Check MongoDB connection

## Production Deployment

For production:

1. Deploy your Next.js app
2. Update Clerk webhook URL to production domain
3. Add `WEBHOOK_SECRET` to production environment variables
4. Test by creating a new user in production

## API Endpoints

- `POST /api/webhooks/clerk` - Receives webhook events from Clerk
- `POST /api/sync-user` - Manually sync current user to MongoDB

---

✅ Once configured, all Clerk users will automatically sync to MongoDB!
