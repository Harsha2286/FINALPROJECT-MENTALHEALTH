import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiHeart, FiArrowLeft, FiDownload } from 'react-icons/fi'
import './QuestionnaireReport.css'

export default function QuestionnaireReport({ report, onRetake }) {
  const navigate = useNavigate()
  const { scores, suggestions, date } = report

  const getOverallStatus = () => {
    const totalMax = 60 // 20 questions * 3 max value
    const percentage = (scores.totalScore / totalMax) * 100

    if (percentage < 25) return { level: 'Excellent', color: '#10b981', icon: FiCheckCircle }
    if (percentage < 50) return { level: 'Good', color: '#3b82f6', icon: FiCheckCircle }
    if (percentage < 75) return { level: 'Moderate', color: '#f59e0b', icon: FiAlertTriangle }
    return { level: 'Needs Attention', color: '#ef4444', icon: FiAlertCircle }
  }

  const getCategoryStatus = (score, max = 15) => {
    const percentage = (score / max) * 100
    if (percentage < 40) return { level: 'Low', color: '#10b981' }
    if (percentage < 70) return { level: 'Moderate', color: '#f59e0b' }
    return { level: 'High', color: '#ef4444' }
  }

  const overall = getOverallStatus()
  const StatusIcon = overall.icon

  const handleDownload = () => {
    const reportText = `
Mental Health Assessment Report
Generated: ${new Date(date).toLocaleDateString()}

OVERALL STATUS: ${overall.level}
Total Score: ${scores.totalScore}/60

CATEGORY SCORES:
- Anxiety: ${scores.anxietyScore}/15
- Depression: ${scores.depressionScore}/15
- Stress: ${scores.stressScore}/15
- Sleep: ${scores.sleepScore}/9
- Social: ${scores.socialScore}/6

RECOMMENDATIONS:
${suggestions.map(s => `
${s.category} (${s.severity}):
${s.tips.map(tip => `  • ${tip}`).join('\n')}
`).join('\n')}
    `.trim()

    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mental-health-report-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="report-page">
      <Navbar />
      <div className="report-container">
        <div className="report-header">
          <h1>Your Mental Health Assessment Report</h1>
          <p>Generated on {new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>

        <div className="overall-status-card">
          <div className="status-icon" style={{ color: overall.color }}>
            <StatusIcon />
          </div>
          <div className="status-content">
            <h2>Overall Status: {overall.level}</h2>
            <p className="status-score">Total Score: {scores.totalScore} / 60</p>
          </div>
        </div>

        <div className="category-scores">
          <h3>Category Breakdown</h3>
          <div className="scores-grid">
            {[
              { name: 'Anxiety', score: scores.anxietyScore, max: 15 },
              { name: 'Depression', score: scores.depressionScore, max: 15 },
              { name: 'Stress', score: scores.stressScore, max: 15 },
              { name: 'Sleep', score: scores.sleepScore, max: 9 },
              { name: 'Social Connection', score: scores.socialScore, max: 6 }
            ].map(category => {
              const status = getCategoryStatus(category.score, category.max)
              const percentage = (category.score / category.max) * 100
              return (
                <div key={category.name} className="score-card">
                  <div className="score-header">
                    <span className="score-name">{category.name}</span>
                    <span className="score-badge" style={{ backgroundColor: `${status.color}20`, color: status.color }}>
                      {status.level}
                    </span>
                  </div>
                  <div className="score-value">
                    {category.score} / {category.max}
                  </div>
                  <div className="score-bar">
                    <div 
                      className="score-bar-fill" 
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: status.color 
                      }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="recommendations-section">
          <h3>
            <FiHeart className="section-icon" />
            Personalized Recommendations
          </h3>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="recommendation-card">
              <div className="recommendation-header">
                <h4>{suggestion.category}</h4>
                <span className={`severity-badge ${suggestion.severity.toLowerCase()}`}>
                  {suggestion.severity}
                </span>
              </div>
              <div className="recommendation-tips">
                <h5>Actionable Tips:</h5>
                <ul>
                  {suggestion.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>
              <div className="recommendation-resources">
                <strong>💡 Next Steps:</strong> {suggestion.resources}
              </div>
            </div>
          ))}
        </div>

        <div className="report-actions">
          <button className="action-button secondary" onClick={onRetake}>
            <FiArrowLeft /> Retake Assessment
          </button>
          <button className="action-button secondary" onClick={handleDownload}>
            <FiDownload /> Download Report
          </button>
          <button className="action-button primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>

        <div className="report-footer">
          <p>
            <strong>Note:</strong> This assessment is for informational purposes only and is not a substitute 
            for professional medical advice, diagnosis, or treatment. If you're experiencing severe symptoms, 
            please consult with a mental health professional or contact emergency services.
          </p>
        </div>
      </div>
    </div>
  )
}

