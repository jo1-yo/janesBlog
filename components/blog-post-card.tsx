import Link from "next/link"
import Image from "next/image"
import { CalendarIcon, Clock3Icon, PinIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/blog-data"

interface BlogPostCardProps {
  post: Post
  className?: string
  isPinned?: boolean
}

export function BlogPostCard({ post, className, isPinned = false }: BlogPostCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md w-full relative",
        className,
      )}
    >
      {isPinned && (
        <div className="absolute top-4 right-4 z-10 transform rotate-12">
          <PinIcon className="h-5 w-5 text-blue-600" />
        </div>
      )}
      <Link href={`/blog/${post.slug}`} className="flex flex-col md:flex-row">
        <div className="relative h-56 w-full md:h-64 md:w-1/4">
          <Image
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-6 md:p-8">
          <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3Icon className="h-4 w-4" />
              {post.readingTime} min read
            </span>
          </div>
          <h2 className="mb-3 text-xl font-semibold tracking-tight text-gray-900 md:text-2xl">{post.title}</h2>
          <p className="mb-4 flex-1 text-base leading-relaxed text-gray-600">{post.excerpt}</p>
          <div className="mt-auto">
            <span className="text-sm font-medium text-blue-600 transition-colors group-hover:text-blue-500">
              Continue reading →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
