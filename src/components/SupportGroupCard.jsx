import { FiUsers, FiMessageCircle, FiArrowRight } from 'react-icons/fi'
import './Card.css'

export default function SupportGroupCard({ group, onJoin, onViewForum }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">
          <FiUsers />
        </div>
        <span className="card-category">{group.topic || 'General'}</span>
      </div>
      <h3 className="card-title">{group.name}</h3>
      <p className="card-description">{group.description}</p>
      <div className="card-actions">
        <button className="card-button" onClick={onJoin}>
          <FiMessageCircle /> Join Group
        </button>
        {onViewForum && (
          <button className="card-button secondary" onClick={onViewForum}>
            <FiArrowRight /> View Forum
          </button>
        )}
      </div>
    </div>
  )
}

