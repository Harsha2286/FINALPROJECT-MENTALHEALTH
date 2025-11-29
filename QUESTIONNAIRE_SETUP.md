# Mental Health Questionnaire Feature

## Overview
A comprehensive mental health assessment questionnaire has been added to the platform. Students can take the assessment to receive personalized recommendations based on their responses.

## Features

### 1. **Questionnaire Component**
- 20 questions covering 5 categories:
  - **Anxiety** (5 questions)
  - **Depression** (5 questions)
  - **Stress** (5 questions)
  - **Sleep** (3 questions)
  - **Social Connection** (2 questions)
- Progress tracking
- One question at a time for better focus
- Beautiful, modern UI with smooth animations

### 2. **Assessment Report**
- Overall mental health status (Excellent, Good, Moderate, Needs Attention)
- Category-wise breakdown with visual score bars
- Personalized recommendations based on scores
- Actionable tips for each area of concern
- Downloadable report (text file)
- Option to retake assessment

### 3. **Scoring System**
- Each question scored 0-3 points
- Category scores calculated automatically
- Total score out of 60 points
- Severity levels: Low, Moderate, High

### 4. **Personalized Suggestions**
- Recommendations tailored to individual scores
- Specific tips for each category
- Resource suggestions
- Next steps guidance

## Database Setup

Run the SQL script to create the questionnaire tables:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database/questionnaire_schema.sql`
4. Click "Run"

This will create:
- `questionnaire_responses` table to store assessment results
- Row Level Security (RLS) policies for data protection

## How to Access

1. **From Dashboard**: Click on the "Assessment" tab
2. **Direct URL**: Navigate to `/questionnaire`
3. Click "Start Assessment" button

## User Flow

1. User clicks "Start Assessment" from dashboard
2. Answers 20 questions one by one
3. Progress bar shows completion status
4. After completion, receives detailed report
5. Report includes:
   - Overall status
   - Category scores
   - Personalized recommendations
   - Actionable tips
6. Can download report or retake assessment

## Report Features

### Overall Status
- **Excellent** (0-14 points): Great mental health
- **Good** (15-29 points): Generally well, minor areas to improve
- **Moderate** (30-44 points): Some areas need attention
- **Needs Attention** (45-60 points): Significant concerns, professional help recommended

### Category Breakdown
Each category shows:
- Score out of maximum
- Visual progress bar
- Severity level (Low/Moderate/High)

### Recommendations
- Category-specific suggestions
- Severity-based recommendations
- Practical, actionable tips
- Resource links and next steps

## Data Storage

All assessment responses are stored in the database with:
- User ID
- Individual category scores
- Total score
- All responses (JSON format)
- Assessment date

## Privacy & Security

- Users can only view their own assessment results
- Admins can view all assessments (for analytics)
- All data protected by Row Level Security (RLS)
- No personal information shared without consent

## Future Enhancements

Potential additions:
- Historical tracking (compare assessments over time)
- Admin analytics dashboard
- Email report delivery
- Integration with therapy scheduling
- Customizable questionnaires

## Files Added

1. `database/questionnaire_schema.sql` - Database schema
2. `src/pages/Questionnaire.jsx` - Main questionnaire component
3. `src/pages/Questionnaire.css` - Questionnaire styling
4. `src/components/QuestionnaireReport.jsx` - Report display component
5. `src/components/QuestionnaireReport.css` - Report styling

## Notes

- The assessment is for informational purposes only
- Not a substitute for professional medical advice
- Users are encouraged to seek professional help if needed
- All recommendations are general guidelines

