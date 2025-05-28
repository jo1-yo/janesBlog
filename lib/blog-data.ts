import fs from 'fs/promises'  // 异步文件系统API
import path from 'path'
import matter from 'gray-matter'

export type Post = {
  slug: string
  title: string
  date: string
  author: string
  excerpt: string
  content: string
  coverImage?: string
  readingTime?: string
}

const postsDirectory = path.join(process.cwd(), 'content')

// Create content directory if it doesn't exist
try {
  fs.mkdir(postsDirectory, { recursive: true }).catch(err => {
    console.error('Failed to create content directory:', err)
  })
} catch (error) {
  console.error('Failed to create content directory:', error)
}

// For both server and client components (async)
export async function getAllPosts(): Promise<Post[]> {
  try {
    // Check if directory exists
    try {
      await fs.access(postsDirectory)
    } catch (error) {
      // Create directory if it doesn't exist
      await fs.mkdir(postsDirectory, { recursive: true })
      return [] // Return empty array if no posts yet
    }
    
    const filenames = await fs.readdir(postsDirectory)
    
    if (filenames.length === 0) {
      return [] // Return empty array if no posts
    }
    
    const posts = await Promise.all(
      filenames.map(async (filename) => {
        if (!filename.endsWith('.md')) return null
        
        const slug = filename.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, filename)
        const fileContents = await fs.readFile(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          slug,
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString().split('T')[0],
          author: data.author || 'Anonymous',
          excerpt: data.excerpt || '',
          content,
          coverImage: data.coverImage || '',
          readingTime: data.readingTime || '5',
        }
      })
    )

    // Filter out null values and sort by date
    return posts
      .filter(post => post !== null)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch (error) {
    console.error('Error getting posts:', error)
    return [] // Return empty array on error
  }
}

// Add a new post
export async function addPost(postData: any): Promise<void> {
  // Ensure content directory exists
  try {
    await fs.access(postsDirectory)
  } catch (error) {
    await fs.mkdir(postsDirectory, { recursive: true })
  }

  const { slug, title, date, author, excerpt, content, coverImage, readingTime } = postData
  
  // Create frontmatter
  const frontmatter = {
    title,
    date,
    author,
    excerpt,
    coverImage: coverImage || '',
    readingTime: readingTime || '5'
  }
  
  // Convert content to string if it's an array
  const contentStr = Array.isArray(content) ? content.join('\n\n') : content
  
  // Create markdown content with frontmatter
  const fileContent = matter.stringify(contentStr, frontmatter)
  
  // Write to file
  const filePath = path.join(postsDirectory, `${slug}.md`)
  await fs.writeFile(filePath, fileContent, 'utf8')
}

// Update an existing post
export async function updatePost(postData: any): Promise<void> {
  const { slug, title, date, author, excerpt, content, coverImage, readingTime } = postData
  
  // Create frontmatter
  const frontmatter = {
    title,
    date,
    author,
    excerpt,
    coverImage: coverImage || '',
    readingTime: readingTime || '5'
  }
  
  // Convert content to string if it's an array
  const contentStr = Array.isArray(content) ? content.join('\n\n') : content
  
  // Create markdown content with frontmatter
  const fileContent = matter.stringify(contentStr, frontmatter)
  
  // Write to file
  const filePath = path.join(postsDirectory, `${slug}.md`)
  await fs.writeFile(filePath, fileContent, 'utf8')
}

// Delete a post
export async function deletePost(slug: string): Promise<void> {
  const filePath = path.join(postsDirectory, `${slug}.md`)
  await fs.unlink(filePath)
}
