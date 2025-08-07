# Student Productivity Platform 🎓

A modern, responsive web application designed to help students track grades, manage schedules, and stay organized throughout their academic journey.

## ✨ Features

- **📊 GPA Tracking**: Comprehensive grade management with automatic GPA calculations
- **📅 Calendar Integration**: Visual calendar with assignment deadlines and class schedules
- **🗓️ Schedule Manager**: Interactive class schedule with grid and list views
- **📋 Dashboard**: Overview of academic performance and upcoming tasks
- **⚙️ Settings**: Profile management, course configuration, and data export/import
- **📱 Mobile-First Design**: Fully responsive interface optimized for all devices
- **♿ Accessibility**: ARIA-compliant with keyboard navigation support
- **💾 Local Storage**: All data stored locally in your browser

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd student-productivity-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Date Handling**: date-fns
- **State Management**: React Hooks with localStorage persistence

## 📱 Features Overview

### Dashboard
- Academic performance overview
- Upcoming assignment alerts
- Today's class schedule
- Quick action buttons
- GPA statistics

### Grade Tracker
- Course-wise grade management
- Automatic GPA calculations
- Grade category filtering
- Visual performance indicators
- Export capabilities

### Calendar
- Monthly calendar view
- Assignment deadline tracking
- Class schedule integration
- Custom reminders
- Event color coding

### Schedule Manager
- Weekly schedule grid view
- List view for detailed information
- Class location tracking
- Schedule statistics
- Easy editing interface

### Settings
- User profile management
- Course configuration
- Application preferences
- Data backup and restore
- Theme customization

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS:

- **Primary Colors**: Blue gradient palette
- **Secondary Colors**: Purple accent colors
- **Typography**: Clean, readable font hierarchy
- **Components**: Reusable card-based layout
- **Animations**: Smooth transitions and hover effects

## ♿ Accessibility Features

- ARIA labels and descriptions
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast mode support
- Reduced motion preferences

## 📊 Data Management

- **Local Storage**: All data persists in browser localStorage
- **Export**: Download complete data backup as JSON
- **Import**: Restore data from backup files
- **Privacy**: No external data transmission

## 🔧 Customization

The application is highly customizable:

- **Themes**: Light/dark mode support (planned)
- **Colors**: Course color coding
- **Preferences**: Notification settings
- **Layout**: Responsive grid systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Bug Reports

If you encounter any issues, please create an issue on the GitHub repository with:
- Description of the problem
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

## 🚀 Deployment

The application can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use the built-in GitHub Actions
- **Firebase Hosting**: Deploy with Firebase CLI

## 📈 Future Enhancements

- [ ] Dark mode theme
- [ ] Data synchronization across devices
- [ ] Assignment submission tracking
- [ ] Study time tracking
- [ ] Grade prediction algorithms
- [ ] Mobile app (PWA)
- [ ] Integration with learning management systems
- [ ] Collaboration features

---

Built with ❤️ for students, by developers who understand the academic journey.
