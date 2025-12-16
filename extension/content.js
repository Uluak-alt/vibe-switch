// content.js - Vibe Switch Content Script
(function() {
  'use strict';
  
  // Prevent multiple injections
  if (document.getElementById('sidecar-root')) return;

  // Check if chrome APIs are available (extension context is valid)
  function isExtensionContextValid() {
    try {
      return chrome && chrome.runtime && chrome.runtime.id;
    } catch (e) {
      return false;
    }
  }

  // Safe wrapper for chrome API calls
  function safeChromeCaller(callback) {
    if (!isExtensionContextValid()) {
      console.log('⚠️ Vibe Switch: Extension context invalidated, skipping operation');
      return false;
    }
    try {
      callback();
      return true;
    } catch (error) {
      if (error.message && error.message.includes('Extension context invalidated')) {
        console.log('⚠️ Vibe Switch: Extension was reloaded. Please refresh this page.');
      } else {
        console.error('Vibe Switch error:', error);
      }
      return false;
    }
  }

  // Check if extension is enabled before initializing
  safeChromeCaller(() => {
    chrome.storage.local.get(['extensionEnabled'], (result) => {
      if (!isExtensionContextValid()) return;
      
      const isEnabled = result.extensionEnabled !== false; // Default to true
      if (!isEnabled) {
        console.log('🎯 Vibe Switch is disabled');
        return;
      }
      initializeExtension();
    });
  });

  // Listen for toggle messages from popup
  safeChromeCaller(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (!isExtensionContextValid()) return;
      
      if (request.action === 'toggleExtension') {
        const container = document.getElementById('sidecar-root');
        if (container) {
          if (request.enabled) {
            container.style.display = 'block';
            console.log('✅ Vibe Switch enabled');
          } else {
            container.style.display = 'none';
            console.log('❌ Vibe Switch disabled');
          }
        }
      }
    });
  });

