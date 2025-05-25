const fs = require('fs-extra')
const path = require('path')
const slugify = require('slugify')

// Ensure content directory exists
const contentDir = path.join(process.cwd(), 'content/blog')
fs.ensureDirSync(contentDir)

// Sample content templates
const TOPICS = [
  'AI and Machine Learning',
  'Web Development',
  'Data Science',
  'Cloud Computing',
  'Cybersecurity',
  'Mobile Development',
  'DevOps',
  'Blockchain',
  'IoT',
  'Software Architecture'
]

const TAGS = [
  'tutorial', 'beginner', 'advanced', 'javascript', 'python', 'react', 'nodejs',
  'aws', 'docker', 'kubernetes', 'ai', 'ml', 'data', 'security', 'performance',
  'best-practices', 'coding', 'programming', 'technology', 'tips'
]

// Content templates for different types of posts
const CONTENT_TEMPLATES = {
  tutorial: `## Introduction

This tutorial will walk you through the fundamentals of {topic}. By the end of this guide, you'll have a solid understanding of the key concepts and practical skills to implement them in your own projects.

## Prerequisites

- Basic understanding of programming concepts
- Familiarity with command line tools
- A development environment set up

## Step 1: Getting Started

Let's begin by setting up our environment and understanding the basic concepts.

\`\`\`bash
# Example command
npm install example-package
\`\`\`

## Step 2: Core Implementation

Now we'll dive into the main implementation details.

## Step 3: Advanced Techniques

Once you've mastered the basics, here are some advanced techniques to consider.

## Best Practices

Here are some important best practices to keep in mind:

- Always follow security guidelines
- Write clean, maintainable code
- Test your implementations thoroughly
- Document your work properly

## Conclusion

We've covered the essential aspects of {topic}. Continue practicing these concepts and explore the related resources below.

## Related Resources

- [Official Documentation](#)
- [Community Forums](#)
- [Additional Tutorials](#)`,

  guide: `## Overview

This comprehensive guide covers everything you need to know about {topic}. Whether you're a beginner or looking to deepen your understanding, this article provides valuable insights and practical examples.

## What is {topic}?

{topic} is a crucial aspect of modern development that enables developers to build more efficient and scalable applications.

## Key Benefits

The main advantages of implementing {topic} include:

1. **Improved Performance** - Significant speed improvements
2. **Better User Experience** - Enhanced interaction and responsiveness  
3. **Scalability** - Handles growth effectively
4. **Maintainability** - Easier to update and modify

## Implementation Strategies

### Strategy 1: Direct Implementation

This approach involves implementing the solution directly without additional abstractions.

### Strategy 2: Framework-Based Approach

Using established frameworks can accelerate development and provide tested solutions.

## Common Pitfalls to Avoid

- Don't overcomplicate the initial implementation
- Avoid premature optimization
- Always consider security implications
- Plan for future maintenance and updates

## Real-World Examples

Let's look at how leading companies implement these concepts in production environments.

## Conclusion

Understanding {topic} is essential for modern development. Start with the basics and gradually incorporate more advanced techniques as you gain experience.`,

  news: `## Latest Developments in {topic}

The {topic} landscape continues to evolve rapidly, with new developments and innovations emerging regularly. Here's what you need to know about the latest trends and updates.

## What's New

Recent announcements and updates in the {topic} space have introduced several game-changing features and improvements.

## Industry Impact

These developments are expected to have significant implications for:

- Enterprise adoption rates
- Developer productivity
- Market competition
- Future innovation directions

## Key Features and Improvements

### Enhanced Performance
The latest updates focus heavily on performance optimization and efficiency improvements.

### Better Developer Experience
New tools and features are designed to streamline the development process.

### Advanced Security Measures
Security remains a top priority with enhanced protection mechanisms.

## What This Means for Developers

For developers working with {topic}, these updates present both opportunities and challenges:

- **Opportunities**: New capabilities and improved workflows
- **Challenges**: Learning curve and migration considerations

## Looking Ahead

The future of {topic} looks promising, with continued investment in research and development expected to bring even more innovations.

## Getting Started

If you're new to {topic} or looking to upgrade, here's how to get started with the latest features.

## Community Response

The developer community has responded positively to these updates, with early adopters reporting significant improvements in their workflows.`
}

