'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react'
import { toast } from 'sonner'

interface QuickReply {
  id: string
  title: string
  shortcut: string
  content: string
  createdAt: string
}

export default function QuickRepliesPage() {
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReply, setEditingReply] = useState<QuickReply | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    shortcut: '',
    content: ''
  })

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would come from an API call
    const mockReplies: QuickReply[] = [
      {
        id: '1',
        title: 'Business Hours',
        shortcut: 'hours',
        content: 'Our business hours are Monday to Friday, 9 AM to 6 PM EST.',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        title: 'Return Policy',
        shortcut: 'return',
        content: 'We offer a 30-day return policy on all items. Items must be in original condition with tags attached.',
        createdAt: '2024-01-16'
      },
      {
        id: '3',
        title: 'Shipping Info',
        shortcut: 'ship',
        content: 'Free shipping on orders over $50. Standard delivery takes 3-5 business days.',
        createdAt: '2024-01-17'
      }
    ]
    setQuickReplies(mockReplies)
  }, [])

  const filteredReplies = quickReplies.filter(reply =>
    reply.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reply.shortcut.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reply.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingReply) {
      // Update existing reply
      setQuickReplies(prev => prev.map(reply => 
        reply.id === editingReply.id 
          ? { ...reply, ...formData, updatedAt: new Date().toISOString() } 
          : reply
      ))
      toast.success('Quick reply updated successfully')
    } else {
      // Create new reply
      const newReply: QuickReply = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        createdAt: new Date().toISOString()
      }
      setQuickReplies(prev => [...prev, newReply])
      toast.success('Quick reply created successfully')
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({ title: '', shortcut: '', content: '' })
    setEditingReply(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (reply: QuickReply) => {
    setEditingReply(reply)
    setFormData({
      title: reply.title,
      shortcut: reply.shortcut,
      content: reply.content
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setQuickReplies(prev => prev.filter(reply => reply.id !== id))
    toast.success('Quick reply deleted successfully')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quick Replies</h1>
        <p className="text-muted-foreground">
          Create and manage quick replies to respond to common customer questions efficiently.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quick replies..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Quick Reply
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingReply ? 'Edit Quick Reply' : 'Create Quick Reply'}</DialogTitle>
              <DialogDescription>
                {editingReply 
                  ? 'Update your quick reply here.' 
                  : 'Create a new quick reply for common responses.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter a title for this quick reply"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortcut">Shortcut</Label>
                <Input
                  id="shortcut"
                  value={formData.shortcut}
                  onChange={(e) => setFormData({...formData, shortcut: e.target.value})}
                  placeholder="e.g., 'hours', 'return'"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Enter the response content"
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingReply ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredReplies.length > 0 ? (
          filteredReplies.map((reply) => (
            <Card key={reply.id} className="overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 bg-gray-50 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-gray-900">{reply.title}</CardTitle>
                    <CardDescription className="text-xs text-gray-500">/{reply.shortcut}</CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      onClick={() => handleEdit(reply)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-red-600 hover:bg-gray-100"
                      onClick={() => handleDelete(reply.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="bg-white">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {reply.content}
                </p>
                <div className="mt-4 text-xs text-gray-500">
                  Created: {new Date(reply.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto max-w-sm">
              <h3 className="mt-2 text-sm font-semibold">No quick replies found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm 
                  ? 'No quick replies match your search.' 
                  : 'Get started by creating your first quick reply.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}