# SheSafe – Women Safety App (JavaScript / JSX)

React + Vite + Tailwind CSS v4 + Framer Motion — no TypeScript!

## Project Structure

```
shesafe-app/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                  ← Entry point
    ├── App.jsx                   ← Root + screen router
    ├── index.css                 ← Tailwind v4
    ├── context/
    │   └── AppContext.jsx        ← Global state
    └── pages/
        ├── Login.jsx             ← Screen 1 – Login
        ├── OtpMethod.jsx         ← Screen 2 – OTP method
        ├── OtpVerify.jsx         ← Screen 3 – OTP verify
        ├── Onboarding.jsx        ← Screens 4-6 – Onboarding
        └── Dashboard.jsx         ← Dashboard + AI panel
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## OTP Test Code

Use **123456** on the OTP screen to verify successfully.

## Features

- Login with Name, Phone (+91), Email
- OTP Method Selection (SMS / WhatsApp / Call)
- OTP Verification with 30s resend timer
- 3-screen Onboarding (new users only)
- Dashboard: Home, Map, Contacts, Feedback tabs
- Pulsing SOS emergency button with countdown
- Right-side AI chat panel (slide-in)
- Light / Dark mode toggle
- Smooth Framer Motion animations throughout

## Tech Stack

- React 18
- Vite 6
- Tailwind CSS 4
- Framer Motion 11
- Lucide React
