'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Plus } from 'lucide-react'

interface Todo {
  _id: string
  text: string
  completed: boolean
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      if (!response.ok) throw new Error('Failed to fetch todos')
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load todos',
        variant: 'destructive',
      })
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo }),
      })

      if (!response.ok) throw new Error('Failed to add todo')
      
      const todo = await response.json()
      setTodos([todo, ...todos])
      setNewTodo('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add todo',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Travel Todo List</h1>

        <Card className="p-6 mb-8">
          <form onSubmit={addTodo} className="flex gap-4">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1"
            />
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          {todos.map((todo) => (
            <Card key={todo._id} className="p-4 flex items-center gap-4">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={async () => {
                  // Implement toggle functionality
                }}
              />
              <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                {todo.text}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}