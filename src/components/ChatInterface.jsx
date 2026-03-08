import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { generatePredefinedChatResponse } from "@/lib/chatbot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

export default function ChatInterface() {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef(null)
    const inputRef = useRef(null)

    // Auto-focus input when chat opens or after AI finishes typing
    useEffect(() => {
        if (isOpen && !isTyping && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus()
            }, 50)
        }
    }, [isOpen, isTyping])

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        }
    }, [messages, isTyping, isOpen])

    // Fetch history and listen for changes
    useEffect(() => {
        if (!isOpen || !user) return

        let subscription = null

        const fetchHistoryAndSubscribe = async () => {
            // 1. Fetch History
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true })

            if (error) {
                console.error("Error fetching chat history:", error)
            } else {
                setMessages(data || [])
            }

            // 2. Subscribe to Realtime Inserts
            subscription = supabase
                .channel(`chat_messages_${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'messages',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        console.log("Realtime payload received:", payload.new)
                        // Using functional update to ensure we get the latest state
                        setMessages((prev) => {
                            // Prevent duplicate messages if Realtime fires locally as well
                            if (prev.some(msg => msg.id === payload.new.id)) return prev
                            return [...prev, payload.new]
                        })
                    }
                )
                .subscribe()
        }

        fetchHistoryAndSubscribe()

        return () => {
            if (subscription) supabase.removeChannel(subscription)
        }
    }, [isOpen, user?.id])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !user) return

        const userText = newMessage.trim()
        setNewMessage("") // clear input immediately

        // 1. Insert user message to Supabase
        const { error: userInsertError } = await supabase
            .from('messages')
            .insert([{ user_id: user.id, content: userText, sender_type: 'user' }])

        if (userInsertError) {
            console.error("Failed to insert user message:", userInsertError)
            return // stop if failed
        }

        // 2. Set "AI is typing" status
        setIsTyping(true)

        // 3. Get AI Response from the predefined logic (pass history for context)
        const aiText = await generatePredefinedChatResponse(userText, messages)

        // 4. Insert AI Response to Supabase
        const { error: aiInsertError } = await supabase
            .from('messages')
            .insert([{ user_id: user.id, content: aiText, sender_type: 'ai' }])

        if (aiInsertError) {
            console.error("Failed to insert AI response:", aiInsertError)
        }

        // 5. Turn off typing status
        setIsTyping(false)
    }

    // Security requirement: Only render for logged-in users
    if (!user) return null

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Toggle Button */}
            {!isOpen && (
                <div className="relative group flex flex-col items-center justify-center">
                    {/* Curved "Chat here!" Text */}
                    <div className="absolute -top-7 text-pink-500 font-bold pointer-events-none drop-shadow-sm flex justify-center text-sm tracking-wide">
                        {"Chat here! ✨".split("").map((char, index) => {
                            const offset = index - 6
                            const rotation = offset * 4
                            const yOffset = Math.abs(offset) * 1.2
                            return (
                                <span
                                    key={index}
                                    className="inline-block origin-bottom"
                                    style={{ transform: `rotate(${rotation}deg) translateY(${yOffset}px)` }}
                                >
                                    <span
                                        className="hover-bounce-letter"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {char === " " ? "\u00A0" : char}
                                    </span>
                                </span>
                            )
                        })}
                    </div>

                    <Button
                        onClick={() => setIsOpen(true)}
                        className="h-16 w-16 rounded-full overflow-hidden transition-all shadow-lg p-0 bg-white border-2 border-pink-100 hover:border-pink-300 hover:ring-4 hover:ring-pink-100 hover:scale-105 hover:bg-white z-10"
                    >
                        <img src="/assets/fox_mascot.png" alt="Chat with Luxe Assistant" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-pink-100 flex-shrink-0 animate-in slide-in-from-bottom-5">

                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-0.5 rounded-full overflow-hidden h-10 w-10 shrink-0 flex items-center justify-center border border-pink-200">
                                <img src="/assets/fox_mascot.png" alt="Luxe Avatar" className="h-full w-full object-cover rounded-full focus:outline-none" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    Luxe Support
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                    </span>
                                </h3>
                                <p className="text-white/80 text-xs">Always here to help ✨</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Messages Area */}
                    <ScrollArea className="flex-1 p-4 bg-slate-50/50 min-h-0" ref={scrollRef}>
                        <div className="space-y-4 pb-4">
                            {messages.length === 0 && (
                                <div className="text-center text-sm text-slate-400 my-8">
                                    Send a message to start chatting! Ask about our perfumes or skincare. 🌸
                                </div>
                            )}

                            {messages.map((msg, index) => {
                                const isUser = msg.sender_type === 'user'
                                return (
                                    <div key={msg.id || index} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                        {!isUser && (
                                            <Avatar className="h-8 w-8 shrink-0 bg-white border border-pink-100">
                                                <AvatarImage src="/assets/fox_mascot.png" alt="AI" className="object-cover p-[2px]" />
                                                <AvatarFallback className="bg-pink-100 text-pink-600"><Bot size={16} /></AvatarFallback>
                                            </Avatar>
                                        )}

                                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm
                                            ${isUser
                                                ? 'bg-gradient-to-tr from-pink-500 to-rose-500 text-white rounded-br-none'
                                                : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none prose prose-p:my-0 prose-sm flex flex-col gap-2'
                                            }`}
                                        >
                                            {msg.content.split(/(\[IMAGE:.*?\])/).map((part, i) => {
                                                if (part.startsWith('[IMAGE:') && part.endsWith(']')) {
                                                    const url = part.substring(7, part.length - 1).trim();
                                                    return <img key={i} src={url} alt="Product" className="rounded-lg border shadow-sm w-full object-contain max-h-72 bg-white" />;
                                                }
                                                return <span key={i}>{part}</span>;
                                            })}
                                        </div>

                                        {isUser && (
                                            <Avatar className="h-8 w-8 shrink-0">
                                                <AvatarFallback className="bg-slate-200 text-slate-600"><User size={16} /></AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                )
                            })}

                            {isTyping && (
                                <div className="flex gap-3 justify-start">
                                    <Avatar className="h-8 w-8 shrink-0 bg-white border border-pink-100">
                                        <AvatarImage src="/assets/fox_mascot.png" alt="AI" className="object-cover p-[2px]" />
                                        <AvatarFallback className="bg-pink-100 text-pink-600"><Bot size={16} /></AvatarFallback>
                                    </Avatar>
                                    <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                                        <div className="fill-pink-500 w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="fill-pink-500 w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="fill-pink-500 w-1.5 h-1.5 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t shrink-0">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                                ref={inputRef}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="focus-visible:ring-pink-500 border-slate-200 rounded-full bg-slate-50"
                                disabled={isTyping}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isTyping || !newMessage.trim()}
                                className="shrink-0 rounded-full bg-pink-500 hover:bg-pink-600 text-white"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
