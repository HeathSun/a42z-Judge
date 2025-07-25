"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Upload, Github, FileText, X, Plus, ExternalLink, Loader2 } from "lucide-react"
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import Link from "next/link";
import { MagicCard } from "@/components/magicui/magic-card";
import Image from 'next/image';

// Types
interface KeywordTab {
  id: string
  label: string
  isCustom?: boolean
}

interface UploadedFile {
  id: string
  name: string
  type: "pdf" | "github" | "code" | "image"
  status: "uploading" | "completed" | "error"
}

interface Citation {
  id: string
  title: string
  url: string
  source: string
}

interface WorkflowStep {
  id: string
  title: string
  description: string
  status: "pending" | "loading" | "completed" | "error"
  isExpanded: boolean
  citations?: Citation[]
  content?: string
  substeps?: WorkflowStep[]
}

interface AITwin {
  id: string
  name: string
  avatar: string
  role: string
  thinking: boolean
  message?: string
}

// Mock data
const initialKeywords: KeywordTab[] = [
  { id: "1", label: "AI/ML" },
  { id: "2", label: "Healthcare" },
  { id: "3", label: "Mobile App" },
  { id: "4", label: "Real-time" },
  { id: "5", label: "Computer Vision" },
  { id: "6", label: "Social Impact" },
]

const aiTwins: AITwin[] = [
  { id: "pg", name: "Paul Graham", avatar: "🧠", role: "Startup Advisor", thinking: false },
  { id: "sa", name: "Sam Altman", avatar: "🚀", role: "AI Pioneer", thinking: false },
  { id: "ak", name: "Andrej Karpathy", avatar: "🤖", role: "AI Researcher", thinking: false },
  { id: "a16z", name: "Andreessen Horowitz", avatar: "💼", role: "VC Partner", thinking: false },
]

// Skeleton Components
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-zinc-700/50 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-zinc-700/30 rounded w-1/2"></div>
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse flex items-center space-x-3">
          <div className="h-3 w-3 bg-zinc-700/50 rounded-full"></div>
          <div className="h-3 bg-zinc-700/30 rounded flex-1"></div>
        </div>
      ))}
    </div>
  )
}

// Citation Tooltip Component
function CitationTooltip({ citation, children }: { citation: Citation; children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block z-50">
      <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)} className="cursor-pointer">
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl"
          >
            <div className="text-xs text-zinc-300 font-medium mb-1">{citation.source}</div>
            <div className="text-sm text-white mb-2">{citation.title}</div>
            <div className="text-xs text-zinc-400 truncate">{citation.url}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900/95"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Expandable Card Component
