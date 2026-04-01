// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '' // URL vacía para endpoints locales

// Tipos para las respuestas de email
export interface EmailResponse {
  success: boolean
  message: string
  data?: unknown
  email?: string
}

export interface EmailConfirmationRequest {
  email: string
  token?: string
}

export interface EmailVerificationRequest {
  email: string
  token: string
}

// Cliente del servicio de email
class EmailService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Email service request failed:', error)
      throw error
    }
  }

  /**
   * Envía email de confirmación
   * @param data - Datos del email de confirmación
   * @returns EmailResponse con el resultado
   */
  async sendConfirmationEmail(data: EmailConfirmationRequest): Promise<EmailResponse> {
    return this.request<EmailResponse>('/api/email/confirm', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Verifica el email con el token
   * @param data - Datos de verificación del email
   * @returns EmailResponse con el resultado
   */
  async verifyEmail(data: EmailVerificationRequest): Promise<EmailResponse> {
    console.log('EmailService.verifyEmail - Datos recibidos:', data)
    
    console.log('EmailService.verifyEmail - URL:', `${this.baseUrl}/api/auth/email/verify`)
    
    // Verificar que el token esté presente antes de enviar
    if (!data.token) {
      throw new Error('Token de verificación es requerido')
    }
    
    // Enviar tanto el email como el token en el body
    return this.request<EmailResponse>('/api/auth/email/verify', {
      method: 'POST',
      body: JSON.stringify({ 
        email: data.email,
        token: data.token
      }),
    })
  }

  /**
   * Reenvía email de confirmación
   * @param email - Email del usuario
   * @returns EmailResponse con el resultado
   */
  async resendConfirmationEmail(email: string): Promise<EmailResponse> {
    return this.request<EmailResponse>('/api/email/resend', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  /**
   * Envía email de recuperación de contraseña
   * @param email - Email del usuario
   * @returns EmailResponse con el resultado
   */
  async sendPasswordResetEmail(email: string): Promise<EmailResponse> {
    return this.request<EmailResponse>('/api/email/password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  /**
   * Verifica el token de recuperación de contraseña
   * @param token - Token de recuperación
   * @returns EmailResponse con el resultado
   */
  async verifyPasswordResetToken(token: string): Promise<EmailResponse> {
    return this.request<EmailResponse>('/api/email/verify-password-reset', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  }

  /**
   * Prueba de conexión al servicio de email
   * @returns EmailResponse con el estado del servicio
   */
  async healthCheck(): Promise<EmailResponse> {
    return this.request<EmailResponse>('/api/email/health')
  }
}

// Instancia del servicio de email
export const emailService = new EmailService(API_BASE_URL)
