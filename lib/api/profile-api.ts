import apiClient from '@/lib/api-client'
import type { ApiResponse, MessageResponse, ProfileData } from './types'

export async function getProfile(): Promise<ApiResponse<ProfileData>> {
  const { data } = await apiClient.get('/profile')
  return data
}

export async function setupProfile(formData: FormData): Promise<ApiResponse<ProfileData>> {
  const { data } = await apiClient.post('/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateProfile(formData: FormData): Promise<ApiResponse<ProfileData>> {
  const { data } = await apiClient.patch('/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function resendPhoneOtp(): Promise<MessageResponse> {
  const { data } = await apiClient.post('/profile/resend-phone-otp')
  return data
}