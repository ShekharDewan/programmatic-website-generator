import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { Metadata } from 'next'

interface BlogPost {
  title: string
  slug: string
  date: string
  excerpt: string
  tags: string[]
  author: string
}

export const metadata: Metadata = {
  title: 'Blog - All Posts',
  description: 'Browse all blog posts and articles',
}

function getAllPosts(): { slug: string; frontMatter: BlogPost }[] {
  const contentDir = path.join(process.cwd(), 'content/blog')
  
  if (!fs.existsSync(contentDir)) {
    return []
  }
  
  const files = fs.readdirSync(contentDir)
  
  const posts = files
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
  
  // Sort by date (newest first)
  return posts.sort((a, b) => 
    new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime()
  )
}

export default function BlogIndex() {
  const posts = getAllPosts()
  
  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No blog posts found.</p>
          <p className="text-sm text-gray-500">
            Run <code className="bg-gray-100 px-2 py-1 rounded">npm run generate</code> to create your first post.
          </p>
        </div>
      </div>
    )
  }
  
  // Get unique tags
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.frontMatter.tags || []))
  ).sort()
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-gray-600 text-lg">
          {posts.length} article{posts.length !== 1 ? 's' : ''} and growing
        </p>
      </header>
      
      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Browse by Topic</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Posts Grid */}
      <div className="grid gap-8">
        {posts.map(({ slug, frontMatter }) => (
          <article key={slug} className="border-b border-gray-200 pb-8 last:border-b-0">
            <Link href={`/blog/${slug}`} className="block group">
              <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                {frontMatter.title}
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {frontMatter.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <time dateTime={frontMatter.date}>
                  {new Date(frontMatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {frontMatter.author && <span>by {frontMatter.author}</span>}
                {frontMatter.tags && (
                  <div className="flex gap-2">
                    {frontMatter.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {frontMatter.tags.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{frontMatter.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
      
      {/* Stats */}
      <footer className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </footer>
    </div>
  )
}