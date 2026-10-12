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

export async function verifyPhone(_phone_number?: string, _otp?: string): Promise<MessageResponse> {
  return Promise.reject(new Error('Phone verification has been removed'))
}

export async function forgotPassword(email: string): Promise<MessageResponse> {
  const { data } = await apiClient.post('/auth/forgot-password', { email })
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