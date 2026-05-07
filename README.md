# Manan Javiya Portfolio

## Content Editing
Blog and notes are static files now. No admin pages and no database are required.

- Blog content: `client/public/content/blogs.json`
- Notes content: `client/public/content/notes.json`

Edit those files, rebuild, and deploy the frontend when the content looks good.

## Local Setup
1. Install dependencies:
   - `npm install --prefix client`
2. Run locally:
   - `npm run dev --prefix client`

## Contact Form

The contact form sends email through Gmail SMTP using a Netlify Function. Add these environment variables in Netlify:

- `GMAIL_USER`: your Gmail address
- `GMAIL_APP_PASSWORD`: your 16-character Gmail App Password
- `EMAIL_TO`: `mananjaviya11@gmail.com`

Use a Gmail App Password, not your normal Gmail password.

## Deploy
Use Git deploys on Netlify because the contact form needs a Netlify Function.

Build settings:
- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`

For a simple static preview without email, you can still open `client/dist` after building.
