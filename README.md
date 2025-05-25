# Programmatic Blog Generator

A Next.js-powered blog system designed for developers who want to generate and manage content entirely through code. Perfect for automated content creation, bulk publishing, and maintaining large-scale blogs without a traditional CMS.

## 🚀 Features

- **Fully Programmatic**: Generate 10s of blog posts daily through scripts
- **MDX Support**: Rich markdown with React components
- **Automatic Linking**: Internal links and related posts generated automatically  
- **SEO Optimized**: Built-in meta tags, sitemaps, and structured data
- **Fast Performance**: Static generation with Next.js optimizations
- **Developer-First**: Everything managed through code and version control

## 📦 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Content**: MDX (Markdown + JSX)
- **Styling**: Tailwind CSS
- **Automation**: Node.js scripts
- **Deployment**: Vercel (recommended)
- **Version Control**: Git-based workflow

## 🛠️ Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd programmatic-blog
npm install
```

### 2. Generate Your First Post

```bash
# Generate a single post
npm run generate

# Generate with custom options
npm run generate -- --title "My First Post" --type tutorial --author "Your Name"
```

### 3. Generate Bulk Content

```bash
# Generate 5 random posts
npm run bulk-generate

# Use daily presets
npm run bulk-generate -- --preset medium  # 10 posts
npm run bulk-generate -- --preset heavy   # 25 posts

# Custom bulk generation
npm run bulk-generate -- --count 20 --type tutorial
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/blog` to see your generated content.

## 📝 Content Generation

### Single Post Generation

The `generate-content.js` script creates individual blog posts:

```bash
# Basic generation
node scripts/generate-content.js

# With custom parameters  
node scripts/generate-content.js \
  --title "Advanced React Patterns" \
  --topic "React" \
  --type tutorial \
  --author "Tech Writer" \
  --tags "react,javascript,advanced"
```

**Post Types Available:**
- `tutorial` - Step-by-step guides with code examples
- `guide` - Comprehensive overview articles  
- `news` - Industry updates and announcements

### Bulk Generation

The `bulk-generate.js` script creates multiple posts at once:

```bash
# Daily content presets
npm run bulk-generate -- --preset light    # 3 posts
npm run bulk-generate -- --preset medium   # 10 posts  
npm run bulk-generate -- --preset heavy    # 25 posts
npm run bulk-generate -- --preset extreme  # 50 posts

# Custom bulk generation
npm run bulk-generate -- --count 15 --type mixed --author "Content Team"

# Dry run to preview what would be generated
npm run bulk-generate -- --count 10 --dry-run
```

## 📁 Project Structure

```
programmatic-blog/
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx      # Dynamic blog post pages
│   │   └── page.tsx          # Blog index page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── content/
│   └── blog/                 # Generated MDX files
│       ├── post-1.mdx
│       ├── post-2.mdx
│       └── ...
├── scripts/
│   ├── generate-content.js   # Single post generator
│   └── bulk-generate.js      # Bulk post generator
├── components/               # Reusable React components
├── next.config.js
└── package.json
```

## 🔧 Customization

### Content Templates

Modify the content templates in `scripts/generate-content.js`:

```javascript
const CONTENT_TEMPLATES = {
  tutorial: `## Introduction
Your custom tutorial template...`,
  
  guide: `## Overview  
Your custom guide template...`,
  
  news: `## Latest Developments
Your custom news template...`
}
```

### Topics and Tags

Customize available topics and tags:

```javascript
const TOPICS = [
  'Your Custom Topic',
  'Another Topic',
  // Add your topics here
]

const TAGS = [
  'your-tag',
  'another-tag', 
  // Add your tags here
]
```

### Styling

Modify the Tailwind classes in the React components to match your design:

```typescript
// app/blog/page.tsx
<article className="your-custom-classes">
  {/* Your styling */}
</article>
```

## 🤖 Automation Workflows

### Daily Content Generation

Set up automated daily content generation with GitHub Actions:

```yaml
# .github/workflows/daily-content.yml
name: Daily Content Generation
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run bulk-generate -- --preset medium
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'Auto-generate daily content'
```

### Content from External APIs

Extend the generators to pull from external sources:

```javascript
// In generate-content.js
async function generateFromAPI() {
  const response = await fetch('https://api.example.com/topics')
  const topics = await response.json()
  
  topics.forEach(topic => {
    generatePost({
      title: topic.title,
      customContent: topic.content,
      tags: topic.tags
    })
  })
}
```

## 📊 Content Management

### Viewing Generated Content

- **Blog Index**: `/blog` - Lists all generated posts
- **Individual Posts**: `/blog/[slug]` - Dynamic post pages
- **Related Posts**: Automatically linked based on tags and topics

### File Organization

All content lives in `content/blog/` as MDX files:

```
content/blog/
├── getting-started-nextjs.mdx
├── react-hooks-guide.mdx  
├── docker-containers-tutorial.mdx
└── ...
```

Each file contains frontmatter with metadata:

```yaml
---
title: "Post Title"
slug: "post-slug"  
date: "2025-05-25"
excerpt: "Post description"
tags: ["tag1", "tag2"]
related: ["other-post-slug"]
author: "Author Name"
type: "tutorial"
---
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

```bash
# Or deploy via CLI
npm install -g vercel
vercel
```

### Other Platforms

- **Netlify**: Use `netlify deploy`
- **AWS Amplify**: Connect your GitHub repo
- **Railway**: Deploy directly from GitHub
- **Self-hosted**: Build and deploy static files

## 🔍 SEO & Performance

### Built-in Optimizations

- **Static Generation**: All posts pre-generated at build time
- **Image Optimization**: Next.js automatic image optimization  
- **Font Optimization**: Web font optimization with `next/font`
- **Meta Tags**: Dynamic SEO tags for each post
- **Sitemap**: Automatic sitemap generation

### Performance Features

- **Code Splitting**: Automatic code splitting per route
- **Prefetching**: Link prefetching for faster navigation
- **Caching**: Aggressive caching strategies
- **CDN**: Global CDN deployment with Vercel

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production  
npm run start           # Start production server
npm run lint            # Run ESLint

# Content Generation
npm run generate        # Generate single post
npm run bulk-generate   # Generate multiple posts

# Custom Scripts
node scripts/generate-content.js --help    # See generation options
node scripts/bulk-generate.js --help       # See bulk options
```

## 📈 Scaling Up

### High-Volume Content

For generating 50+ posts daily:

1. **Optimize Build Times**: Use incremental static regeneration
2. **Database Integration**: Consider moving to a database for metadata
3. **Content Pipelines**: Set up automated content pipelines
4. **Monitoring**: Add analytics and performance monitoring

### Team Collaboration

- **Branch Strategy**: Use feature branches for content experiments
- **Review Process**: Set up PR reviews for generated content
- **Content Guidelines**: Establish style guides and templates
- **Automation Rules**: Create rules for automatic generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this for personal or commercial projects.

## 🆘 Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Documentation**: Check the `/docs` folder for detailed guides
- **Community**: Join discussions in GitHub Discussions

---

**Ready to generate content at scale?** Start with `npm run generate` and scale up to hundreds of posts with the bulk generation tools! 🚀