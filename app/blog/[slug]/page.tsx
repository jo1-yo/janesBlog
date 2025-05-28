import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarIcon, Clock3Icon, User2Icon } from "lucide-react"
import { getPostBySlug } from "@/lib/blog-data"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white px-4 py-12 md:px-8 lg:py-16">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回首页
        </Link>

        <div className="mb-8 overflow-hidden rounded-xl">
          <Image
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            width={1200}
            height={630}
            className="h-auto w-full object-cover"
          />
        </div>

        <header className="mb-8 border-b border-gray-100 pb-8">
          <h1 className="mb-4 text-3xl font-light tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User2Icon className="h-4 w-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-1">
              <Clock3Icon className="h-4 w-4" />
              {post.readingTime} 分钟阅读
            </div>
          </div>
        </header>

        <div className="prose prose-gray max-w-none">
          {post.content.map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  )
}
