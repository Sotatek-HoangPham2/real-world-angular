export interface LoadingState<T> {
  data?: T
  status: 'initial' | 'loading' | 'success' | 'error'
  error?: any
}

export interface CommonFilters {
  q?: string,
  page?: string,
  limit?: string,
}