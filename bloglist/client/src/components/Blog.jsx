import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import blogService from '../services/blogs'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
const BlogCard = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5em 2em;
  max-width: 600px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

const Title = styled.h2`
  margin: 0 0 0.3em;
  font-size: 1.5rem;
  color: #1a1a2e;
`

const Author = styled.span`
  color: #e94560;
`

const Url = styled.a`
  display: block;
  color: #4361ee;
  text-decoration: none;
  margin-bottom: 1em;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid #4361ee;
    outline-offset: 2px;
    border-radius: 4px;
  }
`

const LikesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6em;
  margin-bottom: 0.5em;
  font-size: 1rem;
  color: #333;
`

const LikeButton = styled.button`
  background: #e94560;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.3em 1em;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #c73650;
  }

  &:focus-visible {
    outline: 2px solid #1a1a2e;
    outline-offset: 2px;
  }
`

const AddedBy = styled.div`
  // #888 on white is ~3.9:1 and fails AA for small text,
  // so muted meta uses #555 while #888 is kept for placeholders/borders.
  color: #555;
  font-size: 0.85rem;
  margin-bottom: 1em;
`

const RemoveButton = styled.button`
  background: transparent;
  color: #e94560;
  border: 1px solid #e94560;
  border-radius: 6px;
  padding: 0.3em 0.9em;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;

  &:hover {
    background: #e94560;
    color: white;
  }

  &:focus-visible {
    outline: 2px solid #4361ee;
    outline-offset: 2px;
  }
`

const CommentsHeading = styled.h3`
  margin: 1.2em 0 0.6em;
  font-size: 1.1rem;
  color: #1a1a2e;
  border-top: 1px solid #e0e0e0;
  padding-top: 1em;
`

const CommentList = styled.ul`
  list-style: none;
  margin: 0 0 1em;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`

const CommentItem = styled.li`
  background: #f6f6f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.6em 0.9em;
  font-size: 0.95rem;
  color: #333;
`

// Row layout keeps input + button on one line on desktop,
// wraps to stacked on narrow screens via flex-wrap.
const CommentForm = styled.form`
  display: flex;
  gap: 0.6em;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 1.2em;
`

const CommentInput = styled.input`
  flex: 1;
  min-width: 200px;
  font-size: 0.95rem;
  padding: 0.55em 0.9em;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  color: #1a1a2e;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: #888;
  }

  &:hover {
    border-color: #bdbdc9;
  }

  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.18);
  }
`

// Mirrors LikeButton: solid #e94560 pill, darkens to #c73650 on hover.
const CommentButton = styled.button`
  background: #e94560;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.55em 1.2em;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #c73650;
  }

  &:focus-visible {
    outline: 2px solid #1a1a2e;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

// Visually hidden but screen-reader accessible label so the
// input stays labelled without adding visual clutter above the form.
const ScreenReaderLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

const Blog = ({ handleLike, handleDelete, user }) => {
  const { id } = useParams()
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()
  const addCommentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs', id] })
    },
  })

  const handleAddComment = (event) => {
    event.preventDefault()
    addCommentMutation.mutate({ id, comment })
    setComment('')
  }

  const result = useQuery({
    queryKey: ['blogs', id],
    queryFn: () => blogService.getById(id),
  })

  const blog = result.data

  if (result.isLoading) {
    return <div>loading...</div>
  }

  if (!blog) {
    return <div>Blog not found</div>
  }

  const showDeleteButton =
    user && blog.user && user.username === blog.user.username

  return (
    <BlogCard className="blog">
      <Title>
        {blog.title} <Author>{blog.author}</Author>
      </Title>

      <Url href={blog.url} target="_blank" rel="noopener noreferrer">
        {blog.url}
      </Url>

      <LikesRow>
        <span>likes {blog.likes}</span>
        {user && (
          <LikeButton onClick={() => handleLike(blog)}>
            like
          </LikeButton>
        )}
      </LikesRow>
      <CommentsHeading>comments</CommentsHeading>
      <CommentList>
        {blog.comments?.map((comment, index) => (
          <CommentItem key={index}>{comment}</CommentItem>
        ))}
      </CommentList>
      <CommentForm onSubmit={handleAddComment}>
        <ScreenReaderLabel htmlFor="comment-input">
          Add a comment
        </ScreenReaderLabel>
        <CommentInput
          id="comment-input"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="add a comment"
        />
        <CommentButton type="submit">add comment</CommentButton>
      </CommentForm>
      <AddedBy>added by {blog.user.name}</AddedBy>

      {showDeleteButton && (
        <RemoveButton onClick={() => handleDelete(blog)}>
          remove
        </RemoveButton>
      )}
    </BlogCard>
  )
}

export default Blog
