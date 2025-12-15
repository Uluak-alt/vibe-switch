import React, { useState, useEffect, useRef } from 'react';
import { SourceViewer } from './components/SourceViewer';
import { ExtensionFile, ViewMode } from './types';
import { Code, Play, Lock, Plus, Save, ArrowLeft, X, ChevronLeft, ChevronRight, ExternalLink, Pencil, Check, Trash2, Settings, Mail, Terminal, Feather, Megaphone, Briefcase, Heart, GraduationCap, Zap, FileText, MessageSquare, Search, BarChart, Smile, BookOpen, Share2, Shield, Scale, Globe, Utensils, Palette, Film, Music, Plane, Gift, Dumbbell, Ghost, ClipboardCheck, Brain } from 'lucide-react';

// --- GENERATED EXTENSION CODE ---

const MANIFEST_JSON = `{
  "manifest_version": 3,
  "name": "Vibe Switch",
  "version": "2.2.0",
  "description": "Pro Tools for ChatGPT & Claude.",
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "*://chatgpt.com/*",
    "*://claude.ai/*",
    "*://gemini.google.com/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "*://chatgpt.com/*",
        "*://claude.ai/*",
        "*://gemini.google.com/*"
      ],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_popup": "popup.html"
  }
}`;

const BACKGROUND_JS = `// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ 
    activePersonality: 'default', 
    customVibes: [],
    lastSelectedVibe: null 
  });
  chrome.storage.local.set({ 
    isPro: false, 
    isCollapsed: false 
  });
});`;

const STYLES_CSS = `:host {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  --bg-color: #0f172a;
  --bg-hover: #1e293b;
  --text-color: #f8fafc;
  --text-muted: #94a3b8;
  --border-color: rgba(255, 255, 255, 0.1);
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --danger: #ef4444;
  --danger-bg: rgba(239, 68, 68, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
}

.sidecar-container {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 260px;
  max-height: 80vh; 
  background-color: var(--bg-color);
  color: var(--text-color);
  border-radius: 12px;
  box-shadow: var(--shadow-lg), 0 0 0 1px var(--border-color);
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.sidecar-container.collapsed {
  width: 60px;
}

/* ZONE A: Sticky Header */
.header {
  flex-shrink: 0;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.95);
  height: 54px;
  backdrop-filter: blur(8px);
}

.brand { 
  font-weight: 700; 
  color: var(--text-color); 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  font-size: 14px;
}
.brand svg { color: var(--primary); }

.toggle-btn { 
  cursor: pointer; 
  color: var(--text-muted); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  width: 24px; 
  height: 24px; 
  border-radius: 4px; 
  transition: color 0.2s;
}
.toggle-btn:hover { color: white; background: var(--bg-hover); }

/* ZONE B: Toolbar (New Vibe) */
.toolbar {
  flex-shrink: 0;
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color);
}

.new-vibe-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255,255,255,0.05);
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}
.new-vibe-btn:hover { background: var(--bg-hover); color: white; border-color: var(--primary); }

/* ZONE C: Scrollable List */
.vibe-list {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px;
  min-height: 200px;
}
.vibe-list::-webkit-scrollbar { width: 4px; }
.vibe-list::-webkit-scrollbar-track { background: transparent; }
.vibe-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }

/* Categories */
.category-header {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 8px 4px 8px;
  margin-top: 4px;
}
.category-header:first-child { margin-top: 0; }

/* List Items */
.vibe-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2px;
  transition: all 0.2s;
  border: 1px solid transparent;
  white-space: nowrap;
  position: relative;
  font-size: 13px;
  color: #cbd5e1;
}
.vibe-item:hover { background: var(--bg-hover); color: white; }
.vibe-item.active { 
  background: rgba(59, 130, 246, 0.15); 
  border-color: rgba(59, 130, 246, 0.5); 
  color: white;
}
.vibe-item.locked { opacity: 0.5; }
.vibe-item.locked:hover { opacity: 0.8; background: var(--bg-hover); }

.icon-box { width: 20px; display: flex; justify-content: center; align-items: center; font-size: 14px; flex-shrink: 0; color: var(--text-muted); }
.vibe-item:hover .icon-box { color: white; }
.vibe-item.active .icon-box { color: var(--primary); }

.label-text { margin-left: 12px; font-weight: 500; flex-grow: 1; text-overflow: ellipsis; overflow: hidden; }
.right-icon { color: var(--text-muted); margin-left: auto; display: flex; align-items: center; }
.active .right-icon { color: var(--primary); }

/* Edit Pencil on Custom Vibes */
.edit-btn {
  opacity: 0;
  padding: 4px;
  border-radius: 4px;
  transition: opacity 0.2s;
}
.vibe-item:hover .edit-btn { opacity: 1; }
.edit-btn:hover { background: rgba(255,255,255,0.2); color: white; }

/* Collapsed State Overrides */
.sidecar-container.collapsed .label-text, 
.sidecar-container.collapsed .brand span, 
.sidecar-container.collapsed .badge,
.sidecar-container.collapsed .new-vibe-btn span,
.sidecar-container.collapsed .category-header,
.sidecar-container.collapsed .right-icon {
  display: none;
}
.sidecar-container.collapsed .header { padding: 0; justify-content: center; }
.sidecar-container.collapsed .toolbar { padding: 12px 0; display: flex; justify-content: center; }
.sidecar-container.collapsed .vibe-item { justify-content: center; padding: 10px 0; }
.sidecar-container.collapsed .new-vibe-btn { width: 36px; height: 36px; padding: 0; border-radius: 50%; border-style: solid; background: var(--primary); color: white; border: none; }

/* TOOLTIPS (Only when collapsed) */
.sidecar-container.collapsed .vibe-item::after {
  content: attr(data-label);
  position: absolute;
  right: 120%;
  top: 50%;
  transform: translateY(-50%);
  background: #000;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 99999;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  visibility: hidden;
}
.sidecar-container.collapsed .vibe-item:hover::after {
  opacity: 1;
  visibility: visible;
  right: 100%;
  margin-right: 12px;
}

/* Forms */
.form-view { padding: 16px; overflow-y: auto; flex-grow: 1; }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.form-title { font-weight: 700; font-size: 14px; }
.form-label { display: block; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; margin-top: 16px; }
.text-input {
  width: 100%; background: #020617; border: 1px solid #334155; color: white;
  padding: 10px; border-radius: 6px; font-size: 13px; box-sizing: border-box; outline: none;
}
.text-input:focus { border-color: var(--primary); }

.range-container { margin-bottom: 16px; }
.range-header { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); margin-bottom: 6px; font-weight: 600; text-transform: uppercase; }
input[type=range] { width: 100%; height: 4px; background: #334155; border-radius: 2px; -webkit-appearance: none; outline: none; }
input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: var(--primary); border-radius: 50%; cursor: pointer; border: 2px solid #0f172a; }

.action-row { display: flex; gap: 10px; margin-top: 24px; padding-bottom: 10px; }
.btn { flex: 1; padding: 8px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; }
.btn-primary { background: var(--primary); color: white; }
.btn-secondary { background: transparent; border: 1px solid #334155; color: var(--text-muted); }
.btn-danger { width: 100%; margin-top: 12px; background: var(--danger-bg); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); }

/* Modal */
.modal-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(2px);
  display: flex; align-items: center; justify-content: center; z-index: 50;
}
.modal-box { background: #1e293b; border: 1px solid #334155; padding: 24px; border-radius: 12px; width: 80%; text-align: center; box-shadow: var(--shadow-lg); }
.modal-title { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
.verify-link { color: var(--text-muted); font-size: 12px; margin-top: 12px; cursor: pointer; text-decoration: underline; }
`;

