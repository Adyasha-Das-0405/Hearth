# 🔥 Hearth — Virtual Wall Calendar

Hearth is a **virtual wall calendar** designed to feel like a modern personal planning space.  
It lets you plan your month visually using **date-range selection**, attach notes, assign priority levels, and manage your events through an elegant UI.

---

## ✨ Features

### 📅 Calendar Grid (Monthly View)
- Clean monthly wall-calendar layout
- Displays days in a structured grid
- Highlights **today’s date**
- Smooth month navigation with animation

---

### 🖱️ Date Range Selector (Drag Selection)
- Click and drag across dates to select a range
- On drag release, an **Event Configuration Modal** opens automatically
- Selected ranges are visually highlighted on the calendar

---

### 📝 Event Configuration Modal
When selecting a date or range, you can add:
- **Event Subject**
- **Importance / Priority Level**
- **Internal Notes**
- **Important Links / References**

Events are saved and shown on the calendar visually.

---

### 🎨 Importance-Based Coloring
Each saved event is assigned an importance level:
- Low
- Medium
- High
- Critical

The calendar reflects importance using **color-coded event indicators** for better visibility.

---

### 📌 Quick Notes Panel
- Add quick notes anytime
- If a range is selected, notes can be drafted specifically for that range
- Notes can be saved as an event using the modal

---

### 🗂️ Recent Logs Panel
A dedicated panel to track saved events.
It supports:
- Viewing recently saved notes/events
- Clicking a log to open event details
- Highlight glow when navigating from navbar (Events button)

---

### ⚙️ Settings Panel (Bottom Right)
A floating settings button gives access to powerful customizations:

#### 🌄 Background Customization
- **Cycle Backgrounds** (built-in wallpapers)
- **Upload Background Image** from your system

#### 🌗 Day/Night Mode
- Toggle between day mode and night mode for a better visual experience

#### 📆 Year Selector
- Quickly switch between years

#### 🎵 Music Player (Lazy Loaded)
- Play/Pause support
- **2×2 Track Picker Grid**
- Volume control slider
- Audio loads lazily
- Play button stays disabled until the track is ready (prevents autoplay browser errors)

---

## 🧱 Tech Stack
- **React (Vite)**
- **JavaScript**
- **CSS (custom styling + glassmorphism UI)**
- **LocalStorage** for saving events

---

## 📂 Folder Structure

```bash
my-calendly-app/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── calendar/
│   │   │   ├── CalendarGrid.jsx
│   │   │   ├── DateCell.jsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── CalHeader.jsx
│   │   │   ├── MonthHero.jsx
│   │   │   ├── SettingsPanel.jsx
│   │   │   └── ...
│   │   ├── modals/
│   │   │   ├── EventConfigModal.jsx
│   │   │   ├── EventDetailModal.jsx
│   │   │   └── ...
│   │   ├── sidebar/
│   │   │   ├── SidePanel.jsx
│   │   │   ├── RecentLogs.jsx
│   │   │   └── ...
│   ├── hooks/
│   │   ├── useEvents.js
│   │   ├── useMonthNav.js
│   │   ├── useRangeSelect.js
│   │   ├── useSettings.js
│   │   └── ...
│   ├── constants/
│   │   ├── days.js
│   │   ├── importance.js
│   │   └── index.js
│   ├── utils/
│   │   ├── dateUtils.js
│   │   └── ...
│   ├── styles/
│   │   ├── index.css
│   │   ├── calendar.css
│   │   ├── sidebar.css
│   │   ├── header.css
│   │   └── ...
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json