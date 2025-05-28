import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 text-center md:px-8 lg:py-16">
      <h2 className="mb-2 text-3xl font-light tracking-tight text-gray-900 md:text-4xl">页面未找到</h2>
      <p className="mb-6 text-gray-600">抱歉，您要查找的页面不存在。</p>
      <Link
        href="/"
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
      >
        返回首页
      </Link>
    </div>
  )
}
