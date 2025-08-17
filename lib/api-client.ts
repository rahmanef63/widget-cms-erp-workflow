export interface ApiResponse<T = any> {
  data: T
  status: number
  message?: string
  errors?: string[]
}

class ApiError {
  status: number
  message: string
  errors?: string[]

  constructor({ status, message, errors }: { status: number; message: string; errors?: string[] }) {
    this.status = status
    this.message = message
    this.errors = errors
  }
}

export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
}

export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(baseUrl = "", defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    }
  }

  async request<T = any>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { method = "GET", headers = {}, body, timeout = 10000, retries = 0 } = config

    const url = `${this.baseUrl}${endpoint}`
    const requestHeaders = { ...this.defaultHeaders, ...headers }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    }

    if (body && method !== "GET") {
      requestConfig.body = typeof body === "string" ? body : JSON.stringify(body)
    }

    // Add timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    requestConfig.signal = controller.signal

    try {
      const response = await fetch(url, requestConfig)
      clearTimeout(timeoutId)

      let data: T
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        data = (await response.text()) as T
      }

      if (!response.ok) {
        throw new ApiError({
          status: response.status,
          message: `Request failed: ${response.statusText}`,
          errors: Array.isArray(data) ? data : [],
        })
      }

      return {
        data,
        status: response.status,
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        throw error
      }

      if (error.name === "AbortError") {
        throw new ApiError({
          status: 408,
          message: "Request timeout",
        })
      }

      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return this.request<T>(endpoint, { ...config, retries: retries - 1 })
      }

      throw new ApiError({
        status: 0,
        message: error.message || "Network error",
      })
    }
  }

  async get<T = any>(endpoint: string, config?: Omit<RequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" })
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "POST", body })
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PUT", body })
  }

  async delete<T = any>(endpoint: string, config?: Omit<RequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" })
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PATCH", body })
  }
}

// Default API client instance
export const apiClient = new ApiClient()

// Utility function to create API error
export function createApiError(status: number, message: string, errors?: string[]): ApiError {
  return new ApiError({ status, message, errors })
}
