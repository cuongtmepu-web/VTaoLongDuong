export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  errors?: string[]
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

export interface SelectOption {
  value: string | number
  label: string
}
