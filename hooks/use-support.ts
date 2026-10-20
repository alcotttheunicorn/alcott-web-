'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import {
  closeAdminTicket,
  createTicket,
  getAdminTicketMessages,
  getTicketMessages,
  listAdminTickets,
  listTickets,
  reopenAdminTicket,
  sendAdminTicketMessage,
  sendTicketMessage,
} from '@/lib/api/support-tickets-api'
import { queryKeys } from '@/components/providers/query-provider'


const POLL_MS = 15000

// ---------------------------------------------------------------------------
// User — /api/support/tickets
// ---------------------------------------------------------------------------

export function useSupportTickets() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: queryKeys.support.tickets,
    queryFn: () => listTickets(),
    enabled: isAuthenticated,
    refetchInterval: POLL_MS,
  })
}

export function useSupportTicketMessages(ticketId: string | null) {
  return useQuery({
    queryKey: queryKeys.support.ticketMessages(ticketId ?? ''),
    queryFn: () => getTicketMessages(ticketId!),
    enabled: Boolean(ticketId),
    refetchInterval: POLL_MS,
  })
}

export function useCreateSupportTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { subject: string; message: string }) => createTicket(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['support'] }),
  })
}

export function useSendTicketMessage(ticketId: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (text: string) => {
      if (!ticketId) throw new Error('No ticket selected')
      return sendTicketMessage(ticketId, text)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['support'] }),
  })
}


export function useInboxUnread(): boolean {
  const { isAuthenticated } = useAuth()
  const { data } = useQuery({
    queryKey: queryKeys.support.tickets,
    queryFn: () => listTickets(),
    enabled: isAuthenticated,
    refetchInterval: POLL_MS,
  })
  return (data ?? []).some((t) => t.status === 'OPEN' && t.latestMessageFromAdmin === true)
}

// ---------------------------------------------------------------------------
// Admin — /api/admin/support/tickets
// ---------------------------------------------------------------------------

export function useAdminSupportTickets() {
  return useQuery({
    queryKey: queryKeys.support.adminTickets,
    queryFn: () => listAdminTickets(),
    refetchInterval: POLL_MS,
  })
}

export function useAdminSupportTicketMessages(ticketId: string | null) {
  return useQuery({
    queryKey: queryKeys.support.adminTicketMessages(ticketId ?? ''),
    queryFn: () => getAdminTicketMessages(ticketId!),
    enabled: Boolean(ticketId),
    refetchInterval: POLL_MS,
  })
}

export function useSendAdminTicketMessage(ticketId: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (text: string) => {
      if (!ticketId) throw new Error('No ticket selected')
      return sendAdminTicketMessage(ticketId, text)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['support', 'admin'] }),
  })
}

export function useCloseSupportTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ticketId: string) => closeAdminTicket(ticketId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['support', 'admin'] }),
  })
}

export function useReopenSupportTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ticketId: string) => reopenAdminTicket(ticketId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['support', 'admin'] }),
  })
}
