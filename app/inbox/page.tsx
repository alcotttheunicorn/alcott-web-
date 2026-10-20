'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { MessageBubble } from '@/components/support/MessageBubble'
import { formatChatTime } from '@/lib/format-date'
import {
  useCreateSupportTicket,
  useSendTicketMessage,
  useSupportTicketMessages,
  useSupportTickets,
} from '@/hooks/use-support'
import type { SupportTicketStatus } from '@/lib/types/support-types'

function StatusPill({ status }: { status: SupportTicketStatus }) {
  const open = status === 'OPEN'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        open ? 'bg-[#eafff2] text-[#0a7d38]' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {open ? 'Open' : 'Closed'}
    </span>
  )
}

export default function InboxPage() {
  const { data: tickets, isLoading: ticketsLoading } = useSupportTickets()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [composing, setComposing] = useState(false)

  const { data: messages, isLoading: messagesLoading } = useSupportTicketMessages(
    composing ? null : activeId,
  )
  const sendMessage = useSendTicketMessage(composing ? null : activeId)
  const createTicket = useCreateSupportTicket()

  const [draft, setDraft] = useState('')
  const [subject, setSubject] = useState('')
  const [firstMessage, setFirstMessage] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const activeTicket = useMemo(
    () => (tickets ?? []).find((t) => t.id === activeId) ?? null,
    [tickets, activeId],
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages?.length, sendMessage.isPending])

  // Default-select the most recent ticket once the list arrives.
  useEffect(() => {
    if (!activeId && !composing && tickets && tickets.length > 0) {
      setActiveId(tickets[0].id)
    }
  }, [tickets, activeId, composing])

  const closed = activeTicket?.status === 'CLOSED'
  const showList = !activeId && !composing

  function send() {
    const trimmed = draft.trim()
    if (!trimmed || sendMessage.isPending || !activeId || closed) return
    sendMessage.mutate(trimmed, { onSuccess: () => setDraft('') })
  }

  function submitNew(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !firstMessage.trim() || createTicket.isPending) return
    createTicket.mutate(
      { subject: subject.trim(), message: firstMessage.trim() },
      {
        onSuccess: (ticket) => {
          setSubject('')
          setFirstMessage('')
          setComposing(false)
          setActiveId(ticket.id)
        },
      },
    )
  }

  return (
    <UserAppLayout activeNav="inbox">
      <div className="mx-auto flex h-[calc(100vh-12rem)] w-full max-w-5xl flex-col lg:h-[calc(100vh-9rem)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 rounded-t-2xl border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-gray-900">Support</h1>
            <p className="truncate text-xs text-gray-500">
              Your conversations with the Alcott support team.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setComposing(true)
              setActiveId(null)
            }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#4043FF] px-3.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New message
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Ticket list */}
          <aside
            className={`${showList ? 'flex' : 'hidden md:flex'} w-full flex-col border-r border-gray-200 bg-white md:w-80 lg:w-96`}
          >
            <div className="flex-1 overflow-y-auto">
              {ticketsLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#4043FF]" />
                </div>
              ) : !tickets || tickets.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <p className="text-sm font-semibold text-gray-700">No conversations yet</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Start a new message and our team will reply here.
                  </p>
                </div>
              ) : (
                tickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setComposing(false)
                      setActiveId(t.id)
                    }}
                    className={`flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      activeId === t.id && !composing ? 'bg-[#4043FF]/5' : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-gray-900">{t.subject}</span>
                        <span className="shrink-0 text-[11px] text-gray-400">
                          {formatChatTime(t.latestMessageAt ?? t.updatedAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {t.latestMessagePreview || '—'}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <StatusPill status={t.status} />
                        {t.status === 'OPEN' && t.latestMessageFromAdmin && (
                          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#4043FF] px-2 py-0.5 text-[10px] font-bold text-white">
                            New reply
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* Conversation / compose */}
          <section className={`${showList ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-[#F8F9FC]`}>
            {composing ? (
              <form onSubmit={submitNew} className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setComposing(false)}
                    className="rounded-lg p-1.5 hover:bg-gray-100"
                    aria-label="Back"
                  >
                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-sm font-bold text-gray-900">New message</h2>
                </div>

                <div>
                  <label htmlFor="ticket-subject" className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Subject
                  </label>
                  <input
                    id="ticket-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What is this about?"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-[#4043FF]/20"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <label htmlFor="ticket-message" className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="ticket-message"
                    value={firstMessage}
                    onChange={(e) => setFirstMessage(e.target.value)}
                    placeholder="Describe your question or issue…"
                    className="min-h-[160px] flex-1 resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-[#4043FF]/20"
                  />
                </div>

                {createTicket.isError && (
                  <p className="text-xs text-red-600">
                    Could not start the conversation. Please try again.
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setComposing(false)}
                    className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!subject.trim() || !firstMessage.trim() || createTicket.isPending}
                    className="rounded-full bg-[#4043FF] px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {createTicket.isPending ? 'Sending…' : 'Send message'}
                  </button>
                </div>
              </form>
            ) : !activeTicket ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center text-gray-400">
                <svg className="mb-3 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm font-medium">Select a conversation to view it</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <button
                    onClick={() => setActiveId(null)}
                    className="rounded-lg p-1.5 hover:bg-gray-100 md:hidden"
                    aria-label="Back to list"
                  >
                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-bold text-gray-900">{activeTicket.subject}</h2>
                    <p className="truncate text-xs text-gray-500">
                      Opened {formatChatTime(activeTicket.createdAt)}
                    </p>
                  </div>
                  <StatusPill status={activeTicket.status} />
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
                  {messagesLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#4043FF]" />
                    </div>
                  ) : !messages || messages.length === 0 ? (
                    <p className="py-10 text-center text-sm text-gray-400">No messages yet.</p>
                  ) : (
                    <>
                      {messages.map((m) => (
                        <MessageBubble key={m.id} message={m} />
                      ))}
                      {sendMessage.isPending && (
                        <p className="text-center text-xs text-gray-400">Sending…</p>
                      )}
                      <div ref={bottomRef} />
                    </>
                  )}
                </div>

                {closed ? (
                  <div className="border-t border-gray-200 bg-white px-4 py-4 text-center sm:px-6">
                    <p className="text-xs text-gray-500">
                      This conversation is closed.{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setComposing(true)
                          setActiveId(null)
                        }}
                        className="font-semibold text-[#4043FF] hover:underline"
                      >
                        Start a new message
                      </button>{' '}
                      if you still need help.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      send()
                    }}
                    className="flex items-center gap-2 border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                  >
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Write a reply…"
                      className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-[#4043FF]/20"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim() || sendMessage.isPending}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4043FF] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                      aria-label="Send message"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                )}

                {sendMessage.isError && (
                  <p className="bg-white px-4 pb-2 text-center text-xs text-red-600 sm:px-6">
                    Could not send your message. Please try again.
                  </p>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </UserAppLayout>
  )
}
