import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Send, UserPlus } from "lucide-react";
import { query } from "@/lib/db";

interface Contact {
  id: string;
  name: string | null;
  phone_number: string;
}

interface NewConversationProps {
  tenantId: string;
  onConversationCreated?: (conversationId: string) => void;
}

export function NewConversation({ tenantId, onConversationCreated }: NewConversationProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newContactNumber, setNewContactNumber] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch contacts on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const result = await query<Contact>(
          `SELECT id, name, phone_number 
           FROM contacts 
           WHERE tenant_id = $1 
           ORDER BY name ASC NULLS LAST`,
          [tenantId]
        );
        setContacts(result);
        setFilteredContacts(result);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [tenantId]);

  // Filter contacts based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredContacts(
        contacts.filter(
          (contact) =>
            (contact.name && contact.name.toLowerCase().includes(term)) ||
            contact.phone_number.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, contacts]);

  const handleCreateConversation = async () => {
    if (!selectedContact && !newContactNumber) return;
    
    setIsCreating(true);
    try {
      let contactId = selectedContact;
      
      // If creating a new contact, add it to the database first
      if (newContactNumber) {
        const newContactResult = await query<Contact>(
          `INSERT INTO contacts (tenant_id, phone_number, source)
           VALUES ($1, $2, 'manual')
           RETURNING id, name, phone_number`,
          [tenantId, newContactNumber]
        );
        contactId = newContactResult[0].id;
      }

      // Create a new conversation
      const conversationResult = await query<{ id: string }>(
        `INSERT INTO conversations (tenant_id, contact_id, status)
         VALUES ($1, $2, 'open')
         RETURNING id`,
        [tenantId, contactId]
      );

      // Call the callback if provided
      if (onConversationCreated) {
        onConversationCreated(conversationResult[0].id);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-card">
      {/* Header */}
      <div className="h-16 px-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-foreground">New Conversation</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Search Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select a Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts by name or phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {loading ? (
                <div className="text-center py-4">
                  <p>Loading contacts...</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                          selectedContact === contact.id
                            ? "bg-primary/10 border border-primary"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => {
                          setSelectedContact(contact.id);
                          setNewContactNumber("");
                        }}
                      >
                        <div>
                          <p className="font-medium">
                            {contact.name || contact.phone_number}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {contact.phone_number}
                          </p>
                        </div>
                        <Button
                          variant={selectedContact === contact.id ? "default" : "outline"}
                          size="sm"
                        >
                          {selectedContact === contact.id ? "Selected" : "Select"}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No contacts found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create New Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Or Create New Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter phone number (with country code)"
                  value={newContactNumber}
                  onChange={(e) => {
                    setNewContactNumber(e.target.value);
                    setSelectedContact(null);
                  }}
                  className="flex-1"
                />
                <Button variant="secondary" disabled={!newContactNumber.trim()}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Enter the full phone number including country code (e.g., +1234567890)
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedContact(null);
                setNewContactNumber("");
              }}
              disabled={isCreating}
            >
              Clear Selection
            </Button>
            <Button
              onClick={handleCreateConversation}
              disabled={!(selectedContact || newContactNumber.trim()) || isCreating}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              {isCreating ? "Creating..." : "Start Conversation"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}