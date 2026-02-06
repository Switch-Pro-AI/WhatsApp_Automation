"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ConversationList } from "./conversation-list"
import { ChatPanel } from "./chat-panel"
import { ConversationDetails } from "./conversation-details"
import { Send } from "lucide-react"
import { NewConversation } from "./new-conversation"

interface Conversation {
  id: string
  contact_id: string
  contact_name: string | null
  contact_phone: string
  contact_avatar: string | null
  assigned_agent_id: string | null
  assigned_agent_name: string | null
  status: string
  last_message_at: string | null
  last_message: string | null
  last_message_type: string | null
  unread_count: string
}

interface Agent {
  id: string
  name: string
  avatar_url: string | null
}

interface QuickReply {
  id: string
  title: string
  shortcut: string
  content: string
}

interface InboxLayoutProps {
  conversations: Conversation[]
  agents: Agent[]
  quickReplies: QuickReply[]
  tenantId: string
  initialView?: 'new-conversation' | 'inbox'
}

export function InboxLayout({ conversations, agents, quickReplies, tenantId, initialView }: InboxLayoutProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    (initialView === 'new-conversation' || initialView === undefined) ? null : conversations[0]?.id || null
  )
  const [showDetails, setShowDetails] = useState(false)
  const [filter, setFilter] = useState<"all" | "open" | "pending" | "resolved">("all")

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)

  const filteredConversations = conversations.filter((c) => {
    if (filter === "all") return true
    return c.status === filter
  })

  return (
    <div className="flex h-[calc(100vh-7rem)] -m-6 bg-background">
      {/* Conversation List */}
      <ConversationList
        conversations={filteredConversations}
        selectedId={selectedConversationId}
        onSelect={setSelectedConversationId}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* Chat Panel or New Conversation */}
      {initialView === 'new-conversation' && !selectedConversationId ? (
        <NewConversation
          tenantId={tenantId}
          onConversationCreated={(conversationId) => {
            setSelectedConversationId(conversationId);
          }}
        />
      ) : selectedConversation ? (
        <ChatPanel
          conversation={selectedConversation}
          quickReplies={quickReplies}
          onToggleDetails={() => setShowDetails(!showDetails)}
          showDetails={showDetails}
          tenantId={tenantId}
        />
      ) : (
        <div className="flex-1 flex flex-col bg-card">
          {/* Empty State Header */}
          <div className="h-16 px-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-foreground">New Conversation</h3>
            </div>
          </div>
          
          {/* Empty State Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Start a new conversation</h3>
              <p className="text-muted-foreground mb-6">
                Select a contact from the list to start a conversation or create a new contact.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => {
                  // If there are conversations, select the first one
                  if (conversations.length > 0) {
                    setSelectedConversationId(conversations[0].id);
                  }
                }}>
                  Browse Contacts
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/dashboard/contacts?new=true'}>
                  Add Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversation Details */}
      {showDetails && selectedConversation && (
        <ConversationDetails
          conversation={selectedConversation}
          agents={agents}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  )
}
