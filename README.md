# AI-Powered Job Application & Career Tracker

An AI-powered career management platform that helps users analyze resumes, match resumes with job descriptions, track job applications, and improve resume content using AI.

## Features

### Resume Analyzer
- Upload a PDF resume
- Calculate an ATS compatibility score
- Detect technical skills
- Analyze resume strengths and weaknesses
- Get AI-powered improvement suggestions

### Job Matcher
- Upload a resume
- Paste a job description
- Calculate a resume-to-job match score
- Separate required and preferred skills
- Show matched and missing skills
- Display resume evidence for matched skills
- Identify technical and soft-skill gaps
- Generate AI recommendations
- Save matched jobs directly to the application tracker

### Application Tracker
- Add job applications
- Track company, role, location, salary and job URL
- Track application status
- Update application status
- Delete applications
- View recent applications
- Monitor application activity

### Dashboard
- Total applications
- Interview count
- Offer count
- Recent applications
- Application activity chart
- Career insights based on application activity

### AI Career Assistant
- AI-powered career guidance
- Resume improvement suggestions
- Interview preparation support

## AI Architecture

The application uses a multi-provider AI fallback system:

```text
User Request
     ↓
Gemini
     ↓
Groq
     ↓
Rule-Based Fallback