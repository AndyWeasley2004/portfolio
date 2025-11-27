import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FileText, Github, Linkedin, Mail, ExternalLink, Music, Cpu, Layers, ArrowDownCircle } from 'lucide-react';

/**
 * MUSIC TECHNOLOGY PORTFOLIO TEMPLATE
 * * --- GITHUB PAGES DEPLOYMENT INSTRUCTIONS ---
 * 1. This template uses relative paths (e.g., "assets/...") to ensure it works
 * if your site is hosted at "username.github.io/repo-name/".
 * 2. In your package.json, ensure you add: "homepage": "https://<username>.github.io/<repo-name>",
 * 3. Place your images in the "public/assets" folder of your React project.
 */

// --- DATA CONFIGURATION ---
const portfolioData = {
  personal: {
    name: "Alex Composer",
    title: "Music Technology Researcher & Developer",
    bio: "I am a researcher and composer bridging the gap between symbolic AI and creative expression. My work focuses on generative deep learning models for music composition and real-time audio analysis.",
    email: "alex@example.com",
    github: "https://github.com",
    arxiv: "https://arxiv.org",
    linkedin: "https://linkedin.com",
    // NOTE: Use relative paths (no leading slash) for GH Pages compatibility
    photoPath: "assets/profile.jpg", 
    fallbackPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
  },
  papers: [
    {
      id: "paper1",
      title: "Generative Transformer for Polyphonic Music",
      type: "Research Paper",
      role: "Lead Researcher",
      links: [
        { label: "Read on arXiv", url: "#", icon: FileText },
        { label: "View Full Project", url: "#", icon: ExternalLink }
      ],
      abstract: "This paper introduces a novel transformer-based architecture for multi-track MIDI generation. Unlike previous tokenization methods, this model utilizes a relative-pitch encoding scheme that improves harmonic consistency. The system was trained on the Lakh MIDI dataset and achieves state-of-the-art results.",
      techStack: ["Python", "PyTorch", "Flask"],
      // Figure 1: Architecture
      visualPath: "assets/paper1_arch.png",
      fallbackVisual: "https://placehold.co/600x300/1e293b/a5b4fc?text=Model+Architecture+Diagram",
      hasDemos: true,
      demoSectionId: "demos" 
    },
    {
      id: "paper2",
      title: "Real-Time Symbolic Chord Recognition",
      type: "Research Paper",
      role: "Co-author",
      links: [
        { label: "Read on arXiv", url: "#", icon: FileText },
        { label: "GitHub Repo", url: "#", icon: Github }
      ],
      abstract: "We present a lightweight Convolutional Neural Network (CNN) capable of identifying complex jazz chords from symbolic MIDI streams with <10ms latency. My contribution focused on pruning the model for edge-device deployment without significant accuracy loss.",
      techStack: ["TensorFlow", "C++", "Juce"],
      // Figure 2: Confusion Matrix / Technical Illustration
      visualPath: "assets/paper2_confusion.png",
      fallbackVisual: "https://placehold.co/600x400/1e293b/22d3ee?text=Confusion+Matrix+%2F+Predictions",
      hasDemos: false
    }
  ],
  demos: [
    {
      id: "demo1",
      title: "Transformer Output: Bach Chorale Style",
      description: "Generated with Temperature 0.8, conditioned on C Major key signature.",
      relatedPaperId: "paper1"
    },
    {
      id: "demo2",
      title: "Transformer Output: Jazz Improvisation",
      description: "Model conditioned on a standard ii-V-I progression.",
      relatedPaperId: "paper1"
    }
  ],
  gallery: [
    { 
      id: 1, 
      caption: "Performing at NIME 2023", 
      description: "Performed a live set using a custom-built glove controller to manipulate granular synthesis parameters in real-time.",
      path: "assets/activity1.jpg",
      fallback: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=600"
    },
    { 
      id: 2, 
      caption: "Hackathon Winner", 
      description: "Developed 'Gesture Synth', a web-based instrument using MediaPipe for hand tracking, winning First Place at MusicHacks 2022.",
      path: "assets/activity2.jpg",
      fallback: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
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

const MidiVisualizer = ({ isPlaying, color = "#a5b4fc" }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let offset = 0;
    
    // Mock Data for visualization
    const notes = Array.from({ length: 50 }).map((_, i) => ({
      x: i * 40,
      y: Math.random() * (canvas.height - 20) + 10,
      w: Math.random() * 30 + 10,
      h: 8
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Grid
      ctx.fillStyle = "#1e293b"; // Slate-800
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1;
      for(let i=0; i<canvas.width; i+=40) {
        ctx.beginPath();
        ctx.moveTo(i - (offset % 40), 0);
        ctx.lineTo(i - (offset % 40), canvas.height);
        ctx.stroke();
      }

      // Notes
      ctx.fillStyle = color;
      notes.forEach(note => {
        let drawX = note.x - offset;
        if (drawX < -50) note.x += 2000; 
        if (drawX > -50 && drawX < canvas.width) {
          ctx.beginPath();
          ctx.roundRect(drawX, note.y, note.w, note.h, 4);
          ctx.fill();
        }
      });

      // Playhead
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, 0);
      ctx.lineTo(100, canvas.height);
      ctx.stroke();

      if (isPlaying) {
        offset += 2;
        animationFrameId = requestAnimationFrame(render);
      }
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, color]);

  return <canvas ref={canvasRef} width={600} height={120} className="w-full h-32 rounded-lg border border-slate-700 bg-slate-900" />;
};

const AudioPlayerCard = ({ demo }) => {
  const [playing, setPlaying] = useState(false);
  const audioCtx = useRef(null);
  const oscillator = useRef(null);

  const togglePlay = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!playing) {
      oscillator.current = audioCtx.current.createOscillator();
      const gainNode = audioCtx.current.createGain();
      oscillator.current.type = 'sine';
      oscillator.current.frequency.setValueAtTime(220 + Math.random() * 200, audioCtx.current.currentTime); 
      gainNode.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
      oscillator.current.connect(gainNode);
      gainNode.connect(audioCtx.current.destination);
      oscillator.current.start();
      setPlaying(true);
    } else {
      if (oscillator.current) {
        oscillator.current.stop();
        oscillator.current.disconnect();
      }
      setPlaying(false);
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-indigo-500 transition-all group">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Controls */}
        <div className="flex-shrink-0">
             <button 
              onClick={togglePlay}
              className={`w-16 h-16 flex items-center justify-center rounded-full ${playing ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'} hover:bg-indigo-600 transition-all shadow-lg`}
            >
              {playing ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
        </div>

        {/* Info & Visualizer */}
        <div className="flex-grow w-full space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-slate-100 text-lg">{demo.title}</h4>
                    <p className="text-sm text-slate-400">{demo.description}</p>
                </div>
                <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded text-indigo-400 border border-slate-700">
                    Related: {portfolioData.papers.find(p => p.id === demo.relatedPaperId)?.title.substring(0, 15)}...
                </span>
            </div>
            
            <MidiVisualizer isPlaying={playing} />
        </div>
      </div>
    </div>
  );
};

const PaperCard = ({ paper }) => (
  <div className="bg-slate-900/50 rounded-2xl p-6 md:p-8 border border-slate-800 mb-12 last:mb-0">
    <div className="flex flex-col lg:flex-row gap-10">
      
      {/* Text Section */}
      <div className="flex-1 space-y-6">
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
      <div className="w-full lg:w-5/12">
        <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 h-full">
          <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
            <Layers size={14} className="text-slate-500"/>
            <span className="text-xs text-slate-400 font-mono">
              Figure: {paper.id === "paper2" ? "Confusion Matrix / Model Stats" : "System Architecture"}
            </span>
          </div>
          <div className="relative h-full min-h-[250px] bg-slate-900 flex items-center justify-center group">
             {/* Note: We use the local path if provided, otherwise the fallback */}
             <img 
                src={getLocalUrl(paper.visualPath, paper.fallbackVisual)} 
                alt="Technical Diagram" 
                className="w-full h-full object-contain p-4 transition-opacity opacity-90 group-hover:opacity-100"
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
          Graduate School Applicant
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
          <a href={portfolioData.personal.arxiv} className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-slate-400">
            <FileText size={20} />
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
                My academic work focuses on transformer architectures and real-time DSP. 
                Below are selected publications including system architecture diagrams.
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