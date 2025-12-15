export interface Personality {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  icon: string;
}

export enum ViewMode {
  DEMO = 'DEMO',
  SOURCE = 'SOURCE'
}

export interface ExtensionFile {
  name: string;
  path: string;
  language: string;
  content: string;
}
