// Resume builder service using Gemini AI
export interface StudentProfile {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    linkedin?: string
    github?: string
  }
  education: {
    university: string
    degree: string
    department: string
    year: number
    cgpa: number
    graduationDate: string
  }
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages: string[]
  }
  activities: Array<{
    title: string
    category: string
    description: string
    date: string
    points: number
  }>
  certificates: Array<{
    title: string
    issuer: string
    date: string
    description: string
  }>
  projects: Array<{
    title: string
    technologies: string[]
    description: string
    link?: string
  }>
}

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  category: 'professional' | 'creative' | 'technical' | 'academic'
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and professional layout suitable for corporate roles',
    category: 'professional'
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Developer-focused template with emphasis on technical skills',
    category: 'technical'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern design with visual elements for creative fields',
    category: 'creative'
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Research-oriented template for academic positions',
    category: 'academic'
  }
]

class ResumeBuilderService {
  private apiKey: string
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
  }

  async generateResume(profile: StudentProfile, template: ResumeTemplate): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured')
    }

    const prompt = this.buildPrompt(profile, template)
    
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.candidates[0].content.parts[0].text
    } catch (error) {
      console.error('Error generating resume:', error)
      // Fallback to template-based resume generation
      return this.generateTemplateResume(profile, template)
    }
  }

  private buildPrompt(profile: StudentProfile, template: ResumeTemplate): string {
    return `
Generate a professional resume in HTML format for the following student profile. Use the "${template.name}" template style (${template.description}).

Student Information:
- Name: ${profile.personalInfo.name}
- Email: ${profile.personalInfo.email}
- Phone: ${profile.personalInfo.phone}
- Location: ${profile.personalInfo.location}
- LinkedIn: ${profile.personalInfo.linkedin || 'Not provided'}
- GitHub: ${profile.personalInfo.github || 'Not provided'}

Education:
- University: ${profile.education.university}
- Degree: ${profile.education.degree} in ${profile.education.department}
- Year: ${profile.education.year}
- CGPA: ${profile.education.cgpa}
- Expected Graduation: ${profile.education.graduationDate}

Technical Skills: ${profile.skills.technical.join(', ')}
Soft Skills: ${profile.skills.soft.join(', ')}
Languages: ${profile.skills.languages.join(', ')}

Experience:
${profile.experience.map(exp => `- ${exp.title} at ${exp.company} (${exp.duration}): ${exp.description}`).join('\n')}

Activities and Achievements:
${profile.activities.map(act => `- ${act.title} (${act.category}): ${act.description} - ${act.date}`).join('\n')}

Certifications:
${profile.certificates.map(cert => `- ${cert.title} by ${cert.issuer} (${cert.date}): ${cert.description}`).join('\n')}

Projects:
${profile.projects.map(proj => `- ${proj.title}: ${proj.description} | Technologies: ${proj.technologies.join(', ')}`).join('\n')}

Please create a well-structured, ATS-friendly HTML resume that:
1. Uses modern CSS styling with a ${template.category} design approach
2. Includes proper sections for contact info, education, experience, skills, achievements, and projects
3. Highlights the student's technical skills and academic achievements
4. Uses professional formatting and typography
5. Is optimized for both digital viewing and printing
6. Include CSS styles inline for a complete standalone HTML document

Return only the HTML content without any markdown formatting or explanations.
    `
  }

  private generateTemplateResume(profile: StudentProfile, template: ResumeTemplate): string {
    // Fallback template-based resume generation
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profile.personalInfo.name} - Resume</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            color: #1e40af;
        }
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin-top: 10px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section h2 {
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .education-item, .experience-item, .activity-item {
            margin-bottom: 15px;
        }
        .item-header {
            font-weight: bold;
            color: #374151;
        }
        .item-subheader {
            color: #6b7280;
            font-style: italic;
        }
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .skill-category {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
        }
        .skill-category h3 {
            margin: 0 0 10px 0;
            color: #1f2937;
        }
        ul {
            margin: 5px 0;
            padding-left: 20px;
        }
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
        }
        .project-card {
            border: 1px solid #e5e7eb;
            padding: 15px;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${profile.personalInfo.name}</h1>
        <div class="contact-info">
            <span>${profile.personalInfo.email}</span>
            <span>${profile.personalInfo.phone}</span>
            <span>${profile.personalInfo.location}</span>
            ${profile.personalInfo.linkedin ? `<span>LinkedIn: ${profile.personalInfo.linkedin}</span>` : ''}
            ${profile.personalInfo.github ? `<span>GitHub: ${profile.personalInfo.github}</span>` : ''}
        </div>
    </div>

    <div class="section">
        <h2>Education</h2>
        <div class="education-item">
            <div class="item-header">${profile.education.degree} in ${profile.education.department}</div>
            <div class="item-subheader">${profile.education.university} | ${profile.education.year} Year | CGPA: ${profile.education.cgpa}</div>
            <div>Expected Graduation: ${profile.education.graduationDate}</div>
        </div>
    </div>

    <div class="section">
        <h2>Skills</h2>
        <div class="skills-grid">
            <div class="skill-category">
                <h3>Technical Skills</h3>
                <ul>
                    ${profile.skills.technical.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
            <div class="skill-category">
                <h3>Soft Skills</h3>
                <ul>
                    ${profile.skills.soft.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
            <div class="skill-category">
                <h3>Languages</h3>
                <ul>
                    ${profile.skills.languages.map(lang => `<li>${lang}</li>`).join('')}
                </ul>
            </div>
        </div>
    </div>

    ${profile.experience.length > 0 ? `
    <div class="section">
        <h2>Experience</h2>
        ${profile.experience.map(exp => `
        <div class="experience-item">
            <div class="item-header">${exp.title}</div>
            <div class="item-subheader">${exp.company} | ${exp.duration}</div>
            <div>${exp.description}</div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${profile.projects.length > 0 ? `
    <div class="section">
        <h2>Projects</h2>
        <div class="projects-grid">
            ${profile.projects.map(proj => `
            <div class="project-card">
                <div class="item-header">${proj.title}</div>
                <div class="item-subheader">Technologies: ${proj.technologies.join(', ')}</div>
                <div>${proj.description}</div>
                ${proj.link ? `<div><a href="${proj.link}" target="_blank">View Project</a></div>` : ''}
            </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    <div class="section">
        <h2>Activities & Achievements</h2>
        ${profile.activities.map(act => `
        <div class="activity-item">
            <div class="item-header">${act.title}</div>
            <div class="item-subheader">${act.category} | ${act.date} | Points: ${act.points}</div>
            <div>${act.description}</div>
        </div>
        `).join('')}
    </div>

    ${profile.certificates.length > 0 ? `
    <div class="section">
        <h2>Certifications</h2>
        ${profile.certificates.map(cert => `
        <div class="activity-item">
            <div class="item-header">${cert.title}</div>
            <div class="item-subheader">${cert.issuer} | ${cert.date}</div>
            <div>${cert.description}</div>
        </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>
    `
  }

  generateMockStudentProfile(studentData: any): StudentProfile {
    return {
      personalInfo: {
        name: studentData.name || "Arjun Sharma",
        email: studentData.email || "arjun.sharma@university.edu",
        phone: "+91 9876543210",
        location: "Mumbai, India",
        linkedin: "linkedin.com/in/arjunsharma",
        github: "github.com/arjunsharma"
      },
      education: {
        university: "Indian Institute of Technology",
        degree: "Bachelor of Technology",
        department: studentData.department || "Computer Science",
        year: 3,
        cgpa: 8.7,
        graduationDate: "May 2025"
      },
      experience: [
        {
          title: "Software Development Intern",
          company: "Tech Innovators Pvt Ltd",
          duration: "Summer 2024",
          description: "Developed web applications using React and Node.js, contributing to a 20% improvement in user engagement"
        }
      ],
      skills: {
        technical: [
          "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", 
          "SQL", "MongoDB", "Git", "AWS", "Docker", "Machine Learning"
        ],
        soft: [
          "Leadership", "Problem Solving", "Team Collaboration", 
          "Communication", "Project Management", "Critical Thinking"
        ],
        languages: ["English (Fluent)", "Hindi (Native)", "Marathi (Conversational)"]
      },
      activities: [
        {
          title: "Won First Prize in Hackathon",
          category: "Technical",
          description: "Developed an AI-powered study assistant app and won first prize in the university hackathon",
          date: "March 2024",
          points: 50
        },
        {
          title: "Volunteer at Blood Donation Camp",
          category: "Social",
          description: "Organized and volunteered at the annual blood donation camp, helping coordinate 100+ donations",
          date: "February 2024",
          points: 30
        }
      ],
      certificates: [
        {
          title: "AWS Cloud Practitioner",
          issuer: "Amazon Web Services",
          date: "March 2024",
          description: "Cloud computing fundamentals and AWS services certification"
        },
        {
          title: "Google Analytics Certified",
          issuer: "Google",
          date: "February 2024",
          description: "Digital analytics and data analysis certification"
        }
      ],
      projects: [
        {
          title: "Student Management System",
          technologies: ["React", "Node.js", "MongoDB", "Express"],
          description: "Full-stack web application for managing student records and academic activities",
          link: "github.com/arjunsharma/student-management"
        },
        {
          title: "Machine Learning Price Predictor",
          technologies: ["Python", "Scikit-learn", "Pandas", "Flask"],
          description: "ML model to predict house prices using regression algorithms with 85% accuracy"
        }
      ]
    }
  }
}

export const resumeBuilderService = new ResumeBuilderService()