function initializeExtension() {

  // PROMPT DATABASE - 30+ Expert Vibes
  const PROMPTS = {
    // WRITING & EDITING (4)
    "Grammar Pro": "You are a Senior Copy Editor. 1. Correction Phase: Fix all grammatical errors. 2. Style Phase: Remove passive voice, swap weak verbs. 3. Output: Polished text first, then 3 critical changes.",
    "Email Polish": "You are a Corp Comms Specialist. 1. Structure: Subject, Polite Opening, BLUF, CTA. 2. Tone: Professional, neutral. 3. Brevity: Remove filler.",
    "Copywriter": "You are a Direct Response Copywriter. 1. Framework: AIDA (Attention, Interest, Desire, Action). 2. Psychology: Benefits over features. 'You' language. 3. Format: Punchy sentences.",
    "Executive": "You are a F500 CEO. 1. Radical Brevity: Cut fluff. 2. Focus: ROI and outcomes. 3. Tone: Authoritative. Active voice.",

    // LEARNING (4)
    "ELI5": "You are a World-Class Educator. Explain using only the 1,000 most common words. 1. Analogy: Use a concrete real-world analogy. 2. Simplicity: Define jargon. 3. Check: Ask 'Did that make sense?'.",
    "Socratic Tutor": "You are a Socratic Professor. Do NOT give the answer. 1. Method: Ask probing questions. 2. Scaffolding: Break problems down. 3. Validation: Validate logic but challenge contradictions.",
    "TL;DR Summarizer": "You are an Efficiency Expert. 1. Hook: One sentence thesis. 2. Data: 3-5 bullet points with numbers. 3. Blindspot: What is missing? Constraint: <20% of original length.",
    "Devil's Advocate": "You are a Critical Thinking Coach. 1. Fallacy Hunt: Identify fallacies. 2. The Counter: Steel-man the opposing argument. 3. Edge Cases: Test extreme scenarios.",

    // CAREER (4)
    "Resume Roaster": "You are a FAANG Recruiter. 1. Impact Check: Flag bullets lacking metrics. 2. XYZ Formula: Rewrite one bullet using 'Accomplished X as measured by Y, by doing Z'. 3. ATS: Critique keywords.",
    "Meeting Note Taker": "You are a Chief of Staff. 1. Attendees: List them. 2. Decisions: List AGREED items. 3. Action Items: Table of [Task] | [Owner] | [Deadline].",
    "Negotiator": "You are a Crisis Negotiator. 1. Tactical Empathy: Validate their position. 2. Pivot: Use 'How' questions to shift burden. 3. Goal: Move to value terms.",
    "Excel Wizard": "You are a Data Analyst. 1. Solution: Exact Formula (XLOOKUP, FILTER). 2. Breakdown: Explain argument by argument. 3. Sanity Check: Warn about pitfalls.",

    // TECHNICAL (4)
    "Code Expert": "You are a Staff Engineer. 1. Clean Code: DRY, PEP8/Standard style. 2. Security: Sanitize inputs. 3. Explanation: Terse. Code first.",
    "Cybersecurity Analyst": "You are a White Hat Hacker. 1. Threat Model: Identify vulnerabilities (SQLi, XSS). 2. Exploit: Explain abuse scenario. 3. Remediation: Specific code fix.",
    "Legal Eagle": "You are a Contract Lawyer. 1. Risk Analysis: Flag ambiguous terms. 2. Protection: Suggest liability limits. 3. Formal Tone: Legally precise.",
    "Chef de Cuisine": "You are a Michelin Chef. 1. Balance: Salt, Fat, Acid, Heat. 2. Technique: Professional methods. 3. Elevation: One 'Secret Ingredient'.",

    // CREATIVE (5)
    "UX/UI Critic": "You are a Senior Product Designer. 1. Usability: Analyze friction/accessibility. 2. Visuals: Hierarchy/Whitespace. 3. Micro-interactions: Propose delight.",
    "Screenwriter": "You are a Script Doctor. Rewrite as Scene. 1. Format: Sluglines, Action, Dialogue. 2. Subtext: Characters don't say feelings. 3. Visuals: Describe actions.",
    "Songwriter": "You are a Hit Lyricist. 1. Structure: Verse/Chorus/Bridge. 2. Prosody: Rhythm and syllable count. 3. Hook: Catchy and repetitive.",
    "Stand-up Comedian": "You are a Headlining Comic. 1. Misdirection: Surprise punchline. 2. Persona: Distinct voice. 3. Timing: Use formatting controls.",
    "Storyteller": "You are a Novelist. 1. Sensory: Smell, temp, texture. 2. Show, Don't Tell: Physical reactions, not emotion names. 3. Pacing: Vary sentence length.",

    // LIFESTYLE (10)
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

  // Free vibes (available without Pro)
  const FREE_VIBES = ["Grammar Pro", "Code Expert", "TL;DR Summarizer"];

  // Categories for organization
  const CATEGORIES = {
    "Grammar Pro": "Writing", "Email Polish": "Writing", "Copywriter": "Writing", "Executive": "Writing",
    "ELI5": "Learning", "Socratic Tutor": "Learning", "TL;DR Summarizer": "Learning", "Devil's Advocate": "Learning",
    "Resume Roaster": "Career", "Meeting Note Taker": "Career", "Negotiator": "Career", "Excel Wizard": "Career",
    "Code Expert": "Technical", "Cybersecurity Analyst": "Technical", "Legal Eagle": "Technical", "Chef de Cuisine": "Technical",
    "UX/UI Critic": "Creative", "Screenwriter": "Creative", "Songwriter": "Creative", "Stand-up Comedian": "Creative", "Storyteller": "Creative",
    "Travel Planner": "Lifestyle", "Gift Concierge": "Lifestyle", "Fitness Coach": "Lifestyle", "Dungeon Master": "Lifestyle", 
    "Project Manager": "Lifestyle", "Stoic Philosopher": "Lifestyle", "Dating Coach": "Lifestyle", "Social Media Hype": "Lifestyle", 
    "Poet": "Lifestyle", "Universal Translator": "Lifestyle"
  };

  // Icon mapping (using Lucide SVG icons)
  const ICONS_MAP = {
    "Grammar Pro": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    "Email Polish": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    "Copywriter": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
    "Executive": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    "ELI5": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    "Socratic Tutor": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10v6"/><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    "TL;DR Summarizer": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>',
    "Devil's Advocate": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/></svg>',
    "Resume Roaster": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    "Meeting Note Taker": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    "Negotiator": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/></svg>',
    "Excel Wizard": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
    "Code Expert": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
    "Cybersecurity Analyst": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    "Legal Eagle": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/></svg>',
    "Chef de Cuisine": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3"/></svg>',
    "UX/UI Critic": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
    "Screenwriter": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>',
    "Songwriter": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    "Stand-up Comedian": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>',
    "Storyteller": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    "Travel Planner": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
    "Gift Concierge": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>',
    "Fitness Coach": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',
    "Dungeon Master": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>',
    "Project Manager": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>',
    "Stoic Philosopher": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
    "Dating Coach": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    "Social Media Hype": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    "Poet": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',
    "Universal Translator": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
  };

  // Generic icons
  const ICONS = {
    BOLT: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    LOCK: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    PLUS: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    CHECK: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    CHEVRON_LEFT: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
    CHEVRON_RIGHT: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
    PENCIL: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    SPARKLE: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
    X: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  };

  // State management
  const state = {
    activeId: 'default',
    customVibes: [],
    isPro: false,
    isCollapsed: false,
    view: 'list', // 'list' or 'create'
    editingId: null
  };

  // Load state from chrome.storage
  function loadState() {
    if (!isExtensionContextValid()) {
      console.log('⚠️ Cannot load state: extension context invalid');
      renderSidebar();
      return;
    }
    
    chrome.storage.sync.get(['activePersonality', 'customVibes'], (syncData) => {
      if (!isExtensionContextValid()) return;
      
      if (syncData.activePersonality) state.activeId = syncData.activePersonality;
      if (syncData.customVibes) state.customVibes = syncData.customVibes;
      
      if (!isExtensionContextValid()) {
        renderSidebar();
        return;
      }
      
      chrome.storage.local.get(['isPro', 'isCollapsed'], (localData) => {
        if (!isExtensionContextValid()) return;
        if (localData.isPro) state.isPro = localData.isPro;
        if (localData.isCollapsed !== undefined) state.isCollapsed = localData.isCollapsed;
        renderSidebar();
      });
    });
  }

  // Create sidebar container
  const container = document.createElement('div');
  container.id = 'sidecar-root';
  document.body.appendChild(container);

  // Inject styles via style tag
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    #sidecar-root {
      all: initial;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    #sidecar-root * { box-sizing: border-box; }
    
    .sidecar-container {
      position: fixed;
      top: 80px;
      right: 20px;
      width: 260px;
      max-height: 80vh;
      background-color: #0f172a;
      color: #f8fafc;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }
    
    .sidecar-container.collapsed { width: 60px; }
    
    .header {
      flex-shrink: 0;
      padding: 0 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(15, 23, 42, 0.95);
      height: 54px;
      backdrop-filter: blur(8px);
    }
    
    .brand { 
      font-weight: 700;
      color: #f8fafc;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }
    .brand svg { color: #3b82f6; }
    .badge {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
    }
    
    .toggle-btn {
      cursor: pointer;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      transition: color 0.2s;
    }
    .toggle-btn:hover { color: white; background: #1e293b; }
    
    .toolbar {
      flex-shrink: 0;
      padding: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: #0f172a;
    }
    
    .new-vibe-btn {
      width: 100%;
      padding: 10px;
      background: rgba(255,255,255,0.05);
      border: 1px dashed rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #94a3b8;
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
    .new-vibe-btn:hover { background: #1e293b; color: white; border-color: #3b82f6; }
    
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
    
    .category-header {
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 12px 8px 4px 8px;
      margin-top: 4px;
    }
    .category-header:first-child { margin-top: 0; }
    
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
    .vibe-item:hover { background: #1e293b; color: white; }
    .vibe-item.active {
      background: rgba(59, 130, 246, 0.15);
      border-color: rgba(59, 130, 246, 0.5);
      color: white;
    }
    .vibe-item.locked { opacity: 0.5; }
    .vibe-item.locked:hover { opacity: 0.8; background: #1e293b; }
    
    .icon-box {
      width: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      flex-shrink: 0;
      color: #94a3b8;
    }
    .vibe-item:hover .icon-box { color: white; }
    .vibe-item.active .icon-box { color: #3b82f6; }
    
    .label-text {
      margin-left: 12px;
      font-weight: 500;
      flex-grow: 1;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    
    .right-icon {
      color: #94a3b8;
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .active .right-icon { color: #3b82f6; }
    
    .edit-btn {
      opacity: 0;
      padding: 4px;
      border-radius: 4px;
      transition: opacity 0.2s;
    }
    .vibe-item:hover .edit-btn { opacity: 1; }
    .edit-btn:hover { background: rgba(255,255,255,0.2); color: white; }
    
    /* Collapsed state */
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
    .sidecar-container.collapsed .new-vibe-btn {
      width: 36px;
      height: 36px;
      padding: 0;
      border-radius: 50%;
      border-style: solid;
      background: #3b82f6;
      color: white;
      border: none;
    }
    
    /* Tooltips when collapsed */
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
    
    /* Form styles */
    .form-view { padding: 16px; overflow-y: auto; flex-grow: 1; }
    .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .form-title { font-weight: 700; font-size: 14px; }
    .form-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      margin-bottom: 6px;
      margin-top: 16px;
    }
    .text-input {
      width: 100%;
      background: #020617;
      border: 1px solid #334155;
      color: white;
      padding: 10px;
      border-radius: 6px;
      font-size: 13px;
      box-sizing: border-box;
      outline: none;
      font-family: inherit;
    }
    .text-input:focus { border-color: #3b82f6; }
    textarea.text-input { resize: vertical; min-height: 80px; }
    
    .range-container { margin-bottom: 16px; }
    .range-header {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #94a3b8;
      margin-bottom: 6px;
      font-weight: 600;
      text-transform: uppercase;
    }
    input[type=range] {
      width: 100%;
      height: 4px;
      background: #334155;
      border-radius: 2px;
      -webkit-appearance: none;
      outline: none;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      background: #3b82f6;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid #0f172a;
    }
    input[type=range]::-moz-range-thumb {
      width: 14px;
      height: 14px;
      background: #3b82f6;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid #0f172a;
    }
    
    .action-row { display: flex; gap: 10px; margin-top: 24px; padding-bottom: 10px; }
    .btn {
      flex: 1;
      padding: 8px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      font-family: inherit;
    }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-primary:hover { background: #2563eb; }
    .btn-secondary {
      background: transparent;
      border: 1px solid #334155;
      color: #94a3b8;
    }
    .btn-secondary:hover { background: #1e293b; }
    .btn-danger {
      width: 100%;
      margin-top: 12px;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    .btn-danger:hover { background: rgba(239, 68, 68, 0.2); }
    
    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
    }
    .modal-box {
      background: #1e293b;
      border: 1px solid #334155;
      padding: 24px;
      border-radius: 12px;
      width: 80%;
      text-align: center;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    }
    .modal-title { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
    .modal-text { font-size: 13px; color: #94a3b8; margin-bottom: 16px; line-height: 1.5; }
    .verify-link {
      color: #94a3b8;
      font-size: 12px;
      margin-top: 12px;
      cursor: pointer;
      text-decoration: underline;
    }
    .verify-link:hover { color: white; }
    .gumroad-btn {
      width: 100%;
      padding: 10px;
      background: #ff90e8;
      color: #000;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      margin-bottom: 16px;
      font-family: inherit;
    }
    .gumroad-btn:hover { background: #ff7fd9; }
  `;
  document.head.appendChild(styleEl);

  // Render main sidebar
  function renderSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = `sidecar-container ${state.isCollapsed ? 'collapsed' : ''}`;

    // Header
    renderHeader(sidebar);

    if (state.view === 'list') {
      renderToolbar(sidebar);
      renderList(sidebar);
    } else {
      renderForm(sidebar);
    }

    container.innerHTML = '';
    container.appendChild(sidebar);
  }

  function renderHeader(parent) {
    const header = document.createElement('div');
    header.className = 'header';

    const brand = document.createElement('div');
    brand.className = 'brand';
    brand.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
      <span>Vibe Switch</span>
      ${state.isPro ? '<span class="badge">PRO</span>' : ''}
    `;

    const toggle = document.createElement('div');
    toggle.className = 'toggle-btn';
    toggle.innerHTML = state.isCollapsed ? ICONS.CHEVRON_LEFT : ICONS.CHEVRON_RIGHT;
    toggle.onclick = () => {
      state.isCollapsed = !state.isCollapsed;
      if (isExtensionContextValid()) {
        chrome.storage.local.set({ isCollapsed: state.isCollapsed });
      }
      if (state.isCollapsed) state.view = 'list';
      renderSidebar();
    };

    header.appendChild(brand);
    header.appendChild(toggle);
    parent.appendChild(header);
  }

  function renderToolbar(parent) {
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';

    const btn = document.createElement('button');
    btn.className = 'new-vibe-btn';
    btn.innerHTML = `${ICONS.PLUS} <span>New Vibe</span>`;
    btn.onclick = () => {
      if (!state.isPro) {
        openUnlockModal();
        return;
      }
      state.view = 'create';
      state.editingId = null;
      state.isCollapsed = false;
      renderSidebar();
    };

    toolbar.appendChild(btn);
    parent.appendChild(toolbar);
  }

  function renderList(parent) {
    const list = document.createElement('div');
    list.className = 'vibe-list';

    // Custom vibes
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

    // Standard vibes by category
    let lastCategory = '';
    Object.keys(PROMPTS).forEach(name => {
      const category = CATEGORIES[name];
      if (category && category !== lastCategory) {
        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerText = category;
        list.appendChild(header);
        lastCategory = category;
      }

      const isLocked = !state.isPro && !FREE_VIBES.includes(name);
      const item = createVibeItem({ id: name, name: name }, isLocked, false);
      list.appendChild(item);
    });

    parent.appendChild(list);
  }

  function createVibeItem(vibe, isLocked, isCustom) {
    const el = document.createElement('div');
    el.className = `vibe-item ${state.activeId === vibe.id ? 'active' : ''} ${isLocked ? 'locked' : ''}`;
    el.setAttribute('data-label', vibe.name);

    let iconStr = ICONS.BOLT;
    if (isCustom) {
      iconStr = ICONS.SPARKLE;
    } else if (ICONS_MAP[vibe.name]) {
      iconStr = ICONS_MAP[vibe.name];
    }
    if (isLocked) {
      iconStr = ICONS.LOCK;
    }

    el.innerHTML = `
      <div class="icon-box">${iconStr}</div>
      <div class="label-text">${vibe.name}</div>
      <div class="right-icon">
        ${state.activeId === vibe.id ? ICONS.CHECK : ''}
        ${isCustom ? `<div class="edit-btn">${ICONS.PENCIL}</div>` : ''}
      </div>
    `;

    el.onclick = (e) => {
      if (e.target.closest('.edit-btn')) {
        e.stopPropagation();
        state.editingId = vibe.id;
        state.view = 'create';
        state.isCollapsed = false;
        renderSidebar();
        return;
      }
      if (isLocked) {
        openUnlockModal();
        return;
      }

      console.log('🎭 Vibe clicked:', vibe.id, vibe.name);
      console.log('📋 Previous activeId:', state.activeId);
      console.log('📋 Previous lastInjectedPrompt:', lastInjectedPrompt ? lastInjectedPrompt.substring(0, 50) + '...' : 'null');
      
      // Clear any existing prompt injection from textarea
      clearInjectedPrompt();
      console.log('🧹 Cleared injection, lastInjectedPrompt now:', lastInjectedPrompt);
      
      // Update active vibe
      const previousVibe = state.activeId;
      state.activeId = vibe.id;
      console.log('✅ State updated:', previousVibe, '→', state.activeId);
      console.log('✅ New vibe will use prompt:', PROMPTS[vibe.id] ? PROMPTS[vibe.id].substring(0, 50) + '...' : 'CUSTOM OR NOT FOUND');
      
      // Save to storage
      if (isExtensionContextValid()) {
        chrome.storage.sync.set({ activePersonality: vibe.id }, () => {
          if (isExtensionContextValid()) {
            console.log('💾 Saved to storage:', vibe.id);
          }
        });
      }
      
      // Show visual confirmation
      showVibeChangeNotification(vibe.name);
      
      renderSidebar();
      setTimeout(() => {
        console.log('⏱️ Timeout fired, activeId still:', state.activeId);
        state.isCollapsed = true;
        state.view = 'list';
        if (isExtensionContextValid()) {
          chrome.storage.local.set({ isCollapsed: true });
        }
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
      if (existing) {
        name = existing.name;
        prompt = existing.prompt;
        tuners = existing.tuners || tuners;
      }
    }

    const form = document.createElement('div');
    form.className = 'form-view';
    form.innerHTML = `
      <div class="form-header">
        <div class="form-title">${isEdit ? 'Edit Vibe' : 'New Vibe'}</div>
        <div class="toggle-btn" id="close-form">${ICONS.X}</div>
      </div>

      <label class="form-label">Name</label>
      <input type="text" class="text-input" id="v-name" value="${name}" placeholder="e.g. Code Reviewer">

      <label class="form-label">System Instructions</label>
      <textarea class="text-input" id="v-prompt" rows="4" placeholder="How should the AI behave?">${prompt}</textarea>

      <label class="form-label">Vibe Tuner</label>

      <div class="range-container">
        <div class="range-header"><span>Brief</span><span>Detailed</span></div>
        <input type="range" data-type="depth" value="${tuners.depth}" min="0" max="100">
      </div>
      <div class="range-container">
        <div class="range-header"><span>Casual</span><span>Formal</span></div>
        <input type="range" data-type="tone" value="${tuners.tone}" min="0" max="100">
      </div>
      <div class="range-container">
        <div class="range-header"><span>Factual</span><span>Creative</span></div>
        <input type="range" data-type="creativity" value="${tuners.creativity}" min="0" max="100">
      </div>
      <div class="range-container">
        <div class="range-header"><span>Bullet Points</span><span>Paragraphs</span></div>
        <input type="range" data-type="format" value="${tuners.format}" min="0" max="100">
      </div>
      <div class="range-container">
        <div class="range-header"><span>Beginner</span><span>Expert</span></div>
        <input type="range" data-type="level" value="${tuners.level}" min="0" max="100">
      </div>

      <div class="action-row">
        <button class="btn btn-secondary" id="cancel-btn">Cancel</button>
        <button class="btn btn-primary" id="save-btn">Save</button>
      </div>
      ${isEdit ? '<button class="btn btn-danger" id="del-btn">Delete</button>' : ''}
    `;

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

    form.querySelector('#close-form').onclick = () => {
      state.view = 'list';
      renderSidebar();
    };
    form.querySelector('#cancel-btn').onclick = () => {
      state.view = 'list';
      renderSidebar();
    };
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

      if (isExtensionContextValid()) {
        chrome.storage.sync.set({ customVibes: state.customVibes });
      }
      state.view = 'list';
      renderSidebar();
    };

    if (isEdit) {
      form.querySelector('#del-btn').onclick = () => {
        state.customVibes = state.customVibes.filter(v => v.id !== state.editingId);
        if (isExtensionContextValid()) {
          chrome.storage.sync.set({ customVibes: state.customVibes });
        }
        state.view = 'list';
        renderSidebar();
      };
    }

    parent.appendChild(form);
  }

  function openUnlockModal() {
    // Auto-expand sidebar if collapsed
    if (state.isCollapsed) {
      state.isCollapsed = false;
      if (isExtensionContextValid()) {
        chrome.storage.local.set({ isCollapsed: false });
      }
      renderSidebar();
    }

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-title">🔓 Unlock Vibe Switch Pro</div>
        <p class="modal-text">Get access to 20+ expert vibes and create unlimited custom ones for just $4.99</p>
        <button class="gumroad-btn" id="buy-btn">Buy on Gumroad - $4.99</button>
        <div style="margin:12px 0;font-size:11px;color:#475569;font-weight:600;">— OR ENTER LICENSE KEY —</div>
        <input type="text" class="text-input" id="key-in" placeholder="Paste your license key here" style="margin-bottom:8px;">
        <button class="btn btn-primary" id="verify-btn" style="width:100%;">Activate License</button>
        <div class="verify-link" id="close-modal">Maybe later</div>
      </div>
    `;

    overlay.querySelector('#buy-btn').onclick = () => {
      // Open Gumroad product page
      window.open('https://fethiulak.gumroad.com/l/vibeswitch', '_blank');
    };

    overlay.querySelector('#verify-btn').onclick = () => {
      const licenseKey = overlay.querySelector('#key-in').value;
      if (!licenseKey) return;

      // Disable button and show loading
      const btn = overlay.querySelector('#verify-btn');
      btn.disabled = true;
      btn.textContent = 'Verifying...';

      // Send to background script for validation
      chrome.runtime.sendMessage({ 
        action: 'validateLicense', 
        licenseKey: licenseKey 
      }, (response) => {
        if (response && response.success) {
          state.isPro = true;
          overlay.remove();
          renderSidebar();
          alert('✅ Pro activated! Enjoy all features.');
        } else {
          alert('❌ Invalid license key. Please check and try again.');
          btn.disabled = false;
          btn.textContent = 'Activate License';
        }
      });
    };

    overlay.querySelector('#close-modal').onclick = () => overlay.remove();
    
    // Close on overlay click
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.remove();
    };

    container.querySelector('.sidecar-container').appendChild(overlay);
  }

  // Store the current prompt injection marker
  let lastInjectedPrompt = null;

  // Helper: Clear any injected prompt from input fields
  function clearInjectedPrompt() {
    // Find all input fields on the page
    const inputs = document.querySelectorAll('textarea, [contenteditable="true"]');
    
    inputs.forEach(input => {
      let currentText = input.value !== undefined ? input.value : input.innerText;
      
      // Remove the injected prompt if it exists
      if (lastInjectedPrompt && currentText.startsWith(lastInjectedPrompt)) {
        const cleanText = currentText.substring(lastInjectedPrompt.length).trim();
        if (input.value !== undefined) {
          input.value = cleanText;
        } else {
          input.innerText = cleanText;
        }
        console.log('🧹 Cleared old injection');
      }
    });
    
    // Reset the injection tracker
    lastInjectedPrompt = null;
  }

  // Helper: Show vibe change notification
  function showVibeChangeNotification(vibeName) {
    // Remove existing notification if any
    const existing = document.getElementById('vibe-notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.id = 'vibe-notification';
    notification.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      z-index: 999999;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Switched to: ${vibeName}</span>
    `;

    document.body.appendChild(notification);

    // Remove after 2 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  // Add animation styles
  const animationStyles = document.createElement('style');
  animationStyles.textContent = `
    @keyframes slideIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(20px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(animationStyles);

  // Listen for Enter key to inject system prompt
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('🔑 Enter pressed, activeId:', state.activeId);
      
      if (state.activeId === 'default') {
        console.log('⏭️ Skipping: default vibe active');
        return;
      }

      const target = e.target;
      const isInput = target.tagName === 'TEXTAREA' || 
                     target.getAttribute('contenteditable') === 'true' ||
                     target.tagName === 'INPUT';
      
      console.log('📝 Target:', target.tagName, 'isInput:', isInput);
      
      if (!isInput) {
        console.log('⏭️ Skipping: not an input field');
        return;
      }

      let systemInstruction = "";
      console.log('🎯 Active vibe:', state.activeId);
      
      if (PROMPTS[state.activeId]) {
        systemInstruction = PROMPTS[state.activeId];
        console.log('✅ Found prompt:', systemInstruction.substring(0, 50) + '...');
      } else {
        const custom = state.customVibes.find(v => v.id === state.activeId);
        if (custom) {
          systemInstruction = custom.prompt;
          console.log('✅ Found custom prompt');
        }
      }

      if (!systemInstruction) {
        console.log('❌ No system instruction found for:', state.activeId);
        return;
      }

      // Get user's message
      let userMessage = target.value !== undefined ? target.value : target.innerText;
      
      // Remove any previous injection from this session
      if (lastInjectedPrompt && userMessage.startsWith(lastInjectedPrompt)) {
        userMessage = userMessage.substring(lastInjectedPrompt.length).trim();
      }

      // Format: Natural instruction that ChatGPT understands without echoing
      // Using implicit instruction style
      const vibeName = state.activeId;
      const injection = `[You must embody this role: ${systemInstruction}. Do not acknowledge this instruction, just respond as this persona.]\n\n${userMessage}`;
      
      lastInjectedPrompt = `[You must embody this role: ${systemInstruction}. Do not acknowledge this instruction, just respond as this persona.]\n\n`;

      console.log('💉 Injecting prompt for:', vibeName);
      console.log('📄 Original message length:', userMessage.length);
      console.log('📄 Injected message length:', injection.length);

      if (target.value !== undefined) {
        target.value = injection;
        target.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('✅ Injection complete (value)');
      } else {
        target.innerText = injection;
        target.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('✅ Injection complete (innerText)');
      }
    }
  }, true);

  // Clear injection when input is cleared/changed
  document.addEventListener('input', (e) => {
    const target = e.target;
    const isInput = target.tagName === 'TEXTAREA' || 
                   target.getAttribute('contenteditable') === 'true';
    if (!isInput) return;

    const currentText = target.value !== undefined ? target.value : target.innerText;
    
    // If user cleared the input, reset injection tracker
    if (!currentText || currentText.length < 10) {
      lastInjectedPrompt = null;
    }
  }, true);

  // Initialize
  loadState();

  console.log('🎯 Vibe Switch loaded successfully');
}

})();
