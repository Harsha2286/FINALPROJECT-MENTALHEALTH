import { format } from 'date-fns'
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi'
import './Card.css'

export default function SessionCard({ session }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return '#667eea'
      case 'completed':
        return '#10b981'
      case 'cancelled':
        return '#ef4444'
      default:
        return '#666'
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">
          <FiCalendar />
        </div>
        <span
          className="card-status"
          style={{ backgroundColor: getStatusColor(session.status) }}
        >
          {session.status}
        </span>
      </div>
      <h3 className="card-title">Session with {session.counselor_name}</h3>
      <div className="card-details">
        <div className="card-detail-item">
          <FiClock />
          <span>
            {format(new Date(session.session_date), 'MMM dd, yyyy h:mm a')}
          </span>
        </div>
        <div className="card-detail-item">
          <FiUser />
          <span>{session.session_type}</span>
        </div>
      </div>
      {session.notes && (
        <p className="card-description">Notes: {session.notes}</p>
      )}
    </div>
  )
}