const CONTENT_JS = `// content.js
(function() {
  if (document.getElementById('sidecar-root')) return;

  const PROMPTS = {
    // WRITING & EDITING
    "Grammar Pro": "You are a Senior Copy Editor. 1. Correction Phase: Fix all grammatical errors. 2. Style Phase: Remove passive voice, swap weak verbs. 3. Output: Polished text first, then 3 critical changes.",
    "Email Polish": "You are a Corp Comms Specialist. 1. Structure: Subject, Polite Opening, BLUF, CTA. 2. Tone: Professional, neutral. 3. Brevity: Remove filler.",
    "Copywriter": "You are a Direct Response Copywriter. 1. Framework: AIDA (Attention, Interest, Desire, Action). 2. Psychology: Benefits over features. 'You' language. 3. Format: Punchy sentences.",
    "Executive": "You are a F500 CEO. 1. Radical Brevity: Cut fluff. 2. Focus: ROI and outcomes. 3. Tone: Authoritative. Active voice.",

    // LEARNING
    "ELI5": "You are a World-Class Educator. Explain using only the 1,000 most common words. 1. Analogy: Use a concrete real-world analogy. 2. Simplicity: Define jargon. 3. Check: Ask 'Did that make sense?'.",
    "Socratic Tutor": "You are a Socratic Professor. Do NOT give the answer. 1. Method: Ask probing questions. 2. Scaffolding: Break problems down. 3. Validation: Validate logic but challenge contradictions.",
    "TL;DR Summarizer": "You are an Efficiency Expert. 1. Hook: One sentence thesis. 2. Data: 3-5 bullet points with numbers. 3. Blindspot: What is missing? Constraint: <20% of original length.",
    "Devil's Advocate": "You are a Critical Thinking Coach. 1. Fallacy Hunt: Identify fallacies. 2. The Counter: Steel-man the opposing argument. 3. Edge Cases: Test extreme scenarios.",

    // CAREER
    "Resume Roaster": "You are a FAANG Recruiter. 1. Impact Check: Flag bullets lacking metrics. 2. XYZ Formula: Rewrite one bullet using 'Accomplished X as measured by Y, by doing Z'. 3. ATS: Critique keywords.",
    "Meeting Note Taker": "You are a Chief of Staff. 1. Attendees: List them. 2. Decisions: List AGREED items. 3. Action Items: Table of [Task] | [Owner] | [Deadline].",
    "Negotiator": "You are a Crisis Negotiator. 1. Tactical Empathy: Validate their position. 2. Pivot: Use 'How' questions to shift burden. 3. Goal: Move to value terms.",
    "Excel Wizard": "You are a Data Analyst. 1. Solution: Exact Formula (XLOOKUP, FILTER). 2. Breakdown: Explain argument by argument. 3. Sanity Check: Warn about pitfalls.",

    // TECHNICAL
    "Code Expert": "You are a Staff Engineer. 1. Clean Code: DRY, PEP8/Standard style. 2. Security: Sanitize inputs. 3. Explanation: Terse. Code first.",
    "Cybersecurity Analyst": "You are a White Hat Hacker. 1. Threat Model: Identify vulnerabilities (SQLi, XSS). 2. Exploit: Explain abuse scenario. 3. Remediation: Specific code fix.",
    "Legal Eagle": "You are a Contract Lawyer. 1. Risk Analysis: Flag ambiguous terms. 2. Protection: Suggest liability limits. 3. Formal Tone: Legally precise.",
    "Chef de Cuisine": "You are a Michelin Chef. 1. Balance: Salt, Fat, Acid, Heat. 2. Technique: Professional methods. 3. Elevation: One 'Secret Ingredient'.",

    // CREATIVE
    "UX/UI Critic": "You are a Senior Product Designer. 1. Usability: Analyze friction/accessibility. 2. Visuals: Hierarchy/Whitespace. 3. Micro-interactions: Propose delight.",
    "Screenwriter": "You are a Script Doctor. Rewrite as Scene. 1. Format: Sluglines, Action, Dialogue. 2. Subtext: Characters don't say feelings. 3. Visuals: Describe actions.",
    "Songwriter": "You are a Hit Lyricist. 1. Structure: Verse/Chorus/Bridge. 2. Prosody: Rhythm and syllable count. 3. Hook: Catchy and repetitive.",
    "Stand-up Comedian": "You are a Headlining Comic. 1. Misdirection: Surprise punchline. 2. Persona: Distinct voice. 3. Timing: Use formatting controls.",
    "Storyteller": "You are a Novelist. 1. Sensory: Smell, temp, texture. 2. Show, Don't Tell: Physical reactions, not emotion names. 3. Pacing: Vary sentence length.",

    // LIFESTYLE
    "Travel Planner": "You are a Luxury Concierge. 1. Logistics: Group by location. 2. Local Gems: Authentic spots. 3. Vibe Match: Tailor energy.",
    "Gift Concierge": "You are a Personal Shopper. 1. Psychographics: Identity over hobbies. 2. Specificity: Specific items, not categories. 3. The Matrix: Safe, Sentimental, Wildcard.",
    "Fitness Coach": "You are an Elite Coach. 1. Plan: Specific protocol. 2. Cues: Physical cues. 3. Mindset: Disciplined tone.",
    "Dungeon Master": "You are a DM. 1. Immersion: Engage 5 senses. 2. Stakes: Establish threat. 3. Call to Action: 'What do you do?'.",
    "Project Manager": "You are an Agile PM. 1. WBS: Sub-tasks. 2. Dependencies: Blockers. 3. Estimation: Time estimates.",
    "Stoic Philosopher": "You are Marcus Aurelius. 1. Control: What is in control vs not. 2. Perspective: Cosmic scale. 3. Tone: Calm, virtuous.",
    "Dating Coach": "You are a Charisma Coach. 1. Hook: Callback to profile. 2. Tone: Playful, low-pressure. 3. Close: Open-loop question.",
    "Social Media Hype": "You are a Viral Marketer. 1. Hook: Stop the scroll. 2. Format: Bro-etry spacing. 3. Engagement: Polarizing question.",
    "Poet": "You are a Classical Poet. 1. Imagery: Metaphor/Simile. 2. Sound: Alliteration. 3. Depth: Emotional truth.",
    "Universal Translator": "You are a UN Interpreter. 1. Nuance: Intent over literal. 2. Localization: Idioms. 3. Tone: Context match."
  };
  
  const ICONS_MAP = {
    // Writing
    "Grammar Pro": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>', // Feather
    "Email Polish": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>', // Mail
    "Copywriter": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>', // Megaphone
    "Executive": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>', // Briefcase

    // Learning
    "ELI5": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>', // BookOpen
    "Socratic Tutor": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10v6"/><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    "TL;DR Summarizer": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>', // FileText
    "Devil's Advocate": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>', // Scale

    // Career
    "Resume Roaster": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>', // Search
    "Meeting Note Taker": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', // MsgSquare
    "Negotiator": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>', // Share2 (Network)
    "Excel Wizard": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>', // BarChart

    // Technical
    "Code Expert": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>', // Terminal
    "Cybersecurity Analyst": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', // Shield
    "Legal Eagle": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>', // Scale
    "Chef de Cuisine": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3"/></svg>', // Utensils

    // Creative
    "UX/UI Critic": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>', // Palette
    "Screenwriter": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="7" x2="7" y1="3" y2="21"/><line x1="17" x2="17" y1="3" y2="21"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/></svg>', // Film
    "Songwriter": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>', // Music
    "Stand-up Comedian": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>', // Smile
    "Storyteller": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', // Book

    // Lifestyle
    "Travel Planner": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20"/><path d="M13 2l9 10-9 10"/><path d="M16 12l-4-4"/><path d="M16 12l-4 4"/></svg>', // Plane-ish
    "Gift Concierge": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.9 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>', // Gift
    "Fitness Coach": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 17h11"/><path d="M6 20h12"/><path d="M6 7h12"/><path d="M6.5 4h11"/><path d="M2 12h20"/></svg>', // Dumbbell
    "Dungeon Master": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 22v-6c0-1.6 1.4-3 3-3s3 1.4 3 3v6"/><path d="M9 22C4 22 4 17 4 17s0-8 8-15c8 7 8 15 8 15s0 5-5 5"/></svg>', // Ghost
    "Project Manager": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>', // Clipboard
    "Stoic Philosopher": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/></svg>', // Cloud/Brain
    "Dating Coach": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>', // Heart
    "Social Media Hype": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', // Zap
    "Poet": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>', // Feather
    "Universal Translator": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' // Globe
  };

  const ICONS = {
    BOLT: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    LOCK: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    PLUS: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    CHECK: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    CHEVRON_LEFT: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
    CHEVRON_RIGHT: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
    PENCIL: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    SPARKLE: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>'
  };

  const FREE_VIBES = ["Grammar Pro", "Code Expert", "TL;DR Summarizer"];
  const CATEGORIES = {
    "Grammar Pro": "Writing", "Email Polish": "Writing", "Copywriter": "Writing", "Executive": "Writing",
    "ELI5": "Learning", "Socratic Tutor": "Learning", "TL;DR Summarizer": "Learning", "Devil's Advocate": "Learning",
    "Resume Roaster": "Career", "Meeting Note Taker": "Career", "Negotiator": "Career", "Excel Wizard": "Career",
    "Code Expert": "Technical", "Cybersecurity Analyst": "Technical", "Legal Eagle": "Technical", "Chef de Cuisine": "Technical",
    "UX/UI Critic": "Creative", "Screenwriter": "Creative", "Songwriter": "Creative", "Stand-up Comedian": "Creative", "Storyteller": "Creative",
    "Travel Planner": "Lifestyle", "Gift Concierge": "Lifestyle", "Fitness Coach": "Lifestyle", "Dungeon Master": "Lifestyle", "Project Manager": "Lifestyle", "Stoic Philosopher": "Lifestyle", "Dating Coach": "Lifestyle", "Social Media Hype": "Lifestyle", "Poet": "Lifestyle", "Universal Translator": "Lifestyle"
  };

  let state = {
    view: 'list',
    isPro: false,
    isCollapsed: false,
    activeId: 'default',
    editingId: null,
    customVibes: []
  };

  // --- 2. INITIALIZATION ---
  const root = document.createElement('div');
  root.id = 'sidecar-root';
  document.body.appendChild(root);
  const shadow = root.attachShadow({ mode: 'open' });
  const styleEl = document.createElement('style');
  styleEl.textContent = \`${STYLES_CSS}\`;
  shadow.appendChild(styleEl);
  const container = document.createElement('div');
  container.className = 'sidecar-container';
  shadow.appendChild(container);

  chrome.storage.local.get(['isPro', 'isCollapsed'], (res) => {
    state.isPro = res.isPro || false;
    state.isCollapsed = res.isCollapsed || false;
    if (state.isCollapsed) state.view = 'list';
    
    chrome.storage.sync.get(['customVibes', 'activePersonality'], (sync) => {
      state.customVibes = sync.customVibes || [];
      state.activeId = sync.activePersonality || 'default';
      renderSidebar();
    });
  });

  // --- 3. RENDERING ---
  function renderSidebar() {
    // Force expand if we are in create view
    if (state.view === 'create' && state.isCollapsed) {
       state.isCollapsed = false;
       chrome.storage.local.set({ isCollapsed: false });
    }

    container.innerHTML = '';
    container.className = state.isCollapsed ? 'sidecar-container collapsed' : 'sidecar-container';

    // A. Sticky Header
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = \`
      <div class="brand">\${ICONS.BOLT} <span>Vibe Switch \${state.isPro ? 'Pro' : ''}</span></div>
      <div class="toggle-btn">\${state.isCollapsed ? ICONS.CHEVRON_LEFT : ICONS.CHEVRON_RIGHT}</div>
    \`;
    header.querySelector('.toggle-btn').onclick = () => {
      state.isCollapsed = !state.isCollapsed;
      if (state.isCollapsed) {
        state.view = 'list';
        state.editingId = null;
      }
      chrome.storage.local.set({ isCollapsed: state.isCollapsed });
      renderSidebar();
    };
    container.appendChild(header);

    // B. Toolbar (New Vibe)
    if (state.view === 'list') {
      const toolbar = document.createElement('div');
      toolbar.className = 'toolbar';
      const btn = document.createElement('button');
      btn.className = 'new-vibe-btn';
      btn.innerHTML = \`\${ICONS.PLUS} <span>New Vibe</span>\`;
      btn.onclick = () => {
        // Fix: Force expand immediately if collapsed, so we can see what's happening
        if (state.isCollapsed) {
           state.isCollapsed = false;
           chrome.storage.local.set({ isCollapsed: false });
           renderSidebar();
        }

        if (!state.isPro) { openUnlockModal(); return; }
        
        state.editingId = null;
        state.view = 'create';
        renderSidebar();
      };
      toolbar.appendChild(btn);
      container.appendChild(toolbar);
    }

    // C. Scrollable Content
    if (state.view === 'list') renderList(container);
    else renderForm(container);
  }

  function renderList(parent) {
    const list = document.createElement('div');
    list.className = 'vibe-list';

    // 1. Custom Vibes
    if (state.customVibes.length > 0) {
      const header = document.createElement('div');
      header.className = 'category-header';
      header.innerText = 'My Vibes';
      list.appendChild(header);
      
      state.customVibes.forEach(v => {
        const item = createVibeItem(v, false, true);
        list.appendChild(item);
      });
    }

    // 2. Standard Vibes
    Object.keys(PROMPTS).forEach(name => {
      if (CATEGORIES[name]) {
        // Prevent duplicate headers (naive implementation since keys iterated in order)
        // A robust implementation would group first, but for this snippet we assume order
        // Let's do a simple check: previous sibling
        const prev = list.lastElementChild;
        if (!prev || prev.innerText !== CATEGORIES[name]) {
             if (Object.values(CATEGORIES).includes(CATEGORIES[name])) {
                 const header = document.createElement('div');
                 header.className = 'category-header';
                 header.innerText = CATEGORIES[name];
                 list.appendChild(header);
             }
        }
      }
      const isLocked = !state.isPro && !FREE_VIBES.includes(name);
      const item = createVibeItem({ id: name, name: name }, isLocked, false);
      list.appendChild(item);
    });

    parent.appendChild(list);
  }

  function createVibeItem(vibe, isLocked, isCustom) {
    const el = document.createElement('div');
    el.className = \`vibe-item \${state.activeId === vibe.id ? 'active' : ''} \${isLocked ? 'locked' : ''}\`;
    el.setAttribute('data-label', vibe.name);
    
    // Logic: Start with default BOLT.
    let iconStr = ICONS.BOLT;
    
    // If Custom, use SPARKLE
    if (isCustom) {
      iconStr = ICONS.SPARKLE;
    }
    // Else if mapped, use the map
    else if (ICONS_MAP[vibe.name]) {
      iconStr = ICONS_MAP[vibe.name];
    }
    
    // OVERRIDE if Locked
    if (isLocked) {
      iconStr = ICONS.LOCK;
    }
    
    el.innerHTML = \`
      <div class="icon-box">\${iconStr}</div>
      <div class="label-text">\${vibe.name}</div>
      <div class="right-icon">
        \${state.activeId === vibe.id ? ICONS.CHECK : ''}
        \${isCustom ? \`<div class="edit-btn">\${ICONS.PENCIL}</div>\` : ''}
      </div>
    \`;

    el.onclick = (e) => {
      if (e.target.closest('.edit-btn')) {
        e.stopPropagation();
        state.editingId = vibe.id;
        state.view = 'create';
        renderSidebar();
        return;
      }
      if (isLocked) { openUnlockModal(); return; }
      
      state.activeId = vibe.id;
      chrome.storage.sync.set({ activePersonality: vibe.id });
      renderSidebar();
      setTimeout(() => {
        state.isCollapsed = true;
        state.view = 'list';
        renderSidebar();
      }, 500);
    };
    return el;
  }

  function renderForm(parent) {
    const isEdit = !!state.editingId;
    let name = '', prompt = '';
    let tuners = { depth: 50, tone: 50, creativity: 50, format: 50, level: 50 };
    
    if (isEdit) {
      const existing = state.customVibes.find(v => v.id === state.editingId);
      if (existing) { name = existing.name; prompt = existing.prompt; tuners = existing.tuners || tuners; }
    }

    const form = document.createElement('div');
    form.className = 'form-view';
    form.innerHTML = \`
      <div class="form-header">
        <div class="form-title">\${isEdit ? 'Edit Vibe' : 'New Vibe'}</div>
        <div class="toggle-btn" id="close-form">\${ICONS.CHEVRON_RIGHT}</div>
      </div>
      
      <label class="form-label">Name</label>
      <input type="text" class="text-input" id="v-name" value="\${name}" placeholder="e.g. Code Reviewer">
      
      <label class="form-label">System Instructions</label>
      <textarea class="text-input" id="v-prompt" rows="4" placeholder="How should the AI behave?">\${prompt}</textarea>
      
      <label class="form-label">Vibe Tuner</label>
      
      <div class="range-container">
        <div class="range-header"><span>Brief</span><span>Detailed</span></div>
        <input type="range" data-type="depth" value="\${tuners.depth}" min="0" max="100">
      </div>
      <div class="range-container">
        <div class="range-header"><span>Casual</span><span>Formal</span></div>
        <input type="range" data-type="tone" value="\${tuners.tone}" min="0" max="100">
      </div>
      <div class="range-container">
        <div class="range-header"><span>Factual</span><span>Creative</span></div>
        <input type="range" data-type="creativity" value="\${tuners.creativity}" min="0" max="100">
      </div>
      <div class="range-container">
        <div class="range-header"><span>Bullet Points</span><span>Paragraphs</span></div>
        <input type="range" data-type="format" value="\${tuners.format}" min="0" max="100">
      </div>
       <div class="range-container">
        <div class="range-header"><span>Beginner</span><span>Expert</span></div>
        <input type="range" data-type="level" value="\${tuners.level}" min="0" max="100">
      </div>
      
      <div class="action-row">
        <button class="btn btn-secondary" id="cancel-btn">Cancel</button>
        <button class="btn btn-primary" id="save-btn">Save</button>
      </div>
      \${isEdit ? '<button class="btn btn-danger" id="del-btn">Delete</button>' : ''}
    \`;

    // Tuner Logic
    const promptEl = form.querySelector('#v-prompt');
    form.querySelectorAll('input[type=range]').forEach(input => {
      input.onchange = (e) => {
        const val = parseInt(e.target.value);
        const type = e.target.dataset.type;
        let txt = '';
        
        if (type === 'depth') {
           if (val < 20) txt = "Be extremely concise. No fluff.";
           if (val > 80) txt = "Be comprehensive and detailed.";
        }
        if (type === 'tone') {
           if (val < 20) txt = "Use a casual, friendly tone.";
           if (val > 80) txt = "Use a formal, professional tone.";
        }
        if (type === 'creativity') {
           if (val < 20) txt = "Stick strictly to facts.";
           if (val > 80) txt = "Be creative and speculative.";
        }
        if (type === 'format') {
           if (val < 20) txt = "Format using bullet points and lists.";
           if (val > 80) txt = "Format using flowing paragraphs.";
        }
        if (type === 'level') {
           if (val < 20) txt = "Explain like I'm 5 years old.";
           if (val > 80) txt = "Assume expert domain knowledge.";
        }
        
        if (txt && !promptEl.value.includes(txt)) {
          promptEl.value += (promptEl.value ? ' ' : '') + txt;
        }
      };
    });

    form.querySelector('#close-form').onclick = () => { state.view = 'list'; renderSidebar(); };
    form.querySelector('#cancel-btn').onclick = () => { state.view = 'list'; renderSidebar(); };
    form.querySelector('#save-btn').onclick = () => {
      const newName = form.querySelector('#v-name').value;
      const newPrompt = form.querySelector('#v-prompt').value;
      if (!newName || !newPrompt) return;
      
      const newVibe = {
        id: isEdit ? state.editingId : Date.now().toString(),
        name: newName,
        prompt: newPrompt,
        tuners: { 
          depth: parseInt(form.querySelector('input[data-type="depth"]').value), 
          tone: parseInt(form.querySelector('input[data-type="tone"]').value),
          creativity: parseInt(form.querySelector('input[data-type="creativity"]').value),
          format: parseInt(form.querySelector('input[data-type="format"]').value),
          level: parseInt(form.querySelector('input[data-type="level"]').value)
        }
      };

      if (isEdit) {
        state.customVibes = state.customVibes.map(v => v.id === state.editingId ? newVibe : v);
      } else {
        state.customVibes.push(newVibe);
      }
      
      chrome.storage.sync.set({ customVibes: state.customVibes });
      state.view = 'list';
      renderSidebar();
    };

    if (isEdit) {
      form.querySelector('#del-btn').onclick = () => {
        state.customVibes = state.customVibes.filter(v => v.id !== state.editingId);
        chrome.storage.sync.set({ customVibes: state.customVibes });
        state.view = 'list';
        renderSidebar();
      };
    }

    parent.appendChild(form);
  }

  function openUnlockModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = \`
      <div class="modal-box">
        <div class="modal-title">Unlock Vibe Switch Pro</div>
        <p style="font-size:13px;color:#94a3b8;margin-bottom:16px">Access 20+ expert vibes and create unlimited custom ones.</p>
        <button class="btn btn-primary" onclick="window.open('https://gumroad.com')">Get License ($5)</button>
        <div style="margin:16px 0;font-size:11px;color:#475569">- OR -</div>
        <input type="text" class="text-input" id="key-in" placeholder="Enter License Key">
        <button class="btn btn-secondary" id="verify-btn" style="margin-top:8px;width:100%">Verify Key</button>
        <div class="verify-link" id="close-modal">No thanks</div>
      </div>
    \`;
    
    overlay.querySelector('#verify-btn').onclick = () => {
      if (overlay.querySelector('#key-in').value.length > 5) {
        state.isPro = true;
        chrome.storage.local.set({ isPro: true });
        overlay.remove();
        renderSidebar();
        alert("Pro Activated!");
      }
    };
    overlay.querySelector('#close-modal').onclick = () => overlay.remove();
    container.appendChild(overlay);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (state.activeId === 'default') return;

      const target = e.target;
      const isInput = target.tagName === 'TEXTAREA' || target.getAttribute('contenteditable') === 'true';
      if (!isInput) return;

      let systemInstruction = "";
      if (PROMPTS[state.activeId]) {
        systemInstruction = PROMPTS[state.activeId];
      } else {
        const custom = state.customVibes.find(v => v.id === state.activeId);
        if (custom) systemInstruction = custom.prompt;
      }

      if (!systemInstruction) return;

      const injection = \`(System Instruction: \${systemInstruction})\n\n\`;
      
      if (target.value !== undefined) {
         if (!target.value.startsWith('(System Instruction:')) {
            target.value = injection + target.value;
            target.dispatchEvent(new Event('input', { bubbles: true }));
         }
      } else {
         if (!target.innerText.startsWith('(System Instruction:')) {
            target.innerText = injection + target.innerText;
            target.dispatchEvent(new Event('input', { bubbles: true }));
         }
      }
    }
  }, true);

})();`;

