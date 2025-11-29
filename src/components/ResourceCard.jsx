import { FiBook, FiVideo, FiFileText, FiLink } from 'react-icons/fi'
import './Card.css'

export default function ResourceCard({ resource }) {
  const getIcon = () => {
    switch (resource.resource_type) {
      case 'video':
        return <FiVideo />
      case 'pdf':
        return <FiFileText />
      case 'link':
        return <FiLink />
      default:
        return <FiBook />
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">{getIcon()}</div>
        <span className="card-category">{resource.category || 'General'}</span>
      </div>
      <h3 className="card-title">{resource.title}</h3>
      <p className="card-description">{resource.description}</p>
      {resource.url && (
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card-link"
        >
          View Resource →
        </a>
      )}
    </div>
  )
}

