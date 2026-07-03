import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  BookOpen, Trophy, Code, Zap, Star, Search, Bell, User,
  ChevronRight, Heart, Clock, MapPin, Award, TrendingUp,
  Newspaper, Gamepad2, ChevronLeft, CheckCircle, Terminal,
  GitBranch, Layers, Users, Globe, Calendar, Flame, ArrowRight,
  Play, Bookmark, Filter, DollarSign, Lock, Sparkles, Shield,
  Home, BarChart2, Menu, X, RefreshCw, Hash, Cpu, MessageSquare,
  Check, AlignLeft, Bug
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type Page = "home" | "resources" | "hackathons" | "profile" | "blog" | "novel" | "games";

type Character = "nex" | "aria" | "kai";

interface VNScene {
  id: string;
  background: "classroom" | "rooftop" | "server" | "hackathon" | "void";
  character: Character | null;
  charSide?: "left" | "right";
  speaker: string;
  dialogue: string;
  choices?: { text: string; to: string }[];
  next?: string;
  isChapterBreak?: boolean;
  chapterTitle?: string;
}

interface Hackathon {
  id: number;
  name: string;
  date: string;
  location: string;
  type: "online" | "in-person" | "hybrid";
  prize: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  spots: number;
  registered?: boolean;
}

interface Resource {
  id: number;
  title: string;
  category: string;
  duration: string;
  progress: number;
  xp: number;
  locked?: boolean;
  icon: ReactNode;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  likes: number;
  featured?: boolean;
  image: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const HACKATHONS: Hackathon[] = [
  { id: 1, name: "HackMIT 2025", date: "Oct 11–13, 2025", location: "Cambridge, MA", type: "in-person", prize: "$50,000", difficulty: "Advanced", tags: ["AI", "Web3", "Climate"], spots: 150, registered: true },
  { id: 2, name: "MLH Global Hack", date: "Nov 1–3, 2025", location: "Online", type: "online", prize: "$10,000", difficulty: "Beginner", tags: ["Open Source", "Beginner-Friendly", "Social Impact"], spots: 2000 },
  { id: 3, name: "HackTech Pasadena", date: "Jan 17–19, 2026", location: "Pasadena, CA", type: "in-person", prize: "$25,000", difficulty: "Intermediate", tags: ["Hardware", "HealthTech", "Education"], spots: 300 },
  { id: 4, name: "PennApps XXVI", date: "Sep 6–8, 2025", location: "Philadelphia, PA", type: "in-person", prize: "$30,000", difficulty: "Intermediate", tags: ["Fintech", "AI", "Accessibility"], spots: 400 },
  { id: 5, name: "TreeHacks 2026", date: "Feb 14–16, 2026", location: "Stanford, CA", type: "hybrid", prize: "$20,000", difficulty: "Intermediate", tags: ["Biotech", "Sustainability", "EdTech"], spots: 350 },
  { id: 6, name: "DevPost Hackfest", date: "Dec 5–7, 2025", location: "Online", type: "online", prize: "$5,000", difficulty: "Beginner", tags: ["Web Dev", "Mobile", "APIs"], spots: 5000 },
];

const RESOURCES: Resource[] = [
  { id: 1, title: "Python Fundamentals", category: "Programming", duration: "4h 30m", progress: 85, xp: 500, icon: <Code className="w-5 h-5" /> },
  { id: 2, title: "Git & GitHub Mastery", category: "Git/GitHub", duration: "2h 15m", progress: 60, xp: 350, icon: <GitBranch className="w-5 h-5" /> },
  { id: 3, title: "Your First Hackathon", category: "Hackathons", duration: "1h 45m", progress: 100, xp: 300, icon: <Trophy className="w-5 h-5" /> },
  { id: 4, title: "UI/UX Design Principles", category: "UI/UX", duration: "3h 00m", progress: 35, xp: 450, icon: <Layers className="w-5 h-5" /> },
  { id: 5, title: "JavaScript Essentials", category: "Programming", duration: "5h 00m", progress: 20, xp: 600, icon: <Code className="w-5 h-5" /> },
  { id: 6, title: "Team Communication", category: "Teamwork", duration: "1h 30m", progress: 100, xp: 200, icon: <Users className="w-5 h-5" /> },
  { id: 7, title: "Project Planning 101", category: "Planning", duration: "2h 00m", progress: 45, xp: 280, icon: <AlignLeft className="w-5 h-5" /> },
  { id: 8, title: "React Crash Course", category: "Programming", duration: "6h 00m", progress: 0, xp: 800, locked: true, icon: <Code className="w-5 h-5" /> },
  { id: 9, title: "Interview Prep: DS&A", category: "Interview", duration: "8h 00m", progress: 0, xp: 1000, locked: true, icon: <Terminal className="w-5 h-5" /> },
  { id: 10, title: "Building with APIs", category: "Programming", duration: "3h 30m", progress: 0, xp: 500, locked: true, icon: <Cpu className="w-5 h-5" /> },
  { id: 11, title: "Pitching Your Project", category: "Hackathons", duration: "1h 15m", progress: 100, xp: 250, icon: <MessageSquare className="w-5 h-5" /> },
  { id: 12, title: "Figma for Beginners", category: "UI/UX", duration: "2h 45m", progress: 10, xp: 380, icon: <Sparkles className="w-5 h-5" /> },
];

const BLOG_POSTS: BlogPost[] = [
  { id: 1, title: "How I Won My First Hackathon with Zero Experience", excerpt: "A raw, honest account of showing up with nothing but determination — and leaving with a $5k prize and a co-founder.", author: "Maya Chen", date: "Jun 15, 2025", readTime: "8 min read", category: "Success Story", likes: 847, featured: true, image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop&auto=format" },
  { id: 2, title: "The Ultimate Beginner's Guide to Git Branching", excerpt: "Stop being afraid of merge conflicts. Here's the mental model that made everything click.", author: "Jordan Park", date: "Jun 10, 2025", readTime: "6 min read", category: "Tutorial", likes: 612, image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=450&fit=crop&auto=format" },
  { id: 3, title: "10 Hackathon Ideas That Judges Actually Love", excerpt: "After judging 40+ hackathons, these are the project themes that consistently stand out from the crowd.", author: "Priya Nair", date: "Jun 5, 2025", readTime: "5 min read", category: "Tips", likes: 1203, image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=450&fit=crop&auto=format" },
  { id: 4, title: "Python vs JavaScript: Which Should You Learn First?", excerpt: "The answer might surprise you — and it depends entirely on what you want to build.", author: "Alex Kim", date: "May 28, 2025", readTime: "4 min read", category: "Guide", likes: 934, image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop&auto=format" },
  { id: 5, title: "Building a Team at a Hackathon: A Survival Guide", excerpt: "Approaching strangers is awkward. Here are five tactics that actually work at in-person events.", author: "Sam Osei", date: "May 20, 2025", readTime: "7 min read", category: "Tips", likes: 556, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop&auto=format" },
  { id: 6, title: "What I Wish Someone Told Me Before My First Pull Request", excerpt: "Code review culture, commit messages, and why your PR description matters more than the code.", author: "Linh Nguyen", date: "May 12, 2025", readTime: "5 min read", category: "Tutorial", likes: 789, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop&auto=format" },
];

const ACHIEVEMENTS = [
  { id: 1, name: "First Steps", desc: "Complete your first lesson", icon: "🎯", earned: true, rarity: "common" },
  { id: 2, name: "Code Curious", desc: "Read 5 resources", icon: "📖", earned: true, rarity: "common" },
  { id: 3, name: "Commit Ready", desc: "Finish the Git module", icon: "🌿", earned: true, rarity: "uncommon" },
  { id: 4, name: "Hackathon Hopeful", desc: "Register for your first hackathon", icon: "🏆", earned: true, rarity: "uncommon" },
  { id: 5, name: "Story Seeker", desc: "Complete Chapter 1 of the Visual Novel", icon: "📖", earned: true, rarity: "rare" },
  { id: 6, name: "Bug Slayer", desc: "Win the Bug Hunt mini-game", icon: "🐛", earned: false, rarity: "rare" },
  { id: 7, name: "7-Day Streak", desc: "Log in 7 days in a row", icon: "🔥", earned: false, rarity: "epic" },
  { id: 8, name: "Solo Champion", desc: "Finish all chapters of SoloQueue", icon: "⭐", earned: false, rarity: "legendary" },
];

const VN_STORY: Record<string, VNScene> = {
  "start": {
    id: "start",
    background: "void",
    character: null,
    speaker: "",
    dialogue: "[ SoloQueue Academy — Year 2035. In this world, hackathons decide careers, and code is the language of power. ]",
    next: "p2",
    isChapterBreak: true,
    chapterTitle: "Prologue: Boot Sequence"
  },
  "p2": {
    id: "p2",
    background: "classroom",
    character: "nex",
    charSide: "right",
    speaker: "NEX",
    dialogue: "Oh — you're awake. Good. System log shows you've been offline for... a while. I'm NEX. Your assigned Academy Guide.",
    next: "p3"
  },
  "p3": {
    id: "p3",
    background: "classroom",
    character: "nex",
    charSide: "right",
    speaker: "NEX",
    dialogue: "Welcome to SoloQueue Academy. We train beginners into builders. Coders who ship. Developers who win hackathons. Are you ready to begin your training?",
    choices: [
      { text: "I was born ready. Let's go.", to: "c1_1" },
      { text: "Wait — what even is a hackathon?", to: "c1_explain" }
    ]
  },
  "c1_explain": {
    id: "c1_explain",
    background: "classroom",
    character: "nex",
    charSide: "right",
    speaker: "NEX",
    dialogue: "Great question. A hackathon is a timed event — usually 24 to 48 hours — where developers, designers, and dreamers team up to build something new from scratch. Then judges pick the best.",
    next: "c1_explain2"
  },
  "c1_explain2": {
    id: "c1_explain2",
    background: "classroom",
    character: "nex",
    charSide: "right",
    speaker: "NEX",
    dialogue: "The prize pools can reach tens of thousands. But more importantly — hackathons are where careers begin. Recruiters attend. Networks form. Magic happens.",
    next: "c1_1"
  },
  "c1_1": {
    id: "c1_1",
    background: "hackathon",
    character: "aria",
    charSide: "left",
    speaker: "ARIA",
    dialogue: "Another fresh recruit? Hmph.",
    next: "c1_2",
    isChapterBreak: true,
    chapterTitle: "Chapter 1: The Veteran"
  },
  "c1_2": {
    id: "c1_2",
    background: "hackathon",
    character: "nex",
    charSide: "right",
    speaker: "NEX",
    dialogue: "This is Aria. She has won seven hackathons across three countries. She doesn't like wasting time.",
    next: "c1_3"
  },
  "c1_3": {
    id: "c1_3",
    background: "hackathon",
    character: "aria",
    charSide: "left",
    speaker: "ARIA",
    dialogue: "Most people who walk through that door quit after their first hackathon. They build something terrible, lose, and never come back. Don't be that person.",
    choices: [
      { text: "I won't quit. I promise.", to: "c1_4a" },
      { text: "How do I avoid building something terrible?", to: "c1_4b" }
    ]
  },
  "c1_4a": {
    id: "c1_4a",
    background: "hackathon",
    character: "aria",
    charSide: "left",
    speaker: "ARIA",
    dialogue: "...(she studies you for a moment)... Fine. I'll believe it when I see it. Listen up — the first rule of hackathons is: start with the problem, not the solution.",
    next: "c1_5"
  },
  "c1_4b": {
    id: "c1_4b",
    background: "hackathon",
    character: "aria",
    charSide: "left",
    speaker: "ARIA",
    dialogue: "Finally. A question worth answering. Rule one: fall in love with the problem, not your idea. Ideas are cheap. Problems are what judges care about.",
    next: "c1_5"
  },
  "c1_5": {
    id: "c1_5",
    background: "hackathon",
    character: "aria",
    charSide: "left",
    speaker: "ARIA",
    dialogue: "Rule two: ship something that works over something that's impressive. A working demo of a simple idea beats a broken prototype of a brilliant one. Every time.",
    next: "c1_6"
  },
  "c1_6": {
    id: "c1_6",
    background: "hackathon",
    character: "nex",
    charSide: "right",
    speaker: "NEX",
    dialogue: "Aria's wisdom aside — you'll also need technical foundations. That's where Kai comes in.",
    next: "c2_1",
    isChapterBreak: true,
    chapterTitle: "Chapter 2: Variables & Valor"
  },
  "c2_1": {
    id: "c2_1",
    background: "server",
    character: "kai",
    charSide: "left",
    speaker: "KAI",
    dialogue: "Hey! You must be the new student. I'm Kai — resident code mentor. Don't let my enthusiasm scare you. Programming is actually... beautiful, once you see it.",
    next: "c2_2"
  },
  "c2_2": {
    id: "c2_2",
    background: "server",
    character: "kai",
    charSide: "left",
    speaker: "KAI",
    dialogue: "Let's start with variables. Think of a variable like a labeled box. You put something inside — a number, a word, a list — and you can grab it later by its label.",
    next: "c2_3"
  },
  "c2_3": {
    id: "c2_3",
    background: "server",
    character: "kai",
    charSide: "left",
    speaker: "KAI",
    dialogue: "In Python, you write:  name = \"Alex\"  — and now whenever you type  name , the program remembers Alex. Simple as that.",
    choices: [
      { text: "That actually makes sense!", to: "c2_4a" },
      { text: "Can a variable hold multiple things?", to: "c2_4b" }
    ]
  },
  "c2_4a": {
    id: "c2_4a",
    background: "server",
    character: "kai",
    charSide: "left",
    speaker: "KAI",
    dialogue: "Yes! And it gets better — variables can change. That's why they're called variables. You can update a box's contents anytime. score = 0... then score = score + 10. See?",
    next: "c2_5"
  },
  "c2_4b": {
    id: "c2_4b",
    background: "server",
    character: "kai",
    charSide: "left",
    speaker: "KAI",
    dialogue: "Absolutely — that's called a list! In Python:  items = [\"hammer\", \"nails\", \"wood\"]  — one variable, three items. Lists are one of the most useful tools you'll ever learn.",
    next: "c2_5"
  },
  "c2_5": {
    id: "c2_5",
    background: "server",
    character: "nex",
    charSide: "right",
    speaker: "NEX",
    dialogue: "Excellent progress. Your knowledge stat has increased. You're ready to put theory into practice. The Training Simulation awaits — head to the Mini-Games module.",
    next: "c2_6"
  },
  "c2_6": {
    id: "c2_6",
    background: "rooftop",
    character: "aria",
    charSide: "left",
    speaker: "ARIA",
    dialogue: "...(she's looking at the city skyline)... You've come further than I expected. Don't let it go to your head. The real test hasn't started yet.",
    next: "end"
  },
  "end": {
    id: "end",
    background: "rooftop",
    character: "nex",
    charSide: "right",
    speaker: "NEX",
    dialogue: "Chapter 2 complete. You've earned 500 XP and the 'Story Seeker' achievement. The next chapter unlocks after you complete the Code Sort mini-game. You're doing great, Recruit.",
    next: "end",
    isChapterBreak: true,
    chapterTitle: "End of Demo — More Chapters Coming Soon"
  },
};

// ─── Mini-game data ──────────────────────────────────────────────────────────

const CODE_SORT_PUZZLE = {
  title: "Hello, Hackathon!",
  description: "Arrange these Python lines in the correct order to print a greeting.",
  lines: [
    { id: "a", text: 'print(f"Hello, {name}! Ready to hack?")', order: 4 },
    { id: "b", text: "name = input(\"What is your name? \")", order: 2 },
    { id: "c", text: "# Welcome program", order: 1 },
    { id: "d", text: "print(\"Welcome to SoloQueue Academy!\")", order: 3 },
    { id: "e", text: "print(\"Let the hacking begin!\")", order: 5 },
  ]
};

const BUG_HUNT_PUZZLE = {
  title: "Squash the Bug!",
  description: "One of these lines contains a syntax error. Click the buggy line.",
  lines: [
    { id: 1, text: "def calculate_score(wins, losses):", hasBug: false },
    { id: 2, text: "    total = wins + losses", hasBug: false },
    { id: 3, text: "    if total = 0:", hasBug: true },
    { id: 4, text: "        return 0", hasBug: false },
    { id: 5, text: "    return wins / total * 100", hasBug: false },
  ],
  explanation: "Line 3 uses = (assignment) instead of == (comparison) inside an if statement."
};

// ─── Utility Components ──────────────────────────────────────────────────────

function GradientText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

function GlassCard({ children, className = "", glowColor = "purple" }: { children: ReactNode; className?: string; glowColor?: "purple" | "cyan" | "blue" | "none" }) {
  const glows = {
    purple: "shadow-[0_0_30px_rgba(139,92,246,0.12)] hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]",
    cyan: "shadow-[0_0_30px_rgba(6,182,212,0.12)] hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]",
    blue: "shadow-[0_0_30px_rgba(59,130,246,0.12)] hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]",
    none: ""
  };
  return (
    <div className={`bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl transition-shadow duration-300 ${glows[glowColor]} ${className}`}>
      {children}
    </div>
  );
}

function ProgressBar({ value, color = "purple" }: { value: number; color?: "purple" | "cyan" | "green" | "orange" }) {
  const gradients = {
    purple: "from-violet-500 to-purple-400",
    cyan: "from-cyan-500 to-blue-400",
    green: "from-emerald-500 to-green-400",
    orange: "from-orange-500 to-amber-400"
  };
  return (
    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-full rounded-full bg-gradient-to-r ${gradients[color]}`}
      />
    </div>
  );
}

function Badge({ text, color = "purple" }: { text: string; color?: "purple" | "cyan" | "green" | "orange" | "pink" | "blue" }) {
  const styles = {
    purple: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    orange: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    pink: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border font-mono ${styles[color]}`}>
      {text}
    </span>
  );
}

function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(139,92,246,0.15) 1px, transparent 0)",
          backgroundSize: "48px 48px"
        }}
      />
      <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-cyan-600/10 rounded-full blur-[100px]" />
    </div>
  );
}

// ─── Character Portraits ─────────────────────────────────────────────────────

function CharacterPortrait({ char, size = 200, animate = false }: { char: Character; size?: number; animate?: boolean }) {
  const configs = {
    nex: { primary: "#06b6d4", secondary: "#0e7490", bg: "#071520", hair2: "#0891b2", blush: "#0e7490" },
    aria: { primary: "#a855f7", secondary: "#7c3aed", bg: "#140820", hair2: "#9333ea", blush: "#7c3aed" },
    kai: { primary: "#60a5fa", secondary: "#2563eb", bg: "#080f24", hair2: "#3b82f6", blush: "#2563eb" },
  };
  const c = configs[char];
  const w = size;
  const h = Math.round(size * 1.4);

  return (
    <motion.svg
      width={w}
      height={h}
      viewBox="0 0 160 224"
      xmlns="http://www.w3.org/2000/svg"
      animate={animate ? { y: [0, -6, 0] } : {}}
      transition={animate ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
    >
      <defs>
        <radialGradient id={`glow-${char}`} cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor={c.primary} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c.primary} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`face-${char}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={c.bg} stopOpacity="1" />
          <stop offset="100%" stopColor="#060810" stopOpacity="1" />
        </radialGradient>
      </defs>
      {/* Ground glow */}
      <ellipse cx="80" cy="210" rx="70" ry="18" fill={`url(#glow-${char})`} />
      {/* Shoulders */}
      <path d="M5 224 Q32 172 80 165 Q128 172 155 224 Z" fill={c.secondary} />
      {/* Shirt collar detail */}
      <path d="M65 165 L80 180 L95 165" fill={c.primary} opacity="0.6" />
      {/* Neck */}
      <rect x="67" y="155" width="26" height="20" rx="8" fill={`url(#face-${char})`} />
      {/* Head */}
      <ellipse cx="80" cy="100" rx="55" ry="62" fill={`url(#face-${char})`} />
      {/* Hair base (back) */}
      <ellipse cx="80" cy="54" rx="57" ry="40" fill={c.hair2} />
      {/* Hair sides */}
      <path d="M25 80 Q14 60 22 35 Q28 55 36 72 Z" fill={c.primary} />
      <path d="M135 80 Q146 60 138 35 Q132 55 124 72 Z" fill={c.primary} />
      {/* Hair front */}
      <ellipse cx="80" cy="50" rx="55" ry="32" fill={c.primary} />
      {/* Hair bangs */}
      <path d="M44 68 Q50 88 60 80 Q55 64 44 68Z" fill={c.primary} />
      <path d="M116 68 Q110 88 100 80 Q105 64 116 68Z" fill={c.primary} />
      <path d="M68 72 Q72 88 80 84 Q76 70 68 72Z" fill={c.secondary} opacity="0.7" />
      {/* Ears */}
      <ellipse cx="26" cy="105" rx="7" ry="10" fill={`url(#face-${char})`} />
      <ellipse cx="134" cy="105" rx="7" ry="10" fill={`url(#face-${char})`} />
      <ellipse cx="26" cy="105" rx="4" ry="6" fill={c.primary} opacity="0.25" />
      <ellipse cx="134" cy="105" rx="4" ry="6" fill={c.primary} opacity="0.25" />
      {/* Eyes (anime large) */}
      <ellipse cx="60" cy="102" rx="14" ry="17" fill="#050810" />
      <ellipse cx="100" cy="102" rx="14" ry="17" fill="#050810" />
      <ellipse cx="60" cy="102" rx="10.5" ry="13.5" fill={c.primary} />
      <ellipse cx="100" cy="102" rx="10.5" ry="13.5" fill={c.primary} />
      <ellipse cx="60" cy="100" rx="5" ry="7" fill={c.primary} opacity="0.5" />
      <ellipse cx="100" cy="100" rx="5" ry="7" fill={c.primary} opacity="0.5" />
      <circle cx="64" cy="96" r="4" fill="white" opacity="0.9" />
      <circle cx="104" cy="96" r="4" fill="white" opacity="0.9" />
      <circle cx="55" cy="107" r="2" fill="white" opacity="0.4" />
      <circle cx="95" cy="107" r="2" fill="white" opacity="0.4" />
      {/* Eyebrows */}
      <path d="M46 84 Q60 79 74 83" stroke={c.primary} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M86 83 Q100 79 114 84" stroke={c.primary} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <circle cx="80" cy="118" r="2.5" fill={c.secondary} opacity="0.35" />
      {/* Mouth */}
      <path d="M67 132 Q80 143 93 132" stroke={c.primary} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="44" cy="120" rx="11" ry="6" fill={c.blush} opacity="0.22" />
      <ellipse cx="116" cy="120" rx="11" ry="6" fill={c.blush} opacity="0.22" />
    </motion.svg>
  );
}

// ─── VN Scene Backgrounds ────────────────────────────────────────────────────

function SceneBackground({ type }: { type: VNScene["background"] }) {
  const configs = {
    void: {
      bg: "from-black via-gray-950 to-black",
      deco: null
    },
    classroom: {
      bg: "from-[#060a1a] via-[#0a1030] to-[#06091a]",
      deco: (
        <>
          <div className="absolute top-8 left-8 opacity-20 text-blue-400 font-mono text-sm">
            {["var x = 42;", "for i in range(10):", "  print(i)", "def hackathon():"].map((l, i) => (
              <div key={i} className="mb-1">{l}</div>
            ))}
          </div>
          <div className="absolute top-20 right-12 opacity-10 text-violet-400 font-mono text-xs">
            {["git commit -m", '"First commit"', "git push origin", "main"].map((l, i) => (
              <div key={i} className="mb-1">{l}</div>
            ))}
          </div>
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-40 h-1 bg-blue-400/20 rounded" />
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-64 h-20 bg-blue-400/5 border border-blue-400/15 rounded-xl" />
        </>
      )
    },
    rooftop: {
      bg: "from-[#030310] via-[#080818] to-[#030310]",
      deco: (
        <>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() > 0.8 ? "2px" : "1px",
                height: Math.random() > 0.8 ? "2px" : "1px",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                opacity: Math.random() * 0.7 + 0.1
              }}
            />
          ))}
          <div className="absolute bottom-0 left-0 right-0 h-32"
            style={{ background: "linear-gradient(to top, rgba(30,10,60,0.8), transparent)" }}
          />
          {[20, 60, 100, 140].map((x, i) => (
            <div key={i} className="absolute bottom-0 bg-gradient-to-t from-blue-900/40 to-transparent border-l border-r border-blue-500/10"
              style={{ left: `${x * 2 + i * 30}px`, width: `${20 + i * 12}px`, height: `${80 + i * 20}px` }}
            />
          ))}
        </>
      )
    },
    server: {
      bg: "from-[#010810] via-[#040d18] to-[#010810]",
      deco: (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="absolute border border-cyan-500/10 rounded"
              style={{ left: `${10 + i * 18}%`, top: "10%", width: "14%", height: "80%", background: "rgba(6,182,212,0.02)" }}>
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="border-b border-cyan-500/10 flex items-center px-2"
                  style={{ height: "13.3%" }}>
                  <div className="w-2 h-2 rounded-full mr-2"
                    style={{ background: Math.random() > 0.3 ? "#06b6d4" : "#22c55e", opacity: 0.6 }}
                  />
                  <div className="h-1 bg-cyan-500/20 rounded flex-1" />
                </div>
              ))}
            </div>
          ))}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        </>
      )
    },
    hackathon: {
      bg: "from-[#080412] via-[#0f0520] to-[#080412]",
      deco: (
        <>
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }}
          />
          <div className="absolute top-8 right-8 text-violet-400/30 font-mono text-xs space-y-1">
            <div>{"</ hackathon >"}</div>
            <div>{"// 24h remaining"}</div>
            <div>{"# team: soloqueue"}</div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24"
            style={{ background: "linear-gradient(to top, rgba(80,0,160,0.3), transparent)" }}
          />
        </>
      )
    }
  };

  const cfg = configs[type];
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${cfg.bg} overflow-hidden`}>
      {cfg.deco}
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS: { label: string; page: Page; icon: ReactNode }[] = [
  { label: "Home", page: "home", icon: <Home className="w-4 h-4" /> },
  { label: "Resources", page: "resources", icon: <BookOpen className="w-4 h-4" /> },
  { label: "Hackathons", page: "hackathons", icon: <Trophy className="w-4 h-4" /> },
  { label: "Blog", page: "blog", icon: <Newspaper className="w-4 h-4" /> },
  { label: "Novel", page: "novel", icon: <Play className="w-4 h-4" /> },
  { label: "Mini-Games", page: "games", icon: <Gamepad2 className="w-4 h-4" /> },
];

function Navbar({
  currentPage,
  setPage,
  isLoggedIn,
  setIsLoggedIn,
  onOpenLogin
}: {
  currentPage: Page;
  setPage: (p: Page) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  onOpenLogin: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080810]/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => setPage("home")} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <GradientText>SoloQueue</GradientText>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.page
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* XP badge */}
            {isLoggedIn && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-bold text-violet-300">7 streak</span>
              </div>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Bell className="w-4 h-4 text-white/70" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-400 rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-72 bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                  <div className="p-3 border-b border-white/5">
                    <p className="text-sm font-semibold text-white">Notifications</p>
                  </div>
                  {[
                    { text: "HackMIT 2025 registration opens tomorrow!", time: "2h ago", icon: "🏆" },
                    { text: "You earned the 'Story Seeker' achievement!", time: "1d ago", icon: "⭐" },
                    { text: "New blog post: Git Branching Guide", time: "2d ago", icon: "📖" },
                  ].map((n, i) => (
                    <div key={i} className="flex gap-3 p-3 hover:bg-white/5 transition-colors cursor-pointer">
                      <span className="text-lg">{n.icon}</span>
                      <div>
                        <p className="text-xs text-white/80 leading-snug">{n.text}</p>
                        <p className="text-xs text-white/40 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile / Sign In */}
            {isLoggedIn ? (
              <div className="relative group">
                <button
                  onClick={() => setPage("profile")}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-[#121222] transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">A</div>
                  <span className="hidden sm:block text-sm font-medium text-white/80">Alex</span>
                </button>
                {/* Dropdown Menu on hover/focus */}
                <div className="absolute right-0 top-full pt-1.5 w-36 hidden group-hover:block hover:block z-50">
                  <div className="bg-[#0f0f1a]/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
                    <button
                      onClick={() => setPage("profile")}
                      className="w-full text-left px-3.5 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setPage("home");
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-violet-500/15 hover:-translate-y-0.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-white/5 mt-1 pt-3 grid grid-cols-3 gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.page}
                onClick={() => { setPage(item.page); setMenuOpen(false); }}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                  currentPage === item.page ? "bg-violet-500/20 text-violet-300" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Home Page ───────────────────────────────────────────────────────────────

function HomePage({ setPage, setSelectedPostId }: { setPage: (p: Page) => void; setSelectedPostId: (id: number) => void }) {
  const stats = [
    { label: "Active Learners", value: "12,847", icon: <Users className="w-4 h-4 text-violet-400" /> },
    { label: "Hackathons Listed", value: "340+", icon: <Trophy className="w-4 h-4 text-cyan-400" /> },
    { label: "Resources", value: "500+", icon: <BookOpen className="w-4 h-4 text-blue-400" /> },
    { label: "XP Earned", value: "2.4M", icon: <Zap className="w-4 h-4 text-orange-400" /> },
  ];

  const paths = [
    { title: "Learn to Code", desc: "Start from zero. Python, JavaScript, and the fundamentals of programming.", icon: <Code className="w-6 h-6" />, color: "from-violet-600 to-purple-700", page: "resources" as Page },
    { title: "Hackathon Prep", desc: "Master pitching, team dynamics, and rapid prototyping in 48 hours.", icon: <Trophy className="w-6 h-6" />, color: "from-blue-600 to-cyan-700", page: "hackathons" as Page },
    { title: "Visual Novel", desc: "Learn through story. Follow Kai, Aria, and NEX through SoloQueue Academy.", icon: <Play className="w-6 h-6" />, color: "from-pink-600 to-violet-700", page: "novel" as Page },
  ];

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/15 border border-violet-500/30 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-sm font-semibold text-violet-300">The Gamified Coder's Journey</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight mb-6">
              Go from <GradientText>Zero</GradientText>
              <br />
              to <GradientText>Hackathon Hero</GradientText>
            </h1>

            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              SoloQueue turns beginner coders into hackathon competitors through gamified lessons, a visual novel adventure, and a community that ships.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setPage("novel")}
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5" />
                Start Your Story
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setPage("resources")}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-white/5 hover:bg-white/10 border border-white/15 text-white transition-all"
              >
                <BookOpen className="w-5 h-5" />
                Browse Resources
              </button>
            </div>
          </motion.div>

          {/* Floating character previews */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 flex justify-center gap-6 flex-wrap"
          >
            {(["nex", "aria", "kai"] as Character[]).map((char, i) => {
              const labels = { nex: "NEX • AI Guide", aria: "ARIA • Veteran", kai: "KAI • Mentor" };
              const colors = { nex: "border-cyan-500/30 shadow-cyan-500/20", aria: "border-violet-500/30 shadow-violet-500/20", kai: "border-blue-500/30 shadow-blue-500/20" };
              return (
                <motion.div
                  key={char}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border ${colors[char]} backdrop-blur-xl shadow-lg`}
                >
                  <CharacterPortrait char={char} size={100} animate={true} />
                  <span className="text-xs font-mono text-white/50">{labels[char]}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-1"
            >
              <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1">{s.icon}{s.label}</div>
              <span className="text-3xl font-extrabold text-white">{s.value}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Learning paths */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Choose Your Path</h2>
          <p className="text-white/50">Three ways to start. One destination: shipping your first project.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {paths.map((p, i) => (
            <motion.button
              key={i}
              onClick={() => setPage(p.page)}
              whileHover={{ y: -4 }}
              className="group text-left p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                {p.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{p.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-white/30 group-hover:text-white/60 transition-colors text-sm font-medium">
                Get started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Featured hackathons */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Upcoming Hackathons</h2>
            <p className="text-white/40 text-sm mt-1">Don't miss your next opportunity</p>
          </div>
          <button onClick={() => setPage("hackathons")} className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium">
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {HACKATHONS.slice(0, 3).map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <Badge text={h.difficulty} color={h.difficulty === "Beginner" ? "green" : h.difficulty === "Intermediate" ? "blue" : "purple"} />
                <Badge text={h.type} color={h.type === "online" ? "cyan" : "orange"} />
              </div>
              <h3 className="font-bold text-white mb-1">{h.name}</h3>
              <div className="flex items-center gap-1 text-white/40 text-xs mb-1">
                <Calendar className="w-3 h-3" />{h.date}
              </div>
              <div className="flex items-center gap-1 text-white/40 text-xs mb-3">
                <DollarSign className="w-3 h-3" />{h.prize} prize pool
              </div>
              <button
                onClick={() => setPage("hackathons")}
                className="w-full py-2 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 text-sm font-semibold transition-colors"
              >
                Learn More
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blog preview */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Latest from the Blog</h2>
            <p className="text-white/40 text-sm mt-1">Tips, stories, and tutorials from the community</p>
          </div>
          <button onClick={() => setPage("blog")} className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium">
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {BLOG_POSTS.slice(0, 3).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 overflow-hidden transition-colors group cursor-pointer"
              onClick={() => { setSelectedPostId(post.id); setPage("blog"); }}
            >
              <div className="h-40 bg-violet-900/30 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <Badge text={post.category} color="purple" />
                <h3 className="font-bold text-sm text-white mt-2 mb-1 leading-snug line-clamp-2">{post.title}</h3>
                <p className="text-xs text-white/40">{post.author} · {post.readTime}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Your first hackathon is closer than you think.</h2>
          <p className="text-white/50 mb-8">Join 12,000+ students learning, building, and competing on SoloQueue.</p>
          <button
            onClick={() => setPage("novel")}
            className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 text-lg"
          >
            Start Learning Free
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Resources Page ───────────────────────────────────────────────────────────

interface LessonContent {
  lecture: string;
  sandboxCode: string;
  questions: { question: string; options: string[]; answerIndex: number }[];
}

const LESSON_CONTENTS: Record<number, LessonContent> = {
  1: {
    lecture: "Variables are named boxes for your data in Python. In Python, you write 'name = \"Alex\"' to store a string, or 'score = 42' to store an integer. No type declaration needed!\n\nTo loop over numbers, we use range(). For example, 'for i in range(3):' executes its block three times, with 'i' taking values 0, 1, and 2. Indentation is critical in Python—always use 4 spaces!",
    sandboxCode: "# Python Sandbox!\nname = \"Hacker\"\nprint(f\"Hello, {name}!\")\n\nfor i in range(3):\n    print(f\"Loop count: {i+1}\")",
    questions: [
      { question: "How do you declare a variable with name 'xp' and value 500 in Python?", options: ["var xp = 500", "xp = 500", "int xp = 500", "xp : 500"], answerIndex: 1 },
      { question: "What values will 'i' take in 'for i in range(3):'?", options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "None of the above"], answerIndex: 1 }
    ]
  },
  2: {
    lecture: "Git lets you track and manage your code's history. Think of Git as a tree where 'main' is the trunk. When you want to work on a feature, you create a branch. This keeps the main trunk stable while you experiment.\n\nKey commands:\n- 'git branch branch-name' creates a branch.\n- 'git checkout branch-name' switches to it.\n- 'git add .' stages your edits.\n- 'git commit -m \"msg\"' commits them.",
    sandboxCode: "# Git master simulation\ncommit_msg = \"feat: initialize app\"\nprint(\"Staging modified files...\")\nprint(f\"Commit snapshot created: {commit_msg}\")\nprint(\"Branch 'main' pushed to GitHub!\")",
    questions: [
      { question: "Which Git command stages all modified files?", options: ["git commit", "git push", "git add .", "git checkout"], answerIndex: 2 },
      { question: "How do you create and switch to a new branch 'dev' in one step?", options: ["git branch dev", "git checkout dev", "git checkout -b dev", "git merge dev"], answerIndex: 2 }
    ]
  },
  3: {
    lecture: "Scoping is the single most important skill for a hackathon. With only 36 hours, you must build an MVP (Minimum Viable Product). Don't try to build a massive project with 10 broken features; build ONE feature that works perfectly.\n\nWhen presenting to judges, spend the last 4 hours on your pitch and slides. A beautiful working demo with a clear explanation wins hackathons!",
    sandboxCode: "# Hackathon timing planner\nhours_left = 36\nif hours_left > 12:\n    print(\"Build the MVP core!\")\nelif hours_left > 4:\n    print(\"Feature freeze. Test and polish!\")\nelse:\n    print(\"Design slides and practice your pitch!\")",
    questions: [
      { question: "What is the key factor in building a winning hackathon project?", options: ["Using advanced machine learning", "Scoping a clean, fully-functional MVP", "Writing as many lines of code as possible", "Working completely solo"], answerIndex: 1 },
      { question: "How much time should you devote to your presentation and slides?", options: ["10 minutes at the very end", "The final 3 to 4 hours of the hackathon", "None, judges only look at code", "The first 5 hours of the hackathon"], answerIndex: 1 }
    ]
  },
  4: {
    lecture: "UI/UX Design starts with visual hierarchy. Use contrasting sizes, font weights, and negative space to guide the user's focus.\n\nAlways design with the 'Less is More' principle. Negative space (white space) isn't empty space; it gives your elements room to breathe and makes your interface feel luxurious, legible, and highly premium.",
    sandboxCode: "# Layout style simulator\npadding_desktop = \"px-10 py-8\"\npadding_mobile = \"px-4 py-3\"\nprint(f\"Applied screen spacing: {padding_desktop} (desktop)\")",
    questions: [
      { question: "What is the primary benefit of negative space?", options: ["It wastes valuable screen real estate", "It guides focus and gives elements breathing room", "It makes elements look smaller", "It reduces design fidelity"], answerIndex: 1 },
      { question: "Which property is NOT a tool for visual hierarchy?", options: ["Font Weight", "Element Size", "Using random background colors everywhere", "Intentional Padding"], answerIndex: 2 }
    ]
  }
};

function ResourceLessonViewer({
  resource,
  onBack,
  gainXp,
  onComplete
}: {
  resource: Resource;
  onBack: () => void;
  gainXp: (amount: number) => void;
  onComplete: (id: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<"learn" | "sandbox" | "quiz">("learn");
  const [code, setCode] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const defaultContent: LessonContent = {
    lecture: `Welcome to the lesson on "${resource.title}". This course covers essential concepts in ${resource.category}. Rapid development, debugging, and testing are key skills in modern full-stack developer environments.\n\nRead through the material, test code in the Sandbox terminal, and ace the conceptual quiz to earn your ${resource.xp} XP and unlock higher tier courses!`,
    sandboxCode: `# Welcome to the Sandbox!\nprint("Running environment: SoloQueue Engine v2.0")\nprint("Current Module: ${resource.title}")`,
    questions: [
      { question: `What is the core focus of "${resource.title}"?`, options: [`The advanced mechanics of ${resource.category}`, `How to build a basic application`, `Testing and deployment`, "None of the above"], answerIndex: 0 },
      { question: "Why is rapid prototyping important in hackathons?", options: ["To write flawless code", "To test business value with minimal engineering lag", "To write longer documentation", "To bypass team building"], answerIndex: 1 }
    ]
  };

  const content = LESSON_CONTENTS[resource.id] || defaultContent;

  useEffect(() => {
    setCode(content.sandboxCode);
    setTerminalLogs([`$ initialized sandbox: ${resource.title}`]);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizCorrect(false);
    setActiveTab("learn");
  }, [resource.id]);

  const triggerParticles = () => {
    const colors = ["#8b5cf6", "#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];
    const pts = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 300 - 150,
      y: Math.random() * -200 - 50,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setParticles(pts);
    setTimeout(() => setParticles([]), 2000);
  };

  const runCode = () => {
    setIsRunning(true);
    setTerminalLogs(prev => [...prev, ">> Compiling container..."]);
    setTimeout(() => {
      const logs = ["$ python sandbox.py", ">> Launching isolated instance..."];
      const lines = code.split("\n");
      let prints = 0;
      lines.forEach(l => {
        const t = l.trim();
        if (t.startsWith("print(") && t.endsWith(")")) {
          prints++;
          let inner = t.slice(6, -1);
          if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
            inner = inner.slice(1, -1);
          }
          if (inner.startsWith('f"') || inner.startsWith("f'")) {
            inner = inner.slice(2, -1);
            inner = inner.replace(/{name}/g, "Alex").replace(/{hours_left}/g, "36");
          }
          logs.push(inner);
        }
      });
      if (prints === 0) {
        logs.push(">> Script finished. (Tip: Try print('Hello World') to see outputs here!)");
      } else {
        logs.push(">> Exit code 0 (Success)");
      }
      setTerminalLogs(logs);
      setIsRunning(false);
    }, 800);
  };

  const handleQuizSubmit = () => {
    const isAllCorrect = content.questions.every((q, i) => quizAnswers[i] === q.answerIndex);
    setQuizSubmitted(true);
    setQuizCorrect(isAllCorrect);

    if (isAllCorrect) {
      triggerParticles();
      gainXp(resource.xp);
      onComplete(resource.id);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col pt-4">
      {/* Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: "50vw", y: "40vh", scale: 1.5 }}
            animate={{ opacity: 0, x: `calc(50vw + ${p.x}px)`, y: `calc(40vh + ${p.y}px)`, scale: 0.2, rotate: 360 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute w-3 h-3 rounded-full shadow-lg"
            style={{ backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }}
          />
        ))}
      </div>

      {/* Lesson Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge text={resource.category} color="purple" />
              <span className="text-xs text-yellow-400 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />+{resource.xp} XP
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white leading-tight">{resource.title}</h1>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 shrink-0 self-start sm:self-center">
          {(["learn", "sandbox", "quiz"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (Material / Questions) */}
        <div className="lg:col-span-7 flex flex-col">
          {activeTab === "learn" && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-5">
              <GlassCard className="p-6 h-full flex flex-col justify-between" glowColor="purple">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                    <BookOpen className="w-4 h-4 text-violet-400" /> Lesson Material
                  </h3>
                  <p className="text-white/75 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {content.lecture}
                  </p>
                </div>

                {/* Mentor Tip Box */}
                <div className="mt-8 p-4 rounded-xl bg-violet-900/10 border border-violet-500/20 flex items-start gap-3">
                  <div className="w-10 h-10 shrink-0 mt-0.5 rounded-lg overflow-hidden border border-violet-400/30">
                    <CharacterPortrait char="kai" size={40} />
                  </div>
                  <div>
                    <h5 className="text-xs font-mono font-bold text-violet-300">KAI • CODE MENTOR</h5>
                    <p className="text-xs text-white/60 leading-relaxed mt-0.5">
                      "Make sure to test these theories on the Sandbox tab! Type out some custom print statements and see how they compile live in our simulated environment."
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "sandbox" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col space-y-4">
              <GlassCard className="p-5 flex-1 flex flex-col" glowColor="cyan">
                <h3 className="text-sm font-mono text-cyan-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Code Playground editor.py
                </h3>
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 w-full bg-[#08080f] p-4 rounded-xl border border-white/5 text-cyan-200/90 font-mono text-sm leading-relaxed focus:outline-none focus:border-cyan-500/30 min-h-[220px] resize-none"
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-white/30 font-mono">Simulated execution compiler ready.</p>
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/10 disabled:opacity-40 transition-all"
                  >
                    {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    Run Script
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "quiz" && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
              <GlassCard className="p-6 h-full flex flex-col justify-between" glowColor="purple">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                    <Award className="w-4 h-4 text-violet-400" /> Course Knowledge Check
                  </h3>

                  {content.questions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2.5">
                      <p className="text-sm font-semibold text-white/90">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const selected = quizAnswers[qIdx] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted && quizCorrect}
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                              className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all ${
                                selected
                                  ? "bg-violet-600/20 border-violet-400 text-violet-200"
                                  : "bg-white/[0.02] border-white/10 text-white/60 hover:border-white/20 hover:bg-white/[0.04]"
                              }`}
                            >
                              <span className="text-violet-400 mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-4 border-t border-white/5">
                  {quizSubmitted ? (
                    <div className={`p-4 rounded-xl border text-center ${
                      quizCorrect
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                        : "bg-red-500/15 border-red-500/30 text-red-300"
                    }`}>
                      <h4 className="font-bold text-sm mb-1">
                        {quizCorrect ? "🎉 Challenge Passed!" : "🤔 Try Again!"}
                      </h4>
                      <p className="text-xs opacity-80">
                        {quizCorrect
                          ? `Superb job! You answered all questions correctly, gained +${resource.xp} XP and unlocked the next class!`
                          : "Some questions were answered incorrectly. Review the material and re-try!"}
                      </p>
                      {!quizCorrect && (
                        <button
                          onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                          className="mt-3 px-4 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold border border-red-500/30 transition-colors"
                        >
                          Retry Quiz
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < content.questions.length}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all text-center"
                    >
                      Submit Answers
                    </button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>

        {/* Right Column (Live Terminal / Sandbox Log output) */}
        <div className="lg:col-span-5 flex flex-col">
          <GlassCard className="p-4 flex-1 flex flex-col bg-[#050508]/85 border-white/5 min-h-[220px]" glowColor="none">
            <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
              <span className="text-xs font-mono text-white/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Sandbox Console
              </span>
              <button
                onClick={() => setTerminalLogs([])}
                className="text-[10px] font-mono text-white/30 hover:text-white/60 uppercase"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 font-mono text-xs text-cyan-300/80 p-3 bg-black/50 rounded-lg overflow-y-auto space-y-1.5 max-h-[400px]">
              {terminalLogs.map((log, index) => (
                <div key={index} className="leading-relaxed whitespace-pre-wrap">
                  {log}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function ResourcesPage({
  resourcesList,
  setResourcesList,
  selectedResourceId,
  setSelectedResourceId,
  gainXp,
  xp,
  level,
  isLoggedIn,
  onOpenLogin
}: {
  resourcesList: Resource[];
  setResourcesList: React.Dispatch<React.SetStateAction<Resource[]>>;
  selectedResourceId: number | null;
  setSelectedResourceId: (id: number | null) => void;
  gainXp: (amount: number) => void;
  xp: number;
  level: number;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Programming", "Git/GitHub", "Hackathons", "UI/UX", "Teamwork", "Planning", "Interview"];

  const filtered = resourcesList.filter(r => {
    const matchCat = activeCategory === "All" || r.category === activeCategory;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalXP = resourcesList.filter(r => r.progress === 100).reduce((sum, r) => sum + r.xp, 0);
  const completed = resourcesList.filter(r => r.progress === 100).length;

  const handleLessonComplete = (id: number) => {
    setResourcesList(prev => {
      return prev.map((r, idx) => {
        if (r.id === id) {
          return { ...r, progress: 100 };
        }
        // Unlock next resource!
        if (idx > 0 && prev[idx - 1].id === id) {
          return { ...r, locked: false };
        }
        return r;
      });
    });
  };

  const selectedResource = resourcesList.find(r => r.id === selectedResourceId);

  if (selectedResourceId && selectedResource) {
    return (
      <div className="pt-24 pb-16 max-w-6xl mx-auto px-6">
        <ResourceLessonViewer
          resource={selectedResource}
          onBack={() => setSelectedResourceId(null)}
          gainXp={gainXp}
          onComplete={handleLessonComplete}
        />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2"><GradientText>Learning Resources</GradientText></h1>
          <p className="text-white/50">Everything you need to go from beginner to hackathon-ready.</p>
        </div>

        {!isLoggedIn && (
          <div className="mb-6 p-4 rounded-2xl bg-violet-950/20 border border-violet-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-violet-400 shrink-0 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-white">Guest Mode Active</p>
                <p className="text-xs text-white/50">Sign in to save your progression, gain experience points, and unlock advanced modules!</p>
              </div>
            </div>
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs whitespace-nowrap transition-colors"
            >
              Sign In Now
            </button>
          </div>
        )}

        {/* Progress summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Completed", value: `${completed}/${resourcesList.length}`, icon: <CheckCircle className="w-5 h-5 text-emerald-400" /> },
            { label: "XP Earned", value: `${xp.toLocaleString()}`, icon: <Zap className="w-5 h-5 text-yellow-400" /> },
            { label: "In Progress", value: `${resourcesList.filter(r => r.progress > 0 && r.progress < 100).length}`, icon: <TrendingUp className="w-5 h-5 text-blue-400" /> },
            { label: "Locked", value: `${resourcesList.filter(r => r.locked).length}`, icon: <Lock className="w-5 h-5 text-white/30" /> },
          ].map((s, i) => (
            <GlassCard key={i} className="p-4 flex items-center gap-3">
              {s.icon}
              <div>
                <p className="text-xs text-white/40">{s.label}</p>
                <p className="font-bold text-white">{s.value}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                  : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => { if (!r.locked) setSelectedResourceId(r.id); }}
              className={`group p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                r.locked
                  ? "bg-white/[0.01] border-white/5 opacity-60"
                  : "bg-white/[0.03] border-white/10 hover:border-violet-500/30"
              }`}
            >
              {r.locked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl z-10">
                  <div className="text-center">
                    <Lock className="w-6 h-6 text-white/40 mx-auto mb-1" />
                    <p className="text-xs text-white/40 font-medium">Complete prior lessons</p>
                  </div>
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400">
                  {r.icon}
                </div>
                {r.progress === 100 && (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <Badge text={r.category} color="purple" />
              <h3 className="font-bold text-white mt-2 mb-1">{r.title}</h3>
              <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.duration}</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400" />{r.xp} XP</span>
              </div>
              <ProgressBar value={r.progress} color={r.progress === 100 ? "green" : "purple"} />
              <p className="text-xs text-white/30 mt-1.5">{r.progress}% complete</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Hackathons Page ──────────────────────────────────────────────────────────

function CyberTicket({ hackathon }: { hackathon: Hackathon }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-950/20 to-black/80 backdrop-blur-xl shadow-2xl p-6"
    >
      {/* Laser glow lines */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.1),transparent_40%)]" />

      {/* Perforation line */}
      <div className="absolute right-24 top-0 bottom-0 border-r border-dashed border-white/10 flex flex-col justify-between py-2 z-10">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-black/60 -mr-0.5" />
        ))}
      </div>

      <div className="flex gap-4">
        {/* Ticket Left Part */}
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase">SECURE PASS GRANTED</span>
          </div>

          <h4 className="text-xl font-black text-white tracking-tight line-clamp-1">{hackathon.name}</h4>
          <p className="text-xs text-white/50 mb-5 font-mono">{hackathon.location.toUpperCase()}</p>

          <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-white/5 pt-4 mb-2">
            <div>
              <p className="text-[9px] font-mono text-white/40 uppercase">Challenger ID</p>
              <p className="text-xs font-mono font-bold text-violet-300">SQ-HACK-4927</p>
            </div>
            <div>
              <p className="text-[9px] font-mono text-white/40 uppercase">Assigned Seat</p>
              <p className="text-xs font-mono font-bold text-violet-300">SEAT-D18</p>
            </div>
            <div>
              <p className="text-[9px] font-mono text-white/40 uppercase">Date/Time</p>
              <p className="text-xs font-mono text-white/70 leading-tight">{hackathon.date}</p>
            </div>
            <div>
              <p className="text-[9px] font-mono text-white/40 uppercase">Admission Code</p>
              <p className="text-xs font-mono text-white/70">SQ_PASS_OK</p>
            </div>
          </div>
        </div>

        {/* Ticket Right Part (Stub) */}
        <div className="w-16 flex flex-col items-center justify-center shrink-0">
          {/* QR Code Graphic */}
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-lg p-1.5 flex flex-wrap gap-[2px] items-center justify-center">
            {Array.from({ length: 49 }).map((_, i) => (
              <div
                key={i}
                className={`w-[5px] h-[5px] rounded-[1px] ${
                  (i % 3 === 0 && i % 2 === 0) || i < 8 || i > 40 || (i % 7 === 1)
                    ? "bg-violet-400"
                    : "bg-transparent"
                }`}
              />
            ))}
          </div>
          <span className="text-[8px] font-mono text-white/30 uppercase mt-2 text-center tracking-tighter leading-none">SCAN AT GATE</span>
        </div>
      </div>
    </motion.div>
  );
}

function HackathonsPage({
  registered,
  setRegistered,
  selectedHackathonId,
  setSelectedHackathonId,
  registrationDetails,
  setRegistrationDetails,
  hackathonTeams,
  setHackathonTeams,
  gainXp,
  isLoggedIn,
  onOpenLogin
}: {
  registered: Set<number>;
  setRegistered: React.Dispatch<React.SetStateAction<Set<number>>>;
  selectedHackathonId: number | null;
  setSelectedHackathonId: (id: number | null) => void;
  registrationDetails: Record<number, { role: string; portfolio: string; track: string }>;
  setRegistrationDetails: React.Dispatch<React.SetStateAction<Record<number, { role: string; portfolio: string; track: string }>>>;
  hackathonTeams: Record<number, { id: number; name: string; track: string; size: number; capacity: number; description: string; creator: string; applied?: boolean }[]>;
  setHackathonTeams: React.Dispatch<React.SetStateAction<Record<number, { id: number; name: string; track: string; size: number; capacity: number; description: string; creator: string; applied?: boolean }[]>>>;
  gainXp: (amount: number) => void;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
}) {
  const [filter, setFilter] = useState<"all" | "online" | "in-person" | "hybrid">("all");
  const [diffFilter, setDiffFilter] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");

  // Registration Form Local States
  const [role, setRole] = useState("Full Stack Developer");
  const [portfolio, setPortfolio] = useState("");
  const [track, setTrack] = useState("Web3 & AI Integration");
  const [showRegForm, setShowRegForm] = useState(false);

  // New Team Form Local States
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [newTeamTrack, setNewTeamTrack] = useState("General Track");

  const filtered = HACKATHONS.filter(h => {
    const matchType = filter === "all" || h.type === filter;
    const matchDiff = diffFilter === "All" || h.difficulty === diffFilter;
    return matchType && matchDiff;
  });

  const diffColors: Record<string, "green" | "blue" | "purple"> = {
    Beginner: "green", Intermediate: "blue", Advanced: "purple"
  };
  const typeColors: Record<string, "cyan" | "orange" | "pink"> = {
    online: "cyan", "in-person": "orange", hybrid: "pink"
  };

  const selectedHackathon = HACKATHONS.find(h => h.id === selectedHackathonId);

  const handleRegister = (hId: number) => {
    setRegistered(prev => {
      const next = new Set(prev);
      next.add(hId);
      return next;
    });
    setRegistrationDetails(prev => ({
      ...prev,
      [hId]: { role, portfolio, track }
    }));
    gainXp(100);
    setShowRegForm(false);
  };

  const handleUnregister = (hId: number) => {
    setRegistered(prev => {
      const next = new Set(prev);
      next.delete(hId);
      return next;
    });
    setRegistrationDetails(prev => {
      const next = { ...prev };
      delete next[hId];
      return next;
    });
  };

  const handleApplyToTeam = (hId: number, teamId: number) => {
    setHackathonTeams(prev => {
      const list = prev[hId] || [];
      return {
        ...prev,
        [hId]: list.map(t => t.id === teamId ? { ...t, applied: true, size: t.size + 1 } : t)
      };
    });
    gainXp(30);
  };

  const handleCreateTeam = (hId: number) => {
    if (!newTeamName.trim() || !newTeamDesc.trim()) return;
    const newTeam = {
      id: Date.now(),
      name: newTeamName,
      track: newTeamTrack,
      size: 1,
      capacity: 4,
      description: newTeamDesc,
      creator: "You (SoloQueue Hacker)",
      applied: false
    };

    setHackathonTeams(prev => ({
      ...prev,
      [hId]: [newTeam, ...(prev[hId] || [])]
    }));

    setNewTeamName("");
    setNewTeamDesc("");
    setShowCreateTeam(false);
    gainXp(50);
  };

  // Render Single Hackathon Detail View
  if (selectedHackathonId && selectedHackathon) {
    const isReg = isLoggedIn && registered.has(selectedHackathon.id);
    const regInfo = registrationDetails[selectedHackathon.id];
    const teams = hackathonTeams[selectedHackathon.id] || [];

    return (
      <div className="pt-24 pb-16 max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { setSelectedHackathonId(null); setShowRegForm(false); setShowCreateTeam(false); }}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs text-violet-400 font-mono font-bold tracking-widest uppercase">HACKATHON DETAILS</span>
            <h1 className="text-3xl font-extrabold text-white leading-tight mt-0.5">{selectedHackathon.name}</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Main Panels */}
          <div className="lg:col-span-7 space-y-6">
            <GlassCard className="p-6" glowColor="purple">
              <div className="flex gap-2 flex-wrap mb-4">
                <Badge text={selectedHackathon.difficulty} color={diffColors[selectedHackathon.difficulty]} />
                <Badge text={selectedHackathon.type} color={typeColors[selectedHackathon.type]} />
              </div>

              <h3 className="text-lg font-bold text-white mb-3">Event Overview</h3>
              <p className="text-sm text-white/70 leading-relaxed font-sans">
                {selectedHackathon.name} is the premiere developer playground bringing together students, hackers, and mentors. Build a project from scratch over an intense weekend, present your MVP to industry expert judges, and compete for part of the massive <span className="text-yellow-400 font-bold">{selectedHackathon.prize}</span> prize pool!
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-white/40 uppercase">SCHEDULE</p>
                    <p className="text-sm text-white/80 font-semibold">{selectedHackathon.date}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-white/40 uppercase">LOCATION</p>
                    <p className="text-sm text-white/80 font-semibold">{selectedHackathon.location}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Team Finder Module */}
            <GlassCard className="p-6" glowColor="cyan">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" /> Team Finder Board
                  </h3>
                  <p className="text-xs text-white/40 mt-0.5">Connect with other challengers to build together</p>
                </div>
                {isReg && !showCreateTeam && (
                  <button
                    onClick={() => setShowCreateTeam(true)}
                    className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 text-cyan-200 text-xs font-semibold transition-colors"
                  >
                    Create a Team
                  </button>
                )}
              </div>

              {showCreateTeam && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-cyan-500/20 space-y-3"
                >
                  <h4 className="text-sm font-bold text-white">Create New Hackathon Team</h4>
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase font-mono block mb-1">Team Name</label>
                      <input
                        type="text"
                        value={newTeamName}
                        onChange={e => setNewTeamName(e.target.value)}
                        placeholder="e.g. ByteBusters"
                        className="w-full bg-[#08080f] border border-white/10 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase font-mono block mb-1">Target Track</label>
                      <select
                        value={newTeamTrack}
                        onChange={e => setNewTeamTrack(e.target.value)}
                        className="w-full bg-[#08080f] border border-white/10 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option>General Track</option>
                        <option>Artificial Intelligence</option>
                        <option>UI/UX Design Focus</option>
                        <option>Web3 Sandbox</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase font-mono block mb-1">Project Idea & Required Roles</label>
                      <textarea
                        value={newTeamDesc}
                        onChange={e => setNewTeamDesc(e.target.value)}
                        placeholder="Describe what you plan to build and who you are looking to recruit..."
                        className="w-full bg-[#08080f] border border-white/10 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 h-20 resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      onClick={() => setShowCreateTeam(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-white/50 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleCreateTeam(selectedHackathon.id)}
                      className="px-4 py-1.5 bg-cyan-600 text-white font-semibold text-xs rounded-lg hover:bg-cyan-500"
                    >
                      Publish Team
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Team list cards */}
              <div className="space-y-3">
                {teams.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-white/5 rounded-xl">
                    <p className="text-xs text-white/40">No teams registered yet. Be the first to start a team!</p>
                  </div>
                ) : (
                  teams.map(t => (
                    <div key={t.id} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-white/10 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-white">{t.name}</h5>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 font-mono">
                            {t.track}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 leading-relaxed">{t.description}</p>
                        <p className="text-[10px] font-mono text-white/30">Created by: {t.creator}</p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-xs font-mono text-white/40">{t.size}/{t.capacity} members</span>
                        {t.applied ? (
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Applied
                          </span>
                        ) : (
                          <button
                            disabled={!isReg}
                            onClick={() => handleApplyToTeam(selectedHackathon.id, t.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              isReg
                                ? "bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/20"
                                : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                            }`}
                          >
                            Join Team
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Action / Ticket Column */}
          <div className="lg:col-span-5 space-y-6">
            {!isLoggedIn ? (
              <div className="space-y-4">
                <GlassCard className="p-6 text-center" glowColor="none">
                  <Lock className="w-8 h-8 text-white/30 mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-white mb-1">Sign In Required</h3>
                  <p className="text-xs text-white/50 mb-5 leading-relaxed">
                    You must be logged in to your Challenger account to register for events, claim holographic tickets, and join team boards.
                  </p>
                  <button
                    onClick={onOpenLogin}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-violet-500/20"
                  >
                    Log In to Register
                  </button>
                </GlassCard>
              </div>
            ) : isReg ? (
              <div className="space-y-4">
                <h3 className="text-xs font-mono tracking-widest text-white/40 uppercase">Your Admission Pass</h3>
                <CyberTicket hackathon={selectedHackathon} />

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold font-mono text-white/70 uppercase">Registration Credentials</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-white/30 block">Assigned Track</span>
                      <span className="text-white/80 font-semibold">{regInfo?.track || "General Track"}</span>
                    </div>
                    <div>
                      <span className="text-white/30 block">Team Role</span>
                      <span className="text-white/80 font-semibold">{regInfo?.role || "Full Stack Developer"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnregister(selectedHackathon.id)}
                    className="w-full mt-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors"
                  >
                    Cancel Registration
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <GlassCard className="p-6 text-center" glowColor="none">
                  <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-2 animate-pulse" />
                  <h3 className="text-lg font-bold text-white mb-1">Ready to Register?</h3>
                  <p className="text-xs text-white/50 mb-5 leading-relaxed">
                    Select your track and team role to secure your seat and download your holographic ticket pass.
                  </p>

                  {!showRegForm ? (
                    <button
                      onClick={() => setShowRegForm(true)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-violet-500/20"
                    >
                      Fill Out Registration Form
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-left space-y-4 pt-4 border-t border-white/5"
                    >
                      <div>
                        <label className="text-[10px] text-white/40 font-mono uppercase block mb-1">Select Hackathon Track</label>
                        <select
                          value={track}
                          onChange={e => setTrack(e.target.value)}
                          className="w-full bg-[#08080f] border border-white/10 px-3 py-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                        >
                          <option>Web3 & AI Integration</option>
                          <option>Full-Stack SaaS MVP</option>
                          <option>Green Tech & Carbon Offsets</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-white/40 font-mono uppercase block mb-1">Desired Team Role</label>
                        <select
                          value={role}
                          onChange={e => setRole(e.target.value)}
                          className="w-full bg-[#08080f] border border-white/10 px-3 py-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                        >
                          <option>Full Stack Developer</option>
                          <option>Frontend Engineer</option>
                          <option>Backend Architect</option>
                          <option>Product & Pitch lead</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-white/40 font-mono uppercase block mb-1">GitHub / Portfolio Link</label>
                        <input
                          type="text"
                          value={portfolio}
                          onChange={e => setPortfolio(e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full bg-[#08080f] border border-white/10 px-3 py-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>

                      <button
                        onClick={() => handleRegister(selectedHackathon.id)}
                        className="w-full mt-2 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold text-white text-xs uppercase tracking-wider transition-colors"
                      >
                        Submit & Claim Ticket
                      </button>
                    </motion.div>
                  )}
                </GlassCard>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2"><GradientText>Hackathon Finder</GradientText></h1>
          <p className="text-white/50">Browse upcoming events and register to compete.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex gap-2 flex-wrap">
            {(["all", "online", "in-person", "hybrid"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                  filter === f ? "bg-violet-500 text-white" : "bg-white/5 text-white/50 hover:bg-white/10 border border-white/10"
                }`}
              >
                {f === "all" ? "All Events" : f}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap sm:ml-auto">
            {(["All", "Beginner", "Intermediate", "Advanced"] as const).map(d => (
              <button
                key={d}
                onClick={() => setDiffFilter(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  diffFilter === d ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/40" : "bg-white/5 text-white/50 hover:bg-white/10 border border-white/10"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Hackathon grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setSelectedHackathonId(h.id)}
              className="group p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-all hover:shadow-lg hover:shadow-violet-500/10 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge text={h.difficulty} color={diffColors[h.difficulty]} />
                  <Badge text={h.type} color={typeColors[h.type]} />
                </div>
                {isLoggedIn && registered.has(h.id) && (
                  <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                    <Check className="w-3 h-3" />Registered
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">{h.name}</h3>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Calendar className="w-4 h-4 text-violet-400" />{h.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <MapPin className="w-4 h-4 text-blue-400" />{h.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <DollarSign className="w-4 h-4 text-yellow-400" />Prize Pool: <span className="text-yellow-300 font-semibold">{h.prize}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Users className="w-4 h-4 text-cyan-400" />{h.spots.toLocaleString()} spots available
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {h.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  (isLoggedIn && registered.has(h.id))
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-md shadow-violet-500/20"
                }`}
              >
                {(isLoggedIn && registered.has(h.id)) ? "✓ Ticket Claimed — Open Pass" : "View Details & Register"}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

function ProfilePage({
  level,
  xp,
  xpToNext,
  resourcesList,
  registered,
  isLoggedIn,
  onOpenLogin
}: {
  level: number;
  xp: number;
  xpToNext: number;
  resourcesList: Resource[];
  registered: Set<number>;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
}) {
  const rarityColors: Record<string, string> = {
    common: "text-white/60 border-white/20 bg-white/5",
    uncommon: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    rare: "text-blue-300 border-blue-500/30 bg-blue-500/10",
    epic: "text-violet-300 border-violet-500/30 bg-violet-500/10",
    legendary: "text-yellow-300 border-yellow-500/30 bg-yellow-500/10"
  };

  const completedLessonsCount = resourcesList.filter(r => r.progress === 100).length;
  const registeredHackathonsCount = registered.size;

  // Dynamically mark achievements as earned
  const dynamicAchievements = ACHIEVEMENTS.map(a => {
    let earned = a.earned;
    if (a.id === 1 && completedLessonsCount >= 1) earned = true;
    if (a.id === 2 && registeredHackathonsCount >= 1) earned = true;
    if (a.id === 3 && xp >= 1000) earned = true;
    if (a.id === 4 && completedLessonsCount >= 3) earned = true;
    return { ...a, earned };
  });

  if (!isLoggedIn) {
    return (
      <div className="pt-24 pb-16 max-w-md mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <GlassCard className="p-8 border-white/10" glowColor="purple">
            <Lock className="w-12 h-12 text-violet-400 mb-4 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">Challenger Profile Locked</h2>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              Create an account or sign in to build your programmer profile, track lesson progress, register for hackathons, and earn achievements!
            </p>

            <div className="space-y-3.5 text-left bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-6">
              <h4 className="text-[10px] font-bold font-mono text-violet-300 uppercase tracking-widest mb-2">Unlocked with Account:</h4>
              <div className="space-y-2 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Persistent XP & Level progression</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span>Personalized Hackathon Passports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>Claimable visual-novel achievements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Streak tracking & weekly leaderboard</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenLogin}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-violet-500/20"
            >
              Sign In to Unlock Profile
            </button>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="lg:col-span-1 space-y-4">
            <GlassCard className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg shadow-violet-500/30">
                    A
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black">
                    {level}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white">Alex Kim</h2>
                <p className="text-sm text-white/40 mb-1">@alexkim_dev</p>
                <Badge text={level >= 5 ? "Hackathon Hero" : "Code Apprentice"} color="purple" />
                <div className="mt-4 w-full">
                  <div className="flex justify-between text-xs text-white/40 mb-1">
                    <span>Level {level}</span>
                    <span>{xp} / {xpToNext} XP</span>
                  </div>
                  <ProgressBar value={(xp / xpToNext) * 100} color="purple" />
                </div>
              </div>
            </GlassCard>

            {/* Stats */}
            <GlassCard className="p-5">
              <h3 className="font-semibold text-white mb-4 font-mono uppercase tracking-wider text-xs">Challenger Stats</h3>
              <div className="space-y-4">
                {[
                  { label: "Lessons Completed", value: `${completedLessonsCount}/${resourcesList.length}`, icon: <BookOpen className="w-4 h-4 text-violet-400" />, bar: (completedLessonsCount / resourcesList.length) * 100 },
                  { label: "Hackathons Registered", value: `${registeredHackathonsCount}`, icon: <Trophy className="w-4 h-4 text-yellow-400" />, bar: registeredHackathonsCount > 0 ? 100 : 0 },
                  { label: "Blog Posts Read", value: "3", icon: <Newspaper className="w-4 h-4 text-blue-400" />, bar: 60 },
                  { label: "Daily Streak", value: "7 Days", icon: <Flame className="w-4 h-4 text-orange-400" />, bar: 100 },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-xs text-white/60 font-medium">{s.icon}{s.label}</div>
                      <span className="text-xs font-bold text-white font-mono">{s.value}</span>
                    </div>
                    <ProgressBar value={s.bar} color={i === 0 ? "purple" : i === 1 ? "orange" : i === 2 ? "cyan" : "green"} />
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Novel progress */}
            <GlassCard className="p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
                <Play className="w-4 h-4 text-violet-400" />Visual Novel Progress
              </h3>
              {["Prologue", "Chapter 1", "Chapter 2"].map((ch, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-violet-500 text-white" : "bg-white/10 text-white/30"}`}>
                    {i < 3 ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3" />}
                  </div>
                  <span className={`text-sm ${i < 3 ? "text-white/80" : "text-white/30"}`}>{ch}</span>
                  {i < 3 && <Badge text="Done" color="green" />}
                </div>
              ))}
            </GlassCard>
          </div>

          {/* Right side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-white flex items-center gap-2 text-sm font-mono uppercase tracking-wider">
                  <Award className="w-5 h-5 text-yellow-400" />Achievements
                </h3>
                <span className="text-xs text-white/40 font-mono">{dynamicAchievements.filter(a => a.earned).length}/{dynamicAchievements.length} earned</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {dynamicAchievements.map(a => (
                  <div
                    key={a.id}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      a.earned ? rarityColors[a.rarity] : "bg-white/[0.02] border-white/5 opacity-45 grayscale"
                    }`}
                  >
                    <div className="text-3xl mb-2">{a.icon}</div>
                    <p className="text-xs font-semibold leading-tight">{a.name}</p>
                    <p className="text-[10px] opacity-60 mt-0.5 leading-tight">{a.desc}</p>
                    <div className="mt-1.5">
                      <span className={`text-[10px] font-mono uppercase tracking-wider opacity-60`}>{a.rarity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Recent activity */}
            <GlassCard className="p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm font-mono uppercase tracking-wider">
                <TrendingUp className="w-5 h-5 text-cyan-400" />Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { action: "Completed", item: "Python Variables & Loops", type: "resource", xp: 150, time: "2h ago", icon: "✅" },
                  { action: "Earned", item: "First Commit achievement", type: "achievement", xp: 150, time: "1d ago", icon: "⭐" },
                  { action: "Registered for", item: "HackMIT 2026", type: "hackathon", xp: 100, time: "2d ago", icon: "🏆" },
                  { action: "Completed", item: "Team Communication", type: "resource", xp: 200, time: "3d ago", icon: "✅" },
                  { action: "Completed", item: "Chapter 1 of Visual Novel", type: "novel", xp: 250, time: "4d ago", icon: "📖" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                    <span className="text-xl">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70 truncate">
                        <span className="text-white/40">{a.action} </span>{a.item}
                      </p>
                      <p className="text-xs text-white/30">{a.time}</p>
                    </div>
                    <span className="text-xs font-bold text-yellow-400 whitespace-nowrap">+{a.xp} XP</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Bookmarks */}
            <GlassCard className="p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm font-mono uppercase tracking-wider">
                <Bookmark className="w-5 h-5 text-violet-400" />Active Resource Tracks
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {resourcesList.slice(0, 4).map(r => (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center text-violet-400 shrink-0">
                      {r.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{r.title}</p>
                      <p className="text-xs text-white/40 font-mono">Progress: {r.progress}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Blog Page ────────────────────────────────────────────────────────────────

function BlogPage({
  selectedPostId,
  setSelectedPostId,
  blogLikes,
  setBlogLikes,
  blogComments,
  setBlogComments
}: {
  selectedPostId: number | null;
  setSelectedPostId: (id: number | null) => void;
  blogLikes: Record<number, number>;
  setBlogLikes: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  blogComments: Record<number, { author: string; text: string; date: string }[]>;
  setBlogComments: React.Dispatch<React.SetStateAction<Record<number, { author: string; text: string; date: string }[]>>>;
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [copied, setCopied] = useState(false);
  
  // Comment Form States
  const [cmtName, setCmtName] = useState("");
  const [cmtText, setCmtText] = useState("");

  const categories = ["All", "Tutorial", "Tips", "Success Story", "Guide"];
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1).filter(p =>
    activeCategory === "All" || p.category === activeCategory
  );

  const handleLike = (id: number) => {
    setBlogLikes(prev => {
      const originalLikes = BLOG_POSTS.find(p => p.id === id)?.likes || 0;
      const current = prev[id] !== undefined ? prev[id] : originalLikes;
      return {
        ...prev,
        [id]: current + 1
      };
    });
  };

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = (id: number) => {
    if (!cmtName.trim() || !cmtText.trim()) return;
    const newComment = {
      author: cmtName,
      text: cmtText,
      date: "Just Now"
    };
    setBlogComments(prev => ({
      ...prev,
      [id]: [newComment, ...(prev[id] || [])]
    }));
    setCmtName("");
    setCmtText("");
  };

  const selectedPost = BLOG_POSTS.find(p => p.id === selectedPostId);

  // Render Blog Reading View
  if (selectedPostId && selectedPost) {
    const likes = blogLikes[selectedPost.id] !== undefined ? blogLikes[selectedPost.id] : selectedPost.likes;
    const comments = blogComments[selectedPost.id] || [
      { author: "HackerOne", text: "This article is literally what got me through my first weekend sprint!", date: "2 days ago" },
      { author: "DevAria", text: "Classic tips. Keep scopes hyper-focused. Win first, refactor later.", date: "4 days ago" }
    ];

    // Build unique rich text based on the blog selected
    let bodySections = [
      { h: "The Problem", p: "We wanted to build a revolutionary AI productivity assistant. By 2:00 AM, nothing compiled. Everything was broken." },
      { h: "The Pivot", p: "We threw out 90% of the features. We scoped a simple SMS-based empty room searcher. It was 50 lines of script. It ran flawlessly." },
      { h: "Key Lessons", p: "Never be afraid to pivot. Judges reward a clean, beautiful, fully working demo over a massive broken tech-stack." }
    ];

    if (selectedPost.id === 2) {
      bodySections = [
        { h: "Branching Out", p: "Branches are parallel timelines. The 'main' branch is production. Always spin off a feature branch when editing code." },
        { h: "Atomic Commits", p: "Keep commits short and specific. Write descriptive commit messages like 'feat: add registration form' rather than 'fix' or 'stuff'." },
        { h: "Pull Requests", p: "Use pull requests to review your team's code. This prevents broken builds and keeps everyone aligned." }
      ];
    } else if (selectedPost.id === 3) {
      bodySections = [
        { h: "1. The Last Mile Crisis Aid", p: "Build solutions for immediate problems. Extreme local assistance or food distribution tools win hearts." },
        { h: "2. Visual Storytellers", p: "Gamified learning platforms or interactive novels always stand out from generic database tables." },
        { h: "3. GreenProof Analytics", p: "Real-time ecological trackers or verifiable household carbon estimators." }
      ];
    }

    return (
      <div className="pt-24 pb-16 max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Back button */}
          <button
            onClick={() => setSelectedPostId(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors self-start text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Blogs
          </button>

          {/* Banner image */}
          <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden border border-white/10">
            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <Badge text={selectedPost.category} color="purple" />
              <h1 className="text-2xl sm:text-4xl font-black text-white mt-3 leading-tight">{selectedPost.title}</h1>
            </div>
          </div>

          {/* Author bar */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 py-4 border-y border-white/5 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-blue-500" />
              <div>
                <p className="font-bold text-white/80">{selectedPost.author}</p>
                <p className="opacity-60">{selectedPost.date} · {selectedPost.readTime}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleLike(selectedPost.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/20 transition-colors"
              >
                <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                <span>{likes}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{copied ? "Link Copied!" : "Share"}</span>
              </button>
            </div>
          </div>

          {/* Post Body content */}
          <div className="py-4 space-y-6 font-sans leading-relaxed text-white/80 text-sm sm:text-base">
            <p className="text-lg text-white/90 font-medium font-serif italic">"{selectedPost.excerpt}"</p>

            {bodySections.map((sec, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-lg font-bold text-white font-mono mt-6">{sec.h}</h3>
                <p>{sec.p}</p>
              </div>
            ))}
          </div>

          {/* Comments section */}
          <div className="border-t border-white/5 pt-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-violet-400" /> Comments Board ({comments.length})
            </h3>

            {/* Submit Comment Form */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white/75 font-mono uppercase">Leave a Reply</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={cmtName}
                  onChange={e => setCmtName(e.target.value)}
                  placeholder="Your Name"
                  className="bg-[#08080f] border border-white/10 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <textarea
                value={cmtText}
                onChange={e => setCmtText(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full bg-[#08080f] border border-white/10 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500 h-20 resize-none"
              />
              <button
                onClick={() => handleCommentSubmit(selectedPost.id)}
                className="px-5 py-2 rounded-lg bg-violet-600 text-white font-semibold text-xs hover:bg-violet-500 transition-colors"
              >
                Post Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((cmt, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-violet-300 font-mono">{cmt.author}</span>
                    <span className="text-[10px] text-white/30">{cmt.date}</span>
                  </div>
                  <p className="text-xs text-white/70">{cmt.text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2"><GradientText>The SoloQueue Blog</GradientText></h1>
          <p className="text-white/50">Stories, tutorials, and wisdom from the hackathon trenches.</p>
        </div>

        {/* Featured post */}
        <div
          onClick={() => setSelectedPostId(featured.id)}
          className="rounded-3xl overflow-hidden border border-white/10 mb-10 group cursor-pointer"
        >
          <div className="relative h-64 sm:h-80">
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-3">
                <Badge text="Featured" color="orange" />
                <Badge text={featured.category} color="purple" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 max-w-2xl leading-tight group-hover:text-violet-300 transition-colors">{featured.title}</h2>
              <p className="text-white/60 text-sm max-w-xl mb-3 line-clamp-2">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-white/40">
                <span>{featured.author}</span>
                <span>{featured.date}</span>
                <span>{featured.readTime}</span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                  {blogLikes[featured.id] !== undefined ? blogLikes[featured.id] : featured.likes}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-violet-500 text-white"
                  : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedPostId(post.id)}
              className="group rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:shadow-violet-500/5"
            >
              <div className="h-44 overflow-hidden bg-violet-900/20">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge text={post.category} color="purple" />
                  <span className="text-xs text-white/30">{post.readTime}</span>
                </div>
                <h3 className="font-bold text-white mb-2 leading-snug group-hover:text-violet-300 transition-colors">{post.title}</h3>
                <p className="text-sm text-white/40 line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-blue-500" />
                    <span className="text-xs text-white/50">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/30 text-xs">
                    <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                    {blogLikes[post.id] !== undefined ? blogLikes[post.id] : post.likes}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Visual Novel Page ────────────────────────────────────────────────────────

function VisualNovelPage() {
  const [sceneId, setSceneId] = useState<string>("start");
  const [history, setHistory] = useState<string[]>([]);
  const [displayedText, setDisplayedText] = useState("");
  const [textDone, setTextDone] = useState(false);
  const [showChapterCard, setShowChapterCard] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scene = VN_STORY[sceneId];

  const startTyping = useCallback((text: string) => {
    setDisplayedText("");
    setTextDone(false);
    let i = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(intervalRef.current!);
        setTextDone(true);
      }
    }, 22);
  }, []);

  useEffect(() => {
    if (scene?.isChapterBreak) {
      setShowChapterCard(true);
      setTextDone(true);
      setDisplayedText(scene.dialogue);
    } else {
      setShowChapterCard(false);
      startTyping(scene?.dialogue || "");
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [sceneId, scene, startTyping]);

  const advance = () => {
    if (!textDone) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayedText(scene.dialogue);
      setTextDone(true);
      return;
    }
    if (scene.choices) return;
    if (scene.next && scene.next !== sceneId) {
      setHistory(h => [...h, sceneId]);
      setSceneId(scene.next);
    }
  };

  const choose = (to: string) => {
    setHistory(h => [...h, sceneId]);
    setSceneId(to);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setSceneId(prev);
  };

  if (!scene) return null;

  const chapters = [
    { id: "start", label: "Prologue", unlocked: true },
    { id: "c1_1", label: "Chapter 1", unlocked: true },
    { id: "c2_1", label: "Chapter 2", unlocked: true },
    { id: "c3_1", label: "Chapter 3", unlocked: false },
  ];

  return (
    <div className="pt-16 h-screen flex flex-col">
      {/* VN stage */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background */}
        <SceneBackground type={scene.background} />

        {/* Chapter break overlay */}
        {showChapterCard && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center px-8"
            >
              <p className="text-violet-400 font-mono text-sm mb-3 tracking-widest uppercase">
                {scene.chapterTitle?.includes("End") ? "✦ Complete ✦" : "✦ New Chapter ✦"}
              </p>
              <h2 className="text-4xl font-extrabold text-white mb-6">{scene.chapterTitle}</h2>
              {scene.next !== sceneId && (
                <button
                  onClick={() => {
                    setShowChapterCard(false);
                    if (scene.next && scene.next !== sceneId) {
                      setHistory(h => [...h, sceneId]);
                      setSceneId(scene.next);
                    }
                  }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold hover:from-violet-500 hover:to-blue-500 transition-all"
                >
                  {scene.chapterTitle?.includes("End") ? "Replay Prologue" : "Continue →"}
                </button>
              )}
            </motion.div>
          </div>
        )}

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <button onClick={goBack} disabled={history.length === 0}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-xs font-mono text-white/50">
              Scene {Object.keys(VN_STORY).indexOf(sceneId) + 1} / {Object.keys(VN_STORY).length}
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-xs text-white/60 hover:text-white transition-colors"
          >
            <Menu className="w-3.5 h-3.5" />Chapters
          </button>
        </div>

        {/* Chapter menu */}
        {menuOpen && (
          <div className="absolute top-12 right-4 z-30 w-56 bg-[#0f0f1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-white/5">
              <p className="text-sm font-semibold text-white">Chapter Select</p>
            </div>
            {chapters.map(ch => (
              <button
                key={ch.id}
                disabled={!ch.unlocked}
                onClick={() => { setSceneId(ch.id); setMenuOpen(false); setHistory([]); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  ch.unlocked ? "hover:bg-white/5 text-white/70 hover:text-white" : "text-white/20 cursor-not-allowed"
                }`}
              >
                {ch.unlocked ? <Play className="w-4 h-4 text-violet-400" /> : <Lock className="w-4 h-4" />}
                {ch.label}
                {sceneId.startsWith(ch.id.replace("_1", "")) && ch.unlocked && (
                  <span className="ml-auto text-xs text-violet-400">Current</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Character portrait */}
        {scene.character && !showChapterCard && (
          <motion.div
            key={scene.character + scene.charSide}
            initial={{ opacity: 0, x: scene.charSide === "left" ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`absolute bottom-[180px] z-10 ${scene.charSide === "left" ? "left-8 sm:left-16" : "right-8 sm:right-16"}`}
          >
            <CharacterPortrait char={scene.character} size={160} animate />
          </motion.div>
        )}
      </div>

      {/* Dialogue box */}
      {!showChapterCard && (
        <div
          className="relative z-20 border-t border-white/10 bg-[#080810]/95 backdrop-blur-xl"
          onClick={advance}
          style={{ cursor: "pointer" }}
        >
          {/* Speaker name */}
          {scene.speaker && (
            <div className="absolute -top-7 left-6 px-4 py-1 rounded-t-lg bg-[#0f0f1a] border border-b-0 border-white/10">
              <span className="text-sm font-bold text-violet-300 font-mono">{scene.speaker}</span>
            </div>
          )}

          <div className="max-w-4xl mx-auto px-6 py-5">
            <p className="text-white/90 text-base leading-relaxed min-h-[4.5rem]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {displayedText}
              {!textDone && <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse align-middle" />}
            </p>

            {/* Choices */}
            {textDone && scene.choices && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex flex-col sm:flex-row gap-3"
                onClick={e => e.stopPropagation()}
              >
                {scene.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => choose(choice.to)}
                    className="flex-1 py-3 px-5 rounded-xl border border-violet-500/40 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20 hover:border-violet-400/60 text-sm font-semibold transition-all text-left"
                  >
                    <span className="text-violet-400 mr-2">{String.fromCharCode(65 + i)}.</span>
                    {choice.text}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Advance hint */}
            {textDone && !scene.choices && scene.next !== sceneId && (
              <p className="text-xs text-white/25 mt-3 text-right">Click anywhere to continue ▶</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mini-Games Page ──────────────────────────────────────────────────────────

type GameId = "menu" | "sort" | "bug";

function CodeSortGame({ onBack }: { onBack: () => void }) {
  const lines = CODE_SORT_PUZZLE.lines;
  const [selected, setSelected] = useState<string[]>([]);
  const [phase, setPhase] = useState<"play" | "result">("play");

  const sorted = [...lines].sort((a, b) => a.order - b.order);
  const remaining = lines.filter(l => !selected.includes(l.id));

  const handleSelect = (id: string) => {
    if (selected.includes(id)) return;
    setSelected(prev => [...prev, id]);
  };

  const checkAnswer = () => setPhase("result");
  const isCorrect = selected.join(",") === sorted.map(l => l.id).join(",");

  const reset = () => { setSelected([]); setPhase("play"); };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">{CODE_SORT_PUZZLE.title}</h2>
          <p className="text-sm text-white/50">{CODE_SORT_PUZZLE.description}</p>
        </div>
      </div>

      {phase === "play" && (
        <>
          {/* Your sequence */}
          <GlassCard className="p-5 mb-4">
            <p className="text-xs font-mono text-white/40 mb-3 uppercase tracking-widest">Your Program (click lines below to add)</p>
            <div className="space-y-2 min-h-[160px]">
              {selected.length === 0 && (
                <p className="text-white/20 text-sm italic text-center pt-6">Select lines in order below...</p>
              )}
              {selected.map((id, i) => {
                const line = lines.find(l => l.id === id)!;
                return (
                  <div key={id} className="flex items-center gap-3 p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20 font-mono text-sm">
                    <span className="text-violet-400/60 w-5 text-right shrink-0">{i + 1}</span>
                    <span className="text-cyan-300">{line.text}</span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Available lines */}
          <GlassCard className="p-5 mb-4">
            <p className="text-xs font-mono text-white/40 mb-3 uppercase tracking-widest">Available Lines</p>
            <div className="space-y-2">
              {remaining.map(line => (
                <button
                  key={line.id}
                  onClick={() => handleSelect(line.id)}
                  className="w-full text-left flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/10 font-mono text-sm transition-all"
                >
                  <span className="text-white/20 shrink-0">›</span>
                  <span className="text-white/80">{line.text}</span>
                </button>
              ))}
              {remaining.length === 0 && (
                <p className="text-white/30 text-sm text-center py-2">All lines placed!</p>
              )}
            </div>
          </GlassCard>

          <div className="flex gap-3">
            <button onClick={reset} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white text-sm flex items-center gap-2 transition-colors">
              <RefreshCw className="w-4 h-4" />Reset
            </button>
            <button
              onClick={checkAnswer}
              disabled={selected.length < lines.length}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all"
            >
              Check Answer
            </button>
          </div>
        </>
      )}

      {phase === "result" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <GlassCard className={`p-8 text-center mb-6 ${isCorrect ? "border-emerald-500/30" : "border-red-500/30"}`}>
            <div className="text-5xl mb-4">{isCorrect ? "🎉" : "🤔"}</div>
            <h3 className={`text-2xl font-bold mb-2 ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
              {isCorrect ? "Perfect! +300 XP" : "Not quite..."}
            </h3>
            <p className="text-white/50 text-sm">
              {isCorrect ? "Your program runs flawlessly. You nailed it!" : "Review the correct order below and try again."}
            </p>
          </GlassCard>

          <GlassCard className="p-5 mb-4">
            <p className="text-xs font-mono text-white/40 mb-3 uppercase tracking-widest">Correct Order</p>
            <div className="space-y-2">
              {sorted.map((line, i) => {
                const yourLine = lines.find(l => l.id === selected[i]);
                const correct = yourLine?.id === line.id;
                return (
                  <div key={line.id} className={`flex items-center gap-3 p-2.5 rounded-lg font-mono text-sm border ${correct ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                    <span className="text-white/40 w-5 text-right shrink-0">{i + 1}</span>
                    <span className={correct ? "text-cyan-300" : "text-red-300"}>{line.text}</span>
                    {correct ? <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto shrink-0" /> : <X className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <button onClick={reset} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold transition-all hover:from-violet-500 hover:to-blue-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />Try Again
          </button>
        </motion.div>
      )}
    </div>
  );
}

function BugHuntGame({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<"play" | "result">("play");
  const lines = BUG_HUNT_PUZZLE.lines;

  const handleSelect = (id: number) => {
    if (phase !== "play") return;
    setSelected(id);
  };

  const submit = () => { if (selected !== null) setPhase("result"); };
  const reset = () => { setSelected(null); setPhase("play"); };

  const isCorrect = lines.find(l => l.id === selected)?.hasBug === true;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">{BUG_HUNT_PUZZLE.title}</h2>
          <p className="text-sm text-white/50">{BUG_HUNT_PUZZLE.description}</p>
        </div>
      </div>

      <GlassCard className="p-5 mb-4">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="ml-2 text-xs font-mono text-white/30">score_calculator.py</span>
        </div>
        <div className="space-y-1">
          {lines.map(line => {
            let style = "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10 cursor-pointer";
            if (selected === line.id && phase === "play") style = "bg-yellow-500/15 border-yellow-500/30 cursor-pointer";
            if (phase === "result") {
              if (line.hasBug) style = "bg-red-500/15 border-red-500/30 cursor-default";
              else if (selected === line.id) style = "bg-white/5 border-white/10 cursor-default opacity-60";
              else style = "bg-transparent border-transparent cursor-default";
            }
            return (
              <div
                key={line.id}
                onClick={() => handleSelect(line.id)}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border font-mono text-sm transition-all ${style}`}
              >
                <span className="text-white/20 w-4 text-right shrink-0 select-none">{line.id}</span>
                <span className={`${line.hasBug && phase === "result" ? "text-red-300" : "text-cyan-300/80"}`}>
                  {line.text}
                </span>
                {phase === "result" && line.hasBug && (
                  <span className="ml-auto text-xs text-red-400 font-sans font-semibold flex items-center gap-1">
                    <Bug className="w-3.5 h-3.5" />Bug here
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {phase === "play" && (
        <div className="flex gap-3">
          <p className="flex-1 text-sm text-white/30 flex items-center">
            {selected ? `Line ${selected} selected` : "Click a line to select it"}
          </p>
          <button
            onClick={submit}
            disabled={selected === null}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all"
          >
            Submit
          </button>
        </div>
      )}

      {phase === "result" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className={`p-5 mb-4 ${isCorrect ? "border-emerald-500/30" : "border-red-500/30"}`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl">{isCorrect ? "🐛✅" : "❌"}</span>
              <div>
                <h3 className={`font-bold mb-1 ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                  {isCorrect ? "Bug squashed! +250 XP" : "Not the bug..."}
                </h3>
                <p className="text-sm text-white/50">{BUG_HUNT_PUZZLE.explanation}</p>
              </div>
            </div>
          </GlassCard>
          <button onClick={reset} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-violet-500 hover:to-blue-500 transition-all">
            <RefreshCw className="w-4 h-4" />Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}

function MiniGamesPage() {
  const [currentGame, setCurrentGame] = useState<GameId>("menu");

  const games = [
    {
      id: "sort" as GameId,
      title: "Code Sort",
      desc: "Arrange scrambled code lines into the correct order to make a working program.",
      icon: <AlignLeft className="w-7 h-7" />,
      color: "from-violet-600 to-blue-600",
      shadow: "shadow-violet-500/25",
      xp: "300 XP",
      difficulty: "Beginner",
      available: true
    },
    {
      id: "bug" as GameId,
      title: "Bug Hunt",
      desc: "Find the syntax error hiding in a code snippet before it crashes the program.",
      icon: <Bug className="w-7 h-7" />,
      color: "from-red-600 to-orange-600",
      shadow: "shadow-red-500/25",
      xp: "250 XP",
      difficulty: "Beginner",
      available: true
    },
    {
      id: "menu" as GameId,
      title: "Git Flow",
      desc: "Match git commands to their descriptions. Master version control through gameplay.",
      icon: <GitBranch className="w-7 h-7" />,
      color: "from-emerald-600 to-cyan-600",
      shadow: "shadow-emerald-500/25",
      xp: "400 XP",
      difficulty: "Intermediate",
      available: false
    },
    {
      id: "menu" as GameId,
      title: "Type Match",
      desc: "Flip cards to match variable declarations to their data types. Memory + code!",
      icon: <Cpu className="w-7 h-7" />,
      color: "from-pink-600 to-violet-600",
      shadow: "shadow-pink-500/25",
      xp: "200 XP",
      difficulty: "Beginner",
      available: false
    },
  ];

  if (currentGame === "sort") return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <CodeSortGame onBack={() => setCurrentGame("menu")} />
      </motion.div>
    </div>
  );

  if (currentGame === "bug") return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <BugHuntGame onBack={() => setCurrentGame("menu")} />
      </motion.div>
    </div>
  );

  return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2"><GradientText>Mini-Games</GradientText></h1>
          <p className="text-white/50">Reinforce coding concepts through play. Earn XP. Level up.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {games.map((game, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border transition-all ${
                game.available
                  ? "border-white/10 hover:border-white/20 cursor-pointer"
                  : "border-white/5 opacity-60 cursor-not-allowed"
              } bg-white/[0.03]`}
              onClick={() => game.available && setCurrentGame(game.id)}
            >
              {!game.available && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/40">
                  <Lock className="w-3 h-3" />Coming Soon
                </div>
              )}
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className="p-7">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-white mb-5 shadow-lg ${game.shadow} group-hover:scale-110 transition-transform`}>
                  {game.icon}
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{game.title}</h3>
                  <div className="flex flex-col items-end gap-1">
                    <Badge text={game.xp} color="orange" />
                    <Badge text={game.difficulty} color="green" />
                  </div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-5">{game.desc}</p>
                {game.available && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-violet-400 group-hover:text-violet-300 transition-colors">
                    <Play className="w-4 h-4" />
                    Play Now
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard teaser */}
        <div className="mt-10">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />Mini-Game Leaderboard
              </h3>
              <Badge text="This Week" color="cyan" />
            </div>
            <div className="space-y-3">
              {[
                { rank: 1, name: "Zara Liu", xp: 12400, badge: "🥇" },
                { rank: 2, name: "Marcus Chen", xp: 11200, badge: "🥈" },
                { rank: 3, name: "Priya Nair", xp: 9800, badge: "🥉" },
                { rank: 4, name: "Alex Kim", xp: 3850, badge: "🎮", isYou: true },
                { rank: 5, name: "Sam Osei", xp: 3200, badge: "🎮" },
              ].map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 py-2 px-3 rounded-xl transition-colors ${entry.isYou ? "bg-violet-500/15 border border-violet-500/25" : "hover:bg-white/[0.02]"}`}
                >
                  <span className="text-lg">{entry.badge}</span>
                  <span className="text-sm font-mono text-white/30 w-4">{entry.rank}</span>
                  <span className={`text-sm font-medium flex-1 ${entry.isYou ? "text-violet-300" : "text-white/70"}`}>
                    {entry.name} {entry.isYou && <span className="text-xs text-violet-400">(you)</span>}
                  </span>
                  <span className="text-sm font-bold text-yellow-400">{entry.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Login Modal ──────────────────────────────────────────────────────────────

function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSimulatedLogin();
  };

  const triggerSimulatedLogin = () => {
    setLoading(true);
    const steps = [
      "Establishing handshake...",
      "Syncing with SoloQueue DB...",
      "Decrypting user token...",
      "Welcome, Challenger!"
    ];

    let delay = 0;
    steps.forEach((step, index) => {
      setTimeout(() => {
        setLoadingStep(step);
        if (index === steps.length - 1) {
          setTimeout(() => {
            onLoginSuccess();
            setLoading(false);
            setLoadingStep("");
            onClose();
          }, 400);
        }
      }, delay);
      delay += 450;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c16]/95 p-6 shadow-2xl backdrop-blur-xl z-10"
      >
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <RefreshCw className="w-10 h-10 text-violet-400 animate-spin mb-5" />
            <h3 className="text-sm font-bold text-white mb-2">Simulating Authentication</h3>
            <p className="text-[11px] font-mono text-violet-300 animate-pulse">{loadingStep}</p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30 mx-auto mb-2.5">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {isSignUp ? "Create Account" : "Access HQ"}
              </h2>
              <p className="text-[11px] text-white/40 mt-1">
                {isSignUp ? "Sign up to track your hackathon sprints" : "Login to resume your training sessions"}
              </p>
            </div>

            {/* Google Sign In (Simulated) */}
            <button
              type="button"
              onClick={triggerSimulatedLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white font-medium text-xs sm:text-sm transition-all mb-3.5"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[9px] uppercase font-mono tracking-widest text-white/30 bg-transparent">
                <span className="px-2 bg-[#0c0c16]">Or use credentials</span>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="text-[9px] text-white/40 font-mono uppercase block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Kim"
                    className="w-full bg-white/[0.02] border border-white/10 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="text-[9px] text-white/40 font-mono uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@soloqueue.academy"
                  className="w-full bg-white/[0.02] border border-white/10 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-[9px] text-white/40 font-mono uppercase block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.02] border border-white/10 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors mt-2"
              >
                {isSignUp ? "Sign Up as Alex" : "Log In as Alex"}
              </button>
            </form>

            {/* Banner info */}
            <div className="mt-3.5 p-2.5 rounded-xl bg-violet-950/20 border border-violet-500/10 text-[9px] text-white/40 text-center font-mono leading-relaxed">
              💡 Demo Mode: Enter any email or click Google to instantly load Alex Kim's profile.
            </div>

            {/* Toggle Sign In / Sign Up */}
            <p className="text-center text-xs text-white/40 mt-4">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-violet-400 hover:text-violet-300 font-semibold"
              >
                {isSignUp ? "Log In" : "Sign Up"}
              </button>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Root state management for dynamic synchronization
  const [level, setLevel] = useState(3);
  const [xp, setXp] = useState(750);
  const [resourcesList, setResourcesList] = useState<Resource[]>(RESOURCES);
  const [registered, setRegistered] = useState<Set<number>>(new Set<number>());
  const [selectedHackathonId, setSelectedHackathonId] = useState<number | null>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const [registrationDetails, setRegistrationDetails] = useState<Record<number, { role: string; portfolio: string; track: string }>>({});
  const [hackathonTeams, setHackathonTeams] = useState<Record<number, { id: number; name: string; track: string; size: number; capacity: number; description: string; creator: string; applied?: boolean }[]>>({});

  const [blogLikes, setBlogLikes] = useState<Record<number, number>>({});
  const [blogComments, setBlogComments] = useState<Record<number, { author: string; text: string; date: string }[]>>({});

  const xpToNext = level * 1000;

  const gainXp = (amount: number) => {
    setXp(prev => {
      const total = prev + amount;
      const target = level * 1000;
      if (total >= target) {
        setLevel(l => l + 1);
        return total - target;
      }
      return total;
    });
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.style.fontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";
  }, []);

  const isNovelPage = page === "novel";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <AmbientBackground />
      <Navbar
        currentPage={page}
        setPage={setPage}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      <main className="relative z-10">
        {page === "home" && (
          <HomePage
            setPage={setPage}
            setSelectedPostId={setSelectedPostId}
          />
        )}
        {page === "resources" && (
          <ResourcesPage
            resourcesList={resourcesList}
            setResourcesList={setResourcesList}
            selectedResourceId={selectedResourceId}
            setSelectedResourceId={setSelectedResourceId}
            gainXp={gainXp}
            xp={xp}
            level={level}
            isLoggedIn={isLoggedIn}
            onOpenLogin={() => setShowLoginModal(true)}
          />
        )}
        {page === "hackathons" && (
          <HackathonsPage
            registered={registered}
            setRegistered={setRegistered}
            selectedHackathonId={selectedHackathonId}
            setSelectedHackathonId={setSelectedHackathonId}
            registrationDetails={registrationDetails}
            setRegistrationDetails={setRegistrationDetails}
            hackathonTeams={hackathonTeams}
            setHackathonTeams={setHackathonTeams}
            gainXp={gainXp}
            isLoggedIn={isLoggedIn}
            onOpenLogin={() => setShowLoginModal(true)}
          />
        )}
        {page === "profile" && (
          <ProfilePage
            level={level}
            xp={xp}
            xpToNext={xpToNext}
            resourcesList={resourcesList}
            registered={registered}
            isLoggedIn={isLoggedIn}
            onOpenLogin={() => setShowLoginModal(true)}
          />
        )}
        {page === "blog" && (
          <BlogPage
            selectedPostId={selectedPostId}
            setSelectedPostId={setSelectedPostId}
            blogLikes={blogLikes}
            setBlogLikes={setBlogLikes}
            blogComments={blogComments}
            setBlogComments={setBlogComments}
          />
        )}
        {page === "novel" && <VisualNovelPage />}
        {page === "games" && <MiniGamesPage />}
      </main>

      {/* Bottom nav on mobile (except novel for immersion) */}
      {!isNovelPage && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-white/5 bg-[#080810]/95 backdrop-blur-2xl">
          <div className="flex">
            {NAV_ITEMS.map(item => (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] font-medium transition-colors ${
                  page === item.page ? "text-violet-400" : "text-white/30 hover:text-white/60"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => setIsLoggedIn(true)}
        />
      )}
    </div>
  );
}
