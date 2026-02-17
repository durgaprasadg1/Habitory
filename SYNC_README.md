# 🔄 Clerk + MongoDB Sync

Your habit tracker now has **full Clerk-MongoDB synchronization**! Every user authenticated through Clerk is automatically stored in your MongoDB database.

## ✅ What's Implemented

### 1. **Webhook Sync (Primary Method)**

- **Endpoint**: `/api/webhooks/clerk`
- Automatically syncs users when they:
  - ✅ Sign up (creates user in MongoDB)
  - ✅ Update profile (updates MongoDB)
  - ✅ Delete account (removes from MongoDB)

### 2. **Fallback Sync (Backup Method)**

- **Endpoint**: `/api/sync-user`
- Automatically triggered when user accesses dashboard
- Ensures user exists even if webhook fails

### 3. **User Check Endpoint**

- **Endpoint**: `/api/user/check`
- Verify if logged-in user exists in MongoDB
- Useful for debugging

## 🚀 Setup (5 Minutes)

### Step 1: Install Package

```bash
npm install svix
```

### Step 2: Configure Clerk Webhook

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your app → **Webhooks** → **Add Endpoint**
3. For **local testing**, use ngrok:

   ```bash
   npx ngrok http 3000
   ```

   Then use: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`

4. For **production**, use: `https://your-domain.com/api/webhooks/clerk`

5. Subscribe to events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`

6. Copy the **Signing Secret** (starts with `whsec_`)

### Step 3: Add Environment Variable

Add to `.env.local`:

```env
WEBHOOK_SECRET=whsec_your_secret_here
```

### Step 4: Test It!

1. **Start your app**: `npm run dev`
2. **Sign up a new user**
3. **Check MongoDB**: You should see the user in your `users` collection!

Or test the check endpoint:

```bash
# After logging in, visit:
http://localhost:3000/api/user/check
```

## 📊 What Data is Synced?

```javascript
{
  clerkId: "user_2abc123...",     // Unique Clerk ID
  email: "user@example.com",      // Primary email
  name: "John Doe",               // Full name
  profileImage: "https://...",    // Profile picture URL
  createdAt: "2026-02-17T...",   // Auto-generated
  updatedAt: "2026-02-17T..."    // Auto-updated
}
```

## 🔍 How It Works

### When User Signs Up:

1. User fills form on `/sign-up`
2. Clerk creates account
3. Clerk sends webhook → `/api/webhooks/clerk`
4. Your app saves user to MongoDB ✅

### When User Logs In:

1. User authentication via Clerk
2. User accesses `/dashboard`
3. Dashboard API checks if user exists in MongoDB
4. If not found, fallback sync creates user ✅

### When User Updates Profile:

1. User updates info in Clerk
2. Webhook automatically updates MongoDB ✅

## 🛠️ API Endpoints

| Endpoint              | Method | Purpose                         |
| --------------------- | ------ | ------------------------------- |
| `/api/webhooks/clerk` | POST   | Receives Clerk webhook events   |
| `/api/sync-user`      | POST   | Manually sync current user      |
| `/api/user/check`     | GET    | Check if user exists in MongoDB |
| `/api/dashboard`      | GET    | Auto-syncs user as fallback     |

## 🐛 Troubleshooting

### "User not found in MongoDB"

- **Solution**: Call `/api/sync-user` or refresh dashboard
- The fallback sync will create the user

### "Webhook verification failed"

- **Solution**: Check that `WEBHOOK_SECRET` is correct
- Make sure it starts with `whsec_`

### "svix is not defined"

- **Solution**: Run `npm install svix`
- Restart your dev server

### Webhook not triggering locally

- **Solution**: Use ngrok to expose localhost
- Update webhook URL in Clerk dashboard

## ✨ Benefits

✅ **All users stored in MongoDB** - You own your data  
✅ **Automatic updates** - No manual sync needed  
✅ **Fallback protection** - Works even if webhook fails  
✅ **Production ready** - Secure webhook verification  
✅ **Easy debugging** - Check endpoints to verify sync

## 📝 Files Modified

- ✅ `app/api/webhooks/clerk/route.js` - Webhook handler
- ✅ `app/api/sync-user/route.js` - Manual sync endpoint
- ✅ `app/api/user/check/route.js` - User verification
- ✅ `app/api/dashboard/route.js` - Fallback sync
- ✅ `models/user.js` - Updated schema
- ✅ `lib/syncUser.js` - Sync utilities

---

**Your authentication is now fully integrated with MongoDB! 🎉**

For detailed webhook setup, see: `CLERK_MONGODB_SYNC_SETUP.md`
