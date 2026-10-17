import { useState, useEffect, useRef } from 'react'
import {
  X,
  Send,
  UserCheck,
  Building2,
  Phone,
  ShieldCheck,
} from 'lucide-react'

export interface ChatMsg {
  id: string | number
  senderId: number
  senderName: string
  senderRole: 'CUSTOMER' | 'ENGINEER' | 'ADMIN'
  message: string
  timestamp: string
  attachmentName?: string
}

interface ServiceChatModalProps {
  isOpen: boolean
  onClose: () => void
  ticketNumber: string
  equipmentTitle: string
  hospitalName: string
  currentRole: 'CUSTOMER' | 'ENGINEER'
  currentUserName: string
  assignedEngineerName?: string
  engineerPhone?: string
}

export default function ServiceChatModal({
  isOpen,
  onClose,
  ticketNumber,
  equipmentTitle,
  hospitalName,
  currentRole,
  currentUserName,
  assignedEngineerName = 'Er. Suman Adhikari (NHPC #BM-418)',
  engineerPhone = '+977 9841234567',
}: ServiceChatModalProps) {
  const storageKey = `mediko_chat_${ticketNumber}`

  const defaultMessages: ChatMsg[] = [
    {
      id: 1,
      senderId: 101,
      senderName: assignedEngineerName,
      senderRole: 'ENGINEER',
      message: `Namaste! I am your assigned Biomedical Support Engineer for ticket #${ticketNumber}. I have reviewed the request for "${equipmentTitle}". Could you please verify if the equipment is currently powered off and accessible in the ICU ward?`,
      timestamp: 'Today, 09:15 AM',
    },
    {
      id: 2,
      senderId: 202,
      senderName: currentRole === 'CUSTOMER' ? currentUserName : 'Bir Hospital ICU Ward Staff',
      senderRole: 'CUSTOMER',
      message: `Yes Engineer, the monitor is kept in ICU Ward 2, Bed 4. Calibration analyzer and safety tester can be connected anytime. Please bring the DDA sensor calibration protocol.`,
      timestamp: 'Today, 09:22 AM',
    },
    {
      id: 3,
      senderId: 101,
      senderName: assignedEngineerName,
      senderRole: 'ENGINEER',
      message: `Understood. I am carrying our certified Fluke Biomedical electrical safety analyzer and NIBP simulator. ETA at hospital is approx 45 minutes.`,
      timestamp: 'Today, 09:30 AM',
    },
  ]

  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return defaultMessages
  })

  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages))
    } catch {}
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, storageKey])

  if (!isOpen) return null

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage.trim()
    if (!text) return

    const newMsg: ChatMsg = {
      id: Date.now(),
      senderId: currentRole === 'ENGINEER' ? 101 : 202,
      senderName: currentUserName,
      senderRole: currentRole,
      message: text,
      timestamp: 'Just now',
    }

    const updated = [...messages, newMsg]
    setMessages(updated)
    setInputMessage('')

    // Simulated Auto-Reply from Counterpart if replying as Customer or Engineer
    if (currentRole === 'CUSTOMER') {
      setIsSending(true)
      setTimeout(() => {
        const replyMsg: ChatMsg = {
          id: Date.now() + 1,
          senderId: 101,
          senderName: assignedEngineerName,
          senderRole: 'ENGINEER',
          message: 'Received your message. On-site calibration kit is ready and logged on the Mediko BMET dispatch system.',
          timestamp: 'Just now',
        }
        setMessages((prev) => [...prev, replyMsg])
        setIsSending(false)
      }, 1500)
    } else if (currentRole === 'ENGINEER') {
      setIsSending(true)
      setTimeout(() => {
        const replyMsg: ChatMsg = {
          id: Date.now() + 1,
          senderId: 202,
          senderName: 'Hospital Procurement Staff',
          senderRole: 'CUSTOMER',
          message: 'Thank you Er. Suman! Our duty biomedical assistant will meet you at the hospital receiving gate.',
          timestamp: 'Just now',
        }
        setMessages((prev) => [...prev, replyMsg])
        setIsSending(false)
      }, 1500)
    }
  }

  const quickTemplates =
    currentRole === 'ENGINEER'
      ? [
          'Arrived at Hospital Receiving Desk',
          'Calibration completed: Electrical safety test Passed (Grade A)',
          'Part replacement required for sensor cable',
          'Signed service report uploaded for client approval',
        ]
      : [
          'ICU Ward is ready for your on-site visit',
          'Please bring NIBP cuff and SpO2 sensor for testing',
          'Urgent: Please expedite calibration before evening shift',
          'Authorized person: Dr. Rajan (+977 9851099887)',
        ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xs font-sans animate-in fade-in">
      <div className="relative flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#071B45] p-4 text-white sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-orange font-bold text-white shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-sm sm:text-base font-bold text-white m-0">
                  Direct Biomedical Support Chat
                </h3>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-300 m-0 mt-0.5 flex items-center gap-2 flex-wrap">
                <span>Ticket #{ticketNumber}</span>
                <span>·</span>
                <span className="text-orange font-medium">{equipmentTitle}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer border-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Counterpart Metadata Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs sm:px-6">
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">{hospitalName}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-500">
              Active User: <strong className="text-navy">{currentUserName}</strong> ({currentRole})
            </span>
            <a
              href={`tel:${engineerPhone}`}
              className="flex items-center gap-1 rounded-lg bg-orange/10 px-2 py-0.5 text-orange font-bold hover:bg-orange/20 no-underline transition"
            >
              <Phone className="w-3 h-3" />
              <span>Call Engineer</span>
            </a>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          <div className="text-center my-2">
            <span className="rounded-full bg-slate-200/70 px-3 py-1 text-[10px] font-semibold text-slate-600 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              End-to-end encrypted hospital communication channel
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderRole === currentRole
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-bold text-slate-600">{msg.senderName}</span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[8px] font-black uppercase ${
                      msg.senderRole === 'ENGINEER'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {msg.senderRole}
                  </span>
                  <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-[#071B45] text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  <p className="m-0 whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            )
          })}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic px-2">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-orange animate-bounce"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-orange animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-orange animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span>Counterpart is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="border-t border-slate-100 bg-white p-2 sm:px-4 flex gap-1.5 overflow-x-auto">
          {quickTemplates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(template)}
              className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold text-slate-700 hover:border-orange hover:bg-orange/5 hover:text-orange transition cursor-pointer"
            >
              + {template}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Type message to ${
                currentRole === 'CUSTOMER' ? 'Assigned Engineer' : 'Hospital Customer'
              }...`}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-orange focus:ring-1 focus:ring-orange/20"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange text-white shadow-md shadow-orange/25 hover:bg-orange-hover disabled:opacity-40 transition cursor-pointer border-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
