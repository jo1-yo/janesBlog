"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getAllPosts, addPost, updatePost, deletePost } from "@/lib/blog-data"
import type { Post } from "@/lib/blog-data"

export default function AdminPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    date: new Date().toISOString().split("T")[0],
    author: "",
    excerpt: "",
    readingTime: 5,
    coverImage: "/placeholder.svg?height=630&width=1200",
    content: [""],
  })

  useEffect(() => {
    // Fetch all posts
    const fetchPosts = async () => {
      const allPosts = await getAllPosts()
      setPosts(allPosts)
    }
    fetchPosts()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Split content into paragraphs
    const paragraphs = e.target.value.split("\n\n").filter((p) => p.trim() !== "")
    setFormData((prev) => ({ ...prev, content: paragraphs }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && selectedPost) {
        // Update existing post
        await updatePost({ ...formData, slug: selectedPost.slug })
      } else {
        // Add new post
        await addPost(formData)
      }

      // Reset form and refresh post list
      setFormData({
        slug: "",
        title: "",
        date: new Date().toISOString().split("T")[0],
        author: "",
        excerpt: "",
        readingTime: 5,
        coverImage: "/placeholder.svg?height=630&width=1200",
        content: [""],
      })
      setIsEditing(false)
      setSelectedPost(null)

      // Refresh post list
      const updatedPosts = await getAllPosts()
      setPosts(updatedPosts)
      router.refresh()
    } catch (error) {
      console.error("Failed to save post:", error)
      alert("Failed to save post. Please try again.")
    }
  }

  const handleEdit = (post: Post) => {
    setSelectedPost(post)
    setIsEditing(true)
    setFormData({
      ...post,
      content: post.content,
    })
  }

  const handleDelete = async (slug: string) => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        await deletePost(slug)
        const updatedPosts = await getAllPosts()
        setPosts(updatedPosts)
        router.refresh()
      } catch (error) {
        console.error("Failed to delete post:", error)
        alert("Failed to delete post. Please try again.")
      }
    }
  }

  const handleNewPost = () => {
    setSelectedPost(null)
    setIsEditing(false)
    setFormData({
      slug: "",
      title: "",
      date: new Date().toISOString().split("T")[0],
      author: "",
      excerpt: "",
      readingTime: 5,
      coverImage: "/placeholder.svg?height=630&width=1200",
      content: [""],
    })
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-light tracking-tight text-gray-900">Blog Admin Panel</h1>
            <Button onClick={handleNewPost} className="bg-gray-900 hover:bg-gray-800">
              New Post
            </Button>
          </div>
          <p className="mt-2 text-gray-500">Manage your blog posts</p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Post List */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-xl font-medium text-gray-900">Posts</h2>
              <div className="space-y-2">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div
                      key={post.slug}
                      className="flex items-center justify-between rounded-md border border-gray-100 p-3 hover:bg-gray-50"
                    >
                      <button
                        onClick={() => handleEdit(post)}
                        className="flex-1 text-left text-sm font-medium text-gray-900 hover:text-gray-600"
                      >
                        {post.title}
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="ml-2 text-sm text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No posts yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-medium text-gray-900">{isEditing ? "Edit Post" : "New Post"}</h2>

              <div className="mb-4">
                <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                  Post Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-700">
                  Post Slug (URL)
                </label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  disabled={isEditing}
                  className="w-full"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {isEditing ? "Slug cannot be changed in edit mode" : "Slug can only contain letters, numbers, and hyphens, e.g., my-blog-post"}
                </p>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="author" className="mb-1 block text-sm font-medium text-gray-700">
                    Author
                  </label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
                    Publish Date
                  </label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="readingTime" className="mb-1 block text-sm font-medium text-gray-700">
                    Reading Time (minutes)
                  </label>
                  <Input
                    id="readingTime"
                    name="readingTime"
                    type="number"
                    min="1"
                    value={formData.readingTime}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="coverImage" className="mb-1 block text-sm font-medium text-gray-700">
                    Cover Image URL
                  </label>
                  <Input
                    id="coverImage"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="excerpt" className="mb-1 block text-sm font-medium text-gray-700">
                  Post Excerpt
                </label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  className="h-20 w-full"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700">
                  Post Content
                </label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content.join("\n\n")}
                  onChange={handleContentChange}
                  required
                  className="h-64 w-full"
                />
                <p className="mt-1 text-xs text-gray-500">Separate paragraphs by empty lines (two consecutive newlines)</p>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setSelectedPost(null)
                    setFormData({
                      slug: "",
                      title: "",
                      date: new Date().toISOString().split("T")[0],
                      author: "",
                      excerpt: "",
                      readingTime: 5,
                      coverImage: "/placeholder.svg?height=630&width=1200",
                      content: [""],
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
                  {isEditing ? "Update Post" : "Publish Post"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
