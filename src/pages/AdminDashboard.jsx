import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { FiBook, FiCalendar, FiUsers, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'
import './Dashboard.css'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('resources')
  const [resources, setResources] = useState([])
  const [sessions, setSessions] = useState([])
  const [supportGroups, setSupportGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    resource_type: 'article',
    url: '',
    name: '',
    topic: '',
    counselor_name: '',
    session_date: '',
    session_type: 'individual',
  })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'resources') {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setResources(data || [])
      } else if (activeTab === 'sessions') {
        const { data, error } = await supabase
          .from('sessions')
          .select('*, profiles:student_id(full_name, email)')
          .order('session_date', { ascending: false })

        if (error) throw error
        setSessions(data || [])
      } else if (activeTab === 'groups') {
        const { data, error } = await supabase
          .from('support_groups')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setSupportGroups(data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      if (activeTab === 'resources') {
        setFormData({
          title: item.title || '',
          description: item.description || '',
          content: item.content || '',
          category: item.category || '',
          resource_type: item.resource_type || 'article',
          url: item.url || '',
        })
      } else if (activeTab === 'groups') {
        setFormData({
          name: item.name || '',
          description: item.description || '',
          topic: item.topic || '',
        })
      }
    } else {
      setEditingItem(null)
      setFormData({
        title: '',
        description: '',
        content: '',
        category: '',
        resource_type: 'article',
        url: '',
        name: '',
        topic: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({
      title: '',
      description: '',
      content: '',
      category: '',
      resource_type: 'article',
      url: '',
      name: '',
      topic: '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (activeTab === 'resources') {
        if (editingItem) {
          const { error } = await supabase
            .from('resources')
            .update({
              title: formData.title,
              description: formData.description,
              content: formData.content,
              category: formData.category,
              resource_type: formData.resource_type,
              url: formData.url,
              updated_at: new Date().toISOString(),
            })
            .eq('id', editingItem.id)

          if (error) throw error
        } else {
          const { error } = await supabase.from('resources').insert({
            title: formData.title,
            description: formData.description,
            content: formData.content,
            category: formData.category,
            resource_type: formData.resource_type,
            url: formData.url,
            created_by: profile.id,
          })

          if (error) throw error
        }
      } else if (activeTab === 'groups') {
        if (editingItem) {
          const { error } = await supabase
            .from('support_groups')
            .update({
              name: formData.name,
              description: formData.description,
              topic: formData.topic,
              updated_at: new Date().toISOString(),
            })
            .eq('id', editingItem.id)

          if (error) throw error
        } else {
          const { error } = await supabase.from('support_groups').insert({
            name: formData.name,
            description: formData.description,
            topic: formData.topic,
            created_by: profile.id,
          })

          if (error) throw error
        }
      }

      handleCloseModal()
      fetchData()
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error saving. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      let table = ''
      if (activeTab === 'resources') table = 'resources'
      else if (activeTab === 'groups') table = 'support_groups'
      else if (activeTab === 'sessions') table = 'sessions'

      const { error } = await supabase.from(table).delete().eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Error deleting. Please try again.')
    }
  }

  const handleUpdateSessionStatus = async (sessionId, newStatus) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', sessionId)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error updating session:', error)
      alert('Error updating session. Please try again.')
    }
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage mental health resources and services</p>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            <FiBook /> Resources
          </button>
          <button
            className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            <FiCalendar /> Sessions
          </button>
          <button
            className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('groups')}
          >
            <FiUsers /> Support Groups
          </button>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {activeTab === 'resources' && (
                <div className="admin-section">
                  <button
                    className="primary-button"
                    onClick={() => handleOpenModal()}
                  >
                    <FiPlus /> Add Resource
                  </button>
                  <div className="resources-grid">
                    {resources.length === 0 ? (
                      <div className="empty-state">
                        <FiBook size={48} />
                        <p>No resources yet</p>
                      </div>
                    ) : (
                      resources.map((resource) => (
                        <div key={resource.id} className="admin-card">
                          <div className="admin-card-header">
                            <h3>{resource.title}</h3>
                            <div className="admin-actions">
                              <button
                                onClick={() => handleOpenModal(resource)}
                                className="icon-button"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(resource.id)}
                                className="icon-button delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                          <p>{resource.description}</p>
                          <span className="badge">{resource.category}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'sessions' && (
                <div className="admin-section">
                  <div className="sessions-list">
                    {sessions.length === 0 ? (
                      <div className="empty-state">
                        <FiCalendar size={48} />
                        <p>No sessions scheduled</p>
                      </div>
                    ) : (
                      sessions.map((session) => (
                        <div key={session.id} className="admin-card">
                          <div className="admin-card-header">
                            <div>
                              <h3>
                                {session.profiles?.full_name || 'Student'} -{' '}
                                {session.counselor_name}
                              </h3>
                              <p className="session-date">
                                {new Date(session.session_date).toLocaleString()}
                              </p>
                            </div>
                            <div className="admin-actions">
                              <select
                                value={session.status}
                                onChange={(e) =>
                                  handleUpdateSessionStatus(session.id, e.target.value)
                                }
                                className="status-select"
                              >
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <button
                                onClick={() => handleDelete(session.id)}
                                className="icon-button delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                          <p>Type: {session.session_type}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'groups' && (
                <div className="admin-section">
                  <button
                    className="primary-button"
                    onClick={() => handleOpenModal()}
                  >
                    <FiPlus /> Create Support Group
                  </button>
                  <div className="groups-grid">
                    {supportGroups.length === 0 ? (
                      <div className="empty-state">
                        <FiUsers size={48} />
                        <p>No support groups yet</p>
                      </div>
                    ) : (
                      supportGroups.map((group) => (
                        <div key={group.id} className="admin-card">
                          <div className="admin-card-header">
                            <h3>{group.name}</h3>
                            <div className="admin-actions">
                              <button
                                onClick={() => handleOpenModal(group)}
                                className="icon-button"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(group.id)}
                                className="icon-button delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                          <p>{group.description}</p>
                          <span className="badge">{group.topic}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>
              {editingItem ? 'Edit' : 'Add'}{' '}
              {activeTab === 'resources' ? 'Resource' : 'Support Group'}
            </h2>
            <form onSubmit={handleSubmit}>
              {activeTab === 'resources' ? (
                <>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows="3"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Content</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Resource Type</label>
                    <select
                      value={formData.resource_type}
                      onChange={(e) =>
                        setFormData({ ...formData, resource_type: e.target.value })
                      }
                    >
                      <option value="article">Article</option>
                      <option value="video">Video</option>
                      <option value="pdf">PDF</option>
                      <option value="link">Link</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>URL</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Group Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows="4"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Topic</label>
                    <input
                      type="text"
                      value={formData.topic}
                      onChange={(e) =>
                        setFormData({ ...formData, topic: e.target.value })
                      }
                    />
                  </div>
                </>
              )}
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

