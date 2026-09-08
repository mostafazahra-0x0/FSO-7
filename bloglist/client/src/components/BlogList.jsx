import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return (
    <div>
      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
        <div key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
        </div>
      )}
    </div>
  )
}

export default BlogList