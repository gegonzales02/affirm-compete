# PMM Toolkit — AI-Powered Product Marketing Intelligence

Five professional marketing frameworks powered by Claude AI, built as a single Next.js web app. Designed for product marketing managers who need positioning, SEO, content editing, technical writing, and on-page optimization tools in one place.

## Tools

| Tool | What it does |
|------|-------------|
| **Product Value Map** | Positioning docs with taglines, personas, feature hierarchies, competitive matrices |
| **Meta Info Generator** | SEO-optimized titles, descriptions, slugs, search intent analysis |
| **Content Editing Codes** | Systematic editorial feedback using 7 semantic dimensions |
| **Technical Writing Guide** | Publication-ready content for tutorials, docs, blog posts |
| **On-Page SEO Optimizer** | Full SEO audit with structured data, content gaps, promotion strategy |

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/pmm-toolkit.git
cd pmm-toolkit
npm install
```

### 2. Set your API key

```bash
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key
```

Get an API key at [console.anthropic.com](https://console.anthropic.com/)

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel (One Click)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Import Project**
3. Select your repo
4. Add environment variable: `ANTHROPIC_API_KEY` = your key
5. Click **Deploy**

That's it. You'll have a live URL in ~60 seconds.

## Tech Stack

- **Next.js 16** (App Router) — React framework with server-side API routes
- **Tailwind CSS** — Utility-first styling
- **Anthropic Claude API** — AI-powered analysis with streaming responses
- **TypeScript** — Type safety throughout

## How It Works

Each tool has a dedicated page with a form. When you submit, the app:

1. Sends your input to `/api/analyze` (server-side API route)
2. The API route selects the matching system prompt for that tool
3. Calls Claude with streaming enabled
4. Streams the AI response back to the UI in real-time
5. Renders the output as formatted markdown with copy/download buttons

Your API key never leaves the server — it's set as an environment variable and only used in the API route.

## Based On

[Open Strategy Partners Marketing Tools](https://github.com/open-strategy-partners/osp_marketing_tools) — professional marketing methodologies adapted into an AI-powered web interface.

## License

MIT
