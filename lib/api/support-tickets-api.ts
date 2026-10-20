import apiClient from '@/lib/api-client'
import type {
  SupportMessage,
  SupportSender,
  SupportTicket,
  SupportTicketStatus,
} from '@/lib/types/support-types'

// --- low-level helpers -----------------------------------------------------

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null
}

function pick(obj: Record<string, unknown> | null, keys: string[]): unknown {
  if (!obj) return undefined
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k]
  }
  return undefined
}

function str(v: unknown): string {
  if (typeof v === 'string') return v
  if (v == null) return ''
  return String(v)
}

function num(v: unknown): number | undefined {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v)
  return undefined
}


function findArray(body: unknown, keys: string[]): unknown[] {
  if (Array.isArray(body)) return body
  const o = asRecord(body)
  if (!o) return []
  for (const k of keys) if (Array.isArray(o[k])) return o[k]
  for (const k of ['data', 'result', 'payload']) {
    const inner = asRecord(o[k])
    if (inner) for (const kk of keys) if (Array.isArray(inner[kk])) return inner[kk]
    if (Array.isArray(o[k])) return o[k]
  }
  return []
}

function extractTicket(data: unknown): unknown {
  const body = asRecord(data)
  const inner = asRecord(body?.data)
  return pick(inner, ['ticket']) ?? body?.ticket ?? body?.data ?? data
}

function extractMessage(data: unknown): unknown {
  const body = asRecord(data)
  const inner = asRecord(body?.data)
  return pick(inner, ['message']) ?? body?.message ?? body?.data ?? data
}

// --- normalisers -----------------------------------------------------------

function normalizeStatus(v: unknown): SupportTicketStatus {
  const s = str(v).toUpperCase()
  if (s === 'CLOSED' || s === 'RESOLVED' || s === 'DONE' || s === 'ARCHIVED') return 'CLOSED'
  return 'OPEN'
}

function normalizeSender(v: unknown): SupportSender {
  const s = str(v).toUpperCase()
  if (s === 'USER' || s === 'CUSTOMER' || s === 'CLIENT') return 'USER'
  if (s === 'ADMIN' || s === 'AGENT' || s === 'SUPPORT' || s === 'STAFF') return 'ADMIN'
  return 'SYSTEM'
}

function normalizeTicket(raw: unknown): SupportTicket | null {
  const o = asRecord(raw)
  if (!o) return null
  const id = str(pick(o, ['id', 'ticketId', 'ticket_id', '_id']))
  if (!id) return null

  const latest = asRecord(pick(o, ['latest_message', 'latestMessage', 'last_message', 'lastMessage']))
  const user = asRecord(pick(o, ['user', 'owner', 'customer']))

  const preview =
    str(pick(o, ['latestMessagePreview', 'latest_message_preview', 'preview'])) ||
    (latest ? str(pick(latest, ['body', 'message', 'text', 'content'])) : '')
  const lastAt =
    str(pick(o, ['latest_message_at', 'latestMessageAt'])) ||
    (latest ? str(pick(latest, ['created_at', 'createdAt'])) : '')
  const fromAdminRaw = latest ? latest.is_admin ?? latest.isAdmin : undefined

  return {
    id,
    subject: str(pick(o, ['subject', 'title', 'topic'])) || 'Support conversation',
    status: normalizeStatus(pick(o, ['status'])),
    messageCount: num(pick(o, ['message_count', 'messageCount'])),
    latestMessagePreview: preview || undefined,
    latestMessageAt: lastAt || undefined,
    latestMessageFromAdmin: typeof fromAdminRaw === 'boolean' ? fromAdminRaw : undefined,
    createdAt: str(pick(o, ['created_at', 'createdAt'])),
    updatedAt: str(pick(o, ['updated_at', 'updatedAt'])),
    userId: user ? str(pick(user, ['id'])) || undefined : str(pick(o, ['user_id', 'userId'])) || undefined,
    userEmail: user ? str(pick(user, ['email'])) || undefined : undefined,
    userFirstName: user ? str(pick(user, ['first_name'])) || undefined : undefined,
    userLastName: user ? str(pick(user, ['last_name'])) || undefined : undefined,
  }
}

