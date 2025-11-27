import React, { useEffect, useRef } from 'react';
import { FileText, Github, Mail, ExternalLink, Music, Cpu, Layers, ArrowDownCircle } from 'lucide-react';
import 'html-midi-player';

// --- ICONS ---
const GoogleScholar = ({ size = 24, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
  </svg>
);

// --- DATA CONFIGURATION ---
const portfolioData = {
  personal: {
    name: "Mingyang Yao",
    title: "Undergraduate Student at UC San Diego",
    bio: "I'm Mingyang Yao, a senior undergraduate of Mathematics-Computer Science and Cognitive Science at UCSD. My research interests lies in generative models for music and music information retrieval.",
    email: "m5yao@ucsd.edu",
    github: "https://github.com/AndyWeasley2004",
    googleScholar: "https://scholar.google.com",
    photoPath: "assets/photo.jpg", 
  },
  papers: [
    {
      id: "paper1",
      title: "From Generality to Mastery: Composer-Style Symbolic Music Generation via Large-Scale Pre-training",
      type: "Research Paper",
      role: "First Author",
      links: [
        { label: "Read on arXiv", url: "https://arxiv.org/abs/2506.17497", icon: FileText },
        { label: "View Full Project Demo", url: "https://generality-mastery.github.io/", icon: ExternalLink },
        { label: "GitHub Repo", url: "https://github.com/AndyWeasley2004/Generality-to-Mastery", icon: Github }
      ],
      abstract: "We address data scarcity in style-specific generation using a two-stage training paradigm. By pre-training a model on a broad corpus with extended REMI representation and fine-tuning with lightweight adapters on verified datasets of Bach, Mozart, Beethoven, and Chopin, we achieve superior style accuracy and musicality compared to concurrent baselines.",
      techStack: ["PyTorch", "MIDI", "Transformer"],
      // Figure 1: Architecture
      visualPath: "assets/paper_1_arch.png",
      hasDemos: true,
      demoSectionId: "demos" 
    },
    {
      id: "paper2",
      title: "BACHI: Boundary-Aware Symbolic Chord Recognition Through Masked Iterative Decoding on Pop and Classical Music",
      type: "Research Paper",
      role: "First Author",
      links: [
        { label: "Read on arXiv", url: "https://arxiv.org/abs/2510.06528", icon: FileText },
        { label: "View Full Project Demo", url: "https://andyweasley2004.github.io/BACHI/", icon: ExternalLink },
        { label: "GitHub Repo", url: "https://github.com/AndyWeasley2004/BACHI_Chord_Recognition", icon: Github }
      ],
      abstract: "We propose BACHI, a symbolic chord recognition model that mirrors human analysis by iteratively ranking chord roots, qualities, and bass notes. We also introduce POP909-CL, an enhanced dataset with tempo-aligned labels. Experiments demonstrate state-of-the-art performance on both classical and pop music benchmarks.",
      techStack: ["PyTorch", "Piano Roll", "Chord"],
      // Figure 2: Confusion Matrix / Technical Illustration
      visualPath: "assets/paper_2_arch.png",
      hasDemos: false
    }
  ],
  demos: [
    {
      id: "demo1",
      title: "Generality-to-Mastery Output: Bach Style",
      description: "Generated with Temperature 1.1, Tempo 120, 4/4 Time Signature",
      relatedPaperId: "paper1",
      midiUrl: "assets/bach.mid"
    },
    {
      id: "demo2",
      title: "Generality-to-Mastery Output: Chopin Style",
      description: "Generated with Temperature 1.1, Tempo 160, 3/4 Time Signature",
      relatedPaperId: "paper1",
      midiUrl: "assets/chopin.mid"
    }
  ],
  gallery: [
    { 
      id: 1, 
      caption: "Grade 10 Amateur Piano Exam", 
      description: "I passed the Grade 10 (highest level) of Amateur Piano Exam in Chinese Musician Association in 2015, after 5 years of outside-class piano lessons",
      path: "assets/piano_grade10.png",
    },
    { 
      id: 2, 
      caption: "New Year in High School", 
      description: "I performed Mendelssohn's Spring Song (Op. 62, No. 6) at New Year's Party in High School in 2022",
      path: "/assets/new_year.jpeg",
    },
    { 
      id: 3, 
      caption: "Audio Workshop Teaching", 
      description: "Designed and taught a 2-day workshop on Python for Audio Signal Processing to undergraduate students.",
      path: "assets/activity3.jpg",
      fallback: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600"
    }
  ]
};

// --- HELPER: Handles Local Files vs Fallbacks ---
const getLocalUrl = (localPath, fallbackUrl) => {
  // In production (deployed), we rely on the relative path resolving correctly.
  // For this preview environment, we fallback to the online URL if the local file isn't found.
  // Note: In a real React app, you might use: process.env.PUBLIC_URL + '/' + localPath
  return fallbackUrl || localPath; 
};

// --- COMPONENTS ---

const AudioPlayerCard = ({ demo }) => {
  const visualizerRef = useRef(null);

  useEffect(() => {
    // Set config via JavaScript since web components don't accept object attributes
    if (visualizerRef.current) {
      visualizerRef.current.config = {
        noteRGB: '99, 179, 237',        // Bright sky blue for inactive notes (visible on dark bg)
        activeNoteRGB: '251, 191, 36',  // Bright amber/gold for active notes (high contrast)
        pixelsPerTimeStep: 60,          // Wider spacing for better visibility
        noteHeight: 6,                  // Taller notes for better visibility
        minPitch: 21,                   // Piano range start (A0)
        maxPitch: 108                   // Piano range end (C8)
      };
    }
  }, [demo.id]);

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-indigo-500 transition-all group">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-slate-100 text-lg">{demo.title}</h4>
            <p className="text-sm text-slate-400">{demo.description}</p>
          </div>
          <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded text-indigo-400 border border-slate-700">
            Related: {portfolioData.papers.find(p => p.id === demo.relatedPaperId)?.title.substring(0, 15)}...
          </span>
        </div>

        <div className="w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-700 p-4">
          <midi-player
            src={demo.midiUrl}
            sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
            visualizer={`#visualizer-${demo.id}`}
            style={{ width: '100%' }}
          ></midi-player>
          <midi-visualizer
            ref={visualizerRef}
            type="piano-roll"
            src={demo.midiUrl}
            id={`visualizer-${demo.id}`}
            style={{ 
              width: '100%', 
              height: '200px', 
              marginTop: '1rem', 
              borderRadius: '0.5rem', 
              background: '#0f172a',
              display: 'block'
            }}
          ></midi-visualizer>
        </div>
      </div>
    </div>
  );
};

