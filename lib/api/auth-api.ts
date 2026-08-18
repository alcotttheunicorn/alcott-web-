import apiClient from '@/lib/api-client'
import type { ApiResponse, MessageResponse, AuthResponse } from './types'

function authHeader(token: string) {
  const t = token.trim()
  return t.startsWith('Bearer ') ? t : `Bearer ${t}`
}

export async function signUp(email: string, password: string): Promise<MessageResponse> {
  const { data } = await apiClient.post('/auth/signup', { email, password })
  return data
}

export async function signIn(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
  const { data } = await apiClient.post('/auth/signin', { email, password })
  return data
}

export async function verifyEmail(email: string, otp: string): Promise<ApiResponse<AuthResponse>> {
  const { data } = await apiClient.post('/auth/verify-email', { email, otp })
  return data
}

export async function verifyPhone(phone_number: string, otp: string, token: string): Promise<MessageResponse> {
  const { data } = await apiClient.post('/auth/verify-phone', { phone_number, otp }, {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

export async function forgotPassword(email?: string, phone_number?: string): Promise<MessageResponse> {
  const { data } = await apiClient.post('/auth/forgot-password', { email, phone_number })
  return data
}

export async function resetPassword(email: string, otp: string, newPassword: string): Promise<MessageResponse> {
  const { data } = await apiClient.post('/auth/reset-password', { email, otp, new_password: newPassword })
  return data
}

export async function resendVerification(email: string): Promise<MessageResponse> {
  const { data } = await apiClient.post('/auth/resend-verification', { email })
  return data
}

export function getStoredAuthToken() {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem('authToken') ?? window.sessionStorage.getItem('authToken') ?? ''
}

export function getStoredAuthUser() {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem('authUser') ?? window.sessionStorage.getItem('authUser')
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}