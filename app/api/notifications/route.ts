import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get unread messages
    const unreadMessages = await query<{ conversation_id: string; contact_name: string; content: string; created_at: string }[]>(
      `SELECT DISTINCT
              m.conversation_id,
              co.name as contact_name,
              m.content,
              m.created_at
       FROM messages m
       JOIN conversations c ON m.conversation_id = c.id
       JOIN contacts co ON c.contact_id = co.id
       WHERE c.tenant_id = $1 
         AND m.status != 'read' 
         AND m.direction = 'inbound'
       ORDER BY m.created_at DESC
       LIMIT 10`,
      [session.tenantId]
    );

    // Get total unread count
    const totalUnread: { count: string }[] = await query(
      `SELECT COUNT(*) as count
       FROM messages m
       JOIN conversations c ON m.conversation_id = c.id
       WHERE c.tenant_id = $1 
         AND m.status != 'read' 
         AND m.direction = 'inbound'`,
      [session.tenantId]
    );

    // Get pending agent assignments
    const pendingAssignments = await query<{ id: string; contact_name: string; created_at: string; last_message: string }[]>(
      `SELECT c.id, 
              co.name as contact_name,
              c.created_at,
              c.last_message
       FROM conversations c
       JOIN contacts co ON c.contact_id = co.id
       WHERE c.tenant_id = $1 
         AND c.status = 'pending'
       ORDER BY c.created_at DESC`,
      [session.tenantId]
    );

    // Get recent conversations with unread messages
    const unreadConversations = await query<{ id: string; contact_name: string; last_message: string; last_message_at: string }[]>(
      `SELECT c.id,
              co.name as contact_name,
              c.last_message,
              c.last_message_at
       FROM conversations c
       JOIN contacts co ON c.contact_id = co.id
       WHERE c.tenant_id = $1
         AND c.unread_count > 0
       ORDER BY c.last_message_at DESC`,
      [session.tenantId]
    );

    const totalUnreadCount = totalUnread.length > 0 ? parseInt(totalUnread[0].count || '0') : 0;

    return NextResponse.json({
      unread_messages: totalUnreadCount,
      pending_assignments: pendingAssignments.length,
      unread_conversations: unreadConversations.length,
      total_notifications: totalUnreadCount + pendingAssignments.length,
      recent_unread_messages: unreadMessages, // Recent unread messages
      pending_conversations: pendingAssignments.slice(0, 5), // Top 5 pending conversations
      unread_conversations_list: unreadConversations.slice(0, 5) // Top 5 unread conversations
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// Mark notifications as read
export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, id } = body;

    if (type === 'message') {
      // Mark messages in a conversation as read
      await query(
        `UPDATE messages 
         SET status = 'read' 
         WHERE conversation_id = $1 
           AND direction = 'inbound' 
           AND status != 'read'`,
        [id]
      );
    } else if (type === 'conversation') {
      // Mark all messages in a specific conversation as read
      await query(
        `UPDATE messages 
         SET status = 'read' 
         WHERE conversation_id = $1 
           AND direction = 'inbound' 
           AND status != 'read'`,
        [id]
      );
      
      // Reset unread count for the conversation
      await query(
        `UPDATE conversations 
         SET unread_count = 0 
         WHERE id = $1`,
        [id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}