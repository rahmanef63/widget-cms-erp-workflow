export interface StorageAdapter {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
  keys(): string[]
}

export class LocalStorageAdapter implements StorageAdapter {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn("Failed to save to localStorage:", error)
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key)
  }

  clear(): void {
    localStorage.clear()
  }

  keys(): string[] {
    return Object.keys(localStorage)
  }
}

export class MemoryStorageAdapter implements StorageAdapter {
  private storage = new Map<string, any>()

  get<T>(key: string): T | null {
    return this.storage.get(key) || null
  }

  set<T>(key: string, value: T): void {
    this.storage.set(key, value)
  }

  remove(key: string): void {
    this.storage.delete(key)
  }

  clear(): void {
    this.storage.clear()
  }

  keys(): string[] {
    return Array.from(this.storage.keys())
  }
}

export class StorageManager {
  private adapter: StorageAdapter

  constructor(adapter?: StorageAdapter) {
    this.adapter = adapter || new LocalStorageAdapter()
  }

  get<T>(key: string, defaultValue?: T): T | null {
    const value = this.adapter.get<T>(key)
    return value !== null ? value : defaultValue || null
  }

  set<T>(key: string, value: T): void {
    this.adapter.set(key, value)
  }

  remove(key: string): void {
    this.adapter.remove(key)
  }

  clear(): void {
    this.adapter.clear()
  }

  keys(): string[] {
    return this.adapter.keys()
  }

  // Utility methods for common patterns
  getWithExpiry<T>(key: string): T | null {
    const item = this.adapter.get<{ value: T; expiry: number }>(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      this.adapter.remove(key)
      return null
    }

    return item.value
  }

  setWithExpiry<T>(key: string, value: T, ttlMs: number): void {
    const expiry = Date.now() + ttlMs
    this.adapter.set(key, { value, expiry })
  }
}

// Default storage instance
export const storage = new StorageManager()