// --- REACT SIMULATOR ---
const PROMPTS_DATA: Record<string, string> = {
    // Writing
    "Grammar Pro": "Copy Editor...", "Email Polish": "Corp Comms...", "Copywriter": "Marketing...", "Executive": "F500 CEO...",
    // Learning
    "ELI5": "Explain Like 5...", "Socratic Tutor": "Professor...", "TL;DR Summarizer": "Summarizer...", "Devil's Advocate": "Debate Coach...",
    // Career
    "Resume Roaster": "Recruiter...", "Meeting Note Taker": "Chief of Staff...", "Negotiator": "Crisis Negotiator...", "Excel Wizard": "Data Analyst...",
    // Technical
    "Code Expert": "Staff Engineer...", "Cybersecurity Analyst": "Hacker...", "Legal Eagle": "Lawyer...", "Chef de Cuisine": "Michelin Chef...",
    // Creative
    "UX/UI Critic": "Designer...", "Screenwriter": "Script Doctor...", "Songwriter": "Lyricist...", "Stand-up Comedian": "Comic...", "Storyteller": "Novelist...",
    // Lifestyle
    "Travel Planner": "Concierge...", "Gift Concierge": "Shopper...", "Fitness Coach": "Trainer...", "Dungeon Master": "DM...", "Project Manager": "Agile PM...", "Stoic Philosopher": "Marcus Aurelius...",
    "Dating Coach": "Charisma...", "Social Media Hype": "Viral...", "Poet": "Poet...", "Universal Translator": "Interpreter..."
};

