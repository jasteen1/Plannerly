# 🎓 Student Planner

A comprehensive web application designed to help students manage their tasks, assignments, and stay organized with Philippine holidays integration.

## ✨ Features

- 📅 **Monthly Calendar View** - Visual calendar with tasks and holidays
- ✅ **Task Management** - Create, edit, delete, and track tasks with deadlines
- 🎯 **Deadline Tracking** - Never miss important dates with overdue warnings
- 🇵🇭 **Philippine Holidays** - Official holiday data from Calendarific API
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 💾 **Local Storage** - All data saved locally in your browser
- 🔒 **Privacy First** - No account required, everything stays on your device

## 🚀 Live Demo

[View Live Application](https://student-planner-demo.netlify.app) *(Replace with your deployed URL)*

## 🛠️ Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **API**: Calendarific API for holidays
- **Deployment**: Netlify

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd student-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.local.example .env.local

   # Edit .env.local and add your Calendarific API key
   CALENDARIFIC_API_KEY=your-api-key-here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🌐 Deployment to Netlify

### Quick Deploy
1. **Push to Git** (GitHub/GitLab/Bitbucket)
2. **Connect to Netlify** at [app.netlify.com](https://app.netlify.com)
3. **Set build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Add environment variable**:
   - `CALENDARIFIC_API_KEY` = Your Calendarific API key
5. **Deploy!**

### Detailed Instructions
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for comprehensive deployment instructions.

## 🎯 Usage

### Dashboard
- View today's tasks and upcoming holidays
- Quick navigation to all features
- Statistics overview

### Planner
- Monthly calendar view
- Add tasks directly on calendar days
- View official Philippine holidays
- Click days for detailed task/holiday view

### Tasks
- Comprehensive task management
- Filter by date, status, or search
- Mark tasks as complete
- Set deadlines with overdue warnings

### Holidays
- View all official Philippine holidays
- Add custom holidays/events
- Filter by type (official/custom)
- Search functionality

### About
- Learn about the application
- Contact information and social links
- Technical details

## 🔑 API Keys

### Calendarific API (Required)
1. Sign up at [calendarific.com](https://calendarific.com)
2. Get your free API key
3. Add to environment variables as `CALENDARIFIC_API_KEY`

**Free tier includes 1,000 requests/month - perfect for personal use!**

## 📱 Features Overview

- **📅 Calendar Integration**: Philippine holidays automatically loaded
- **⏰ Deadline Management**: Visual overdue indicators and due date warnings
- **📱 Mobile Responsive**: Perfect experience on all devices
- **💾 Offline Ready**: All data stored locally
- **🔒 Privacy Focused**: No accounts, no data collection
- **⚡ Fast & Lightweight**: Built with modern web technologies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

- **Issues**: Open a GitHub issue
- **Email**: justineluis.dasa@wvsu.edu.ph
- **Social**: Connect on Facebook/Instagram/Github

## 🙏 Acknowledgments

- **Calendarific API** for Philippine holiday data
- **Next.js** for the amazing framework
- **TailwindCSS** for beautiful styling
- **Lucide** for consistent icons

---

**Built with ❤️ for students, by a student.**

*Justine Luis Dasa - WVSU Student*