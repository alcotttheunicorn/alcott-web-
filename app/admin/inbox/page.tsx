'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Inbox, Loader2, MessageSquare, Send, XCircle } from 'lucide-react'
import {
  useAdminSupportTicketMessages,
  useAdminSupportTickets,
  useCloseSupportTicket,
  useReopenSupportTicket,
  useSendAdminTicketMessage,
} from '@/hooks/use-support'
import { MessageBubble } from '@/components/support/MessageBubble'
import type { SupportTicket, SupportTicketStatus } from '@/lib/types/support-types'

function formatChatTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function StatusPill({ status }: { status: SupportTicketStatus }) {
  return status === 'OPEN' ? (
    <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
      Open
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
      Closed
    </span>
  )
}


export default function AdminSupportInboxPage() {
  const ticketsQuery = useAdminSupportTickets()
  const tickets = ticketsQuery.data ?? []

  const [filter, setFilter] = useState<'ALL' | SupportTicketStatus>('ALL')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = filter === 'ALL' ? tickets : tickets.filter((t) => t.status === filter)

  useEffect(() => {
    if (tickets.length === 0) {
      setSelectedId(null)
      return
    }
    setSelectedId((prev) => {
      if (prev && tickets.some((t) => t.id === prev)) return prev
      const firstOpen = tickets.find((t) => t.status === 'OPEN')
      return firstOpen?.id ?? tickets[0].id
    })
  }, [tickets])

  const activeTicket: SupportTicket | null =
    tickets.find((t) => t.id === selectedId) ?? null
  const closed = activeTicket?.status === 'CLOSED'

  const messagesQuery = useAdminSupportTicketMessages(selectedId)
  const messages = messagesQuery.data ?? []
  const sendMessage = useSendAdminTicketMessage(selectedId)
  const closeTicket = useCloseSupportTicket()
  const reopenTicket = useReopenSupportTicket()

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  const [draft, setDraft] = useState('')
  const [mobileShowConversation, setMobileShowConversation] = useState(false)

  const counts = {
    ALL: tickets.length,
    OPEN: tickets.filter((t) => t.status === 'OPEN').length,
    CLOSED: tickets.filter((t) => t.status === 'CLOSED').length,
  }

  function submit() {
    const text = draft.trim()
    if (!text || !selectedId || closed) return
    sendMessage.mutate(text, { onSuccess: () => setDraft('') })
  }

  return (
    <div className="space-y-6">
      {/* Header + status filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Inbox</h1>
          <p className="text-sm text-muted-foreground">User support tickets</p>
        </div>
        <div className="inline-flex rounded-lg border bg-muted/30 p-1">
          {(['ALL', 'OPEN', 'CLOSED'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                filter === f ? 'bg-background shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'ALL' ? 'All' : f === 'OPEN' ? 'Open' : 'Closed'}
              <span className="ml-1 text-muted-foreground">{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {ticketsQuery.isError && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load tickets.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,340px)_1fr]">
        {/* Ticket list */}
        <aside
          className={`flex flex-col rounded-xl border bg-card ${
            mobileShowConversation ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="max-h-[520px] overflow-y-auto">
            {ticketsQuery.isLoading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
            {!ticketsQuery.isLoading && filtered.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">No tickets.</div>
            )}
            {filtered.map((t) => {
              const active = t.id === selectedId
              const awaiting = t.status === 'OPEN' && t.latestMessageFromAdmin
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedId(t.id)
                    setMobileShowConversation(true)
                  }}
                  className={`flex w-full flex-col gap-1 border-b px-4 py-3 text-left transition hover:bg-accent/40 ${
                    active ? 'bg-accent/60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">
                      {t.subject || 'Support conversation'}
                    </span>
                    <StatusPill status={t.status} />
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {t.userFirstName || t.userEmail || 'Customer'}
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted-foreground/90">
                      {t.latestMessagePreview ?? '—'}
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-foreground/70">
                      {t.latestMessageAt ? formatChatTime(t.latestMessageAt) : ''}
                    </span>
                  </div>
                  {awaiting && (
                    <span className="w-fit rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      Awaiting reply
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </aside>

        {/* Conversation */}
        <section
          className={`flex min-h-[520px] flex-col rounded-xl border bg-card ${
            mobileShowConversation ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {!activeTicket ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-muted-foreground">
              <Inbox className="h-10 w-10" />
              <p>Select a ticket to view the conversation.</p>
            </div>
          ) : (
            <>
              {/* Conversation header */}
              <div className="flex items-center justify-between gap-3 border-b p-4">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold">
                    {activeTicket.subject || 'Support conversation'}
                  </h2>
                  <p className="truncate text-xs text-muted-foreground">
                    {[activeTicket.userFirstName, activeTicket.userLastName].filter(Boolean).join(' ')}
                    {activeTicket.userEmail ? ` · ${activeTicket.userEmail}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusPill status={activeTicket.status} />
                  {closed ? (
                    <button
                      type="button"
                      onClick={() => reopenTicket.mutate(activeTicket.id)}
                      disabled={reopenTicket.isPending}
                      className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold transition hover:bg-accent disabled:opacity-50"
                    >
                      {reopenTicket.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                      Reopen
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => closeTicket.mutate(activeTicket.id)}
                      disabled={closeTicket.isPending}
                      className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                    >
                      {closeTicket.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      Close
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMobileShowConversation(false)}
                    className="text-xs text-muted-foreground hover:text-foreground lg:hidden"
                  >
                    ← Back
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
                {messagesQuery.isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-muted-foreground">
                    <MessageSquare className="h-6 w-6" />
                    No messages yet.
                  </div>
                ) : (
                  messages.map((m, i) => <MessageBubble key={m.id || i} message={m} />)
                )}
              </div>

              {/* Composer */}
              {closed ? (
                <div className="border-t p-4">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <XCircle className="h-4 w-4" />
                    This ticket is closed. Reopen it to reply.
                  </p>
                </div>
              ) : (
                <div className="border-t p-3">
                  {sendMessage.isError && (
                    <p className="mb-1 px-1 text-xs text-destructive">
                      {(sendMessage.error as Error)?.message ?? 'Failed to send.'}
                    </p>
                  )}
                  <div className="flex items-end gap-2">
                    <textarea
                      dir="ltr"
                      value={draft}
                      rows={2}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          submit()
                        }
                      }}
                      placeholder="Reply to this customer…"
                      className="min-h-0 flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={submit}
                      disabled={!draft.trim() || sendMessage.isPending}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition disabled:opacity-50"
                      aria-label="Send reply"
                    >
                      {sendMessage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