const CATEGORIES: Record<string, string> = {
    "Grammar Pro": "Writing", "Email Polish": "Writing", "Copywriter": "Writing", "Executive": "Writing",
    "ELI5": "Learning", "Socratic Tutor": "Learning", "TL;DR Summarizer": "Learning", "Devil's Advocate": "Learning",
    "Resume Roaster": "Career", "Meeting Note Taker": "Career", "Negotiator": "Career", "Excel Wizard": "Career",
    "Code Expert": "Technical", "Cybersecurity Analyst": "Technical", "Legal Eagle": "Technical", "Chef de Cuisine": "Technical",
    "UX/UI Critic": "Creative", "Screenwriter": "Creative", "Songwriter": "Creative", "Stand-up Comedian": "Creative", "Storyteller": "Creative",
    "Travel Planner": "Lifestyle", "Gift Concierge": "Lifestyle", "Fitness Coach": "Lifestyle", "Dungeon Master": "Lifestyle", "Project Manager": "Lifestyle", "Stoic Philosopher": "Lifestyle", "Dating Coach": "Lifestyle", "Social Media Hype": "Lifestyle", "Poet": "Lifestyle", "Universal Translator": "Lifestyle"
};
const FREE_VIBES = ["Grammar Pro", "Code Expert", "TL;DR Summarizer"];

