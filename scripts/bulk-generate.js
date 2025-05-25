const fs = require('fs-extra')
const path = require('path')
const slugify = require('slugify')

// Content scenarios focused on programming and web development
const contentScenarios = [
  {
    title: "Getting Started with Next.js 14 App Router",
    excerpt: "Learn the fundamentals of Next.js 14's new App Router and build your first modern web application with server components.",
    tags: ["nextjs", "react", "web-development", "app-router"],
    author: "John Doe"
  },
  {
    title: "Advanced TypeScript Patterns for React",
    excerpt: "Explore advanced TypeScript patterns and techniques for building type-safe React applications with better developer experience.",
    tags: ["typescript", "react", "javascript", "patterns"],
    author: "Jane Smith"
  },
  {
    title: "Building Scalable REST APIs with Node.js",
    excerpt: "Design and implement scalable REST APIs using Node.js, Express, and modern best practices for enterprise applications.",
    tags: ["nodejs", "api", "backend", "express"],
    author: "Mike Johnson"
  },
  {
    title: "Modern CSS Grid and Flexbox Techniques",
    excerpt: "Master modern CSS layout techniques including Grid, Flexbox, and container queries for responsive web design.",
    tags: ["css", "frontend", "web-design", "responsive"],
    author: "Sarah Wilson"
  },
  {
    title: "Database Design Best Practices with PostgreSQL",
    excerpt: "Learn essential database design principles and optimization techniques for building efficient PostgreSQL databases.",
    tags: ["database", "postgresql", "backend", "optimization"],
    author: "David Brown"
  },
  {
    title: "React Performance Optimization Guide",
    excerpt: "Comprehensive guide to optimizing React applications including memoization, code splitting, and bundle analysis.",
    tags: ["react", "performance", "optimization", "javascript"],
    author: "Emily Chen"
  },
  {
    title: "Introduction to GraphQL with Apollo",
    excerpt: "Get started with GraphQL and Apollo Client to build efficient, type-safe APIs for modern web applications.",
    tags: ["graphql", "apollo", "api", "javascript"],
    author: "Alex Rodriguez"
  },
  {
    title: "Docker Containerization for Web Developers",
    excerpt: "Learn how to containerize your web applications with Docker for consistent development and deployment environments.",
    tags: ["docker", "devops", "containers", "deployment"],
    author: "Lisa Park"
  },
  {
    title: "Testing React Applications with Jest and Testing Library",
    excerpt: "Complete guide to testing React components and applications using Jest, React Testing Library, and best practices.",
    tags: ["testing", "react", "jest", "javascript"],
    author: "Tom Anderson"
  },
  {
    title: "State Management in React: Redux vs Zustand",
    excerpt: "Compare different state management solutions for React applications and learn when to use each approach.",
    tags: ["react", "state-management", "redux", "javascript"],
    author: "Maria Garcia"
  },
  {
    title: "Building Progressive Web Apps with Next.js",
    excerpt: "Transform your Next.js application into a Progressive Web App with service workers, offline support, and app-like features.",
    tags: ["pwa", "nextjs", "web-development", "service-workers"],
    author: "Chris Taylor"
  },
  {
    title: "Authentication and Authorization in Node.js",
    excerpt: "Implement secure authentication and authorization in Node.js applications using JWT, OAuth, and modern security practices.",
    tags: ["nodejs", "authentication", "security", "backend"],
    author: "Rachel Green"
  },
  {
    title: "CSS-in-JS: Styled Components vs Emotion",
    excerpt: "Explore CSS-in-JS solutions for React applications and compare the benefits of Styled Components and Emotion.",
    tags: ["css-in-js", "react", "styled-components", "frontend"],
    author: "Jordan Lee"
  },
  {
    title: "Serverless Functions with Vercel and Netlify",
    excerpt: "Deploy and manage serverless functions using Vercel and Netlify for scalable backend functionality.",
    tags: ["serverless", "vercel", "netlify", "backend"],
    author: "Kevin Wong"
  },
  {
    title: "Web Accessibility Best Practices",
    excerpt: "Create inclusive web applications by implementing accessibility best practices and WCAG guidelines.",
    tags: ["accessibility", "web-development", "inclusive-design", "frontend"],
    author: "Sophie Miller"
  },
  {
    title: "Optimizing Web Performance with Core Web Vitals",
    excerpt: "Improve your website's performance by understanding and optimizing Core Web Vitals metrics.",
    tags: ["performance", "web-vitals", "optimization", "seo"],
    author: "Daniel Kim"
  },
  {
    title: "Building Real-time Applications with WebSockets",
    excerpt: "Create real-time web applications using WebSockets, Socket.io, and modern real-time communication patterns.",
    tags: ["websockets", "real-time", "nodejs", "javascript"],
    author: "Amy Liu"
  },
  {
    title: "Version Control Best Practices with Git",
    excerpt: "Master Git workflows, branching strategies, and collaboration techniques for effective version control.",
    tags: ["git", "version-control", "collaboration", "development"],
    author: "Mark Thompson"
  },
  {
    title: "API Documentation with OpenAPI and Swagger",
    excerpt: "Create comprehensive API documentation using OpenAPI specifications and Swagger tools for better developer experience.",
    tags: ["api", "documentation", "openapi", "swagger"],
    author: "Nina Patel"
  },
  {
    title: "Monitoring and Logging in Production Applications",
    excerpt: "Implement effective monitoring and logging strategies for production web applications using modern tools and practices.",
    tags: ["monitoring", "logging", "production", "devops"],
    author: "Robert Davis"
  }
]

