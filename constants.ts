import { Personality } from './types';

export const PERSONALITIES: Personality[] = [
  {
    id: 'default',
    name: 'Normal',
    description: 'No modification to your prompt.',
    systemPrompt: '',
    icon: '👤'
  },
  {
    id: 'sarcastic',
    name: 'Sarcastic',
    description: 'Adds a layer of wit and sarcasm.',
    systemPrompt: 'Rewrite the following prompt to be sarcastic, witty, and slightly cynical, but keep the core meaning.',
    icon: '😏'
  },
  {
    id: 'python_expert',
    name: 'Python Expert',
    description: 'Optimizes for Python coding standards.',
    systemPrompt: 'Rewrite the following prompt to specifically ask for high-quality, PEP-8 compliant Python code solutions. Add technical context where appropriate.',
    icon: '🐍'
  },
  {
    id: 'eli5',
    name: 'ELI5',
    description: 'Explain Like I\'m 5.',
    systemPrompt: 'Rewrite the following prompt to ask for an extremely simple, easy-to-understand explanation suitable for a child.',
    icon: '👶'
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Formal and research-oriented.',
    systemPrompt: 'Rewrite the following prompt to use formal academic language, asking for citations and rigorous analysis.',
    icon: '🎓'
  }
];