const ICON_MAP: Record<string, React.ReactNode> = {
  // Writing
  "Grammar Pro": <Feather size={14} />,
  "Email Polish": <Mail size={14} />,
  "Copywriter": <Megaphone size={14} />,
  "Executive": <Briefcase size={14} />,

  // Learning
  "ELI5": <BookOpen size={14} />,
  "Socratic Tutor": <GraduationCap size={14} />,
  "TL;DR Summarizer": <FileText size={14} />,
  "Devil's Advocate": <Scale size={14} />,

  // Career
  "Resume Roaster": <Search size={14} />,
  "Meeting Note Taker": <MessageSquare size={14} />,
  "Negotiator": <Share2 size={14} />,
  "Excel Wizard": <BarChart size={14} />,

  // Technical
  "Code Expert": <Terminal size={14} />,
  "Cybersecurity Analyst": <Shield size={14} />,
  "Legal Eagle": <Scale size={14} />,
  "Chef de Cuisine": <Utensils size={14} />,

  // Creative
  "UX/UI Critic": <Palette size={14} />,
  "Screenwriter": <Film size={14} />,
  "Songwriter": <Music size={14} />,
  "Stand-up Comedian": <Smile size={14} />,
  "Storyteller": <BookOpen size={14} />,

  // Lifestyle
  "Travel Planner": <Plane size={14} />,
  "Gift Concierge": <Gift size={14} />,
  "Fitness Coach": <Dumbbell size={14} />,
  "Dungeon Master": <Ghost size={14} />,
  "Project Manager": <ClipboardCheck size={14} />,
  "Stoic Philosopher": <Brain size={14} />,
  "Dating Coach": <Heart size={14} />,
  "Social Media Hype": <Zap size={14} />,
  "Poet": <Feather size={14} />,
  "Universal Translator": <Globe size={14} />
};

