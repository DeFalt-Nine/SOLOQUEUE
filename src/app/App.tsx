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

function Navbar({ currentPage, setPage }: { currentPage: Page; setPage: (p: Page) => void }) {
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
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-bold text-violet-300">7 streak</span>
            </div>

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

            {/* Profile */}
            <button
              onClick={() => setPage("profile")}
              className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center text-xs font-bold">A</div>
              <span className="hidden sm:block text-sm font-medium text-white/80">Alex</span>
            </button>

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

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
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

function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Programming", "Git/GitHub", "Hackathons", "UI/UX", "Teamwork", "Planning", "Interview"];

  const filtered = RESOURCES.filter(r => {
    const matchCat = activeCategory === "All" || r.category === activeCategory;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalXP = RESOURCES.filter(r => r.progress === 100).reduce((sum, r) => sum + r.xp, 0);
  const completed = RESOURCES.filter(r => r.progress === 100).length;

  return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2"><GradientText>Learning Resources</GradientText></h1>
          <p className="text-white/50">Everything you need to go from beginner to hackathon-ready.</p>
        </div>

        {/* Progress summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Completed", value: `${completed}/${RESOURCES.length}`, icon: <CheckCircle className="w-5 h-5 text-emerald-400" /> },
            { label: "XP Earned", value: `${totalXP.toLocaleString()}`, icon: <Zap className="w-5 h-5 text-yellow-400" /> },
            { label: "In Progress", value: `${RESOURCES.filter(r => r.progress > 0 && r.progress < 100).length}`, icon: <TrendingUp className="w-5 h-5 text-blue-400" /> },
            { label: "Locked", value: `${RESOURCES.filter(r => r.locked).length}`, icon: <Lock className="w-5 h-5 text-white/30" /> },
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

function HackathonsPage() {
  const [filter, setFilter] = useState<"all" | "online" | "in-person" | "hybrid">("all");
  const [diffFilter, setDiffFilter] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");
  const [registered, setRegistered] = useState<Set<number>>(new Set([1]));

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
              className="group p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-all hover:shadow-lg hover:shadow-violet-500/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge text={h.difficulty} color={diffColors[h.difficulty]} />
                  <Badge text={h.type} color={typeColors[h.type]} />
                </div>
                {registered.has(h.id) && (
                  <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                    <Check className="w-3 h-3" />Registered
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-3">{h.name}</h3>

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
                onClick={() => setRegistered(prev => {
                  const next = new Set(prev);
                  if (next.has(h.id)) next.delete(h.id); else next.add(h.id);
                  return next;
                })}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  registered.has(h.id)
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-red-500/15 hover:text-red-300 hover:border-red-500/30"
                    : "bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-md shadow-violet-500/20"
                }`}
              >
                {registered.has(h.id) ? "✓ Registered — Click to Unregister" : "Register Now"}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

function ProfilePage() {
  const level = 12;
  const xp = 3850;
  const xpToNext = 4500;
  const rarityColors: Record<string, string> = {
    common: "text-white/60 border-white/20 bg-white/5",
    uncommon: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    rare: "text-blue-300 border-blue-500/30 bg-blue-500/10",
    epic: "text-violet-300 border-violet-500/30 bg-violet-500/10",
    legendary: "text-yellow-300 border-yellow-500/30 bg-yellow-500/10"
  };

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
                <Badge text="Code Apprentice" color="purple" />
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
              <h3 className="font-semibold text-white mb-4">Your Stats</h3>
              <div className="space-y-3">
                {[
                  { label: "Lessons Completed", value: "23", icon: <BookOpen className="w-4 h-4 text-violet-400" />, bar: 46 },
                  { label: "Hackathons Registered", value: "1", icon: <Trophy className="w-4 h-4 text-yellow-400" />, bar: 33 },
                  { label: "Blog Posts Read", value: "14", icon: <Newspaper className="w-4 h-4 text-blue-400" />, bar: 70 },
                  { label: "Days Streak", value: "7", icon: <Flame className="w-4 h-4 text-orange-400" />, bar: 100 },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm text-white/60">{s.icon}{s.label}</div>
                      <span className="text-sm font-bold text-white">{s.value}</span>
                    </div>
                    <ProgressBar value={s.bar} color={i === 0 ? "purple" : i === 1 ? "orange" : i === 2 ? "cyan" : "green"} />
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Novel progress */}
            <GlassCard className="p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
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
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />Achievements
                </h3>
                <span className="text-sm text-white/40">{ACHIEVEMENTS.filter(a => a.earned).length}/{ACHIEVEMENTS.length} earned</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ACHIEVEMENTS.map(a => (
                  <div
                    key={a.id}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      a.earned ? rarityColors[a.rarity] : "bg-white/[0.02] border-white/5 opacity-40 grayscale"
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
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { action: "Completed", item: "Your First Hackathon", type: "resource", xp: 300, time: "2h ago", icon: "✅" },
                  { action: "Earned", item: "Story Seeker achievement", type: "achievement", xp: 150, time: "1d ago", icon: "⭐" },
                  { action: "Registered for", item: "HackMIT 2025", type: "hackathon", xp: 50, time: "2d ago", icon: "🏆" },
                  { action: "Completed", item: "Team Communication", type: "resource", xp: 200, time: "3d ago", icon: "✅" },
                  { action: "Completed", item: "Chapter 1 of Visual Novel", type: "novel", xp: 250, time: "4d ago", icon: "📖" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
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
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-violet-400" />Bookmarked Resources
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {RESOURCES.filter((_, i) => [1, 3, 6, 8].includes(i)).map(r => (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center text-violet-400 shrink-0">
                      {r.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{r.title}</p>
                      <p className="text-xs text-white/40">{r.duration}</p>
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

function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Tutorial", "Tips", "Success Story", "Guide"];
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1).filter(p =>
    activeCategory === "All" || p.category === activeCategory
  );

  return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2"><GradientText>The SoloQueue Blog</GradientText></h1>
          <p className="text-white/50">Stories, tutorials, and wisdom from the hackathon trenches.</p>
        </div>

        {/* Featured post */}
        <div className="rounded-3xl overflow-hidden border border-white/10 mb-10 group cursor-pointer">
          <div className="relative h-64 sm:h-80">
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-3">
                <Badge text="Featured" color="orange" />
                <Badge text={featured.category} color="purple" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 max-w-2xl leading-tight">{featured.title}</h2>
              <p className="text-white/60 text-sm max-w-xl mb-3 line-clamp-2">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-white/40">
                <span>{featured.author}</span>
                <span>{featured.date}</span>
                <span>{featured.readTime}</span>
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-pink-400" />{featured.likes}</span>
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
                <h3 className="font-bold text-white mb-2 leading-snug">{post.title}</h3>
                <p className="text-sm text-white/40 line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-blue-500" />
                    <span className="text-xs text-white/50">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/30 text-xs">
                    <Heart className="w-3.5 h-3.5 text-pink-400" />
                    {post.likes}
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

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.style.fontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";
  }, []);

  const isNovelPage = page === "novel";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <AmbientBackground />
      <Navbar currentPage={page} setPage={setPage} />

      <main className="relative z-10">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "resources" && <ResourcesPage />}
        {page === "hackathons" && <HackathonsPage />}
        {page === "profile" && <ProfilePage />}
        {page === "blog" && <BlogPage />}
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
    </div>
  );
}
