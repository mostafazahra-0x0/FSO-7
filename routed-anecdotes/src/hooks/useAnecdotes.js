import { useEffect } from "react"
import { useState } from "react"
import anecdoteService from "../services/anecdotes"
export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])
  
  const addAnecdote = async (anecdote) => {
    const newAnecdote = await  anecdoteService.createNew(anecdote)
    setAnecdotes(anecdotes.concat(newAnecdote))
  }
  
  const deleteAnecdote = async (id) => {
    await anecdoteService.deleteAnecdote(id)
    setAnecdotes(anecdotes.filter(anecdote => anecdote.id !== id))
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}