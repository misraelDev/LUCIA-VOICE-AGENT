import NodeCache from 'node-cache'

// Cache con TTL de 24 horas (86400 segundos)
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 })

const MAX_CALLS_PER_IP = 6

export interface RateLimitResult {
    allowed: boolean
    remaining: number
    resetTime: Date
}

export function checkRateLimit(ip: string): RateLimitResult {
    const key = `calls_${ip}`
    const currentCount = cache.get<number>(key) || 0
    
    if (currentCount >= MAX_CALLS_PER_IP) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: new Date(Date.now() + cache.getTtl(key)! - Date.now())
        }
    }
    
    // Incrementar contador
    cache.set(key, currentCount + 1)
    
    return {
        allowed: true,
        remaining: MAX_CALLS_PER_IP - (currentCount + 1),
        resetTime: new Date(Date.now() + 86400000) // 24 horas desde ahora
    }
}

export function getRealIP(request: Request): string {
    // Obtener IP real considerando proxies y load balancers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const cfConnectingIP = request.headers.get('cf-connecting-ip') // Cloudflare
    
    if (cfConnectingIP) return cfConnectingIP
    if (realIP) return realIP
    if (forwarded) return forwarded.split(',')[0].trim()
    
    // Fallback para desarrollo local
    return 'localhost'
}