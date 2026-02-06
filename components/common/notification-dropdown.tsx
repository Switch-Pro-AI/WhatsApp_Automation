import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, MessageSquare, User, Clock, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

interface Notification {
  id: string;
  type: 'message' | 'assignment' | 'mention';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  conversationId?: string;
}

interface NotificationDropdownProps {
  tenantId: string;
}

// SWR fetcher function
const fetcher = (url: string) => fetch(url).then(res => res.json());

export function NotificationDropdown({ tenantId }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Fetch notification data
  const { data: notificationData, error, mutate } = useSWR(`/api/notifications`, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Mark notifications as seen when opening the dropdown
      markAllAsSeen();
    }
  };

  // Mark all notifications as seen (but not necessarily read)
  const markAllAsSeen = async () => {
    // In a real implementation, you would call an API to mark notifications as seen
    // For now, we'll just refetch to update the counts
    mutate();
  };

  // Navigate to conversation
  const goToConversation = (conversationId: string) => {
    router.push(`/dashboard/inbox?conversation=${conversationId}`);
    setIsOpen(false);
    // Mark as read after navigating
    setTimeout(() => {
      markAsRead('conversation', conversationId);
    }, 1000);
  };

  // Mark notification as read
  const markAsRead = async (type: string, id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, id }),
      });
      // Refresh the notification data
      mutate();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Flatten all notifications for display
  const allNotifications = [
    ...(notificationData?.recent_unread_messages?.map((msg: any) => ({
      id: msg.conversation_id,
      type: 'message' as const,
      title: msg.contact_name || 'New Message',
      description: msg.content?.length > 50 ? `${msg.content.substring(0, 50)}...` : msg.content,
      timestamp: msg.created_at,
      read: false,
      conversationId: msg.conversation_id
    })) || []),
    ...(notificationData?.pending_conversations?.map((conv: any) => ({
      id: conv.id,
      type: 'assignment' as const,
      title: 'Pending Assignment',
      description: `${conv.contact_name || 'A contact'} needs attention`,
      timestamp: conv.created_at,
      read: false,
      conversationId: conv.id
    })) || []),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  const unreadCount = allNotifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={toggleDropdown}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <Card className="border-0 shadow-none rounded-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                {allNotifications.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={markAllAsSeen}
                    className="text-xs"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-96 overflow-y-auto">
              {allNotifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {allNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => notification.conversationId && goToConversation(notification.conversationId)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'message' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {notification.type === 'message' ? (
                            <MessageSquare className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 truncate">
                            {notification.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatRelativeTime(notification.timestamp)}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (notification.conversationId) {
                              markAsRead(notification.type, notification.conversationId);
                            }
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bell className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">No notifications</h3>
                  <p className="text-sm text-gray-500">All caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}