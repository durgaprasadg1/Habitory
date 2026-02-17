# 📊 Habit Tracker

A modern, full-stack habit tracking application built with Next.js 14+ that helps users build and maintain positive habits through comprehensive tracking, analytics, and goal setting.

## ✨ Features

- **User Authentication**: Secure authentication powered by Clerk
- **Habit Management**: Create, edit, and track daily habits
- **Dashboard**: Comprehensive overview of your habit progress
- **Analytics**: Visualize your progress with interactive charts
  - Daily and weekly trend analysis
  - Category-based habit distribution
  - Performance overview cards
- **History**: View and manage your complete habit log history
- **Monthly Goals**: Set and track monthly goals for habits
- **Progress Tracking**: Weekly and daily progress visualization
- **Responsive Design**: Seamless experience across all devices

## 🚀 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: JavaScript/TypeScript
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: MongoDB (via Mongoose)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui
- **Charts**: Interactive data visualizations


## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database
- Clerk account for authentication

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd habit-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)


## 🗄️ Database Models

### User

- User profile and authentication details
- Links to habits and monthly goals

### Habit

- Habit details (name, category, frequency)
- User association
- Tracking configuration

### HabitLog

- Daily habit completion records
- Timestamps and status
- Links to habits

### Month

- Monthly goal tracking
- Progress calculations
- Historical data

## 🎨 Components

### Dashboard Components

- **AddHabitDialog**: Create new habits
- **EditHabitDialog**: Modify existing habits
- **HabitsTable**: Display all habits
- **MonthlyGoalCards**: Show monthly goals
- **SetMonthlyGoalDialog**: Set new monthly goals
- **SummaryCard**: Quick stats overview
- **WeeklyProgress**: Week-at-a-glance view

### Analytics Components

- **CategoryChart**: Habit distribution by category
- **DailyTrendChart**: Daily completion trends
- **HabitsChart**: Individual habit performance
- **OverviewCards**: Key metrics
- **WeeklyTrendChart**: Weekly patterns

## 🚢 Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new):

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Configure environment variables
4. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more options.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

Built with ❤️ using Next.js
