import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PropFirm Trading Blog - Tips, Strategies & Tools',
  description: 'Expert insights on propfirm trading, copy trading strategies, risk management, and free trading tools.',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-xl font-semibold text-gray-900">PropFirm Copier</a>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/blog" className="text-gray-700 hover:text-gray-900">Blog</a>
              <a href="/blog/tools" className="text-gray-700 hover:text-gray-900">Free Tools</a>
              <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded">Dashboard</a>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
