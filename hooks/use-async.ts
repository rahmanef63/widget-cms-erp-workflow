"use client"

import { useState, useEffect, useCallback } from "react"

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
): AsyncState<T> & { execute: () => Promise<void> } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const data = await asyncFunction()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error })
    }
  }, dependencies)

  useEffect(() => {
    execute()
  }, [execute])

  return { ...state, execute }
}

export function useAsyncCallback<T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T,
): [T, AsyncState<Awaited<ReturnType<T>>>] {
  const [state, setState] = useState<AsyncState<Awaited<ReturnType<T>>>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: Parameters<T>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const data = await asyncFunction(...args)
        setState({ data, loading: false, error: null })
        return data
      } catch (error) {
        setState({ data: null, loading: false, error: error as Error })
        throw error
      }
    },
    [asyncFunction],
  ) as T

  return [execute, state]
}
