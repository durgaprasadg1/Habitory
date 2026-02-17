# 📝 Habit CRUD API Documentation

Complete API reference for managing habits in your habit tracker.

---

## 🎯 Authentication

All endpoints require Clerk authentication. Include the Clerk session token in your requests.

**Authentication Header:**

```
Authorization: Bearer <clerk_session_token>
```

---

## 📋 Habits Endpoints

### 1. Get All Habits (for a specific month)

**Endpoint:** `GET /api/habits`

**Query Parameters:**

- `year` (optional): Year (default: current year)
- `month` (optional): Month 1-12 (default: current month)

**Example:**

```bash
GET /api/habits?year=2026&month=2
```

**Response:**

```json
{
  "habits": [
    {
      "_id": "65f1b2c3d4e5f6a7b8c9d0e1",
      "userId": "user_2abc123...",
      "monthId": "65f1b2c3d4e5f6a7b8c9d0e2",
      "name": "Morning Exercise",
      "category": "Health",
      "isGoalHabit": false,
      "isEditable": true,
      "createdAt": "2026-02-01T00:00:00.000Z",
      "updatedAt": "2026-02-01T00:00:00.000Z"
    }
  ],
  "habitLogs": [...],
  "monthlyGoal": {...}
}
```

---

### 2. Create New Habit

**Endpoint:** `POST /api/habits`

**Request Body:**

```json
{
  "name": "Read Books",
  "category": "Personal Development",
  "isGoalHabit": false,
  "year": 2026,
  "month": 2
}
```

**Response:**

```json
{
  "_id": "65f1b2c3d4e5f6a7b8c9d0e1",
  "userId": "user_2abc123...",
  "monthId": "65f1b2c3d4e5f6a7b8c9d0e2",
  "name": "Read Books",
  "category": "Personal Development",
  "isGoalHabit": false,
  "isEditable": true,
  "createdAt": "2026-02-17T00:00:00.000Z",
  "updatedAt": "2026-02-17T00:00:00.000Z"
}
```

**Status Codes:**

- `201`: Habit created successfully
- `400`: Invalid request (missing name)
- `401`: Unauthorized
- `500`: Server error

---

### 3. Get Single Habit

**Endpoint:** `GET /api/habits/[habitId]`

**Example:**

```bash
GET /api/habits/65f1b2c3d4e5f6a7b8c9d0e1
```

**Response:**

```json
{
  "_id": "65f1b2c3d4e5f6a7b8c9d0e1",
  "userId": "user_2abc123...",
  "name": "Morning Exercise",
  "category": "Health",
  "isGoalHabit": false
}
```

**Status Codes:**

- `200`: Success
- `401`: Unauthorized
- `403`: Not your habit (ownership check)
- `404`: Habit not found
- `500`: Server error

---

### 4. Update Habit

**Endpoint:** `PUT /api/habits/[habitId]` or `PATCH /api/habits/[habitId]`

**Request Body (all fields optional):**

```json
{
  "name": "Evening Exercise",
  "category": "Fitness",
  "isGoalHabit": true
}
```

**Response:**

```json
{
  "success": true,
  "habit": {
    "_id": "65f1b2c3d4e5f6a7b8c9d0e1",
    "name": "Evening Exercise",
    "category": "Fitness",
    "isGoalHabit": true,
    "updatedAt": "2026-02-17T10:30:00.000Z"
  },
  "message": "Habit updated successfully"
}
```

**Status Codes:**

- `200`: Updated successfully
- `401`: Unauthorized
- `403`: Not your habit
- `404`: Habit not found
- `500`: Server error

---

### 5. Delete Habit

**Endpoint:** `DELETE /api/habits/[habitId]`

**Example:**

```bash
DELETE /api/habits/65f1b2c3d4e5f6a7b8c9d0e1
```

**Response:**

```json
{
  "success": true,
  "message": "Habit and all associated logs deleted successfully"
}
```

**Note:** This also deletes ALL habit logs associated with this habit.

**Status Codes:**

- `200`: Deleted successfully
- `401`: Unauthorized
- `403`: Not your habit
- `404`: Habit not found
- `500`: Server error

---

## 📊 Habit Logs Endpoints

### 6. Toggle Habit Completion

**Endpoint:** `POST /api/habits/logs`

**Request Body:**

```json
{
  "habitId": "65f1b2c3d4e5f6a7b8c9d0e1",
  "date": "2026-02-17T00:00:00.000Z"
}
```

