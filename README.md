# Manan Javiya Portfolio

## Features
- Creative portfolio frontend
- Blog and notes stored with Netlify Blobs
- Protected blog/notes admin pages using `ADMIN_KEY`
- Contact form through Web3Forms
- Resume download button

## Project Structure
- `client` - React + Vite frontend, static pages, and Netlify Functions
- `netlify.toml` - Netlify build and `/api/*` function routing

## Netlify Setup
Add these environment variables in Netlify:

- `ADMIN_KEY`: your private admin password for blog/notes pages
- `VITE_WEB3FORMS_ACCESS_KEY`: your Web3Forms access key

Use Git-based Netlify deploys, not drag-and-drop deploys, because blog/notes now use Netlify Functions.

Build settings:
- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`

## Local Setup
1. Install dependencies:
   - `npm install --prefix client`
2. Run frontend:
   - `npm run dev --prefix client`

## Links
- GitHub: https://github.com/Manan1107
- LinkedIn: https://www.linkedin.com/in/manan-javiya/
