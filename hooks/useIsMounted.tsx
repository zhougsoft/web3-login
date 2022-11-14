import { useState, useEffect } from 'react'

export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  return isMounted
}
