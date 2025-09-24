import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PropFirm Trading Blog - Expert Tips & Strategies',
  description: 'Learn propfirm trading strategies, copy trading techniques, and risk management from industry experts.',
  keywords: 'propfirm trading, copy trading, forex, FTMO, 5%ers, risk management',
}

const blogPosts = [
  {
    id: 1,
    title: 'Complete Guide to PropFirm Copy Trading',
    excerpt: 'Learn how to effectively copy trade across multiple propfirm accounts while maintaining compliance.',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Strategy'
  },
  {
    id: 2,
    title: 'Risk Management for PropFirm Traders',
    excerpt: 'Essential risk management techniques to pass propfirm challenges and maintain funded accounts.',
    date: '2024-01-12',
    readTime: '6 min read',
    category: 'Risk Management'
  },
  {
    id: 3,
    title: 'FTMO vs 5%ers: Which PropFirm is Better?',
    excerpt: 'Comprehensive comparison of popular propfirms and their copy trading policies.',
    date: '2024-01-10',
    readTime: '10 min read',
    category: 'Reviews'
  }
]

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">PropFirm Trading Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Expert insights, strategies, and tools for successful propfirm trading
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">{post.readTime}</span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600">
                <a href={`/blog/${post.id}`}>{post.title}</a>
              </h2>
              
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{post.date}</span>
                <a href={`/blog/${post.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                  Read more →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Trading Tools</h2>
        <p className="text-gray-600 mb-6">
          Access our collection of free tools to improve your trading performance
        </p>
        <a href="/blog/tools" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Explore Tools
        </a>
      </div>
    </div>
  )
}
