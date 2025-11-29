import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import QuestionnaireReport from '../components/QuestionnaireReport'
import { FiCheckCircle, FiCircle, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import './Questionnaire.css'

const QUESTIONS = [
  // Anxiety Questions (1-5)
  {
    id: 1,
    category: 'anxiety',
    question: 'I feel nervous, anxious, or on edge',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 2,
    category: 'anxiety',
    question: 'I worry too much about different things',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 3,
    category: 'anxiety',
    question: 'I have trouble relaxing',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 4,
    category: 'anxiety',
    question: 'I become easily annoyed or irritable',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 5,
    category: 'anxiety',
    question: 'I feel afraid as if something awful might happen',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  // Depression Questions (6-10)
  {
    id: 6,
    category: 'depression',
    question: 'I feel down, depressed, or hopeless',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 7,
    category: 'depression',
    question: 'I have little interest or pleasure in doing things',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 8,
    category: 'depression',
    question: 'I feel tired or have little energy',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 9,
    category: 'depression',
    question: 'I have trouble concentrating on things',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 10,
    category: 'depression',
    question: 'I feel bad about myself or feel like a failure',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  // Stress Questions (11-15)
  {
    id: 11,
    category: 'stress',
    question: 'I feel overwhelmed by my responsibilities',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 12,
    category: 'stress',
    question: 'I have difficulty managing my workload',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 13,
    category: 'stress',
    question: 'I feel unable to control important things in my life',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 14,
    category: 'stress',
    question: 'I feel that difficulties are piling up',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 15,
    category: 'stress',
    question: 'I feel unable to cope with all the things I have to do',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  // Sleep Questions (16-18)
  {
    id: 16,
    category: 'sleep',
    question: 'I have trouble falling or staying asleep',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 17,
    category: 'sleep',
    question: 'I feel tired even after sleeping',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 18,
    category: 'sleep',
    question: 'My sleep schedule is irregular',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  // Social Questions (19-20)
  {
    id: 19,
    category: 'social',
    question: 'I feel isolated or disconnected from others',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  },
  {
    id: 20,
    category: 'social',
    question: 'I have difficulty maintaining relationships',
    options: [
      { text: 'Not at all', value: 0 },
      { text: 'Several days', value: 1 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 3 }
    ]
  }
]

export default function Questionnaire() {
  const { profile } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showReport, setShowReport] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnswer = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    })
  }

  const calculateScores = () => {
    let anxietyScore = 0
    let depressionScore = 0
    let stressScore = 0
    let sleepScore = 0
    let socialScore = 0

    QUESTIONS.forEach(q => {
      const answer = answers[q.id] || 0
      if (q.category === 'anxiety') anxietyScore += answer
      else if (q.category === 'depression') depressionScore += answer
      else if (q.category === 'stress') stressScore += answer
      else if (q.category === 'sleep') sleepScore += answer
      else if (q.category === 'social') socialScore += answer
    })

    const totalScore = anxietyScore + depressionScore + stressScore + sleepScore + socialScore

    return {
      totalScore,
      anxietyScore,
      depressionScore,
      stressScore,
      sleepScore,
      socialScore
    }
  }

  const getSuggestions = (scores) => {
    const suggestions = []
    const maxScore = 15 // Maximum possible score per category (5 questions * 3)

    if (scores.anxietyScore >= 10) {
      suggestions.push({
        category: 'Anxiety',
        severity: scores.anxietyScore >= 12 ? 'High' : 'Moderate',
        tips: [
          'Practice deep breathing exercises daily (5-10 minutes)',
          'Try mindfulness meditation or yoga',
          'Consider scheduling a therapy session to discuss anxiety management',
          'Limit caffeine intake and maintain a regular sleep schedule',
          'Engage in physical activity for at least 30 minutes daily'
        ],
        resources: 'Check out our anxiety management resources in the Resources section'
      })
    }

    if (scores.depressionScore >= 10) {
      suggestions.push({
        category: 'Depression',
        severity: scores.depressionScore >= 12 ? 'High' : 'Moderate',
        tips: [
          'Reach out to friends, family, or support groups',
          'Consider professional counseling or therapy',
          'Establish a daily routine with small, achievable goals',
          'Engage in activities you once enjoyed, even if you don\'t feel like it',
          'Practice self-compassion and avoid self-criticism'
        ],
        resources: 'Explore our depression support resources and consider joining a support group'
      })
    }

    if (scores.stressScore >= 10) {
      suggestions.push({
        category: 'Stress',
        severity: scores.stressScore >= 12 ? 'High' : 'Moderate',
        tips: [
          'Break tasks into smaller, manageable steps',
          'Practice time management and prioritize important tasks',
          'Take regular breaks throughout your day',
          'Learn to say no to additional commitments when overwhelmed',
          'Consider stress management techniques like progressive muscle relaxation'
        ],
        resources: 'Access our stress management resources and consider scheduling a counseling session'
      })
    }

    if (scores.sleepScore >= 6) {
      suggestions.push({
        category: 'Sleep',
        severity: scores.sleepScore >= 9 ? 'High' : 'Moderate',
        tips: [
          'Maintain a consistent sleep schedule (even on weekends)',
          'Create a relaxing bedtime routine',
          'Avoid screens 1 hour before bedtime',
          'Keep your bedroom cool, dark, and quiet',
          'Avoid caffeine and heavy meals close to bedtime'
        ],
        resources: 'Check our sleep hygiene resources for more tips'
      })
    }

    if (scores.socialScore >= 4) {
      suggestions.push({
        category: 'Social Connection',
        severity: scores.socialScore >= 5 ? 'High' : 'Moderate',
        tips: [
          'Join a support group to connect with others',
          'Reach out to friends or family members regularly',
          'Participate in campus activities or clubs',
          'Consider group therapy sessions',
          'Practice active listening and open communication'
        ],
        resources: 'Explore our support groups and community forums'
      })
    }

    if (suggestions.length === 0) {
      suggestions.push({
        category: 'Overall Well-being',
        severity: 'Good',
        tips: [
          'Continue maintaining healthy habits',
          'Stay connected with your support network',
          'Practice regular self-care activities',
          'Keep up with regular exercise and balanced nutrition',
          'Consider periodic check-ins with mental health resources'
        ],
        resources: 'Continue exploring our resources to maintain your well-being'
      })
    }

    return suggestions
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      alert('Please answer all questions before submitting.')
      return
    }

    setLoading(true)
    const scores = calculateScores()
    const suggestions = getSuggestions(scores)

    const report = {
      scores,
      suggestions,
      answers,
      date: new Date().toISOString()
    }

    // Save to database
    try {
      const { error } = await supabase.from('questionnaire_responses').insert({
        user_id: profile.id,
        total_score: scores.totalScore,
        anxiety_score: scores.anxietyScore,
        depression_score: scores.depressionScore,
        stress_score: scores.stressScore,
        sleep_score: scores.sleepScore,
        social_score: scores.socialScore,
        responses: answers
      })

      if (error) throw error

      setReportData(report)
      setShowReport(true)
    } catch (error) {
      console.error('Error saving response:', error)
      // Still show report even if save fails
      setReportData(report)
      setShowReport(true)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100
  const question = QUESTIONS[currentQuestion]
  const isAnswered = answers[question.id] !== undefined

  if (showReport && reportData) {
    return <QuestionnaireReport report={reportData} onRetake={() => {
      setShowReport(false)
      setCurrentQuestion(0)
      setAnswers({})
      setReportData(null)
    }} />
  }

  return (
    <div className="questionnaire-page">
      <Navbar />
      <div className="questionnaire-container">
        <div className="questionnaire-header">
          <h1>Mental Health Assessment</h1>
          <p>Answer these questions to get personalized recommendations</p>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <span className="progress-text">
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </span>
        </div>

        <div className="question-card">
          <div className="question-category">
            {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
          </div>
          <h2 className="question-text">{question.question}</h2>

          <div className="options-container">
            {question.options.map((option, index) => {
              const isSelected = answers[question.id] === option.value
              return (
                <button
                  key={index}
                  className={`option-button ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAnswer(question.id, option.value)}
                >
                  {isSelected ? <FiCheckCircle className="option-icon" /> : <FiCircle className="option-icon" />}
                  <span>{option.text}</span>
                </button>
              )
            })}
          </div>

          <div className="question-navigation">
            <button
              className="nav-button secondary"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <FiArrowLeft /> Previous
            </button>
            <button
              className="nav-button primary"
              onClick={handleNext}
              disabled={!isAnswered || loading}
            >
              {loading ? 'Processing...' : currentQuestion === QUESTIONS.length - 1 ? 'Submit' : 'Next'}
              {!loading && currentQuestion !== QUESTIONS.length - 1 && <FiArrowRight />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

