import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get unread message count
    const unreadMessages = await query<{ count: string }>(
      `SELECT COUNT(*) as count
       FROM messages m
       JOIN conversations c ON m.conversation_id = c.id
       WHERE c.tenant_id = $1 
         AND m.status != 'read' 
         AND m.direction = 'inbound'`,
      [session.tenantId]
    );

    // Get unread conversation count
    const unreadConversations = await query<{ count: string }>(
      `SELECT COUNT(DISTINCT conversation_id) as count
       FROM messages m
       JOIN conversations c ON m.conversation_id = c.id
       WHERE c.tenant_id = $1 
         AND m.status != 'read' 
         AND m.direction = 'inbound'`,
      [session.tenantId]
    );

    // Get pending agent assignments (if applicable)
    const pendingAssignments = await query<{ count: string }>(
      `SELECT COUNT(*) as count
       FROM conversations
       WHERE tenant_id = $1 
         AND status = 'pending'`,
      [session.tenantId]
    );

    return NextResponse.json({
      unread_messages: parseInt(unreadMessages[0].count) || 0,
      unread_conversations: parseInt(unreadConversations[0].count) || 0,
      pending_assignments: parseInt(pendingAssignments[0].count) || 0,
      total_notifications: parseInt(unreadMessages[0].count) + parseInt(pendingAssignments[0].count) || 0
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}