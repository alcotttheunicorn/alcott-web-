export type SupportTicketStatus = 'OPEN' | 'CLOSED'

export type SupportSender = 'USER' | 'ADMIN' | 'SYSTEM'

export interface SupportMessage {
  id: string
  ticketId: string
  sender: SupportSender
  text: string
  createdAt: string
  senderName?: string
}

export interface SupportTicket {
  id: string
  subject: string
  status: SupportTicketStatus
  messageCount?: number
  latestMessagePreview?: string
  latestMessageAt?: string
  latestMessageFromAdmin?: boolean
  createdAt: string
  updatedAt: string
  userId?: string
  userEmail?: string
  userFirstName?: string
  userLastName?: string
}
