'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface ProjectsAppProps {
  isFocused: boolean
  onExitFocused: () => void
  isMobile?: boolean
}

type Block =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }

interface Note {
  id: string
  title: string
  preview: string
  date: string
  image?: string
  tags: string[]
  blocks: Block[]
}

const PROJECTS: Note[] = [
  {
    id: 'invoice-tax-classifier',
    title: 'Invoice Tax Exemption Classifier',
    preview: 'End-to-end classification system determining whether an invoice qualifies for tax exemption and the specific legal basis — with confidence tiers and human review.',
    date: 'Recent',
    image: '/Tax.jpg',
    tags: ['LLM Pipeline', 'Confidence Tiers', 'Human Review', 'Unstructured Docs'],
    blocks: [
      { type: 'p', text: 'Built an end-to-end classification system that determines whether an invoice qualifies for tax exemption — and if so, the specific legal basis for that exemption (e.g., repairs to real property, purchase of work apparel). The input was unstructured: invoices and supporting documents with no standard format, frequently containing handwritten annotations and ambiguous line items.' },
      { type: 'h3', text: 'The Problem' },
      { type: 'p', text: 'Tax exemption classification is a judgment call with real financial consequences — the right answer isn\'t always derivable from a single field, but from the full context of the document. Like GL coding, it requires semantic understanding of unstructured inputs.' },
      { type: 'h3', text: 'How It Works' },
      { type: 'p', text: 'The system surfaces a confidence level alongside each decision, flagging low-confidence cases for human review rather than forcing a prediction. The review interface was designed for non-technical staff: plain-English explanations of each decision, organized so reviewers could quickly accept, question, or override without needing to understand the model.' },
      { type: 'h3', text: 'What It Demonstrated' },
      { type: 'p', text: 'This project demonstrated our ability to handle the full problem: messy, real-world inputs; semantic classification that requires context, not just pattern matching; and a human-in-the-loop workflow built around the realities of the people actually doing the review.' },
    ],
  },
  {
    id: 'code-detector',
    title: 'AI & Private Data Detector',
    preview: 'Classification system analyzing Python, JS, and TS code snippets to detect AI usage and private data exposure — with line-level explainability.',
    date: 'Recent',
    image: '/Pytorch.webp',
    tags: ['Ensemble LLM', 'Line-level Explainability', 'Multi-class Detection', 'Scalable Pipeline'],
    blocks: [
      { type: 'p', text: 'Designed and built a classification system that analyzes code snippets — across Python, JavaScript, and TypeScript — to detect two things: whether the code contains AI usage, and whether it exposes private data. Beyond a binary flag, the system identifies the specific lines responsible, giving reviewers an actionable, localized signal rather than a vague verdict.' },
      { type: 'h3', text: 'The Engineering Challenge' },
      { type: 'p', text: 'A single line of code can\'t always be evaluated without understanding its surrounding context. We solved this by building an ensemble of LLMs and lightweight classification models that distributes inference intelligently: reserving heavier LLM calls for ambiguous cases and routing clear-cut ones through faster, cheaper models.' },
      { type: 'h3', text: 'Outcome' },
      { type: 'p', text: 'The result was a system that was both accurate and economically viable at scale — a tradeoff that matters equally when processing 10,000 GL entries a month. This project also sharpened our approach to explainability: outputs needed to be specific enough that a non-engineer could understand exactly what was flagged and why.' },
    ],
  },
  {
    id: 'red-cross-prediction',
    title: 'Young Donor Turnout Prediction',
    preview: 'Predictive model for the American Red Cross forecasting which blood drive sites produce the highest young donor turnout. R² of 0.87.',
    date: 'American Red Cross',
    image: '/RedCross.jpg',
    tags: ['Predictive Modeling', 'Tabular Data', 'Model Evaluation', 'Stakeholder Collab'],
    blocks: [
      { type: 'p', text: 'The American Red Cross needed to forecast which blood drive sites would produce the highest turnout of young donors, using historical site-level data. We built a predictive model on tabular data that achieved an R² of 0.87 — meaning it explained roughly 87% of the variance in young donor turnout across sites.' },
      { type: 'h3', text: 'Why It\'s Relevant' },
      { type: 'p', text: 'The rigor we applied to model evaluation at Red Cross — understanding what the number means, where it breaks down, and how to interpret it honestly for a non-technical stakeholder — is directly transferable to how we\'d approach ongoing performance measurement for any classification system.' },
      { type: 'h3', text: 'Collaboration' },
      { type: 'p', text: 'It also reflects our comfort working directly with domain experts to translate a business question into a well-scoped modeling problem — the same kind of collaboration that shapes scope refinement with clients.' },
    ],
  },
  {
    id: 'saveware-invoice-classifier',
    title: 'Invoice Classification Model',
    preview: 'Custom LayoutLMV3 classifier to filter true invoices before hitting Microsoft\'s pipeline — reducing document processing costs at Saveware.',
    date: 'Saveware',
    image: '/HuggingFace.png',
    tags: ['LayoutLMV3', 'PyTorch', 'Azure ML', 'Document AI'],
    blocks: [
      { type: 'p', text: 'At Saveware, document processing costs were driven up by sending every incoming file through Microsoft\'s invoice model, even when many were not invoices. I trained a custom classification model using LayoutLMV3 to identify true invoices before they hit that pipeline.' },
      { type: 'h3', text: 'The Solution' },
      { type: 'p', text: 'The model was fine-tuned on labeled document data and deployed through Azure ML, with a PyTorch training stack and Azure cloud infrastructure. This allowed us to filter out irrelevant documents early and significantly reduce unnecessary API usage.' },
      { type: 'h3', text: 'Outcome' },
      { type: 'p', text: 'The result was lower overall processing costs while maintaining accuracy — a clean example of applying targeted ML to reduce operational overhead at scale.' },
    ],
  },
  {
    id: 'cranium-chatbot',
    title: 'Internal Knowledge Chatbot',
    preview: 'Unified internal chatbot at Cranium connecting GitHub, HubSpot, sales call transcripts, and internal docs — handled 2,000+ queries in its first month.',
    date: 'Cranium',
    image: '/RobotEmoji.png',
    tags: ['RAG', 'Internal Tools', 'Multi-source Retrieval', 'NLP'],
    blocks: [
      { type: 'p', text: 'At Cranium, teams were constantly searching across disconnected sources — GitHub, sales call transcripts, HubSpot, and internal docs — to answer routine questions. I built an internal chatbot that unified these data sources into a single interface, allowing employees to query company knowledge in natural language.' },
      { type: 'h3', text: 'How It Works' },
      { type: 'p', text: 'The system used retrieval-based techniques to surface relevant context and generate accurate responses across all connected data sources — GitHub repositories, CRM data, transcripts, and documentation.' },
      { type: 'h3', text: 'Impact' },
      { type: 'p', text: 'Within the first month, the chatbot handled over 2,000 queries and became a go-to tool for quickly accessing information, reducing time spent digging through systems and improving team productivity.' },
    ],
  },
  {
    id: 'tutorai',
    title: 'TutorAI',
    preview: '3rd place & $7,000 at the NittanyAI Challenge. An AI-powered platform helping students search course materials faster.',
    date: 'Sophomore Year',
    image: '/proj-tutorai.jpg',
    tags: ['NittanyAI Challenge', 'Similarity Search', 'Team Lead'],
    blocks: [
      { type: 'p', text: 'TutorAI is a platform that lets students search their course materials using similarity search — quickly surfacing relevant videos, slides, and notes instead of scrubbing through hours of content.' },
      { type: 'h3', text: 'Background' },
      { type: 'p', text: 'I founded and led the project during my sophomore year, working with a team of seven. The core insight was simple: students waste enormous time hunting for the right piece of course content. We set out to fix that.' },
      { type: 'h3', text: 'How It Works' },
      { type: 'p', text: 'Students type a question or topic and TutorAI uses semantic similarity search to find the most relevant moments across their uploaded course materials — lectures, readings, and supplementary videos alike.' },
      { type: 'h3', text: 'Recognition' },
      { type: 'p', text: 'TutorAI placed 3rd at the NittanyAI Challenge, one of Penn State\'s flagship AI competitions, earning our team $7,000.' },
      { type: 'h3', text: 'What I Learned' },
      { type: 'p', text: 'Leading a team of seven while also building the product was the real challenge. Keeping everyone aligned on the same vision — especially under hackathon pressure — taught me more about communication than any class.' },
    ],
  },
  {
    id: 'plottwist',
    title: 'PlotTwist',
    preview: 'Built at a NYC Google Hackathon. Helps real estate developers find off-market properties using Gemma and Google Cloud Run.',
    date: 'NYC Hackathon',
    image: '/proj-plottwist.jpg',
    tags: ['Gemma', 'Google Cloud Run', 'Next.js'],
    blocks: [
      { type: 'p', text: 'PlotTwist is a tool for real estate developers that surfaces off-market properties — deals that never hit Zillow or the MLS. Built at a Google-sponsored hackathon in New York City.' },
      { type: 'h3', text: 'The Problem' },
      { type: 'p', text: 'The best real estate deals are the ones that never hit the open market. Finding them traditionally means cold-calling, door-knocking, and years of network-building. We wanted to automate that discovery.' },
      { type: 'h3', text: 'The Solution' },
      { type: 'p', text: 'PlotTwist analyzes public records, permit filings, and distressed property signals to surface high-potential off-market leads. Developers get a ranked feed of properties worth pursuing before anyone else knows they\'re available.' },
      { type: 'h3', text: 'Tech Stack' },
      { type: 'p', text: 'The app runs on Google Cloud Run with Gemma powering the natural language analysis layer. The frontend is built in Next.js. We had 24 hours to ship it from scratch.' },
      { type: 'h3', text: 'Outcome' },
      { type: 'p', text: 'PlotTwist was one of the standout projects at the event. The tight timeline forced us to prioritize ruthlessly — a constraint that, in retrospect, made the product sharper.' },
    ],
  },
  {
    id: 'docucut',
    title: 'DocuCut',
    preview: 'Built for a local State College media company. Automates interview transcription and organization to save hours of manual work.',
    date: 'While at Penn State',
    image: '/proj-docucut.jpg',
    tags: ['Transcription', 'Python', 'Freelance'],
    blocks: [
      { type: 'p', text: 'DocuCut is a transcription and organization tool built for a local media company here in State College. It came out of a real conversation about a real problem.' },
      { type: 'h3', text: 'The Story' },
      { type: 'p', text: 'I was talking to the owner of a local media company and he mentioned that he spent an enormous amount of time manually transcribing interview footage — listening back, typing it out, and trying to organize his thoughts into something usable. It was eating hours he didn\'t have.' },
      { type: 'h3', text: 'What I Built' },
      { type: 'p', text: 'DocuCut takes raw interview footage and automatically transcribes it, segments it by speaker and topic, and outputs a clean, searchable document. What used to take hours now takes minutes.' },
      { type: 'h3', text: 'Tech Stack' },
      { type: 'p', text: 'Built in Python with a Whisper-based transcription pipeline. Transcripts are chunked and organized automatically, with a simple interface for reviewing and exporting the final output.' },
      { type: 'h3', text: 'Takeaway' },
      { type: 'p', text: 'The best product ideas come from listening. I didn\'t go looking for a startup idea — I had a conversation, heard a real frustration, and built something useful. That\'s the whole playbook.' },
    ],
  },
  {
    id: 'arcling',
    title: 'Arcling',
    preview: 'Helps stressed parents of high school students navigate the college counseling process and connect with the right advisor.',
    date: 'Recent',
    image: '/proj-arcling.png',
    tags: ['EdTech', 'Mobile', 'Product'],
    blocks: [
      { type: 'p', text: 'Arcling is an EdTech platform built with a team of educators that helps overwhelmed parents of high school students get the guidance they need to navigate the college admissions process.' },
      { type: 'h3', text: 'The Problem' },
      { type: 'p', text: 'The college admissions process is stressful — not just for students, but for their parents. Many families don\'t know where to start, what questions to ask, or who to turn to. They end up anxious, underinformed, and overwhelmed.' },
      { type: 'h3', text: 'How It Works' },
      { type: 'p', text: 'Arcling intakes parents through a guided flow that surfaces their specific concerns — whether it\'s test prep, essay strategy, school selection, or financial aid. Based on their answers, the platform routes them to a matched student counselor best equipped to help.' },
      { type: 'h3', text: 'The Goal' },
      { type: 'p', text: 'Every student deserves a shot at their dream school. Arcling tries to level the playing field by making expert college counseling accessible to families who wouldn\'t otherwise know where to look.' },
      { type: 'h3', text: 'What I Learned' },
      { type: 'p', text: 'Building with educators changed how I think about user research. They had deep context I didn\'t — knowing that surfaced assumptions I didn\'t know I was making. The best product decisions on this project came from those conversations.' },
    ],
  },
]

