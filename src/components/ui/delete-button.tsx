'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteRecord } from '@/app/actions/delete'

interface DeleteButtonProps {
  tableName: string
  id: string
  redirectPath?: string
  className?: string
}

export function DeleteButton({ tableName, id, redirectPath, className }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (window.confirm('Are you sure you want to delete this? This action can be undone later by contacting support.')) {
      setIsDeleting(true)
      try {
        await deleteRecord(tableName, id, redirectPath)
      } catch (error) {
        console.error('Failed to delete:', error)
        alert('Failed to delete record.')
        setIsDeleting(false)
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className={`text-slate-400 hover:text-danger-600 transition-colors p-1 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
