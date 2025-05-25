import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'

interface BlogPost {
  title: string
  slug: string
  date: string
  excerpt: string
  tags: string[]
  related: string[]
  author: string
}

interface PageProps {
  params: {
    slug: string
  }
}

// Get all blog posts
function getAllPosts(): { slug: string; frontMatter: BlogPost }[] {
  const contentDir = path.join(process.cwd(), 'content/blog')
  
  if (!fs.existsSync(contentDir)) {
    return []
  }
  
  const files = fs.readdirSync(contentDir)
  
  return files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const filePath = path.join(contentDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContent)
      
      return {
        slug: file.replace('.mdx', ''),
        frontMatter: data as BlogPost
      }
    })
}

// Get single post
function getPost(slug: string) {
  const filePath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    return null
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContent)
  
  return {
    frontMatter: data as BlogPost,
    content
  }
}

// Smart related posts algorithm
function getSmartRelatedPosts(currentPost: BlogPost, allPosts: { slug: string; frontMatter: BlogPost }[], maxResults: number = 6): { slug: string; frontMatter: BlogPost }[] {
  const currentTags = currentPost.tags || []
  const currentSlug = currentPost.slug
  
  // Filter out current post
  const otherPosts = allPosts.filter(post => post.slug !== currentSlug)
  
  // Calculate relevance scores
  const scoredPosts = otherPosts.map(post => {
    let score = 0
    const postTags = post.frontMatter.tags || []
    
    // Tag similarity score (higher weight for more matching tags)
    const commonTags = currentTags.filter(tag => postTags.includes(tag))
    score += commonTags.length * 3
    
    // Bonus for having any tags in common
    if (commonTags.length > 0) {
      score += 2
    }
    
    // Date proximity bonus (newer posts get slight preference)
    const currentDate = new Date(currentPost.date).getTime()
    const postDate = new Date(post.frontMatter.date).getTime()
    const daysDiff = Math.abs(currentDate - postDate) / (1000 * 60 * 60 * 24)
    if (daysDiff < 30) score += 1
    
    // Author similarity bonus
    if (currentPost.author === post.frontMatter.author) {
      score += 1
    }
    
    return { ...post, score }
  })
  
  // Sort by score (descending) and take top results
  const topPosts = scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
  
  // If we don't have enough high-scoring posts, fill with random recent posts
  if (topPosts.length < maxResults) {
    const remainingPosts = otherPosts
      .filter(post => !topPosts.find(tp => tp.slug === post.slug))
      .sort((a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime())
      .slice(0, maxResults - topPosts.length)
    
    topPosts.push(...remainingPosts.map(post => ({ ...post, score: 0 })))
  }
  
  return topPosts
}

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = getAllPosts()
  
  return posts.map(post => ({
    slug: post.slug
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }
  
  return {
    title: post.frontMatter.title,
    description: post.frontMatter.excerpt,
    openGraph: {
      title: post.frontMatter.title,
      description: post.frontMatter.excerpt,
      type: 'article',
      publishedTime: post.frontMatter.date,
      tags: post.frontMatter.tags,
    }
  }
}

// Enhanced related posts component
function RelatedPosts({ currentPost, currentSlug }: { currentPost: BlogPost, currentSlug: string }) {
  const allPosts = getAllPosts()
  
  // First try manual related posts
  let relatedPosts = []
  if (currentPost.related && currentPost.related.length > 0) {
    relatedPosts = allPosts.filter(post => 
      currentPost.related.includes(post.slug) && post.slug !== currentSlug
    )
  }
  
  // If we don't have enough manual related posts, use smart algorithm
  if (relatedPosts.length < 3) {
    const smartRelated = getSmartRelatedPosts(currentPost, allPosts, 6)
    
    // Combine manual and smart related, avoiding duplicates
    const combinedSlugs = new Set(relatedPosts.map(p => p.slug))
    const additionalPosts = smartRelated.filter(post => !combinedSlugs.has(post.slug))
    
    relatedPosts = [...relatedPosts, ...additionalPosts].slice(0, 6)
  }
  
  // Randomize the display order to add variety
  const shuffledPosts = [...relatedPosts].sort(() => Math.random() - 0.5)
  
  // Show 2-3 posts by default, but allow expansion
  const displayPosts = shuffledPosts.slice(0, 3)
  
  if (displayPosts.length === 0) return null
  
  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
      <div className="grid gap-4">
        {displayPosts.map(post => (
          <Link 
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-blue-600 mb-2">{post.frontMatter.title}</h4>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.frontMatter.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {post.frontMatter.tags?.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      
      {shuffledPosts.length > 3 && (
        <div className="mt-4 text-center">
          <Link 
            href="/blog" 
            className="text-blue-600 hover:underline text-sm"
          >
            View more articles →
          </Link>
        </div>
      )}
    </div>
  )
}

// Simple markdown to HTML converter for basic content
function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>')
    .replace(/^(.*)$/gim, '<p>$1</p>')
    .replace(/<p><h/gim, '<h')
    .replace(/<\/h([1-6])><\/p>/gim, '</h$1>')
    .replace(/<p><\/p>/gim, '')
}

export default function BlogPost({ params }: PageProps) {
  const post = getPost(params.slug)
  
  if (!post) {
    notFound()
  }
  
  const { frontMatter, content } = post
  const htmlContent = markdownToHtml(content)
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold mb-4">{frontMatter.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
          <time dateTime={frontMatter.date}>
            {new Date(frontMatter.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          {frontMatter.author && (
            <span>by {frontMatter.author}</span>
          )}
        </div>
        {frontMatter.tags && (
          <div className="flex flex-wrap gap-2">
            {frontMatter.tags.map(tag => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>
      
      {/* Content */}
      <article 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      
      {/* Related Posts - Now always shows posts */}
      <RelatedPosts 
        currentPost={frontMatter}
        currentSlug={params.slug}
      />
    </div>
  )
}