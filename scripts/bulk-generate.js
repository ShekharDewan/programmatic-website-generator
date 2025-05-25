const { generatePost } = require('./generate-content')

// Predefined content scenarios for bulk generation
const CONTENT_SCENARIOS = [
  { topic: 'React Hooks', type: 'tutorial', tags: ['react', 'javascript', 'tutorial'] },
  { topic: 'Node.js Performance', type: 'guide', tags: ['nodejs', 'performance', 'backend'] },
  { topic: 'GraphQL API Design', type: 'tutorial', tags: ['graphql', 'api', 'backend'] },
  { topic: 'TypeScript Best Practices', type: 'guide', tags: ['typescript', 'javascript', 'best-practices'] },
  { topic: 'Docker Containerization', type: 'tutorial', tags: ['docker', 'devops', 'containers'] },
  { topic: 'AWS Lambda Functions', type: 'guide', tags: ['aws', 'serverless', 'cloud'] },
  { topic: 'CSS Grid Layout', type: 'tutorial', tags: ['css', 'frontend', 'layout'] },
  { topic: 'Database Optimization', type: 'guide', tags: ['database', 'performance', 'sql'] },
  { topic: 'Microservices Architecture', type: 'guide', tags: ['architecture', 'microservices', 'backend'] },
  { topic: 'Vue.js Composition API', type: 'tutorial', tags: ['vue', 'javascript', 'tutorial'] },
  { topic: 'Kubernetes Deployment', type: 'guide', tags: ['kubernetes', 'devops', 'deployment'] },
  { topic: 'Python Data Analysis', type: 'tutorial', tags: ['python', 'data-science', 'analysis'] },
  { topic: 'Machine Learning Basics', type: 'guide', tags: ['ml', 'ai', 'python'] },
  { topic: 'REST API Security', type: 'guide', tags: ['api', 'security', 'backend'] },
  { topic: 'Progressive Web Apps', type: 'tutorial', tags: ['pwa', 'javascript', 'mobile'] },
  { topic: 'Redis Caching Strategies', type: 'guide', tags: ['redis', 'caching', 'performance'] },
  { topic: 'Webpack Configuration', type: 'tutorial', tags: ['webpack', 'javascript', 'build-tools'] },
  { topic: 'MongoDB Aggregation', type: 'tutorial', tags: ['mongodb', 'database', 'nosql'] },
  { topic: 'CI/CD Pipelines', type: 'guide', tags: ['ci-cd', 'devops', 'automation'] },
  { topic: 'Next.js App Router', type: 'tutorial', tags: ['nextjs', 'react', 'routing'] },
  { topic: 'Testing Strategies', type: 'guide', tags: ['testing', 'javascript', 'best-practices'] },
  { topic: 'Blockchain Development', type: 'tutorial', tags: ['blockchain', 'cryptocurrency', 'web3'] },
  { topic: 'Svelte Framework', type: 'guide', tags: ['svelte', 'javascript', 'frontend'] },
  { topic: 'Serverless Architecture', type: 'guide', tags: ['serverless', 'cloud', 'architecture'] },
  { topic: 'GraphQL Federation', type: 'tutorial', tags: ['graphql', 'microservices', 'api'] }
]

// Industry news topics for news-type posts
const NEWS_TOPICS = [
  'JavaScript ES2024 Features',
  'React 19 Release Updates',
  'TypeScript 5.5 Improvements',
  'Node.js LTS Updates',
  'AWS New Services',
  'Docker Desktop Changes',
  'VS Code Extensions',
  'GitHub Copilot Updates',
  'Chrome DevTools Features',
  'NPM Security Updates'
]