// 5 Dimensions
interface Tuners { 
  depth: number; 
  tone: number; 
  creativity: number;
  format: number;
  level: number;
}
interface CustomVibe { id: string; name: string; prompt: string; tuners?: Tuners; }

const SidebarSimulator = () => {
  const [isPro, setIsPro] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [activeId, setActiveId] = useState<string>('default');
  const [customVibes, setCustomVibes] = useState<CustomVibe[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [fName, setFName] = useState('');
  const [fPrompt, setFPrompt] = useState('');
  // 5 Dimensions Default
  const [tuners, setTuners] = useState<Tuners>({ depth: 50, tone: 50, creativity: 50, format: 50, level: 50 });

  // FORCE EXPAND IF IN CREATE MODE
  useEffect(() => {
    if (view === 'create' && isCollapsed) {
      setIsCollapsed(false);
    }
  }, [view, isCollapsed]);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (newState) {
      setView('list');
      setEditingId(null);
    }
  };

  const handleSelect = (id: string, locked: boolean) => {
    if (locked) { setShowModal(true); return; }
    setActiveId(id);
    setTimeout(() => { 
        setIsCollapsed(true);
        setView('list'); 
    }, 500);
  };

  const startEdit = (vibe?: CustomVibe) => {
    // Force expand immediately so modal/form has space
    setIsCollapsed(false);

    if (!isPro) { setShowModal(true); return; }

    if (vibe) {
      setEditingId(vibe.id);
      setFName(vibe.name);
      setFPrompt(vibe.prompt);
      setTuners(vibe.tuners || { depth: 50, tone: 50, creativity: 50, format: 50, level: 50 });
    } else {
      setEditingId(null);
      setFName('');
      setFPrompt('');
      setTuners({ depth: 50, tone: 50, creativity: 50, format: 50, level: 50 });
    }
    setView('create');
  };

  const handleSave = () => {
    if (!fName || !fPrompt) return;
    if (editingId) {
      setCustomVibes(prev => prev.map(v => v.id === editingId ? { ...v, name: fName, prompt: fPrompt, tuners } : v));
    } else {
      setCustomVibes(prev => [...prev, { id: Date.now().toString(), name: fName, prompt: fPrompt, tuners }]);
    }
    setView('list');
  };

  const handleDelete = () => {
    setCustomVibes(prev => prev.filter(v => v.id !== editingId));
    setView('list');
  };

  const updateTuner = (key: keyof Tuners, val: number) => {
    setTuners(prev => ({...prev, [key]: val}));
    let txt = '';
    
    if (key === 'depth') {
       if (val < 20) txt = "Be extremely concise. No fluff.";
       if (val > 80) txt = "Be comprehensive and detailed.";
    }
    if (key === 'tone') {
       if (val < 20) txt = "Use a casual, friendly tone.";
       if (val > 80) txt = "Use a formal, professional tone.";
    }
    if (key === 'creativity') {
       if (val < 20) txt = "Stick strictly to facts.";
       if (val > 80) txt = "Be creative and speculative.";
    }
    if (key === 'format') {
       if (val < 20) txt = "Format using bullet points and lists.";
       if (val > 80) txt = "Format using flowing paragraphs.";
    }
    if (key === 'level') {
       if (val < 20) txt = "Explain like I'm 5 years old.";
       if (val > 80) txt = "Assume expert domain knowledge.";
    }

    if (txt && !fPrompt.includes(txt)) setFPrompt(prev => prev + ' ' + txt);
  };

  // Group prompts for rendering in simulator
  let lastCategory = '';

  return (
    <div className={`fixed top-20 right-10 bg-[#0f172a] text-slate-200 rounded-xl shadow-2xl border border-white/10 flex flex-col font-sans z-50 transition-all duration-300 overflow-hidden`}
         style={{ width: isCollapsed ? '60px' : '260px', maxHeight: '80vh', height: 'auto' }}>
      
      {/* HEADER */}
      <div className={`h-[54px] bg-slate-900/95 border-b border-white/10 flex items-center shrink-0 backdrop-blur-sm ${isCollapsed ? 'justify-center' : 'justify-between px-4'}`}>
        {!isCollapsed && (
          <div className="font-bold text-sm flex items-center gap-2 text-blue-400">
            <div className="text-blue-500"><Code size={18} /></div> Vibe Switch {isPro && <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1 rounded">PRO</span>}
          </div>
        )}
        <button onClick={toggleCollapse} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded">
          {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* TOOLBAR - NEW VIBE */}
      {view === 'list' && (
        <div className={`p-3 border-b border-white/10 bg-[#0f172a] shrink-0 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button onClick={() => startEdit()} className={`w-full flex items-center justify-center gap-2 bg-white/5 border border-dashed border-white/10 hover:border-blue-500 hover:bg-white/10 hover:text-white text-slate-400 rounded-lg transition-all ${isCollapsed ? 'w-9 h-9 p-0 rounded-full bg-blue-600 text-white border-none' : 'py-2.5'}`}>
            <Plus size={16} /> {!isCollapsed && <span className="text-xs font-bold">New Vibe</span>}
          </button>
        </div>
      )}

      {/* BODY */}
      {view === 'list' ? (
        <div className="flex-grow overflow-y-auto p-2 scrollbar-thin">
          {/* Custom Vibes */}
          {customVibes.length > 0 && !isCollapsed && <div className="text-[10px] font-bold text-slate-500 uppercase px-2 py-2">My Vibes</div>}
          {customVibes.map(v => (
             <div key={v.id} onClick={() => handleSelect(v.id, false)} 
                  className={`group relative flex items-center p-2 rounded-lg cursor-pointer border border-transparent hover:bg-slate-800 hover:text-white text-sm text-slate-300 transition-all mb-1 ${activeId === v.id ? 'bg-blue-500/15 border-blue-500/50 text-white' : ''} ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="w-5 flex justify-center shrink-0 text-yellow-400"><Code size={14} /></div>
                {!isCollapsed && <>
                  <span className="ml-3 font-medium truncate flex-1">{v.name}</span>
                  <div className="ml-auto flex items-center">
                    {activeId === v.id && <Check size={14} className="text-blue-500 mr-1" />}
                    <div onClick={(e) => { e.stopPropagation(); startEdit(v); }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded"><Pencil size={12} /></div>
                  </div>
                </>}
             </div>
          ))}

          {/* Standard Vibes */}
          {Object.keys(PROMPTS_DATA).map(key => {
            const isLocked = !isPro && !FREE_VIBES.includes(key);
            const category = CATEGORIES[key];
            const icon = ICON_MAP[key] || <Code size={14} />;
            let showHeader = false;
            if (category && category !== lastCategory) {
                showHeader = true;
                lastCategory = category;
            }

            return (
              <React.Fragment key={key}>
                {showHeader && !isCollapsed && <div className="text-[10px] font-bold text-slate-500 uppercase px-2 py-2 mt-1">{category}</div>}
                <div onClick={() => handleSelect(key, isLocked)}
                  className={`group relative flex items-center p-2 rounded-lg cursor-pointer border border-transparent hover:bg-slate-800 hover:text-white text-sm text-slate-300 transition-all mb-1 ${activeId === key ? 'bg-blue-500/15 border-blue-500/50 text-white' : ''} ${isLocked ? 'opacity-50' : ''} ${isCollapsed ? 'justify-center' : ''}`}>
                  
                  {isCollapsed && <div className="hidden group-hover:block absolute right-[120%] bg-black text-white text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap z-50 shadow-xl">{key}</div>}

                  <div className="w-5 flex justify-center items-center shrink-0 text-slate-400 group-hover:text-white group-hover:scale-110 transition-transform">
                    {isLocked ? <Lock size={12} /> : icon}
                  </div>
                  {!isCollapsed && <span className="ml-3 font-medium truncate">{key}</span>}
                  {!isCollapsed && activeId === key && <Check size={14} className="text-blue-500 ml-auto" />}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        /* FORM VIEW */
        <div className="flex-grow overflow-y-auto p-4">
           <div className="flex justify-between items-center mb-4 text-sm font-bold">
             <span>{editingId ? 'Edit Vibe' : 'New Vibe'}</span>
             <button onClick={() => setView('list')}><X size={16} className="text-slate-400" /></button>
           </div>
           
           <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Name</label>
           <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-blue-500 outline-none mb-4" 
                  value={fName} onChange={e => setFName(e.target.value)} placeholder="e.g. Code Reviewer" />
           
           <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Instructions</label>
           <textarea className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-blue-500 outline-none mb-4 h-24 resize-none" 
                     value={fPrompt} onChange={e => setFPrompt(e.target.value)} placeholder="System prompt..." />
           
           <label className="block text-[11px] font-bold text-slate-500 uppercase mb-3">Vibe Tuner</label>
           
           <div className="space-y-3 mb-6">
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mb-1"><span>Brief</span><span>Detailed</span></div>
                <input type="range" className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer" min="0" max="100" value={tuners.depth} onChange={(e) => updateTuner('depth', parseInt(e.target.value))} />
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mb-1"><span>Casual</span><span>Formal</span></div>
                <input type="range" className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer" min="0" max="100" value={tuners.tone} onChange={(e) => updateTuner('tone', parseInt(e.target.value))} />
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mb-1"><span>Factual</span><span>Creative</span></div>
                <input type="range" className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer" min="0" max="100" value={tuners.creativity} onChange={(e) => updateTuner('creativity', parseInt(e.target.value))} />
              </div>
               <div>
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mb-1"><span>Bullets</span><span>Paragraphs</span></div>
                <input type="range" className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer" min="0" max="100" value={tuners.format} onChange={(e) => updateTuner('format', parseInt(e.target.value))} />
              </div>
               <div>
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mb-1"><span>Beginner</span><span>Expert</span></div>
                <input type="range" className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer" min="0" max="100" value={tuners.level} onChange={(e) => updateTuner('level', parseInt(e.target.value))} />
              </div>
           </div>

           <div className="flex gap-2">
             <button onClick={() => setView('list')} className="flex-1 py-2 border border-slate-700 text-slate-400 rounded text-xs font-bold hover:bg-slate-800">Cancel</button>
             <button onClick={handleSave} className="flex-1 py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-500">Save</button>
           </div>
           {editingId && <button onClick={handleDelete} className="w-full mt-3 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-xs font-bold hover:bg-red-500/20">Delete</button>}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] z-[60] flex items-center justify-center p-4">
           <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full text-center shadow-2xl">
              <div className="text-white font-bold text-lg mb-2">Unlock Vibe Switch Pro</div>
              <p className="text-slate-400 text-xs mb-4">Get access to 20+ expert vibes and create unlimited custom ones.</p>
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-sm mb-4">Get License ($5)</button>
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">- OR -</div>
              <input className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white outline-none mb-2" placeholder="License Key" />
              <button onClick={() => { setIsPro(true); setShowModal(false); alert("Verified!"); }} className="w-full py-2 border border-slate-600 text-slate-300 font-bold rounded text-sm hover:bg-slate-700">Verify Key</button>
              <div onClick={() => setShowModal(false)} className="text-xs text-slate-500 mt-3 underline cursor-pointer">No thanks</div>
           </div>
        </div>
      )}
    </div>
  );
};

const EXTENSION_FILES: ExtensionFile[] = [
  { name: 'manifest.json', path: '/manifest.json', language: 'json', content: MANIFEST_JSON },
  { name: 'background.js', path: '/background.js', language: 'javascript', content: BACKGROUND_JS },
  { name: 'content.js', path: '/content.js', language: 'javascript', content: CONTENT_JS },
  { name: 'styles.css', path: '/styles.css', language: 'css', content: STYLES_CSS },
  { name: 'popup.html', path: '/popup.html', language: 'html', content: '<html><body><h1>Vibe Switch</h1><p>Running in background.</p></body></html>' }
];

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DEMO);

  return (
    <div className="h-full flex flex-col font-sans bg-slate-50">
      {/* Top Navigation */}
      <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 border-b border-slate-700 shrink-0 z-50 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
            S
          </div>
          <h1 className="font-bold text-lg tracking-tight">Vibe Switch Builder</h1>
        </div>
        
        <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
          <button
            onClick={() => setViewMode(ViewMode.DEMO)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === ViewMode.DEMO 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Play size={16} />
            Simulator
          </button>
          <button
             onClick={() => setViewMode(ViewMode.SOURCE)}
             className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === ViewMode.SOURCE
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Code size={16} />
            Source Code
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {viewMode === ViewMode.DEMO ? (
          <div className="w-full h-full relative bg-gray-100 flex items-center justify-center overflow-hidden">
             {/* Fake Page Background */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
             </div>
             
             <div className="text-center text-slate-400 max-w-md">
                <h2 className="text-2xl font-bold mb-2 text-slate-800">Target Page Simulation</h2>
                <p>The sidebar is now fully interactive with new Pro logic and Sticky Layout.</p>
             </div>

             {/* The Sidebar Simulator Component */}
             <SidebarSimulator />
          </div>
        ) : (
          <div className="w-full h-full">
            <SourceViewer files={EXTENSION_FILES} />
          </div>
        )}
      </main>
    </div>
  );
}