// Function to get random related posts based on tag similarity
function getRelatedPosts(currentTags, allPosts, currentSlug, maxRelated = 3) {
  const related = []
  
  // Find posts with overlapping tags
  const tagMatches = allPosts
    .filter(post => post.slug !== currentSlug)
    .map(post => ({
      ...post,
      commonTags: post.tags.filter(tag => currentTags.includes(tag)).length
    }))
    .filter(post => post.commonTags > 0)
    .sort((a, b) => b.commonTags - a.commonTags)
  
  // Add top tag matches
  related.push(...tagMatches.slice(0, Math.min(2, tagMatches.length)))
  
  // Fill remaining slots with random posts
  if (related.length < maxRelated) {
    const remainingPosts = allPosts
      .filter(post => post.slug !== currentSlug && !related.find(r => r.slug === post.slug))
    
    const randomPosts = remainingPosts
      .sort(() => Math.random() - 0.5)
      .slice(0, maxRelated - related.length)
    
    related.push(...randomPosts)
  }
  
  return related.slice(0, maxRelated).map(post => post.slug)
}

// Function to generate a single blog post
async function generateBlogPost(scenario, index, allScenarios) {
  const slug = slugify(scenario.title, { lower: true, strict: true })
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 90)) // Random date within last 90 days
  
  // Get related posts based on tag similarity
  const relatedSlugs = getRelatedPosts(
    scenario.tags, 
    allScenarios.map((s, i) => ({
      slug: slugify(s.title, { lower: true, strict: true }),
      tags: s.tags
    })),
    slug
  )
  
  const frontMatter = {
    title: scenario.title,
    slug: slug,
    date: date.toISOString().split('T')[0],
    excerpt: scenario.excerpt,
    tags: scenario.tags,
    related: relatedSlugs,
    author: scenario.author
  }
  
  // Generate more substantial content based on the topic
  const content = generateDetailedContent(scenario)
  
  const fileContent = `---
title: "${frontMatter.title}"
slug: "${frontMatter.slug}"
date: "${frontMatter.date}"
excerpt: "${frontMatter.excerpt}"
tags: [${frontMatter.tags.map(tag => `"${tag}"`).join(', ')}]
related: [${frontMatter.related.map(slug => `"${slug}"`).join(', ')}]
author: "${frontMatter.author}"
---

${content}`
  
  const contentDir = path.join(process.cwd(), 'content', 'blog')
  await fs.ensureDir(contentDir)
  
  const filePath = path.join(contentDir, `${slug}.mdx`)
  await fs.writeFile(filePath, fileContent)
  
  console.log(`✅ Generated: ${scenario.title}`)
  return { slug, ...frontMatter }
}

