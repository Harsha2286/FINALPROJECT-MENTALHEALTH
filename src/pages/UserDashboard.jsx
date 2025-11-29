import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import ResourceCard from '../components/ResourceCard'
import SessionCard from '../components/SessionCard'
import SupportGroupCard from '../components/SupportGroupCard'
import Forum from '../components/Forum'
import { FiBook, FiCalendar, FiUsers, FiPlus, FiArrowLeft, FiClipboard } from 'react-icons/fi'
import './Dashboard.css'

export default function UserDashboard() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('resources')
  const [resources, setResources] = useState([])
  const [sessions, setSessions] = useState([])
  const [supportGroups, setSupportGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [sessionForm, setSessionForm] = useState({
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
          .select('*')
          .eq('student_id', profile?.id)
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

  const handleScheduleSession = async (e) => {
    e.preventDefault()
    try {
      // Convert datetime-local to ISO 8601 format with timezone
      const sessionDateTime = new Date(sessionForm.session_date)
      const isoDateTime = sessionDateTime.toISOString()

      const { error } = await supabase.from('sessions').insert({
        student_id: profile.id,
        counselor_name: sessionForm.counselor_name,
        session_date: isoDateTime,
        session_type: sessionForm.session_type,
        status: 'scheduled',
      })

      if (error) throw error

      setShowSessionModal(false)
      setSessionForm({ counselor_name: '', session_date: '', session_type: 'individual' })
      fetchData()
      alert('Session scheduled successfully!')
    } catch (error) {
      console.error('Error scheduling session:', error)
      alert('Error scheduling session. Please try again.')
    }
  }

  const handleJoinGroup = async (groupId) => {
    try {
      const { error } = await supabase.from('group_members').insert({
        group_id: groupId,
        user_id: profile.id,
      })

      if (error) throw error
      alert('Successfully joined the support group!')
      fetchData()
    } catch (error) {
      if (error.code === '23505') {
        alert('You are already a member of this group.')
      } else {
        console.error('Error joining group:', error)
        alert('Error joining group. Please try again.')
      }
    }
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {profile?.full_name || 'Student'}!</h1>
          <p>Access mental health resources and support</p>
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
            <FiCalendar /> Therapy Sessions
          </button>
          <button
            className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('groups')}
          >
            <FiUsers /> Support Groups
          </button>
          <button
            className={`tab ${activeTab === 'assessment' ? 'active' : ''}`}
            onClick={() => setActiveTab('assessment')}
          >
            <FiClipboard /> Assessment
          </button>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {activeTab === 'resources' && (
                <div className="resources-grid">
                  {resources.length === 0 ? (
                    <div className="empty-state">
                      <FiBook size={48} />
                      <p>No resources available yet</p>
                    </div>
                  ) : (
                    resources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))
                  )}
                </div>
              )}

              {activeTab === 'sessions' && (
                <div className="sessions-section">
                  <button
                    className="primary-button"
                    onClick={() => setShowSessionModal(true)}
                  >
                    <FiPlus /> Schedule New Session
                  </button>

                  <div className="sessions-list">
                    {sessions.length === 0 ? (
                      <div className="empty-state">
                        <FiCalendar size={48} />
                        <p>No sessions scheduled</p>
                      </div>
                    ) : (
                      sessions.map((session) => (
                        <SessionCard key={session.id} session={session} />
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'groups' && (
                <>
                  {selectedGroup ? (
                    <div className="forum-view">
                      <button
                        className="back-button"
                        onClick={() => setSelectedGroup(null)}
                      >
                        <FiArrowLeft /> Back to Groups
                      </button>
                      <Forum
                        groupId={selectedGroup.id}
                        groupName={selectedGroup.name}
                      />
                    </div>
                  ) : (
                    <div className="groups-grid">
                      {supportGroups.length === 0 ? (
                        <div className="empty-state">
                          <FiUsers size={48} />
                          <p>No support groups available yet</p>
                        </div>
                      ) : (
                        supportGroups.map((group) => (
                          <SupportGroupCard
                            key={group.id}
                            group={group}
                            onJoin={() => handleJoinGroup(group.id)}
                            onViewForum={() => setSelectedGroup(group)}
                          />
                        ))
                      )}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'assessment' && (
                <div className="assessment-section">
                  <div className="assessment-intro">
                    <h2>Mental Health Assessment</h2>
                    <p>
                      Take our comprehensive mental health assessment to get personalized 
                      recommendations and insights about your well-being. The assessment takes 
                      about 5-10 minutes to complete.
                    </p>
                    <button
                      className="primary-button"
                      onClick={() => window.location.href = '/questionnaire'}
                    >
                      <FiClipboard /> Start Assessment
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showSessionModal && (
        <div className="modal-overlay" onClick={() => setShowSessionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Schedule Therapy Session</h2>
            <form onSubmit={handleScheduleSession}>
              <div className="form-group">
                <label>Counselor Name</label>
                <input
                  type="text"
                  value={sessionForm.counselor_name}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, counselor_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Session Date & Time</label>
                <input
                  type="datetime-local"
                  value={sessionForm.session_date}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, session_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Session Type</label>
                <select
                  value={sessionForm.session_type}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, session_type: e.target.value })
                  }
                >
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowSessionModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

