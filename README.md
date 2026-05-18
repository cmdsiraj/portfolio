# Personal Portfolio — Mahammad Siraj Cheruvu

Futuristic personal portfolio site hosted on GitHub Pages. All dynamic content is driven by `data.json` — no rebuild needed to update info.

## File Structure

```
portfolio/
├── index.html          # Shell — loads everything dynamically
├── data.json           # ← Edit this to update your info
├── css/style.css       # All styles
├── js/app.js           # Fetches data.json, renders all sections
├── assets/             # Images, resume PDF, logos
│   ├── avatar.jpg
│   ├── resume.pdf
│   └── projects/
└── .claude/launch.json # Local dev server config
```

## Updating Your Info

Just edit `data.json`. The site re-reads it on every page load.

| Section | Key in data.json |
|---------|-----------------|
| Name, title, links | `personal` |
| About paragraph | `about` |
| Skills by category | `skills` |
| Work experience | `experience` |
| Projects | `projects` |
| Education | `education` |
| Certifications | `certifications` |

## Adding a Project

```json
{
  "title": "My New Project",
  "description": "One sentence pitch.",
  "bullets": ["Key detail 1", "Key detail 2"],
  "tags": ["Python", "FastAPI"],
  "github": "https://github.com/you/repo",
  "demo": "https://your-demo.com",
  "image": "assets/projects/my-project.png",
  "featured": true
}
```

## GitHub Pages Setup

1. Create repo: `your-username.github.io` (for a root site) or any repo (for `your-username.github.io/portfolio`)
2. Push all files to the `main` branch
3. Go to **Settings → Pages → Source: Deploy from branch → main / root**
4. Your site will be live at `https://your-username.github.io`

> **Note:** GitHub Pages serves static files directly — `data.json` is fetched client-side via `fetch('./data.json')` so it works with no backend needed.

## Local Development

```bash
npx serve .
# or
python -m http.server 3333
```

Then open `http://localhost:3333`.