const PaperCard = ({ paper }) => (
  <div className="bg-slate-900/50 rounded-2xl p-6 md:p-8 border border-slate-800 mb-12 last:mb-0">
    <div className="flex flex-col gap-10">
      
      {/* Text Section */}
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <FileText size={14}/>
            {paper.type}
          </div>
          <h3 className="text-2xl font-bold text-slate-100">{paper.title}</h3>
        </div>

        <div className="prose prose-invert prose-sm text-slate-300 leading-relaxed">
          <p>{paper.abstract}</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase">My Role</span>
          <p className="text-slate-200 text-sm font-medium">{paper.role}</p>
        </div>

        <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase">Tech Stack</span>
            <div className="flex flex-wrap gap-2">
            {paper.techStack.map(tech => (
                <span key={tech} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
                {tech}
                </span>
            ))}
            </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800">
          {paper.links.map((link, i) => (
            <a key={i} href={link.url} className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              <link.icon size={16} />
              {link.label}
            </a>
          ))}
          {/* Hyperlink to Demos Section */}
          {paper.hasDemos && (
            <a 
                href={`#${paper.demoSectionId}`} 
                className="flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors ml-auto bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20"
            >
                <Music size={16} />
                Listen to Audio Demos
                <ArrowDownCircle size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Visual Section */}
      <div className="w-full">
        <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
          <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
            <Layers size={14} className="text-slate-500"/>
            <span className="text-xs text-slate-400 font-mono">
               Figure: {"Model Architecture"}
            </span>
          </div>
          <div className="relative min-h-[300px] bg-slate-900 flex items-center justify-center group">
             {/* Note: We use the local path if provided, otherwise the fallback */}
             <img 
                src={getLocalUrl(paper.visualPath, paper.fallbackVisual)} 
                alt="Technical Diagram" 
                className="w-full h-auto object-contain p-4 transition-opacity opacity-90 group-hover:opacity-100"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Section = ({ title, children, id, icon: Icon }) => (
  <section id={id} className="py-20 border-b border-slate-800 last:border-0 scroll-mt-20">
    <div className="container mx-auto px-6 max-w-6xl">
      <h2 className="text-3xl font-bold text-slate-100 mb-12 flex items-center gap-3">
        {Icon && <Icon className="text-indigo-500" size={32} />}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-indigo-100">
            {title}
        </span>
      </h2>
      {children}
    </div>
  </section>
);

const NavBar = () => (
  <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
      <span className="font-bold text-xl text-slate-100 tracking-tight">
        {portfolioData.personal.name.split(' ')[0]}<span className="text-indigo-500">.Portfolio</span>
      </span>
      <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
        <a href="#about" className="hover:text-indigo-400 transition-colors">About</a>
        <a href="#papers" className="hover:text-indigo-400 transition-colors">Papers</a>
        <a href="#demos" className="hover:text-indigo-400 transition-colors">MIDI Demos</a>
        <a href="#activities" className="hover:text-indigo-400 transition-colors">Activities</a>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <header id="about" className="pt-32 pb-20 container mx-auto px-6 max-w-6xl">
    <div className="flex flex-col md:flex-row gap-12 items-start">
      <div className="flex-1 space-y-6">
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20">
          Music Technology Applicant
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-100 leading-tight">
          {portfolioData.personal.name}
        </h1>
        <h2 className="text-2xl text-slate-400 font-light">
          {portfolioData.personal.title}
        </h2>
        <p className="text-slate-300 leading-relaxed text-lg max-w-xl">
          {portfolioData.personal.bio}
        </p>
        
        <div className="flex gap-4 pt-4">
          <a href={portfolioData.personal.github} className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-slate-400">
            <Github size={20} />
          </a>
          <a href={portfolioData.personal.googleScholar} className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-slate-400">
            <GoogleScholar size={20} />
          </a>
          <a href={`mailto:${portfolioData.personal.email}`} className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-slate-400">
            <Mail size={20} />
          </a>
        </div>
      </div>

      <div className="w-full md:w-auto flex justify-center md:justify-end">
        <div className="relative w-64 md:w-72 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-slate-700 group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent z-10"></div>
            <img 
              src={getLocalUrl(portfolioData.personal.photoPath, portfolioData.personal.fallbackPhoto)} 
              alt={portfolioData.personal.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 z-20">
                <p className="text-white text-sm font-semibold">Contact</p>
                <p className="text-slate-300 text-xs">{portfolioData.personal.email}</p>
            </div>
        </div>
      </div>
    </div>
  </header>
);

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500/30 scroll-smooth">
      <NavBar />
      <Hero />
      
      {/* SECTION A: PAPERS */}
      <Section title="Research Papers" id="papers" icon={FileText}>
        <div className="space-y-4">
            <p className="text-slate-400 max-w-2xl mb-12">
                My academic work focuses on controllable symbolic music generation and MIR tasks such as symbolic chord recognition. 
                Below are selected publications including model architecture diagrams.
            </p>
            {portfolioData.papers.map(paper => (
                <PaperCard key={paper.id} paper={paper} />
            ))}
        </div>
      </Section>

      {/* SECTION B: MIDI DEMOS */}
      <Section title="Code & MIDI Demos" id="demos" icon={Music}>
        <div className="grid grid-cols-1 gap-6">
            <div className="mb-6">
                <p className="text-slate-400 max-w-2xl">
                    Audio demonstrations of the generative models discussed in the papers above. 
                    These visualizations render real-time MIDI data (simulated).
                </p>
            </div>
            {portfolioData.demos.map(demo => (
                <AudioPlayerCard key={demo.id} demo={demo} />
            ))}
        </div>
      </Section>

      {/* SECTION C: ACTIVITIES */}
      <Section title="Activities & Gallery" id="activities" icon={Cpu}>
        <p className="text-slate-400 max-w-2xl mb-8">
            Documentation of performances, hackathons, and teaching experiences.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolioData.gallery.map((item) => (
            <div key={item.id} className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-colors group">
              <div className="aspect-video relative overflow-hidden">
                <img 
                    src={getLocalUrl(item.path, item.fallback)} 
                    alt={item.caption} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-100 mb-2 text-lg">{item.caption}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <footer className="bg-slate-950 py-12 border-t border-slate-800 text-center">
        <div className="container mx-auto px-6">
          <p className="text-slate-500 text-sm mb-2">© {new Date().getFullYear()} {portfolioData.personal.name}. All rights reserved.</p>
          <p className="text-slate-600 text-xs">
            Built with React & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