function normalizeMessage(raw: unknown): SupportMessage | null {
  const o = asRecord(raw)
  if (!o) return null
  const id = str(pick(o, ['id', 'messageId', 'message_id', '_id']))

  // `is_admin` is the real discriminator; fall back to a sender/role string.
  const isAdmin = o.is_admin ?? o.isAdmin
  let sender: SupportSender
  if (typeof isAdmin === 'boolean') {
    sender = isAdmin ? 'ADMIN' : 'USER'
  } else {
    sender = normalizeSender(
      pick(o, ['sender', 'senderType', 'sender_type', 'authorType', 'author_type', 'from', 'role', 'sentBy', 'sent_by']),
    )
  }

  const senderObj = asRecord(o.sender)
  const senderName = senderObj
    ? [str(senderObj.first_name), str(senderObj.last_name)].filter(Boolean).join(' ') || undefined
    : undefined

  return {
    id,
    ticketId: str(pick(o, ['ticket_id', 'ticketId'])),
    sender,
    text: str(pick(o, ['body', 'message', 'text', 'content'])),
    createdAt: str(pick(o, ['created_at', 'createdAt', 'timestamp', 'time'])),
    senderName,
  }
}

function toTickets(data: unknown): SupportTicket[] {
  return findArray(data, ['tickets', 'content', 'items', 'data', 'results', 'records'])
    .map(normalizeTicket)
    .filter((t): t is SupportTicket => t !== null)
}

function toMessages(data: unknown): SupportMessage[] {
  return findArray(data, ['messages', 'content', 'items', 'data'])
    .map(normalizeMessage)
    .filter((m): m is SupportMessage => m !== null)
}

// --- user endpoints --------------------------------------------------------

export async function listTickets(params?: {
  status?: SupportTicketStatus
  page?: number
  limit?: number
}): Promise<SupportTicket[]> {
  const { data } = await apiClient.get('/support/tickets', { params })
  return toTickets(data)
}

export async function createTicket(payload: { subject: string; message: string }): Promise<SupportTicket> {
  const { data } = await apiClient.post('/support/tickets', payload)
  const ticket = normalizeTicket(extractTicket(data))
  if (!ticket) throw new Error('Ticket created but the response could not be parsed.')
  return ticket
}

export async function getTicketMessages(ticketId: string, since?: string): Promise<SupportMessage[]> {
  const { data } = await apiClient.get(
    `/support/tickets/${encodeURIComponent(ticketId)}/messages`,
    { params: since ? { since } : undefined },
  )
  return toMessages(data)
}

export async function sendTicketMessage(ticketId: string, message: string): Promise<SupportMessage | null> {
  const { data } = await apiClient.post(
    `/support/tickets/${encodeURIComponent(ticketId)}/messages`,
    { message },
  )
  return normalizeMessage(extractMessage(data))
}

// --- admin endpoints -------------------------------------------------------

export async function listAdminTickets(params?: {
  status?: SupportTicketStatus
  page?: number
  limit?: number
  user_id?: string
}): Promise<SupportTicket[]> {
  const { data } = await apiClient.get('/admin/support/tickets', { params })
  return toTickets(data)
}

export async function getAdminTicketMessages(ticketId: string, since?: string): Promise<SupportMessage[]> {
  const { data } = await apiClient.get(
    `/admin/support/tickets/${encodeURIComponent(ticketId)}/messages`,
    { params: since ? { since } : undefined },
  )
  return toMessages(data)
}

export async function sendAdminTicketMessage(
  ticketId: string,
  message: string,
): Promise<SupportMessage | null> {
  const { data } = await apiClient.post(
    `/admin/support/tickets/${encodeURIComponent(ticketId)}/messages`,
    { message },
  )
  return normalizeMessage(extractMessage(data))
}

export async function closeAdminTicket(ticketId: string): Promise<SupportTicket | null> {
  const { data } = await apiClient.patch(`/admin/support/tickets/${encodeURIComponent(ticketId)}/close`)
  return normalizeTicket(extractTicket(data))
}

export async function reopenAdminTicket(ticketId: string): Promise<SupportTicket | null> {
  const { data } = await apiClient.patch(`/admin/support/tickets/${encodeURIComponent(ticketId)}/reopen`)
  return normalizeTicket(extractTicket(data))
}
