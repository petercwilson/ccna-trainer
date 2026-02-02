# CCNA Certification Trainer

<div align="center">

![CCNA Trainer](https://img.shields.io/badge/CCNA-Certification%20Trainer-00BCB4?style=for-the-badge&logo=cisco&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A comprehensive, interactive web application for CCNA 200-301 exam preparation**

[Live Demo](#) • [Features](#features) • [Getting Started](#getting-started) • [Deployment](#deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🎯 Overview

The CCNA Certification Trainer is a modern, feature-rich web application designed to help networking professionals and students prepare for the Cisco CCNA 200-301 certification exam. Built with React and featuring an intuitive interface, it provides comprehensive study materials, practice questions, and interactive network simulations.

### Why This Project?

- **Comprehensive Coverage**: All 6 CCNA exam domains included
- **Interactive Learning**: Hands-on network topology simulator
- **Progress Tracking**: Monitor your performance and improvement over time
- **Exam Simulation**: Timed practice exams that mirror the real certification test
- **Free & Open Source**: No subscription fees, fully accessible to everyone

---

## ✨ Features

### 📚 Study Guides

- **6 Complete Study Domains**:
  - Network Fundamentals (OSI Model, IP Addressing, Subnetting)
  - IP Routing (OSPF, EIGRP, Static/Dynamic Routing)
  - Switching Technologies (VLANs, STP, EtherChannel)
  - Network Security (ACLs, Port Security, DHCP Snooping)
  - Network Automation (REST APIs, JSON, Python)
  - Wireless Networking (802.11 Standards, WLAN Security)

- **Expandable Topics**: Click to reveal detailed explanations
- **Structured Content**: Clear sections with examples and best practices
- **Easy Navigation**: Sidebar navigation between domains

### ❓ Practice Questions

- **12+ Practice Questions** covering all exam topics
- **Two Study Modes**:
  - **Topic-by-Topic**: Practice by category with immediate feedback
  - **Timed Exam Mode**: Simulate the real CCNA exam experience
  
- **Difficulty Levels**: Easy, Medium, and Hard questions
- **Detailed Explanations**: Learn why answers are correct or incorrect
- **Smart Filtering**: Focus on specific domains that need improvement

### 🌐 Network Lab Simulator

- **Interactive Topology Builder**: Visualize network configurations
- **Device Types**: Routers, Switches, PCs, and Servers
- **Configuration Viewer**: See device configs in Cisco IOS format
- **Visual Connections**: Labeled links between devices
- **Click-to-Inspect**: Select devices to view their configurations

### 📊 Progress Tracking

- **Performance Analytics**: Track questions answered and accuracy rates
- **Exam History**: Review all past exam attempts with scores
- **Domain Mastery**: See your performance breakdown by topic
- **Local Storage**: Progress saved automatically in your browser
- **Visual Dashboards**: Color-coded performance indicators

---

## 🖼️ Screenshots

### Study Guides Interface
![Study Guides](./docs/screenshots/study-guides.png)
*Comprehensive study materials organized by domain*

### Practice Questions
![Practice Questions](./docs/screenshots/practice-questions.png)
*Interactive quiz mode with instant feedback*

### Network Simulator
![Network Lab](./docs/screenshots/network-simulator.png)
*Visual network topology builder*

### Progress Dashboard
![Progress Tracking](./docs/screenshots/progress.png)
*Track your learning journey*

---

## 🛠️ Tech Stack

### Core Technologies

- **[React 18](https://react.dev/)** - UI library for building interactive interfaces
- **[Vite](https://vitejs.dev/)** - Next-generation frontend build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful, consistent icon library

### Development Tools

- **JavaScript (ES6+)** - Modern JavaScript features
- **CSS3** - Custom animations and transitions
- **LocalStorage API** - Client-side data persistence
- **Git** - Version control

### Hosting

- **GitHub Pages** - Free static site hosting
- **gh-pages** - Deployment automation

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/YOUR-USERNAME/ccna-trainer.git
cd ccna-trainer
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser**

Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
ccna-trainer/
├── public/                 # Static assets
├── src/
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles (Tailwind imports)
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json           # Project dependencies and scripts
└── README.md              # This file
```

### Key Components

- **`CCNATrainer`** - Main application component with state management
- **`NetworkSimulation`** - Interactive network topology simulator
- **`studyGuides`** - Comprehensive study content database
- **`examQuestions`** - Practice question database

---

## 💡 Usage

### Study Mode

1. Navigate to the **Study Guides** tab
2. Select a domain from the sidebar (e.g., Network Fundamentals)
3. Click on a topic to expand and read the content
4. Take notes and review key concepts

### Practice Mode

1. Go to the **Practice Questions** tab
2. Choose your preferred mode:
   - **Topic-by-Topic**: Focus on one domain at a time
   - **Timed Exam**: Take a full practice exam
3. Answer questions and click "Check Answer" for immediate feedback
4. Review explanations to understand the concepts

### Network Lab

1. Visit the **Network Lab** tab
2. Click on devices to view their configurations
3. Study the topology and connection labels
4. Use the device buttons to add new network elements (future feature)

### Track Progress

1. Check the **My Progress** tab
2. View your statistics:
   - Total questions answered
   - Correct answer percentage
   - Exam history with scores
3. Identify weak areas and focus your studies accordingly

---

## 🌐 Deployment

### Deploy to GitHub Pages

1. **Update `vite.config.js`** with your repository name:

```javascript
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/ccna-trainer/' : '/',
})
```

2. **Install gh-pages**

```bash
npm install --save-dev gh-pages
```

3. **Add deployment scripts to `package.json`**

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. **Deploy**

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
npm run deploy
```

5. **Enable GitHub Pages**

- Go to your repository Settings → Pages
- Source: `gh-pages` branch
- Your site will be live at: `https://YOUR-USERNAME.github.io/ccna-trainer/`

### Deploy to Other Platforms

#### Netlify

1. Build the project: `npm run build`
2. Drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

#### Vercel

```bash
npm install -g vercel
vercel
```

#### Cloudflare Pages

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Output directory: `dist`

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Ideas

- 📝 Add more practice questions
- 🎨 Improve UI/UX design
- 🌐 Add multi-language support
- 🔧 Implement additional network simulation features
- 📚 Expand study guide content
- 🐛 Fix bugs and improve performance
- 📱 Enhance mobile responsiveness

### Code Standards

- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Comment complex logic
- Test your changes before submitting

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

---

## 🙏 Acknowledgments

### Resources & Inspiration

- **[Cisco CCNA 200-301 Official Cert Guide](https://www.ciscopress.com/store/ccna-200-301-official-cert-guide-library-9781587147142)** - Primary study reference
- **[Cisco Learning Network](https://learningnetwork.cisco.com/)** - Community and resources
- **[Jeremy's IT Lab](https://www.youtube.com/@JeremysITLab)** - Excellent CCNA video course
- **[Packet Tracer](https://www.netacad.com/courses/packet-tracer)** - Cisco's official network simulator

### Technologies

- Thanks to the **React** team for an amazing framework
- **Vite** for blazing-fast development experience
- **Tailwind CSS** for beautiful, utility-first styling
- **Lucide** for clean, consistent icons

### Community

Special thanks to all contributors and users who have provided feedback, reported bugs, and suggested features to make this project better.

---

## 📞 Contact & Support

### Author

**Your Name**
- GitHub: [@petercwilson](https://github.com/petercwilson)
- LinkedIn: [pcwilson19](https://www.linkedin.com/in/pcwilson19/)
- Email: pcwilson19@gmail.com

### Issues & Questions

If you encounter any issues or have questions:

1. Check existing [Issues](https://github.com/YOUR-USERNAME/ccna-trainer/issues)
2. Create a [New Issue](https://github.com/YOUR-USERNAME/ccna-trainer/issues/new) with detailed information
3. Join discussions in the [Discussions](https://github.com/YOUR-USERNAME/ccna-trainer/discussions) tab

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Expanded Question Bank**: Add 50+ more practice questions
- [ ] **Flashcard Mode**: Quick-study flashcards for memorization
- [ ] **Lab Simulations**: Interactive CLI simulation exercises
- [ ] **Performance Analytics**: Detailed charts and insights
- [ ] **Dark/Light Mode Toggle**: Theme customization
- [ ] **Export Progress**: Download study history as PDF
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **Collaborative Study**: Share progress with study groups
- [ ] **AI-Powered Hints**: Smart suggestions based on performance

### Version History

#### v1.0.0 (Current)
- ✅ Core study guides for 6 CCNA domains
- ✅ 12 practice questions with explanations
- ✅ Interactive network topology simulator
- ✅ Progress tracking with local storage
- ✅ Timed exam mode
- ✅ Responsive design

---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/YOUR-USERNAME/ccna-trainer?style=social)
![GitHub Forks](https://img.shields.io/github/forks/YOUR-USERNAME/ccna-trainer?style=social)
![GitHub Issues](https://img.shields.io/github/issues/YOUR-USERNAME/ccna-trainer)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/YOUR-USERNAME/ccna-trainer)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Built with ❤️ for the networking community**

[Report Bug](https://github.com/YOUR-USERNAME/ccna-trainer/issues) • [Request Feature](https://github.com/YOUR-USERNAME/ccna-trainer/issues) • [Contribute](https://github.com/YOUR-USERNAME/ccna-trainer/pulls)

</div>

---

## 📚 Additional Resources

### CCNA Study Materials

- [Cisco CCNA Exam Topics](https://learningnetwork.cisco.com/s/ccna-exam-topics)
- [Subnetting Practice](https://subnettingpractice.com/)
- [CCNA Subreddit](https://reddit.com/r/ccna)
- [Boson ExSim](https://www.boson.com/practice-exam/200-301-cisco-ccna-practice-exam) - Premium practice exams

### Networking Tools

- [Cisco Packet Tracer](https://www.netacad.com/courses/packet-tracer) - Free network simulation tool
- [GNS3](https://www.gns3.com/) - Advanced network emulator
- [Wireshark](https://www.wireshark.org/) - Network protocol analyzer

---

**Good luck with your CCNA certification journey! 🎓🚀**
