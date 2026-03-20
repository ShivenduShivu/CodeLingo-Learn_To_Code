<div align="center">

<br/>

<img src="./banner.svg" alt="CodeLingo Banner" width="100%"/>

### 🎮 Learn Python & ML — the gamified way.

**Bite-sized challenges. Instant feedback. Real progress.**

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-codelingo--tawny.vercel.app-6366f1?style=for-the-badge&logoColor=white)](https://codelingo-tawny.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-97.9%25-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com)

<br/>

### 🌐 Live Demo

> 🔗 **[https://codelingo-tawny.vercel.app](https://codelingo-tawny.vercel.app)**

> **📝 Note:** For now, you can use any email and password to sign up, then use those same credentials to log in. No verification required!

<br/>

---

</div>

## 🌟 What is CodeLingo?

**CodeLingo** is an interactive, gamified coding platform built for learners who want to master **Python**, **Machine Learning**, and **AI** without the boring bits. Think of it as your coding dojo — structured lessons, in-browser code execution, AI-powered hints, and XP you actually earn.

> *"Learn to code the fun way — bite-sized challenges, gamified progress, and interactive practice."*

<br/>

## ✨ Features

| Feature | Description |
|---|---|
| 🏆 **Gamified Progress** | Earn XP, level up, and track streaks as you complete challenges |
| 🤖 **AI-Powered Hints** | Stuck? Get contextual hints powered by Google's Gemini AI |
| 💻 **In-Browser Code Editor** | Monaco Editor (the same engine as VS Code) runs right in the browser |
| 🔐 **Auth & Profiles** | Secure authentication and persistent progress via Supabase |
| 🎵 **Sound Effects** | Satisfying audio feedback to keep you in the zone |
| 📱 **Responsive Design** | Smooth experience across desktop and mobile |
| ⚡ **Instant Feedback** | Real-time evaluation so you never wait to know if you're right |
| 🎨 **Beautiful UI** | Polished animations via Framer Motion + Tailwind CSS |

<br/>

## 🛠️ Tech Stack

```
Frontend          →  Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion
Code Editor       →  Monaco Editor (@monaco-editor/react)
AI Integration    →  Vercel AI SDK · Google Gemini (@ai-sdk/google)
Backend / Auth    →  Supabase (Auth + PostgreSQL)
State Management  →  Zustand
UI Components     →  Radix UI · shadcn/ui · Lucide React
Deployment        →  Vercel
```

<br/>

## 📁 Project Structure

```
CodeLingo/
├── app/                    # Next.js App Router pages & API routes
│   ├── (auth)/             # Auth flows (login, signup)
│   ├── (dashboard)/        # Protected app pages
│   └── api/                # Server-side API endpoints (AI hints, etc.)
├── components/             # Reusable UI components
├── lib/                    # Utilities, Supabase client, helpers
├── styles/                 # Global CSS
├── supabase/               # DB migrations & schema
├── public/
│   └── sounds/             # Audio feedback assets
├── middleware.ts           # Auth middleware (route protection)
├── tailwind.config.ts
└── next.config.mjs
```

<br/>

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** / **yarn** / **pnpm**
- A [Supabase](https://supabase.com) project
- A [Google AI](https://aistudio.google.com) API key (for Gemini)

### 1. Clone the repository

```bash
git clone https://github.com/ShivenduShivu/CodeLingo-Learn_To_Code.git
cd CodeLingo-Learn_To_Code
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
```

### 4. Set up the database

Apply the Supabase migrations from the `/supabase` directory using the Supabase CLI:

```bash
supabase db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

<br/>

## 🧩 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

<br/>

## 📸 Screenshots

> *Coming soon — UI screenshots of the challenge view, editor, and dashboard.*

<br/>

## 🗺️ Roadmap

- [x] Core gamified challenge system
- [x] In-browser Monaco code editor
- [x] AI-powered hints with Gemini
- [x] Supabase auth + progress persistence
- [x] Sound effects & animations
- [ ] Leaderboards & social features
- [ ] More tracks: Data Science, Web Dev, Algorithms
- [ ] Mobile app (React Native)
- [ ] Custom challenge creator

<br/>

## 🤝 Contributing

Contributions are what make open source great! Here's how to get involved:

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add some amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please make sure your code follows the existing TypeScript conventions and passes the linter (`npm run lint`).

<br/>

## 🐛 Found a Bug?

Open an [issue](https://github.com/ShivenduShivu/CodeLingo-Learn_To_Code/issues) with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

<br/>

## 📄 License

This project is open source. Feel free to use it, learn from it, and build on top of it.

<br/>

## 👨‍💻 Author

**Shivendu Shivu**

[![GitHub](https://img.shields.io/badge/GitHub-@ShivenduShivu-181717?style=flat-square&logo=github)](https://github.com/ShivenduShivu)

<br/>

---

<div align="center">

Made with ❤️ and a lot of `console.log` debugging

⭐ **Star this repo if CodeLingo helped you learn something new!** ⭐

</div>
