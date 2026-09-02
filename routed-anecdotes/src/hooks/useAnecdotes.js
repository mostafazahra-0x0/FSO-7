import { useEffect } from "react"
import { useState } from "react"
import anecdoteService from "../services/anecdotes"
export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])
  return { anecdotes }
}