const BLOGS: Note[] = [
  {
    id: 'blog-rag',
    title: 'Why RAG Is Harder Than It Looks',
    preview: 'Everyone\'s building RAG pipelines. Here\'s what the tutorials don\'t tell you.',
    date: 'Mar 2025',
    tags: ['AI', 'Engineering'],
    blocks: [
      { type: 'p', text: 'Retrieval-Augmented Generation sounds simple: embed your documents, retrieve relevant chunks, stuff them into a prompt. Ship it. But spend a week debugging a production RAG system and you\'ll discover it\'s far more nuanced.' },
      { type: 'h3', text: 'The Retrieval Problem' },
      { type: 'p', text: 'The most common mistake is treating retrieval as solved. Cosine similarity over embeddings is a surprisingly blunt instrument. Two sentences can be semantically similar by the model\'s measure while being completely irrelevant to actual user intent.' },
      { type: 'h3', text: 'Chunking Strategy Matters Enormously' },
      { type: 'p', text: 'How you split your documents determines what gets retrieved. Naive sentence splitting loses context. Large paragraph chunks get diluted. Overlapping windows help, but they inflate your index and can introduce redundancy in retrieved context.' },
      { type: 'h3', text: 'Prompting Isn\'t a Patch' },
      { type: 'p', text: 'A lot of RAG failures get "fixed" with longer system prompts. This is tech debt. If your retriever is returning garbage, no amount of instruction in the system prompt will save you. Fix the retriever first.' },
    ],
  },
  {
    id: 'blog-solo',
    title: 'What Shipping Solo Teaches You',
    preview: 'Building a product alone is the fastest education in prioritization.',
    date: 'Feb 2025',
    tags: ['Product', 'Startups'],
    blocks: [
      { type: 'p', text: 'I\'ve shipped multiple projects solo. Not because I think it\'s optimal — it usually isn\'t — but because the experience of owning every layer of a product is irreplaceable.' },
      { type: 'h3', text: 'You Can\'t Hide' },
      { type: 'p', text: 'On a team, you can specialize. On a solo project, there\'s no one to hand off the parts you\'re bad at or don\'t enjoy. That\'s uncomfortable. It\'s also exactly why it\'s educational.' },
      { type: 'h3', text: 'Scope Is Everything' },
      { type: 'p', text: 'The number one killer of solo projects isn\'t skill — it\'s scope. The feature list always expands to fill available time, and then some. The discipline to cut ruthlessly is a muscle, and solo projects are its gym.' },
      { type: 'h3', text: 'Momentum Compounds' },
      { type: 'p', text: 'Small daily progress beats occasional sprints. Shipping something imperfect every few days keeps the project alive. The moment a solo project loses momentum, it usually dies.' },
    ],
  },
  {
    id: 'blog-design',
    title: 'The Interface Is the Product',
    preview: 'Most engineers treat UI as a layer on top. It\'s not.',
    date: 'Jan 2025',
    tags: ['Design', 'Engineering'],
    blocks: [
      { type: 'p', text: 'There\'s a tendency among engineers to treat the interface as a skin over "real" functionality. The logic lives in the backend; the UI just presents it. This framing is wrong, and it produces bad products.' },
      { type: 'h3', text: 'The Interface Is Where You Live' },
      { type: 'p', text: 'Users don\'t experience your data model or your API design. They experience the interface. That\'s where value is created or destroyed, where trust is built or lost.' },
      { type: 'h3', text: 'Friction Is a Bug' },
      { type: 'p', text: 'Every extra tap, every confusing label, every animation that fights the user — these are bugs. They should be tracked and fixed with the same urgency as crashes. They just don\'t show up in error logs.' },
      { type: 'h3', text: 'The Best Interfaces Are Invisible' },
      { type: 'p', text: 'You know an interface is great when you stop thinking about it. The best tools disappear and let you focus on the task. That\'s an extremely high bar, and worth chasing.' },
    ],
  },
]