function generateRandomContent(topic, type = 'tutorial') {
  const template = CONTENT_TEMPLATES[type] || CONTENT_TEMPLATES.tutorial
  return template.replace(/{topic}/g, topic)
}

function getRandomTags(count = 3) {
  const shuffled = TAGS.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function getRandomRelated(allSlugs, currentSlug, count = 2) {
  const otherSlugs = allSlugs.filter(s => s !== currentSlug)
  const shuffled = otherSlugs.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, otherSlugs.length))
}

function getAllExistingSlugs() {
  if (!fs.existsSync(contentDir)) return []
  
  return fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace('.mdx', ''))
}

function generatePost(options = {}) {
  const {
    title,
    topic,
    type = 'tutorial',
    author = 'Auto Generator',
    tags,
    customContent
  } = options
  
  // Generate title if not provided
  const finalTitle = title || `${type === 'tutorial' ? 'Complete Guide to' : type === 'news' ? 'Latest Updates in' : 'Understanding'} ${topic || TOPICS[Math.floor(Math.random() * TOPICS.length)]}`
  
  // Generate slug
  const slug = slugify(finalTitle, { lower: true, strict: true })
  
  // Get existing slugs for related posts
  const existingSlugs = getAllExistingSlugs()
  const relatedPosts = getRandomRelated(existingSlugs, slug)
  
  // Generate content
  const actualTopic = topic || TOPICS[Math.floor(Math.random() * TOPICS.length)]
  const content = customContent || generateRandomContent(actualTopic, type)
  
  // Create frontmatter
  const frontmatter = {
    title: finalTitle,
    slug: slug,
    date: new Date().toISOString().split('T')[0],
    excerpt: `Learn about ${actualTopic.toLowerCase()} with this comprehensive ${type}. Discover best practices, implementation strategies, and real-world examples.`,
    tags: tags || getRandomTags(),
    related: relatedPosts,
    author: author,
    type: type
  }

  // Create MDX content
  const mdxContent = `---
title: "${frontmatter.title}"
slug: "${frontmatter.slug}"
date: "${frontmatter.date}"
excerpt: "${frontmatter.excerpt}"
tags: [${frontmatter.tags.map(tag => `"${tag}"`).join(', ')}]
related: [${frontmatter.related.map(slug => `"${slug}"`).join(', ')}]
author: "${frontmatter.author}"
type: "${frontmatter.type}"
---

${content}
`

  // Write file
  const filename = `${slug}.mdx`
  const filepath = path.join(contentDir, filename)
  
  if (fs.existsSync(filepath)) {
    console.log(`⚠️  File already exists: ${filename}`)
    return { success: false, reason: 'File exists', slug, filepath }
  }
  
  fs.writeFileSync(filepath, mdxContent)
  console.log(`✅ Generated: ${filename}`)
  
  return { success: true, slug, filepath, title: finalTitle }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node generate-content.js [options]

Options:
  --title "Your Title"     Custom title for the post
  --topic "Your Topic"     Specific topic to write about  
  --type tutorial|guide|news  Type of content to generate
  --author "Author Name"   Author name
  --tags "tag1,tag2,tag3"  Comma-separated tags
  --help, -h              Show this help message

Examples:
  node generate-content.js
  node generate-content.js --title "Advanced React Patterns" --type tutorial
  node generate-content.js --topic "Docker" --type guide --author "Tech Writer"
    `)
    process.exit(0)
  }
  
  // Parse command line arguments
  const options = {}
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '')
    const value = args[i + 1]
    
    if (key && value) {
      if (key === 'tags') {
        options[key] = value.split(',').map(tag => tag.trim())
      } else {
        options[key] = value
      }
    }
  }
  
  const result = generatePost(options)
  
  if (result.success) {
    console.log(`\n🎉 Successfully generated: "${result.title}"`)
    console.log(`📁 File: ${result.filepath}`)
    console.log(`🔗 URL: /blog/${result.slug}`)
  } else {
    console.log(`\n❌ Failed to generate post: ${result.reason}`)
  }
}

module.exports = { generatePost, getAllExistingSlugs }