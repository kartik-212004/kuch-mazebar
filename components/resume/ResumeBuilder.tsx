"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Plus,
  X,
  Loader2,
  Eye,
  Download,
  Sparkles
} from "lucide-react"
import { resumeBuilderService, resumeTemplates, type StudentProfile, type ResumeTemplate } from "@/lib/resume-builder"

interface ResumeBuilderProps {
  isOpen: boolean
  onClose: () => void
  studentData: any
  onResumeGenerated: (resumeHtml: string, template: ResumeTemplate) => void
}

export default function ResumeBuilder({ isOpen, onClose, studentData, onResumeGenerated }: ResumeBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(resumeTemplates[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [profile, setProfile] = useState<StudentProfile>(
    resumeBuilderService.generateMockStudentProfile(studentData)
  )

  const totalSteps = 6

  const updateProfile = (section: keyof StudentProfile, data: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }))
  }

  const addArrayItem = <T,>(section: keyof StudentProfile, item: T) => {
    setProfile(prev => ({
      ...prev,
      [section]: [...(prev[section] as T[]), item]
    }))
  }

  const removeArrayItem = (section: keyof StudentProfile, index: number) => {
    setProfile(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((_, i) => i !== index)
    }))
  }

  const handleGenerateResume = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 20
      })
    }, 500)

    try {
      const resumeHtml = await resumeBuilderService.generateResume(profile, selectedTemplate)
      setGenerationProgress(100)
      
      setTimeout(() => {
        onResumeGenerated(resumeHtml, selectedTemplate)
        setIsGenerating(false)
        setGenerationProgress(0)
        onClose()
        clearInterval(progressInterval)
      }, 1000)
    } catch (error) {
      console.error('Error generating resume:', error)
      alert('Error generating resume. Please try again.')
      setIsGenerating(false)
      setGenerationProgress(0)
      clearInterval(progressInterval)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepProgress = () => {
    return (currentStep / totalSteps) * 100
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Sparkles className="h-6 w-6 mr-2 text-blue-500" />
            AI Resume Builder
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Create a professional resume using AI-powered generation
          </DialogDescription>
        </DialogHeader>

        {isGenerating ? (
          <div className="py-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
            <h3 className="text-lg font-semibold mb-2">Generating Your Resume...</h3>
            <p className="text-slate-400 mb-4">Our AI is crafting your professional resume</p>
            <div className="max-w-md mx-auto">
              <Progress value={generationProgress} className="h-2" />
              <p className="text-sm text-slate-400 mt-2">{Math.round(generationProgress)}% complete</p>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm text-slate-400">{Math.round(getStepProgress())}% complete</span>
              </div>
              <Progress value={getStepProgress()} className="h-2" />
            </div>

            <Tabs value={currentStep.toString()} className="w-full">
              {/* Step 1: Template Selection */}
              <TabsContent value="1" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Choose Resume Template
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumeTemplates.map((template) => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-all ${
                          selectedTemplate.id === template.id 
                            ? 'bg-blue-600/20 border-blue-500' 
                            : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                        }`}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{template.name}</h4>
                            <Badge 
                              className={
                                template.category === 'professional' ? 'bg-blue-600' :
                                template.category === 'technical' ? 'bg-purple-600' :
                                template.category === 'creative' ? 'bg-pink-600' :
                                'bg-green-600'
                              }
                            >
                              {template.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400">{template.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Step 2: Personal Information */}
              <TabsContent value="2" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={profile.personalInfo.name}
                        onChange={(e) => updateProfile('personalInfo', { name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={profile.personalInfo.email}
                        onChange={(e) => updateProfile('personalInfo', { email: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={profile.personalInfo.phone}
                        onChange={(e) => updateProfile('personalInfo', { phone: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={profile.personalInfo.location}
                        onChange={(e) => updateProfile('personalInfo', { location: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn</Label>
                      <Input
                        value={profile.personalInfo.linkedin || ''}
                        onChange={(e) => updateProfile('personalInfo', { linkedin: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GitHub</Label>
                      <Input
                        value={profile.personalInfo.github || ''}
                        onChange={(e) => updateProfile('personalInfo', { github: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="github.com/yourusername"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Step 3: Education */}
              <TabsContent value="3" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Education
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>University</Label>
                      <Input
                        value={profile.education.university}
                        onChange={(e) => updateProfile('education', { university: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input
                        value={profile.education.degree}
                        onChange={(e) => updateProfile('education', { degree: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input
                        value={profile.education.department}
                        onChange={(e) => updateProfile('education', { department: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Year</Label>
                      <Input
                        type="number"
                        value={profile.education.year}
                        onChange={(e) => updateProfile('education', { year: parseInt(e.target.value) })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CGPA</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={profile.education.cgpa}
                        onChange={(e) => updateProfile('education', { cgpa: parseFloat(e.target.value) })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expected Graduation</Label>
                      <Input
                        value={profile.education.graduationDate}
                        onChange={(e) => updateProfile('education', { graduationDate: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="May 2025"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Step 4: Skills */}
              <TabsContent value="4" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    Skills
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Technical Skills</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {profile.skills.technical.map((skill, index) => (
                          <Badge key={index} className="bg-blue-600 hover:bg-blue-700">
                            {skill}
                            <X 
                              className="h-3 w-3 ml-1 cursor-pointer" 
                              onClick={() => {
                                const newSkills = profile.skills.technical.filter((_, i) => i !== index)
                                updateProfile('skills', { technical: newSkills })
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add technical skill"
                          className="bg-slate-700 border-slate-600 text-white"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = (e.target as HTMLInputElement).value.trim()
                              if (value) {
                                updateProfile('skills', { 
                                  technical: [...profile.skills.technical, value] 
                                })
                                ;(e.target as HTMLInputElement).value = ''
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Soft Skills</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {profile.skills.soft.map((skill, index) => (
                          <Badge key={index} className="bg-green-600 hover:bg-green-700">
                            {skill}
                            <X 
                              className="h-3 w-3 ml-1 cursor-pointer" 
                              onClick={() => {
                                const newSkills = profile.skills.soft.filter((_, i) => i !== index)
                                updateProfile('skills', { soft: newSkills })
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add soft skill"
                        className="bg-slate-700 border-slate-600 text-white"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = (e.target as HTMLInputElement).value.trim()
                            if (value) {
                              updateProfile('skills', { 
                                soft: [...profile.skills.soft, value] 
                              })
                              ;(e.target as HTMLInputElement).value = ''
                            }
                          }
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium">Languages</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {profile.skills.languages.map((lang, index) => (
                          <Badge key={index} className="bg-purple-600 hover:bg-purple-700">
                            {lang}
                            <X 
                              className="h-3 w-3 ml-1 cursor-pointer" 
                              onClick={() => {
                                const newLangs = profile.skills.languages.filter((_, i) => i !== index)
                                updateProfile('skills', { languages: newLangs })
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add language"
                        className="bg-slate-700 border-slate-600 text-white"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = (e.target as HTMLInputElement).value.trim()
                            if (value) {
                              updateProfile('skills', { 
                                languages: [...profile.skills.languages, value] 
                              })
                              ;(e.target as HTMLInputElement).value = ''
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Step 5: Experience & Projects */}
              <TabsContent value="5" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Experience & Projects
                  </h3>
                  
                  {/* Experience Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Work Experience</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => addArrayItem('experience', {
                          title: '',
                          company: '',
                          duration: '',
                          description: ''
                        })}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Experience
                      </Button>
                    </div>
                    
                    {profile.experience.map((exp, index) => (
                      <Card key={index} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium text-white">Experience {index + 1}</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => removeArrayItem('experience', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              placeholder="Job Title"
                              value={exp.title}
                              onChange={(e) => {
                                const newExp = [...profile.experience]
                                newExp[index].title = e.target.value
                                updateProfile('experience', newExp)
                              }}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                            <Input
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => {
                                const newExp = [...profile.experience]
                                newExp[index].company = e.target.value
                                updateProfile('experience', newExp)
                              }}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                            <Input
                              placeholder="Duration (e.g., Summer 2024)"
                              value={exp.duration}
                              onChange={(e) => {
                                const newExp = [...profile.experience]
                                newExp[index].duration = e.target.value
                                updateProfile('experience', newExp)
                              }}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          </div>
                          <Textarea
                            placeholder="Job description and achievements"
                            value={exp.description}
                            onChange={(e) => {
                              const newExp = [...profile.experience]
                              newExp[index].description = e.target.value
                              updateProfile('experience', newExp)
                            }}
                            className="bg-slate-700 border-slate-600 text-white mt-3"
                            rows={3}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Projects Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Projects</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => addArrayItem('projects', {
                          title: '',
                          technologies: [],
                          description: '',
                          link: ''
                        })}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Project
                      </Button>
                    </div>
                    
                    {profile.projects.map((project, index) => (
                      <Card key={index} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium text-white">Project {index + 1}</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => removeArrayItem('projects', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <Input
                              placeholder="Project Title"
                              value={project.title}
                              onChange={(e) => {
                                const newProjects = [...profile.projects]
                                newProjects[index].title = e.target.value
                                updateProfile('projects', newProjects)
                              }}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                            <Input
                              placeholder="Technologies used (comma-separated)"
                              value={project.technologies.join(', ')}
                              onChange={(e) => {
                                const newProjects = [...profile.projects]
                                newProjects[index].technologies = e.target.value.split(',').map(t => t.trim()).filter(t => t)
                                updateProfile('projects', newProjects)
                              }}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                            <Input
                              placeholder="Project Link (optional)"
                              value={project.link || ''}
                              onChange={(e) => {
                                const newProjects = [...profile.projects]
                                newProjects[index].link = e.target.value
                                updateProfile('projects', newProjects)
                              }}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                            <Textarea
                              placeholder="Project description"
                              value={project.description}
                              onChange={(e) => {
                                const newProjects = [...profile.projects]
                                newProjects[index].description = e.target.value
                                updateProfile('projects', newProjects)
                              }}
                              className="bg-slate-700 border-slate-600 text-white"
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Step 6: Review & Generate */}
              <TabsContent value="6" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Review & Generate
                  </h3>
                  
                  <Card className="bg-slate-700/50 border-slate-600 mb-6">
                    <CardHeader>
                      <CardTitle className="text-white">Resume Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Template:</span>
                          <span className="text-white ml-2">{selectedTemplate.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Name:</span>
                          <span className="text-white ml-2">{profile.personalInfo.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Education:</span>
                          <span className="text-white ml-2">{profile.education.degree}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Experience:</span>
                          <span className="text-white ml-2">{profile.experience.length} entries</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Projects:</span>
                          <span className="text-white ml-2">{profile.projects.length} entries</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Skills:</span>
                          <span className="text-white ml-2">{profile.skills.technical.length + profile.skills.soft.length} total</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-center">
                    <Button
                      onClick={handleGenerateResume}
                      className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                      disabled={isGenerating}
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate AI Resume
                    </Button>
                    <p className="text-sm text-slate-400 mt-2">
                      This will use AI to create a professional resume based on your information
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-slate-700">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Previous
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                {currentStep < totalSteps && (
                  <Button
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}