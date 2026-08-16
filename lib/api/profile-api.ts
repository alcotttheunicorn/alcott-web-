import apiClient from '@/lib/api-client'
import type { ApiResponse, MessageResponse, ProfileData } from './types'

function authHeader(token: string) {
  const t = token.trim()
  return t.startsWith('Bearer ') ? t : `Bearer ${t}`
}

export async function getProfile(token: string): Promise<ApiResponse<ProfileData>> {
  const { data } = await apiClient.get('/profile', {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

export async function setupProfile(token: string, formData: FormData): Promise<ApiResponse<ProfileData>> {
  const { data } = await apiClient.post('/profile', formData, {
    headers: {
      Authorization: authHeader(token),
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export async function updateProfile(token: string, formData: FormData): Promise<ApiResponse<ProfileData>> {
  const { data } = await apiClient.patch('/profile', formData, {
    headers: {
      Authorization: authHeader(token),
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export async function resendPhoneOtp(token: string): Promise<MessageResponse> {
  const { data } = await apiClient.post('/profile/resend-phone-otp', null, {
    headers: { Authorization: authHeader(token) },
  })
  return data
}