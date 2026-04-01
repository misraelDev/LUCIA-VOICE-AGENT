'use client'

import { useState, useCallback } from 'react'

interface RateLimitError {
    message: string
    resetTime: string
    type: 'rate_limit'
}

export function useRateLimit() {
    const [isRateLimited, setIsRateLimited] = useState(false)
    const [rateLimitData, setRateLimitData] = useState<RateLimitError | null>(null)

    const handleApiCall = useCallback(async (apiCall: () => Promise<Response>) => {
        try {
            const response = await apiCall()
            
            if (response.status === 429) {
                const errorData = await response.json()
                if (errorData.type === 'rate_limit') {
                    setRateLimitData(errorData)
                    setIsRateLimited(true)
                    return null
                }
            }
            
            return response
        } catch (error) {
            throw error
        }
    }, [])

    const closeRateLimitModal = useCallback(() => {
        setIsRateLimited(false)
        setRateLimitData(null)
    }, [])

    return {
        isRateLimited,
        rateLimitData,
        handleApiCall,
        closeRateLimitModal
    }
}