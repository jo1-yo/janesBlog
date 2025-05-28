import { BlogPostCard } from "@/components/blog-post-card"
import { getAllPosts, Post } from "@/lib/blog-data"
import { PinIcon } from "lucide-react"

export default async function Home() {
  const posts: Post[] = await getAllPosts()
  
  // Find the welcome post to pin at the top
  const welcomePost = posts.find(post => post.slug === 'welcome-to-my-blog')
  // Filter out the welcome post from the regular posts list
  const regularPosts = posts.filter(post => post.slug !== 'welcome-to-my-blog')

  return (
    <main className="min-h-screen bg-white px-4 py-12 md:px-8 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-light tracking-tight text-gray-900 md:text-5xl">Jane's Blog</h1>
          <p className="text-lg text-gray-500">Ideas are spreading.</p>
        </header>

        <div className="space-y-10">
          {/* Pinned welcome post */}
          {welcomePost && (
            <div className="relative">
              <BlogPostCard 
                post={welcomePost} 
                className="border-blue-200"
                isPinned={true}
              />
            </div>
          )}
          
          {/* Regular posts */}
          {regularPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}