async function generateBulkContent(count = 5, options = {}) {
  const {
    type = 'mixed', // 'tutorial', 'guide', 'news', or 'mixed'
    author = 'Content Generator',
    dryRun = false
  } = options
  
  console.log(`🚀 Starting bulk generation of ${count} posts...`)
  if (dryRun) console.log('📋 DRY RUN MODE - No files will be created')
  
  const results = {
    success: [],
    failed: [],
    skipped: []
  }
  
  for (let i = 0; i < count; i++) {
    let postOptions = { author }
    
    // Determine post type
    if (type === 'mixed') {
      const types = ['tutorial', 'guide', 'news']
      postOptions.type = types[Math.floor(Math.random() * types.length)]
    } else {
      postOptions.type = type
    }
    
    // Select content based on type
    if (postOptions.type === 'news') {
      postOptions.topic = NEWS_TOPICS[Math.floor(Math.random() * NEWS_TOPICS.length)]
      postOptions.tags = ['news', 'updates', 'technology']
    } else {
      const scenario = CONTENT_SCENARIOS[Math.floor(Math.random() * CONTENT_SCENARIOS.length)]
      postOptions = { ...postOptions, ...scenario }
    }
    
    console.log(`\n📝 Generating post ${i + 1}/${count}: ${postOptions.topic} (${postOptions.type})`)
    
    if (dryRun) {
      console.log(`   Would create: "${postOptions.topic}" as ${postOptions.type}`)
      results.success.push({ title: postOptions.topic, type: postOptions.type })
      continue
    }
    
    try {
      const result = generatePost(postOptions)
      
      if (result.success) {
        results.success.push(result)
        // Add small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100))
      } else if (result.reason === 'File exists') {
        results.skipped.push(result)
        console.log(`   ⏭️  Skipped: ${result.slug} (already exists)`)
      } else {
        results.failed.push(result)
        console.log(`   ❌ Failed: ${result.reason}`)
      }
    } catch (error) {
      results.failed.push({ error: error.message, topic: postOptions.topic })
      console.log(`   ❌ Error: ${error.message}`)
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 BULK GENERATION SUMMARY')
  console.log('='.repeat(50))
  console.log(`✅ Successfully created: ${results.success.length}`)
  console.log(`⏭️  Skipped (already exist): ${results.skipped.length}`)
  console.log(`❌ Failed: ${results.failed.length}`)
  
  if (results.success.length > 0) {
    console.log('\n🎉 Successfully generated posts:')
    results.success.forEach(post => {
      console.log(`   • ${post.title || post.topic}`)
    })
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed posts:')
    results.failed.forEach(post => {
      console.log(`   • ${post.topic || 'Unknown'}: ${post.error || post.reason}`)
    })
  }
  
  return results
}

// Daily content generation presets
const DAILY_PRESETS = {
  light: 3,    // 3 posts per day
  medium: 10,  // 10 posts per day  
  heavy: 25,   // 25 posts per day
  extreme: 50  // 50 posts per day
}

async function generateDailyContent(preset = 'light', options = {}) {
  const count = DAILY_PRESETS[preset] || parseInt(preset) || 3
  
  console.log(`📅 Daily content generation: ${preset} preset (${count} posts)`)
  
  return await generateBulkContent(count, {
    ...options,
    type: 'mixed',
    author: 'Daily Auto Generator'
  })
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node bulk-generate.js [options]

Options:
  --count N               Number of posts to generate (default: 5)
  --type TYPE             Post type: tutorial|guide|news|mixed (default: mixed)
  --author "Name"         Author name (default: Content Generator)
  --preset PRESET         Daily preset: light|medium|heavy|extreme
  --dry-run              Show what would be generated without creating files
  --help, -h             Show this help message

Presets:
  light   = 3 posts    (good for starting out)
  medium  = 10 posts   (steady content flow)
  heavy   = 25 posts   (high-volume content)
  extreme = 50 posts   (maximum generation)

Examples:
  node bulk-generate.js --count 10
  node bulk-generate.js --preset medium --type tutorial
  node bulk-generate.js --count 5 --dry-run
  node bulk-generate.js --preset heavy --author "Tech Team"
    `)
    process.exit(0)
  }
  
  // Parse arguments
  const options = {}
  let count = 5
  let preset = null
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const value = args[i + 1]
    
    switch (arg) {
      case '--count':
        count = parseInt(value) || 5
        i++
        break
      case '--type':
        options.type = value
        i++
        break
      case '--author':
        options.author = value
        i++
        break
      case '--preset':
        preset = value
        i++
        break
      case '--dry-run':
        options.dryRun = true
        break
    }
  }
  
  // Execute generation
  async function main() {
    if (preset) {
      await generateDailyContent(preset, options)
    } else {
      await generateBulkContent(count, options)
    }
  }
  
  main().catch(console.error)
}

module.exports = { generateBulkContent, generateDailyContent }