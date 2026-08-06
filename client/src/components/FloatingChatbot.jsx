import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, RefreshCw, ChevronDown, Minimize2 } from 'lucide-react';
import { aiService } from '../services/authService';
import { aiService as aiApiService } from '../services/aiService';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: 'Hello! I am EcoMind Gemini AI Copilot. Ask me anything about your carbon footprint, SEBI BRSR rules, energy efficiency, or government subsidies!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    '⚡ How can I reduce electricity carbon footprint?',
    '📜 Explain SEBI BRSR Core compliance',
    '💧 What rainwater harvesting methods work best?',
    '🏛️ What government subsidies exist for rooftop solar?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      id: `msg_usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const data = await aiApiService.chatWithAI(query);
      const aiReply = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'I have analyzed your request. Check your EcoMind Dashboard and Intelligence Hub for further recommendations.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Chatbot request error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'ai',
          text: `⚡ **Energy Reduction Advice for "${query}":**\n• Upgrade lighting to high-efficiency LEDs (40-60% energy savings).\n• Install rooftop solar PV arrays with net metering.\n• Optimize HVAC with inverter chillers and programmable thermostats.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render formatted text with bold and line breaks
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={lIdx} className={lIdx > 0 ? 'mt-1' : ''}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-white">{part.slice(2, -2)}</strong>;
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative p-4 rounded-full bg-gradient-to-r from-eco-600 via-emerald-500 to-teal-500 text-white shadow-glow-eco hover:scale-110 transition-all duration-300 flex items-center justify-center"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
          
          {/* Hover Tooltip */}
          <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-slate-800 shadow-xl pointer-events-none">
            Ask EcoMind Gemini AI Copilot 💬
          </span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[440px] h-[540px] max-h-[85vh] glass-panel rounded-3xl border border-slate-700 bg-slate-900/95 shadow-2xl flex flex-col overflow-hidden animate-fade-in backdrop-blur-xl">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-eco-500/20 text-eco-400 border border-eco-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
                  EcoMind AI Assistant
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                    Gemini 1.5
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Ask about ESG, SEBI BRSR, & Carbon Footprints</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-eco-500/20 text-eco-400 border border-eco-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-eco-600 to-emerald-600 text-white font-medium rounded-tr-none shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {renderFormattedText(msg.text)}
                  </div>
                  <span className="text-[10px] text-slate-500 block px-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold p-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Gemini AI is generating dynamic advice...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          {messages.length < 4 && (
            <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto scrollbar-none flex items-center gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold whitespace-nowrap border border-slate-700 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask EcoMind AI any query..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-xs"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white disabled:opacity-40 transition-all shadow-glow-eco"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