**Response:**

```json
{
  "_id": "65f1b2c3d4e5f6a7b8c9d0e3",
  "userId": "user_2abc123...",
  "habitId": "65f1b2c3d4e5f6a7b8c9d0e1",
  "date": "2026-02-17T00:00:00.000Z",
  "completed": true,
  "createdAt": "2026-02-17T10:30:00.000Z"
}
```

**Behavior:**

- If log doesn't exist: Creates with `completed: true`
- If log exists: Toggles `completed` status

---

## 🎯 Monthly Goal Endpoints

### 7. Set Monthly Goal

**Endpoint:** `PUT /api/monthly-goal`

**Request Body:**

```json
{
  "year": 2026,
  "month": 2,
  "goalTitle": "Read 20 Days",
  "goalDescription": "Read at least 30 minutes daily",
  "goalHabitId": "65f1b2c3d4e5f6a7b8c9d0e1"
}
```

**Response:**

```json
{
  "success": true,
  "monthlyGoal": {
    "title": "Read 20 Days",
    "description": "Read at least 30 minutes daily",
    "habitId": "65f1b2c3d4e5f6a7b8c9d0e1"
  }
}
```

---

## 📈 Dashboard Endpoint

### 8. Get Dashboard Data

**Endpoint:** `GET /api/dashboard`

**Query Parameters:**

- `year` (optional): Year
- `month` (optional): Month 1-12

**Response:**

```json
{
  "monthlyGoal": {
    "title": "Read 20 Days",
    "description": "Read at least 30 minutes daily",
    "habitId": "65f1b2c3d4e5f6a7b8c9d0e1"
  },
  "habits": [...],
  "habitLogsMap": {
    "65f1b2c3d4e5f6a7b8c9d0e1-1": true,
    "65f1b2c3d4e5f6a7b8c9d0e1-2": false
  },
  "weeklyStats": [
    {
      "label": "Week 1",
      "days": "1-7",
      "percentage": 85,
      "completed": 12,
      "total": 14
    }
  ],
  "overallSummary": {
    "percentage": 75,
    "completed": 45,
    "total": 60
  }
}
```

---

## 🔐 User Management Endpoints

### 9. Sync Current User

**Endpoint:** `POST /api/sync-user`

Manually syncs the current Clerk user to MongoDB.

**Response:**

```json
{
  "success": true,
  "message": "User synced to MongoDB",
  "user": {
    "clerkId": "user_2abc123...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### 10. Check User Status

**Endpoint:** `GET /api/user/check`

Verify if the current user exists in MongoDB.

**Response:**

```json
{
  "success": true,
  "message": "User found in MongoDB",
  "user": {
    "id": "65f1b2c3d4e5f6a7b8c9d0e1",
    "clerkId": "user_2abc123...",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-02-01T00:00:00.000Z"
  }
}
```

---

## 🛡️ Security Features

✅ **Ownership Verification:** All endpoints check that you own the resource  
✅ **Authentication Required:** All endpoints require valid Clerk session  
✅ **Data Isolation:** Users can only access their own data  
✅ **Automatic Sync:** Users are automatically synced to MongoDB

---

## 🧪 Testing the API

### Using curl:

```bash
# Get habits
curl -X GET "http://localhost:3000/api/habits?year=2026&month=2" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create habit
curl -X POST "http://localhost:3000/api/habits" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Morning Run","category":"Health"}'

# Update habit
curl -X PUT "http://localhost:3000/api/habits/HABIT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Evening Run"}'

# Delete habit
curl -X DELETE "http://localhost:3000/api/habits/HABIT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using JavaScript (fetch):

```javascript
// Create habit
const response = await fetch("/api/habits", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Morning Meditation",
    category: "Wellness",
  }),
});

// Update habit
await fetch(`/api/habits/${habitId}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Evening Meditation" }),
});

// Delete habit
await fetch(`/api/habits/${habitId}`, {
  method: "DELETE",
});
```

---

## 📝 Notes

- **Month Format:** Months are 1-indexed (1 = January, 12 = December)
- **Date Format:** ISO 8601 format recommended
- **ObjectId Format:** MongoDB ObjectId (24 hex characters)
- **User ID:** Clerk user ID format (e.g., `user_2abc123...`)

---

✅ **Your habits are now fully manageable with complete CRUD operations!**
