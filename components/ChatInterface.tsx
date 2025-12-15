import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Loader2 } from 'lucide-react';
import { Personality } from '../types';
import { rewritePrompt } from '../services/geminiService';

interface ChatInterfaceProps {
  personality: Personality;
  setIsProcessing: (loading: boolean) => void;
  isProcessing: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  originalContent?: string;
  personalityUsed?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ personality, setIsProcessing, isProcessing }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am a simulated AI assistant. Try typing a prompt with a selected personality from the sidebar.' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const originalInput = input;
    setIsProcessing(true);
    setInput(''); // Clear input immediately for UX

    try {
      // 1. Rewrite prompt if personality is not default
      let finalPrompt = originalInput;
      if (personality.id !== 'default') {
        finalPrompt = await rewritePrompt(originalInput, personality);
      }

      // 2. Add user message to chat
      const newUserMsg: Message = {
        role: 'user',
        content: finalPrompt,
        originalContent: personality.id !== 'default' ? originalInput : undefined,
        personalityUsed: personality.id !== 'default' ? personality.name : undefined
      };
      
      setMessages(prev => [...prev, newUserMsg]);

      // 3. Simulate AI response delay
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `(Simulated Response) That's a great prompt! Here is how I would respond to: "${finalPrompt}"... \n\n[Actual AI response logic would go here]`
        }]);
        setIsProcessing(false);
      }, 1000);

    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setInput(originalInput); // Restore on error
      alert("Failed to process prompt using Gemini API.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full relative">
      {/* Fake Header */}
      <div className="h-14 border-b flex items-center px-6 justify-between bg-white z-10">
        <span className="font-semibold text-gray-700 flex items-center gap-2">
          ChatGPT <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">Simulation</span>
        </span>
        <div className="text-sm text-gray-400">Model: GPT-4o (Fake)</div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
            )}
            
            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
               {msg.originalContent && (
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <span className="italic">Original: "{msg.originalContent}"</span>
                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                    {msg.personalityUsed}
                  </span>
                </div>
              )}
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-gray-100 text-gray-800 rounded-tr-sm' 
                  : 'text-gray-800'
              }`}>
                {msg.content}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                <User size={16} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isProcessing && (
           <div className="flex gap-4 max-w-3xl mx-auto">
             <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0 animate-pulse">
                <Bot size={16} className="text-white" />
              </div>
              <div className="flex items-center text-gray-400 text-sm">Thinking...</div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="max-w-3xl mx-auto relative">
          {personality.id !== 'default' && (
             <div className="absolute -top-10 left-0 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-t-lg flex items-center gap-2 shadow-sm">
                <Sparkles size={12} />
                <span>Sidecar Active: <strong>{personality.name}</strong></span>
             </div>
          )}
          <div className={`relative flex items-center border rounded-xl shadow-sm bg-white overflow-hidden transition-colors ${
            personality.id !== 'default' ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-300'
          }`}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ChatGPT... ${personality.id !== 'default' ? `(will be rewritten as ${personality.name})` : ''}`}
              className="w-full py-3 pl-4 pr-12 resize-none max-h-32 focus:outline-none text-sm"
              rows={1}
              style={{ minHeight: '44px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className={`absolute right-2 p-1.5 rounded-lg transition-all ${
                input.trim() && !isProcessing
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
          <div className="text-center text-xs text-gray-400 mt-2">
            Sidecar AI can make mistakes. Check generated prompts.
          </div>
        </div>
      </div>
    </div>
  );
};
