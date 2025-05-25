import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Programmatic Content System',
  description: 'A robust, code-centric system for automated content generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-gray-900">
                  Content System
                </a>
              </div>
              <div className="flex items-center space-x-8">
                <a href="/blog" className="text-gray-700 hover:text-gray-900">
                  Blog
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-50 border-t mt-16">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-600">
              © 2024 Programmatic Content System. Built with Next.js and MDX.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
} 