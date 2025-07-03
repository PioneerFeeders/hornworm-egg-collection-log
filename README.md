# 🐛 Waxworm Egg Logger

A beautiful, modern web application for tracking waxworm egg collections. Built with React, TypeScript, and Tailwind CSS, featuring real-time statistics, goal tracking, and trend visualization.

## ✨ Features

### 📊 Core Functionality

- **Egg Collection Logging**: Record daily collections in grams (automatically converts to egg count: 1g = 650 eggs)
- **Date Selection**: Choose specific collection dates with an intuitive calendar interface
- **Weekly Tracking**: Automatic Sunday-Sunday week cycles with comprehensive statistics
- **Goal Setting**: Set weekly collection goals and track progress
- **Progress Monitoring**: Real-time calculation of whether you're ahead or behind your targets

### 📈 Analytics & Visualization

- **Weekly Stats Dashboard**: Current week overview with progress bars and metrics
- **Trend Charts**: Interactive line graphs showing collection patterns over time
- **Historical Data**: Track cumulative collections and daily totals
- **Performance Indicators**: Visual cues for goal achievement status

### 💾 Data Management

- **Local Storage**: All data persists in your browser (no account required)
- **CSV Export**: Download your collection data for analysis
- **Google Sheets Integration**: (Coming soon) Automatic synchronization with Google Sheets

### 🎨 User Experience

- **Modern Design**: Clean, nature-inspired green color palette
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Intuitive Interface**: Easy-to-use forms and clear data visualization
- **Real-time Updates**: Instant feedback and live statistics

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone or download** this repository
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
4. **Open your browser** to `http://localhost:8080`

### Production Build

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
client/
├── components/           # React components
│   ├── EggLogForm.tsx   # Collection logging form
│   ├── WeeklyStats.tsx  # Current week statistics
│   ├── GoalSetting.tsx  # Goal configuration
│   ├── TrendsChart.tsx  # Data visualization
│   └── ui/              # Reusable UI components
├── hooks/
│   └── use-egg-log-data.ts  # Data management hook
├── lib/
│   └── waxworm-utils.ts     # Utility functions
└── pages/
    └── Index.tsx            # Main dashboard

server/
├── routes/
│   └── egg-logs.ts      # API endpoints
└── index.ts             # Express server setup

shared/
└── api.ts               # Shared TypeScript interfaces
```

## 📱 How to Use

### 1. Log Your Collections

- Select the collection date using the calendar
- Enter the weight in grams (decimals supported)
- Add optional notes about the collection
- Click "Log Collection" to save

### 2. Set Weekly Goals

- Use the "Weekly Goal" card to set your target
- Enter your goal in grams per week
- The system automatically calculates egg equivalents
- Track your progress in real-time

### 3. Monitor Progress

- View current week statistics in the center panel
- See if you're ahead or behind your goal
- Check daily breakdowns and recent collections
- Monitor trends over time with the chart

### 4. Export Data

- Click "Export CSV" to download your data
- Use the exported file for external analysis
- Google Sheets integration coming soon

## 🎯 Key Metrics

- **1 gram = 650 eggs** (industry standard conversion)
- **Weekly cycles**: Sunday to Sunday tracking
- **Progress calculation**: Real-time goal vs. actual comparison
- **Trend analysis**: Historical performance visualization

## 🔧 Technical Features

### Built With

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 3 + Radix UI components
- **Charts**: Recharts for data visualization
- **Backend**: Express.js with TypeScript
- **Storage**: Browser localStorage (with planned cloud backup)

### Performance

- ⚡ Lightning-fast local data access
- 📱 Fully responsive design
- 🎨 Modern, accessible UI components
- 🔄 Real-time calculations and updates

## 🌱 Future Enhancements

### Planned Features

- **Google Sheets Integration**: Automatic data synchronization
- **Advanced Analytics**: Monthly/yearly trend analysis
- **Data Backup**: Cloud storage options
- **Multi-user Support**: Team/farm management
- **Mobile App**: Native iOS/Android applications
- **API Integration**: Connect with farm management systems

### Potential Integrations

- Weather data correlation
- Feed tracking integration
- Breeding cycle management
- Inventory management systems

## 📊 Understanding Your Data

### Weekly Statistics

- **Total Grams**: Sum of all collections for the current week
- **Total Eggs**: Automatic conversion using 650 eggs/gram ratio
- **Goal Progress**: Percentage of weekly goal achieved
- **Status Indicator**: Ahead/behind goal with exact difference

### Trend Analysis

- **Daily Collections**: Individual day collection amounts
- **Cumulative Totals**: Running totals over time
- **Performance Patterns**: Identify peak collection periods
- **Goal Achievement**: Track consistency in meeting targets

## 🆘 Support

### Common Questions

**Q: Where is my data stored?**
A: All data is stored locally in your browser. Export regularly for backups.

**Q: Can I change the eggs-per-gram ratio?**
A: The 650 eggs/gram ratio is industry standard, but future versions may allow customization.

**Q: How do I backup my data?**
A: Use the "Export CSV" button to download your data regularly.

### Troubleshooting

- **Data not saving**: Check if your browser allows localStorage
- **Charts not displaying**: Ensure JavaScript is enabled
- **Export not working**: Try refreshing the page and export again

## 📄 License

This project is open source and available under the MIT License.

---

**Happy tracking! 🐛📈**

_Built with ❤️ for waxworm farmers and researchers_
