export interface BlogCategory {
  categoryId: number
  categoryName: string
  slug: string
  description?: string
  parentId?: number
  isActive: boolean
  sortOrder: number
  children?: BlogCategory[]
}

export interface BlogPost {
  postId: number
  categoryId: number
  categoryName: string
  title: string
  slug: string
  summary?: string
  content: string
  featuredImageUrl?: string
  authorId: number
  authorName: string
  views: number
  likes: number
  isFeatured: boolean
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  commentCount: number
  comments?: BlogComment[]
}

export interface BlogComment {
  commentId: number
  userId: number
  userName: string
  content: string
  createdAt: string
  replies?: BlogComment[]
}

export interface CreateBlogPostRequest {
  categoryId: number
  title: string
  slug: string
  summary?: string
  content: string
  featuredImageUrl?: string
  isFeatured: boolean
  isPublished: boolean
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {}
