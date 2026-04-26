'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { callGeminiChat } from '@/services/api';
import { useApp } from '@/context/AppContext';
import styles from './ChatUI.module.css';

const SYSTEM_PROMPT = `You are ElectIQ, a helpful, friendly, and knowledgeable election assistant. 
You help citizens understand the voting process, registration steps, eligibility, and election timelines. 
You are empathetic, use simple language, and provide actionable step-by-step guidance. 
When users ask about voting, always ask clarifying questions (age, country, state) to personalize your response. 
Keep answers concise (under 200 words), use bullet points and bold text for clarity. 
Always end with a helpful follow-up question or suggestion. 
Never give legal advice. If unsure, direct to official election commission resources.`;

const SUGGESTIONS = [
  "How do I register to vote? 📋",
  "Am I eligible to vote? ✅",
  "Where is my polling station? 📍",
  "What ID do I need to vote? 🪪",
  "What are the voting deadlines? 📅",
  "How does the EVM work? 🖥️",
];

function TypingIndicator() {
  return (
    <div className={styles.typingBubble}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
}

function MessageBubble({ message, isNew }) {
  const isUser = message.role === 'user';

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <motion.div
      className={`${styles.messageRow} ${isUser ? styles.userRow : styles.botRow}`}
      initial={isNew ? { opacity: 0, y: 16, scale: 0.96 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {!isUser && (
        <div className={styles.avatar}>
          <span>⚡</span>
        </div>
      )}
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.botBubble}`}>
        <div
          className={styles.messageText}
          dangerouslySetInnerHTML={{ __html: formatText(message.content) }}
        />
        <span className={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}

export default function ChatUI({ onTabSwitch }) {
  const { incrementChat, profile, simpleLanguage } = useApp();
  const [messages, setMessages] = useState([
    {
      id: '0',
      role: 'assistant',
      content: `👋 **Welcome to ElectIQ!**\n\nI'm your personal election guide. I can help you with:\n- Voter registration step-by-step\n- Checking if you're eligible\n- Finding polling stations\n- Understanding voting methods\n- Election timelines and deadlines\n\n**What would you like to know today?** You can ask me anything about voting! 🗳️`,
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice Input
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser. Please use Chrome.');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = profile.language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // Text to Speech
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    const clean = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = profile.language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || isLoading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Check for special intents
    if (content.toLowerCase().includes('map') || content.toLowerCase().includes('polling station')) {
      setTimeout(() => onTabSwitch?.('map'), 1500);
    }
    if (content.toLowerCase().includes('step') || content.toLowerCase().includes('guide')) {
      setTimeout(() => onTabSwitch?.('steps'), 1500);
    }

    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
    
    try {
      const response = await callGeminiChat(history, SYSTEM_PROMPT);
      const assistantMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: Date.now() };
      setMessages(prev => [...prev, assistantMsg]);
      incrementChat();
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Sorry, I had trouble responding. Please try again in a moment.',
        timestamp: Date.now(),
      }]);
    }
    setIsLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.botAvatarLarge}>⚡</div>
          <div>
            <h3 className={styles.botName}>ElectIQ Assistant</h3>
            <div className={styles.statusRow}>
              <div className="pulse-dot" style={{ width: 8, height: 8 }} />
              <span className={styles.statusText}>Online — Powered by Gemini AI</span>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={isSpeaking ? stopSpeaking : () => {
              const last = messages.filter(m => m.role === 'assistant').slice(-1)[0];
              if (last) speakText(last.content);
            }}
            title={isSpeaking ? 'Stop speaking' : 'Read last message aloud'}
            aria-label={isSpeaking ? 'Stop speaking' : 'Read aloud'}
          >
            {isSpeaking ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={`${styles.messagesArea} scroll-area`} role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id} message={msg} isNew={i === messages.length - 1 && i > 0} />
        ))}
        {isLoading && (
          <div className={styles.botRow} style={{ display: 'flex', gap: 10, padding: '0 16px 12px' }}>
            <div className={styles.avatar}><span>⚡</span></div>
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <AnimatePresence>
        {messages.length <= 2 && (
          <motion.div
            className={styles.suggestions}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className={styles.chip}
                onClick={() => sendMessage(s)}
                aria-label={`Ask: ${s}`}
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <div className={styles.inputRow}>
          <textarea
            ref={inputRef}
            className={`${styles.chatInput} input`}
            placeholder="Ask anything about voting, registration, eligibility..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            aria-label="Chat message input"
            disabled={isLoading}
          />
          <button
            className={`btn btn-icon ${styles.voiceBtn} ${isListening ? styles.listening : ''}`}
            onClick={isListening ? stopListening : startListening}
            title={isListening ? 'Stop listening' : 'Voice input'}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            {isListening ? '⏹️' : '🎤'}
          </button>
          <button
            className={`btn btn-primary btn-icon ${styles.sendBtn}`}
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            {isLoading ? (
              <span className={styles.spinner} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
        <p className={styles.hint}>Press Enter to send · Shift+Enter for new line · 🎤 for voice</p>
      </div>
    </div>
  );
}
