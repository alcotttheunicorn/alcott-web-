import apiClient from '@/lib/api-client'
import type { ApiResponse, MessageResponse, AuthResponse } from './types'

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

export async function verifyPhone(phone_number: string, otp: string): Promise<MessageResponse> {
  const { data } = await apiClient.post('/auth/verify-phone', { phone_number, otp })
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