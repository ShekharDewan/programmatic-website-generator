interface ContentCardProps {
  title: string
  slug: string
  date: string
  excerpt?: string
  tags?: string[]
  contentType?: string
}

export default function ContentCard({ 
  title, 
  slug, 
  date, 
  excerpt, 
  tags = [], 
  contentType = 'blog' 
}: ContentCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <time className="text-sm text-gray-500">{formattedDate}</time>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-xs text-gray-500">+{tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        <a 
          href={`/${contentType}/${slug}`}
          className="hover:text-blue-600 transition-colors"
        >
          {title}
        </a>
      </h2>
      
      {excerpt && (
        <p className="text-gray-600 mb-4 line-clamp-3">
          {excerpt}
        </p>
      )}
      
      <a
        href={`/${contentType}/${slug}`}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        Read more
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </article>
  )
} 