# Manan Javiya - Creative 3D MERN Portfolio

## Features
- 3D animated hero section with Three.js
- Creative modern UI with glassmorphism
- Blog section (stored in MongoDB)
- Diary / Notes section (stored in MongoDB)
- Contact form that sends email in real-time via Nodemailer
- Resume download button

## Project Structure
- `client` - React + Vite frontend
- `server` - Express + MongoDB backend

## Setup
1. Install dependencies:
   - `npm run install:all`
2. Create env files:
   - Copy `server/.env.example` to `server/.env`
   - Copy `client/.env.example` to `client/.env`
3. Resume download setup:
   - Create folder `client/public`
   - Put your resume PDF in `client/public/Manan_Javiya_Resume.pdf`
4. Run backend:
   - `npm run dev:server`
5. Run frontend:
   - `npm run dev:client`

## Email Contact Setup
- Recommended on Render: create a Web3Forms access key and set `WEB3FORMS_ACCESS_KEY`.
- Use Gmail App Password for `EMAIL_PASS` (not your normal Gmail password).
- `EMAIL_TO` is already your email `mananjaviya11@gmail.com`.
- On Render, add these Environment variables:
  - `WEB3FORMS_ACCESS_KEY`: your Web3Forms access key
  - `EMAIL_USER`: your Gmail address
  - `EMAIL_PASS`: your 16-character Gmail App Password
  - `EMAIL_TO`: `mananjaviya11@gmail.com`
  - `CLIENT_ORIGINS`: `https://mananportfolioin.netlify.app`
- After redeploying the backend, open `/api/contact/health` on your Render URL. It should show `"emailConfigured": true`.

## Links
- GitHub: https://github.com/Manan1107
- LinkedIn: https://www.linkedin.com/in/manan-javiya/
