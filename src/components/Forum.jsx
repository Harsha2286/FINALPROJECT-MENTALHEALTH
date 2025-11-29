import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'
import { FiMessageCircle, FiSend, FiUser } from 'react-icons/fi'
import './Forum.css'

export default function Forum({ groupId, groupName }) {
  const { profile } = useAuth()
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState({})
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [newComment, setNewComment] = useState({})
  const [showPostForm, setShowPostForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [groupId])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*, profiles:user_id(full_name, email)')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])

      // Fetch comments for each post
      if (data && data.length > 0) {
        const postIds = data.map((p) => p.id)
        const { data: commentsData, error: commentsError } = await supabase
          .from('forum_comments')
          .select('*, profiles:user_id(full_name, email)')
          .in('post_id', postIds)
          .order('created_at', { ascending: true })

        if (!commentsError && commentsData) {
          const commentsMap = {}
          commentsData.forEach((comment) => {
            if (!commentsMap[comment.post_id]) {
              commentsMap[comment.post_id] = []
            }
            commentsMap[comment.post_id].push(comment)
          })
          setComments(commentsMap)
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('forum_posts').insert({
        group_id: groupId,
        user_id: profile.id,
        title: newPost.title,
        content: newPost.content,
      })

      if (error) throw error

      setNewPost({ title: '', content: '' })
      setShowPostForm(false)
      fetchPosts()
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post. Please try again.')
    }
  }

  const handleAddComment = async (postId) => {
    const content = newComment[postId]
    if (!content || !content.trim()) return

    try {
      const { error } = await supabase.from('forum_comments').insert({
        post_id: postId,
        user_id: profile.id,
        content: content.trim(),
      })

      if (error) throw error

      setNewComment({ ...newComment, [postId]: '' })
      fetchPosts()
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Error adding comment. Please try again.')
    }
  }

  if (loading) {
    return <div className="forum-loading">Loading forum...</div>
  }

  return (
    <div className="forum-container">
      <div className="forum-header">
        <h2>Forum: {groupName}</h2>
        <button
          className="primary-button"
          onClick={() => setShowPostForm(!showPostForm)}
        >
          <FiMessageCircle /> {showPostForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {showPostForm && (
        <form onSubmit={handleCreatePost} className="post-form">
          <input
            type="text"
            placeholder="Post title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
          <textarea
            placeholder="What's on your mind?"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            rows="4"
            required
          />
          <button type="submit" className="primary-button">
            <FiSend /> Post
          </button>
        </form>
      )}

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <FiMessageCircle size={48} />
            <p>No posts yet. Be the first to start a conversation!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="forum-post">
              <div className="post-header">
                <div className="post-author">
                  <FiUser />
                  <span>{post.profiles?.full_name || post.profiles?.email || 'Anonymous'}</span>
                </div>
                <span className="post-date">
                  {format(new Date(post.created_at), 'MMM dd, yyyy h:mm a')}
                </span>
              </div>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-content">{post.content}</p>

              <div className="comments-section">
                <h4>Comments ({comments[post.id]?.length || 0})</h4>
                {comments[post.id]?.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <FiUser className="comment-icon" />
                      <strong>{comment.profiles?.full_name || comment.profiles?.email || 'Anonymous'}</strong>
                      <span className="comment-date">
                        {format(new Date(comment.created_at), 'MMM dd, h:mm a')}
                      </span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                ))}

                <div className="add-comment">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment[post.id] || ''}
                    onChange={(e) =>
                      setNewComment({ ...newComment, [post.id]: e.target.value })
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(post.id)
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="comment-button"
                  >
                    <FiSend />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