function WorkflowCard({ step, onToggle }: { step: WorkflowStep; onToggle: (id: string) => void }) {
  return (
    <motion.div
      layout
      className="backdrop-blur-md rounded-lg border border-white/20 shadow-lg bg-[rgba(24,24,27,0.7)] overflow-visible"
    >
      {["business-research", "hackathon-research", "ai-analysis", "scoring", "debate"].includes(step.id) ? (
        <ShinyButton
          onClick={() => onToggle(step.id)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-white font-medium">{step.title}</h3>
            </div>
          </div>
          <motion.div animate={{ rotate: step.isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </motion.div>
        </ShinyButton>
      ) : (
        <ShimmerButton
          borderRadius="0.25rem"
          onClick={() => onToggle(step.id)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-white font-medium">{step.title}</h3>
            </div>
          </div>
          <motion.div animate={{ rotate: step.isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </motion.div>
        </ShimmerButton>
      )}

      <AnimatePresence>
        {step.isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-4 space-y-4">
              {step.status === "loading" ? (
                <SkeletonList />
              ) : (
                <>
                  {step.content && <div className="text-zinc-300 text-sm leading-relaxed">{step.content}</div>}

                  {step.citations && step.citations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Sources</h4>
                      <div className="flex flex-wrap gap-2">
                        {step.citations.map((citation) => (
                          <CitationTooltip key={citation.id} citation={citation}>
                            <a
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800/50 hover:bg-zinc-700/50 rounded text-xs text-zinc-300 border border-white/10 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {citation.source}
                            </a>
                          </CitationTooltip>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.substeps && (
                    <div className="space-y-2">
                      {step.substeps.map((substep) => (
                        <WorkflowCard key={substep.id} step={substep} onToggle={onToggle} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Keyword Tab Component
function KeywordTabs({
  keywords,
  onRemove,
  onAdd,
}: {
  keywords: KeywordTab[]
  onRemove: (id: string) => void
  onAdd: (label: string) => void
}) {
  const [newKeyword, setNewKeyword] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = () => {
    if (newKeyword.trim()) {
      onAdd(newKeyword.trim())
      setNewKeyword("")
      setIsAdding(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword) => (
        <motion.div
          key={keyword.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-1 px-3 py-1 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-full text-sm text-zinc-300 border border-white/20 transition-colors group"
        >
          <span>{keyword.label}</span>
          <button onClick={() => onRemove(keyword.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
            <X className="w-3 h-3 hover:text-red-400" />
          </button>
        </motion.div>
      ))}

      {isAdding ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            onBlur={handleAdd}
            placeholder="New keyword"
            className="px-2 py-1 bg-zinc-900/50 text-zinc-300 rounded text-sm border border-white/20 focus:outline-none focus:ring-1 focus:ring-white-400 w-24"
            autoFocus
          />
        </div>
      ) : (
        <ShimmerButton
          borderRadius="0.25rem"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-3 py-1 bg-zinc-800/30 hover:bg-zinc-700/50 rounded-full text-sm text-zinc-400 border border-white/10 border-dashed transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add
        </ShimmerButton>
      )}
    </div>
  )
}

// File Upload Component
function FileUploadSection({
  files,
  onFileUpload,
}: {
  files: UploadedFile[]
  onFileUpload: (file: File, type: UploadedFile["type"]) => void
}) {
  const fileInputRefs = {
    pdf: useRef<HTMLInputElement>(null),
    github: useRef<HTMLInputElement>(null),
    code: useRef<HTMLInputElement>(null),
    image: useRef<HTMLInputElement>(null),
  }

  const uploadTypes = [
    { type: "pdf" as const, label: "Pitch Deck PDF", icon: FileText, required: true },
    { type: "github" as const, label: "GitHub Repo", icon: Github, required: false },
    { type: "code" as const, label: "Core Code Sample", icon: FileText, required: false },
    { type: "image" as const, label: "Tech Roadmap", icon: Upload, required: false },
  ]

  const handleFileSelect = (type: UploadedFile["type"]) => {
    fileInputRefs[type].current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: UploadedFile["type"]) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file, type)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {uploadTypes.map(({ type, label, icon: Icon, required }) => {
        const uploadedFile = files.find((f) => f.type === type)

        return (
          <div key={type} className="relative">
            <input
              ref={fileInputRefs[type]}
              type="file"
              onChange={(e) => handleFileChange(e, type)}
              className="hidden"
              accept={type === "pdf" ? ".pdf" : type === "image" ? "image/*" : "*"}
            />

            <ShimmerButton
              borderRadius="0.25rem"
              onClick={() => handleFileSelect(type)}
              className={`w-full p-4 rounded-lg border-2 border-dashed transition-all ${
                uploadedFile
                  ? "border-green-400/50 bg-green-400/10"
                  : "border-white/20 hover:border-white/40 bg-zinc-800/30 hover:bg-zinc-700/30"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon className={`w-6 h-6 ${uploadedFile ? "text-green-400" : "text-zinc-400"}`} />
                <div className="text-center">
                  <div className={`font-medium ${uploadedFile ? "text-green-300" : "text-zinc-300"}`}>
                    {uploadedFile ? uploadedFile.name : label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                  </div>
                  {uploadedFile && (
                    <div className="text-xs text-zinc-400 mt-1">
                      {uploadedFile.status === "uploading" && "Uploading..."}
                      {uploadedFile.status === "completed" && "Uploaded successfully"}
                      {uploadedFile.status === "error" && "Upload failed"}
                    </div>
                  )}
                </div>
              </div>
            </ShimmerButton>
          </div>
        )
      })}
    </div>
  )
}

// AI Twins Debate Component
function AITwinsDebate({ twins, debateRound }: { twins: AITwin[]; debateRound: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-zinc-300 font-medium">Carbon Panel Debate</h4>
        <div className="text-xs text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded">Round {debateRound}/3</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {twins.map((twin) => (
          <motion.div
            key={twin.id}
            className={`p-4 rounded-lg border transition-all ${
              twin.thinking ? "border-white-400/50 bg-white-400/10" : "border-white/20 bg-zinc-800/30"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">{twin.avatar}</div>
              <div>
                <div className="text-white font-medium">{twin.name}</div>
                <div className="text-xs text-zinc-400">{twin.role}</div>
              </div>
              {twin.thinking && <Loader2 className="w-4 h-4 animate-spin text-white-400 ml-auto" />}
            </div>

            {twin.message ? (
              <div className="text-sm text-zinc-300 leading-relaxed">{twin.message}</div>
            ) : twin.thinking ? (
              <SkeletonCard />
            ) : (
              <div className="text-sm text-zinc-500 italic">Waiting for turn...</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Main Component
export default function A42zJudgeWorkflow() {
  const [projectDescription, setProjectDescription] = useState("")
  const [keywords, setKeywords] = useState<KeywordTab[]>([])
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [twins] = useState<AITwin[]>(aiTwins)
  const [debateRound] = useState(1)
  const [isStarted, setIsStarted] = useState(false)
  const [showRankModal, setShowRankModal] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginFading, setLoginFading] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastY = window.scrollY;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y > lastY) {
            // setShowNav(false); // hide on scroll down
          } else if (y < lastY) {
            // setShowNav(true); // show on scroll up
          }
          // setLastScroll(y);
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 32) {
        // setShowNav(true); // show if mouse at top
      }
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0]?.clientY < 32) {
        // setShowNav(true); // show if tap top
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  // Initialize workflow steps
  useEffect(() => {
    const steps: WorkflowStep[] = [
      {
        id: "keywords",
        title: "Keyword Analysis",
        description: "AI-generated project keywords based on your description",
        status: "pending",
        isExpanded: false,
      },
      {
        id: "upload",
        title: "Document Upload",
        description: "Upload your pitch deck, code samples, and roadmap",
        status: "pending",
        isExpanded: false,
      },
      {
        id: "business-research",
        title: "Business Intelligence Scraping",
        description: "Finding related business ideas from tech news sources",
        status: "pending",
        isExpanded: false,
        citations: [
          {
            id: "1",
            title: "Similar AI Healthcare Startups Raise $50M",
            url: "https://techcrunch.com",
            source: "TechCrunch",
          },
          { id: "2", title: "Mobile Health Apps Market Analysis", url: "https://crunchbase.com", source: "Crunchbase" },
        ],
      },
      {
        id: "hackathon-research",
        title: "Hackathon Project Analysis",
        description: "Analyzing similar projects from hackathon platforms",
        status: "pending",
        isExpanded: false,
        citations: [
          { id: "3", title: "AI Healthcare Projects on DevPost", url: "https://devpost.com", source: "DevPost" },
          { id: "4", title: "Computer Vision Health Apps", url: "https://hackathon.com", source: "Hackathon.com" },
        ],
      },
      {
        id: "ai-analysis",
        title: "Multimodal AI Analysis",
        description: "a42z Engine analyzing your project comprehensively",
        status: "pending",
        isExpanded: false,
      },
      {
        id: "scoring",
        title: "Benchmark Scoring",
        description: "Generating scores based on hackathon rubric",
        status: "pending",
        isExpanded: false,
      },
      {
        id: "debate",
        title: "Carbon Panel Debate",
        description: "AI twins discussing and evaluating your project",
        status: "pending",
        isExpanded: false,
      },
    ]
    setWorkflowSteps(steps)
  }, [])

  const handleStart = async () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    if (!projectDescription.trim()) return

    setIsStarted(true)

    // Step 1: Generate keywords
    setWorkflowSteps((prev) =>
      prev.map((step) => (step.id === "keywords" ? { ...step, status: "loading", isExpanded: true } : step)),
    )

    // Simulate AI keyword generation
    setTimeout(() => {
      setKeywords(initialKeywords)
      setWorkflowSteps((prev) =>
        prev.map((step) =>
          step.id === "keywords"
            ? {
                ...step,
                status: "completed",
                content:
                  "Generated 6 relevant keywords based on your project description. You can edit these keywords to better match your project focus.",
              }
            : step,
        ),
      )
      setCurrentStep(1)
    }, 2000)
  }

  const handleFileUpload = (file: File, type: UploadedFile["type"]) => {
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      type,
      status: "uploading",
    }

    setFiles((prev) => [...prev.filter((f) => f.type !== type), newFile])

    // Simulate upload
    setTimeout(() => {
      setFiles((prev) => prev.map((f) => (f.id === newFile.id ? { ...f, status: "completed" } : f)))
    }, 1500)
  }

  const handleStepToggle = (stepId: string) => {
    setWorkflowSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, isExpanded: !step.isExpanded } : step)),
    )
  }

  const handleKeywordRemove = (id: string) => {
    setKeywords((prev) => prev.filter((k) => k.id !== id))
  }

  const handleKeywordAdd = (label: string) => {
    const newKeyword: KeywordTab = {
      id: Date.now().toString(),
      label,
      isCustom: true,
    }
    setKeywords((prev) => [...prev, newKeyword])
  }

  const continueWorkflow = () => {
    if (currentStep < workflowSteps.length - 1) {
      const nextStep = workflowSteps[currentStep + 1]

      setWorkflowSteps((prev) =>
        prev.map((step) => (step.id === nextStep.id ? { ...step, status: "loading", isExpanded: true } : step)),
      )

      // Simulate processing time
      setTimeout(() => {
        setWorkflowSteps((prev) =>
          prev.map((step) =>
            step.id === nextStep.id
              ? {
                  ...step,
                  status: "completed",
                  content: getStepContent(nextStep.id),
                }
              : step,
          ),
        )
        setCurrentStep((prev) => prev + 1)
      }, 3000)
    }
  }

  const getStepContent = (stepId: string): string => {
    switch (stepId) {
      case "business-research":
        return "Found 15 related business ideas in the healthcare AI space. Market analysis shows strong investor interest with $2.3B funding in Q4 2024."
      case "hackathon-research":
        return "Analyzed 47 similar hackathon projects. Common patterns include mobile-first approach and real-time processing capabilities."
      case "ai-analysis":
        return "Comprehensive analysis completed. Technical feasibility: High. Market potential: Strong. Innovation score: 8.2/10."
      case "scoring":
        return "Technical Implementation: 85/100, Innovation: 82/100, Market Potential: 78/100, Presentation: 88/100. Overall Score: 83.25/100"
      case "debate":
        return "Carbon Panel debate completed after 3 rounds. Consensus reached on project strengths and improvement areas."
      default:
        return "Processing completed successfully."
    }
  }

  const anyStepExpanded = workflowSteps.some(step => step.isExpanded);

  return (
    <>
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 px-6 py-2 rounded-xl backdrop-blur bg-black/60 border border-white/10 shadow-lg transition-all duration-300 sm:top-2 sm:gap-2 sm:px-2 sm:py-1 sm:text-xs sm:rounded-lg" style={{width:'max-content'}}>
        <Link href="/" passHref legacyBehavior><RainbowButton className="sm:px-2 sm:py-1" asChild><a>Home</a></RainbowButton></Link>
        <Link href="/judge" passHref legacyBehavior><RainbowButton className="sm:px-2 sm:py-1" asChild><a>Judge</a></RainbowButton></Link>
        <Link href="/manifesto" passHref legacyBehavior><RainbowButton className="sm:px-2 sm:py-1" asChild><a>Manifesto</a></RainbowButton></Link>
        <span ><RainbowButton asChild><span className="sm:px-2 sm:py-1" role="button" tabIndex={0} onClick={() => setShowRankModal(true)}>Rank</span></RainbowButton></span>
      </nav>
      {showRankModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowRankModal(false)}>
          <div
            className="mt-24 rounded-2xl bg-black/80 shadow-2xl border border-white/10 px-8 py-6 max-w-md w-full flex flex-col items-center animate-slideDown"
            style={{animation: 'slideDown 0.4s cubic-bezier(0.4,0,0.2,1)'}}
            onClick={e => e.stopPropagation()}
          >
            <span className="text-2xl font-bold text-white mb-2">🚧 Under development</span>
            <span className="text-zinc-300 text-center">The Rank feature is coming soon!</span>
            <button className="mt-6 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition" onClick={() => setShowRankModal(false)}>Close</button>
          </div>
          <style jsx global>{`
            @keyframes slideDown {
              0% { transform: translateY(-40px); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
      {/* Login Modal */}
      {showLogin && !isLoggedIn && (
        <div
          className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${loginFading ? 'opacity-0' : 'opacity-100'}`}
        >
          <MagicCard className="rounded-2xl shadow-2xl border-2 border-white/30 bg-gradient-to-b from-zinc-200 to-zinc-100 max-w-sm w-full mx-4">
            <form
              className="flex flex-col items-center gap-4 p-8"
              onSubmit={e => {
                e.preventDefault();
                if (!loginEmail.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
                  setLoginError("Please enter a valid email address.");
                  return;
                }
                setLoginError("");
                setLoginFading(true);
                setTimeout(() => {
                  setIsLoggedIn(true);
                  setShowLogin(false);
                  setLoginFading(false);
                }, 500);
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Image src="https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//a42z-black.png" alt="a42z" width={20} height={20} />
                <span className="text-xl text-black align-middle" style={{lineHeight: '1.75em', display: 'inline-block'}}>Early Access</span>
              </div>
              <input
                type="email"
                className="w-full px-4 py-2 rounded bg-zinc-100 border border-zinc-300 text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black/20"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
              />
              {loginError && <span className="text-red-400 text-sm">{loginError}</span>}
              <button type="submit" className="mt-2 px-6 py-2 rounded-lg bg-zinc-200 text-black hover:bg-zinc-300 transition font-semibold">Login</button>
            </form>
          </MagicCard>
        </div>
      )}
      <div className="fixed inset-0 -z-20 w-full h-full bg-black" />
      <div className="fixed inset-0 -z-10 w-full h-full">
        <FlickeringGrid className="w-full h-full" color="#fff" />
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className={`container mx-auto px-4 py-8 transition-all duration-300 ${anyStepExpanded ? 'mt-16' : ''}`}>
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-2 flex justify-center items-center"
              style={{ fontFamily: "'Chakra Petch', sans-serif" }}
            >
              <Image src="https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//a42z.png" alt="a42z Judge Logo" width={100} height={100} />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400"
            >
              The World's First AI Judge for Hackathons — Autonomous, Insightful, and Fair.
            </motion.p>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Input Section */}
            {!isStarted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg bg-[rgba(24,24,27,0.7)]"
              >
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe your project in 1 sentence"
                      className="w-full px-4 py-3 bg-zinc-900/50 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white-50 placeholder-zinc-500"
                    />
                  </div>
                  <ShimmerButton
                    borderRadius="0.25rem"
                    onClick={handleStart}
                    disabled={!projectDescription.trim()}
                    className="w-full py-3 bg-white-600 hover:bg-white-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Start Analysis
                  </ShimmerButton>
                </div>
              </motion.div>
            )}

            {/* Workflow Steps */}
            {isStarted && (
              <div className="space-y-4">
                {/* Keywords Section */}
                {keywords.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg bg-[rgba(24,24,27,0.7)]"
                  >
                    <h3 className="text-white font-medium mb-4">Project Keywords</h3>
                    <KeywordTabs keywords={keywords} onRemove={handleKeywordRemove} onAdd={handleKeywordAdd} />
                  </motion.div>
                )}

                {/* File Upload Section */}
                {currentStep >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg bg-[rgba(24,24,27,0.7)]"
                  >
                    <h3 className="text-white font-medium mb-4">Upload Documents</h3>
                    <FileUploadSection files={files} onFileUpload={handleFileUpload} />
                    {files.some((f) => f.status === "completed") && (
                      <div className="mt-4 flex justify-end">
                        <ShimmerButton
                          borderRadius="0.25rem"
                          onClick={continueWorkflow}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Continue Analysis
                        </ShimmerButton>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Workflow Steps */}
                {workflowSteps.slice(2).map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <WorkflowCard step={step} onToggle={handleStepToggle} />

                    {/* AI Twins Debate */}
                    {step.id === "debate" && step.status === "completed" && step.isExpanded && (
                      <div className="mt-4">
                        <AITwinsDebate twins={twins} debateRound={debateRound} />
                      </div>
                    )}

                    {/* Continue Button */}
                    {step.status === "completed" &&
                      currentStep === workflowSteps.findIndex((s) => s.id === step.id) &&
                      currentStep < workflowSteps.length - 1 && (
                        <div className="mt-4 flex justify-end">
                          <ShimmerButton
                            borderRadius="0.25rem"
                            onClick={continueWorkflow}
                            className="px-6 py-2 bg-white-600 hover:bg-white-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Continue
                          </ShimmerButton>
                        </div>
                      )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