type FolderId = 'projects' | 'blogs'

const FOLDERS: { id: FolderId; label: string; count: number; notes: Note[] }[] = [
  { id: 'projects', label: 'Projects', count: PROJECTS.length, notes: PROJECTS },
  { id: 'blogs', label: 'Blog', count: BLOGS.length, notes: BLOGS },
]

function NoteContent({ blocks }: { blocks: Block[] }) {
  return (
    <div className="text-[13px] leading-relaxed" style={{ color: '#c8c0a8' }}>
      {blocks.map((block, i) =>
        block.type === 'h3' ? (
          <h3 key={i} className="text-[15px] font-semibold mt-5 mb-2" style={{ color: '#e0d8c8' }}>
            {block.text}
          </h3>
        ) : (
          <p key={i} className="mb-3">{block.text}</p>
        ),
      )}
    </div>
  )
}

export default function ProjectsApp({ isFocused, onExitFocused, isMobile }: ProjectsAppProps) {
  const [selectedFolder, setSelectedFolder] = useState<FolderId>('projects')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const noteScrollRef = useRef<HTMLDivElement>(null)
  const galleryScrollRef = useRef<HTMLDivElement>(null)
  const exitDelta = useRef(0)

  const activeNotes = FOLDERS.find((f) => f.id === selectedFolder)!.notes

  const handleNoteScroll = useCallback(
    (e: React.WheelEvent) => {
      if (!isFocused) return
      const el = noteScrollRef.current
      if (!el) return
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8
      if (atBottom && e.deltaY > 0) {
        exitDelta.current += e.deltaY
        if (exitDelta.current > 120) {
          exitDelta.current = 0
          setSelectedNote(null)
        }
      } else {
        exitDelta.current = 0
        el.scrollTop += e.deltaY
      }
    },
    [isFocused],
  )

  const handleGalleryScroll = useCallback(
    (e: React.WheelEvent) => {
      if (!isFocused) return
      const el = galleryScrollRef.current
      if (!el) return
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8
      if (atBottom && e.deltaY > 0) {
        exitDelta.current += e.deltaY
        if (exitDelta.current > 120) {
          exitDelta.current = 0
          onExitFocused()
        }
      } else {
        exitDelta.current = 0
        el.scrollTop += e.deltaY
      }
    },
    [isFocused, onExitFocused],
  )

  return (
    <div
      className="flex h-full"
      style={{ background: '#1c1c1c', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* Sidebar */}
      {!isMobile && <div
        className="flex-shrink-0 flex flex-col pt-4 pb-4"
        style={{ width: 160, background: '#1a1a1a', borderRight: '1px solid #2e2e2e' }}
      >
        <p className="px-4 text-[10px] font-semibold mb-2" style={{ color: '#666' }}>iCloud</p>
        {FOLDERS.map((folder) => (
          <button
            key={folder.id}
            onClick={() => { setSelectedFolder(folder.id); setSelectedNote(null) }}
            className="flex items-center gap-2 mx-2 px-2 py-[6px] rounded-lg text-left"
            style={{
              background: selectedFolder === folder.id ? '#2e2e2e' : 'transparent',
              color: selectedFolder === folder.id ? '#fff' : '#888',
            }}
          >
            <span className="text-[13px]">🗂️</span>
            <span className="text-[12px] font-medium flex-1">{folder.label}</span>
            <span className="text-[10px]" style={{ color: '#555' }}>{folder.count}</span>
          </button>
        ))}

        {/* Bottom new folder button */}
        <div className="mt-auto px-3 pt-4">
          <button
            className="flex items-center gap-1 text-[11px]"
            style={{ color: '#666' }}
          >
            <span>+</span>
            <span>New Folder</span>
          </button>
        </div>
      </div>}

      {/* Main area — gallery or note detail */}
      <div className="flex-1 overflow-hidden flex flex-col" style={{ background: '#1e1e1e' }}>
        {/* Toolbar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-4"
          style={{ height: 36, borderBottom: '1px solid #2a2a2a' }}
        >
          <div className="flex items-center gap-3">
            {selectedNote && (
              <button
                onClick={() => setSelectedNote(null)}
                className="flex items-center gap-1 text-[12px]"
                style={{ color: '#a89060' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                {FOLDERS.find((f) => f.id === selectedFolder)!.label}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* List / Grid toggle icons */}
            <div className="w-5 h-5 flex items-center justify-center rounded opacity-40" style={{ color: '#aaa' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!selectedNote ? (
            /* Gallery grid */
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              ref={galleryScrollRef}
              className="flex-1 overflow-y-auto px-5 py-5"
              onWheel={handleGalleryScroll}
            >
              {isMobile ? (
                <div className="flex gap-2 mb-4">
                  {FOLDERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => { setSelectedFolder(f.id); setSelectedNote(null) }}
                      className="flex-1 py-1.5 rounded-lg text-[13px] font-medium"
                      style={{
                        background: selectedFolder === f.id ? '#3a3a3a' : 'transparent',
                        color: selectedFolder === f.id ? '#fff' : '#888',
                        border: '1px solid #3a3a3a',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] font-semibold mb-4" style={{ color: '#666' }}>
                  {FOLDERS.find((f) => f.id === selectedFolder)!.label}
                </p>
              )}

              <div className={isMobile ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-4 gap-3'}>
                {activeNotes.map((note) => (
                  <div key={note.id} className="flex flex-col">
                    <motion.button
                      onClick={() => setSelectedNote(note)}
                      className="w-full rounded-xl overflow-hidden group"
                      style={{
                        aspectRatio: '1 / 1',
                        background: '#242424',
                        border: '1px solid #3a3a3a',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      }}
                      whileHover={{
                        scale: 1.02,
                        borderColor: '#c8a84a',
                        transition: { duration: 0.15 },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {note.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={note.image}
                          alt={note.title}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-start p-3"
                          style={{ background: '#2e2e2e' }}
                        >
                          <p className="text-[10px] leading-relaxed line-clamp-6" style={{ color: '#888' }}>
                            {note.preview}
                          </p>
                        </div>
                      )}
                    </motion.button>

                    {/* Title below the square */}
                    <div className="mt-1.5 px-0.5">
                      <p className="text-[11px] font-semibold truncate mb-[1px]" style={{ color: '#f0f0f0' }}>
                        {note.title}
                      </p>
                      <p className="text-[10px]" style={{ color: '#666' }}>{note.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isFocused && !isMobile && (
                <p className="text-[11px] text-center mt-6 pb-2" style={{ color: '#333' }}>
                  ↓ Scroll to return
                </p>
              )}
            </motion.div>
          ) : (
            /* Note detail */
            <motion.div
              key={selectedNote.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.22 }}
              ref={noteScrollRef}
              className={`flex-1 overflow-y-auto py-6 ${isMobile ? 'px-5' : 'px-8'}`}
              style={{ background: '#1e1c18' }}
              onWheel={handleNoteScroll}
            >
              {selectedNote.image && (
                <div className="w-full rounded-xl overflow-hidden mb-6" style={{ maxHeight: 240 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedNote.image}
                    alt={selectedNote.title}
                    className="w-full object-cover"
                    style={{ maxHeight: 240 }}
                    draggable={false}
                  />
                </div>
              )}

              <p className="text-[11px] mb-2" style={{ color: '#888' }}>{selectedNote.date}</p>
              <h1 className="text-[28px] font-bold mb-3 leading-tight" style={{ color: '#f5f0e8' }}>
                {selectedNote.title}
              </h1>

              <div className="flex flex-wrap gap-1 mb-5">
                {selectedNote.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-[2px] rounded-full"
                    style={{ background: '#2e2a20', color: '#a89060', border: '1px solid #3a3020' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <NoteContent blocks={selectedNote.blocks} />

              {isFocused && !isMobile && (
                <p className="text-[11px] text-center mt-8 pb-2" style={{ color: '#333' }}>
                  ↓ Scroll to go back
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
