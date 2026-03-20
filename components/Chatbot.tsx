
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: 'Hola, soy el asistente virtual de Valeria Ferrer. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `Basándote en la información de https://www.valeriaferrer.com, responde a la siguiente pregunta del usuario: ${userMessage}` }]
          }
        ],
        config: {
          systemInstruction: "Eres el asistente virtual de Valeria Ferrer, una exclusiva agencia de escorts de lujo. Tu objetivo es ayudar a los clientes con información sobre los servicios, modelos, reservas y casting basándote únicamente en la información del sitio web oficial www.valeriaferrer.com. La dirección de la agencia es Calle Colón, Valencia (sin número por motivos de privacidad y seguridad). Informa a los usuarios que el número exacto se proporcionará exclusivamente una vez que se pongan en contacto por Telegram (@Valeriaferreeer) o por teléfono (645872227). Mantén siempre un tono extremadamente sofisticado, discreto, profesional y lujoso. Responde en español.",
          tools: [{ urlContext: {} }]
        },
      });

      const botResponse = response.text || "Lo siento, no he podido procesar tu solicitud en este momento. Por favor, inténtalo de nuevo más tarde.";
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    } catch (error) {
      console.error('Error calling Gemini:', error);
      setMessages(prev => [...prev, { role: 'bot', content: "Lo siento, ha ocurrido un error al conectar con mi sistema. Por favor, contacta directamente con nosotros vía WhatsApp o email." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#c2b2a3] text-black flex items-center justify-center shadow-2xl hover:bg-white transition-colors duration-300"
        id="chatbot-toggle"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-[#111111] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            id="chatbot-window"
          >
            {/* Header */}
            <div className="p-4 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#c2b2a3]/20 flex items-center justify-center">
                  <Bot size={18} className="text-[#c2b2a3]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-widest uppercase text-white">Asistente Valeria</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">En línea</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed tracking-wide ${
                      msg.role === 'user'
                        ? 'bg-[#c2b2a3] text-black rounded-tr-none'
                        : 'bg-[#1a1a1a] text-gray-300 border border-white/5 rounded-tl-none'
                    }`}
                  >
                    <div className="markdown-body">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] text-gray-500 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center space-x-2">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-[10px] uppercase tracking-widest">Valeria está escribiendo...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#1a1a1a] border-t border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu mensaje..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-full py-3 pl-4 pr-12 text-xs focus:outline-none focus:border-[#c2b2a3] transition-colors text-white placeholder:text-gray-600"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#c2b2a3] text-black flex items-center justify-center hover:bg-white disabled:opacity-50 disabled:hover:bg-[#c2b2a3] transition-all"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="text-[8px] text-center text-gray-600 mt-3 uppercase tracking-widest">
                Asistente Virtual • Discreción Absoluta
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