// Function to generate detailed content based on the scenario
function generateDetailedContent(scenario) {
  const { title, tags, author } = scenario
  
  // Generate content sections based on tags and topic
  let content = `# ${title}\n\n`
  
  // Introduction
  content += `${scenario.excerpt}\n\n`
  
  // Main content sections based on tags
  if (tags.includes('tutorial') || tags.includes('guide')) {
    content += `## Getting Started\n\n`
    content += `Before diving into the details, let's establish the foundational concepts you'll need to understand.\n\n`
    content += `## Step-by-Step Implementation\n\n`
    content += `Follow these carefully crafted steps to achieve the best results:\n\n`
    content += `### Step 1: Planning and Preparation\n\n`
    content += `Proper planning is crucial for success. Take time to understand your requirements and constraints.\n\n`
    content += `### Step 2: Implementation\n\n`
    content += `Now that we have a solid plan, let's move to the implementation phase.\n\n`
    content += `### Step 3: Testing and Optimization\n\n`
    content += `Testing is not optional. Here's how to ensure your implementation works correctly.\n\n`
  } else if (tags.includes('business') || tags.includes('strategy')) {
    content += `## Current Market Landscape\n\n`
    content += `Understanding the current market conditions is essential for making informed decisions.\n\n`
    content += `## Key Strategies for Success\n\n`
    content += `Based on industry research and real-world experience, here are the strategies that work:\n\n`
    content += `### Strategy 1: Focus on Core Value\n\n`
    content += `Identify and double down on what makes your approach unique and valuable.\n\n`
    content += `### Strategy 2: Measure and Iterate\n\n`
    content += `Continuous improvement through measurement and iteration is key to long-term success.\n\n`
    content += `## Implementation Roadmap\n\n`
    content += `Here's a practical roadmap for implementing these strategies in your organization.\n\n`
  } else if (tags.includes('design') || tags.includes('ux')) {
    content += `## Design Principles\n\n`
    content += `Great design is built on solid principles. Let's explore the fundamentals that guide effective design decisions.\n\n`
    content += `## User-Centered Approach\n\n`
    content += `Putting users at the center of your design process ensures better outcomes and higher satisfaction.\n\n`
    content += `## Practical Applications\n\n`
    content += `Theory is important, but practical application is where real value is created.\n\n`
    content += `### Case Study: Real-World Implementation\n\n`
    content += `Let's examine a real-world example of these principles in action.\n\n`
  } else {
    // Generic structure for other topics
    content += `## Understanding the Fundamentals\n\n`
    content += `To master this topic, we need to start with a solid understanding of the core concepts.\n\n`
    content += `## Advanced Concepts\n\n`
    content += `Once you've grasped the basics, these advanced concepts will take your understanding to the next level.\n\n`
    content += `## Practical Applications\n\n`
    content += `Knowledge without application is incomplete. Here's how to put these concepts to work.\n\n`
    content += `## Best Practices\n\n`
    content += `Learn from the experience of others and avoid common pitfalls with these proven best practices.\n\n`
  }
  
  // Common sections for all posts
  content += `## Key Takeaways\n\n`
  content += `Here are the most important points to remember:\n\n`
  content += `- Focus on understanding the fundamentals before moving to advanced topics\n`
  content += `- Practice and real-world application are essential for mastery\n`
  content += `- Stay updated with the latest developments in the field\n`
  content += `- Connect with the community and learn from others' experiences\n\n`
  
  content += `## What's Next?\n\n`
  content += `This is just the beginning of your journey. Continue learning, experimenting, and sharing your knowledge with others.\n\n`
  content += `*Have questions or want to share your experience? Connect with me on social media or leave a comment below.*\n\n`
  
  return content
}

// Main function to generate multiple posts
async function generateBulkContent() {
  const count = process.argv.includes('--count') 
    ? parseInt(process.argv[process.argv.indexOf('--count') + 1]) 
    : contentScenarios.length
  
  const selectedScenarios = contentScenarios
    .sort(() => Math.random() - 0.5) // Randomize order
    .slice(0, Math.min(count, contentScenarios.length))
  
  console.log(`🚀 Generating ${selectedScenarios.length} blog posts...\n`)
  
  const generatedPosts = []
  
  for (let i = 0; i < selectedScenarios.length; i++) {
    try {
      const post = await generateBlogPost(selectedScenarios[i], i, selectedScenarios)
      generatedPosts.push(post)
    } catch (error) {
      console.error(`❌ Error generating post ${i + 1}:`, error.message)
    }
  }
  
  console.log(`\n✅ Successfully generated ${generatedPosts.length} blog posts!`)
  console.log(`📁 Posts saved to: content/blog/`)
  console.log(`🌐 Run 'npm run dev' to view your posts at http://localhost:3000/blog`)
  
  // Display tag distribution
  const tagCounts = {}
  generatedPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  
  console.log(`\n📊 Tag Distribution:`)
  Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .forEach(([tag, count]) => {
      console.log(`   ${tag}: ${count} post${count !== 1 ? 's' : ''}`)
    })
}

// Run the script
if (require.main === module) {
  generateBulkContent().catch(console.error)
}

module.exports = { generateBulkContent, contentScenarios }