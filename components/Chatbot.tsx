
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { MODELS } from '../constants';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: 'Bienvenido a Valeria Ferrer\n\nSoy tu asistente personal de confianza. Puedo ayudarte con:\n\n• Información detallada de nuestras modelos\n• Nuestra ubicación en Valencia centro\n• Métodos de contacto directo\n• Tarifas y servicios exclusivos\n• Reservas y consultas personalizadas\n\n¿En qué puedo asistirle hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickButtons, setShowQuickButtons] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate comprehensive models information for the chatbot
  const generateModelsInfo = () => {
    return MODELS.map(model => ({
      name: model.name,
      age: model.age,
      height: model.height,
      weight: model.weight,
      nationality: model.nationality,
      location: model.location,
      description: model.description,
      isVIP: model.name === 'Gaby',
      tariffs: model.name === 'Gaby' ? {
        '1 hora': '180 €',
        '45 minutos': '150 €',
        '30 minutos': '120 €',
        '2 horas': '350 €',
        '3 horas': '520 €',
        'Salida hotel': '250 €',
        'Noche (10 horas)': '2.000 €',
        'Todo el día (24 horas)': '3.000 €',
        'Dos días (48 horas)': '4.000 €'
      } : {
        '1 hora': '150 €',
        '45 minutos': '120 €',
        '30 minutos': '80 €',
        '1,5 horas': '240 €',
        '2 horas': '300 €',
        '3 horas': '430 €',
        'Salida': '200 €',
        'Noche (10 horas)': '1.200 €',
        'Noche (24 horas)': '2.800 €',
        'Dos días (48 horas)': '3.700 €'
      }
    }));
  };

  const getSystemInstruction = () => {
    const modelsInfo = generateModelsInfo();
    const modelsList = modelsInfo.map(model => 
      `${model.name} (${model.age} años, ${model.height}, ${model.weight}, ${model.nationality})${model.isVIP ? ' - VIP' : ''}`
    ).join('\n');
    
    return `Eres el asistente virtual de Valeria Ferrer, una exclusiva agencia de escorts de lujo. 

INFORMACIÓN COMPLETA DE LA AGENCIA:

📍 DIRECCIÓN: Calle Colón, Valencia (centro)
📞 TELÉFONO: 645872227
💬 TELEGRAM: @Valeriaferreeer
🌐 WEB: www.valeriaferrer.com

📋 MODELOS DISPONIBLES:
${modelsList}

🏢 INFORMACIÓN DE SERVICIOS:
• Todas las modelos ofrecen servicios de compañía y discreción absoluta
• Disponibilidad en Valencia centro y salidas a hoteles
• Reservas previas recomendadas
• Máxima confidencialidad y privacidad garantizada

📞 MÉTODOS DE CONTACTO:
1. Teléfono directo: 645872227
2. Telegram: @Valeriaferreeer 
3. WhatsApp: 645872227
4. Email: info@valeriaferrer.com

💳 TARIFAS ESTÁNDAR:
• 1 hora: 150 €
• 45 minutos: 120 €
• 30 minutos: 80 €
• 1,5 horas: 240 €
• 2 horas: 300 €
• 3 horas: 430 €
• Salida: 200 €
• Noche (10h): 1.200 €
• Noche (24h): 2.800 €
• Dos días (48h): 3.700 €

💎 TARIFAS VIP (Gaby):
• 1 hora: 180 €
• 45 minutos: 150 €
• 30 minutos: 120 €
• 2 horas: 350 €
• 3 horas: 520 €
• Salida hotel: 250 €
• Noche (10h): 2.000 €
• Todo el día (24h): 3.000 €
• Dos días (48h): 4.000 €

🎯 DIRECTRICES DE RESPUESTA:
• Mantén siempre un tono extremadamente sofisticado, discreto y profesional
• Proporciona información precisa sobre modelos, tarifas y contacto
• Ofrece ayuda para reservas y consultas
• Enfócate en la exclusividad, lujo y discreción del servicio
• Responde siempre en español
• Sé útil pero mantén la elegancia y misterio de una marca de lujo
• Para información específica de cada modelo, consulta los datos proporcionados`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Función para extraer números del mensaje
    const extractAge = (text: string): number | null => {
      const match = text.match(/\b(\d{1,2})\b/);
      return match ? parseInt(match[1]) : null;
    };
    
    // Función para filtrar modelos por edad
    const filterByAge = (age: number): string => {
      const models = MODELS.filter(model => model.age === age);
      if (models.length === 0) {
        return `No tenemos modelos de ${age} años actualmente. Nuestras edades disponibles son: 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29 años. ¿Le gustaría conocer modelos de otra edad?`;
      }
      
      const modelNames = models.map(model => {
        const vipStatus = model.name.includes('VIP') ? ' (VIP)' : '';
        return `${model.name}${vipStatus} - ${model.age} años`;
      }).join('\n');
      
      return `Sí, tenemos ${models.length} modelo(s) de ${age} años:\n\n${modelNames}\n\nPara más detalles sobre cualquiera de ellas, contacte directamente:\n📞 645872227`;
    };
    
    // Detección de preguntas por edad
    const age = extractAge(message);
    if (age && (message.includes('años') || message.includes('edad') || message.includes('chicas de') || message.includes('tienen'))) {
      return filterByAge(age);
    }
    
    // Respuestas sobre modelos específicos
    if (message.includes('teresa')) {
      return 'Teresa es una de nuestras modelos exclusivas, 20 años, 1.52 m, 45 kg, de nacionalidad española. Ofrece servicios de compañía premium con total discreción. Para más detalles o reservas, contacte directamente con nosotros:\n\n📞 645872227';
    }
    
    if (message.includes('gaby')) {
      return 'Gaby es nuestra modelo VIP, 25 años, 1.65 m, 52 kg, de nacionalidad venezolana. Como modelo VIP, ofrece tarifas especiales y servicios exclusivos. Sus tarifas VIP incluyen 1 hora: 180 €, noche: 2.000 €, y todo el día: 3.000 €.\n\n📞 645872227';
    }
    
    // Respuestas sobre tarifas
    if (message.includes('tarifa') || message.includes('precio') || message.includes('costo') || message.includes('cuánto')) {
      if (message.includes('vip') || message.includes('gaby')) {
        return 'Nuestras tarifas VIP son:\n\n• 1 hora: 180 €\n• 45 minutos: 150 €\n• 30 minutos: 120 €\n• 2 horas: 350 €\n• 3 horas: 520 €\n• Salida hotel: 250 €\n• Noche (10h): 2.000 €\n• Todo el día (24h): 3.000 €\n• Dos días (48h): 4.000 €\n\nPara reservas VIP:\n📞 645872227';
      }
      return 'Nuestras tarifas estándar son:\n\n• 1 hora: 150 €\n• 45 minutos: 120 €\n• 30 minutos: 80 €\n• 1,5 horas: 240 €\n• 2 horas: 300 €\n• 3 horas: 430 €\n• Salida: 200 €\n• Noche (10h): 1.200 €\n• Noche (24h): 2.800 €\n• Dos días (48h): 3.700 €\n\nPara reservas:\n📞 645872227';
    }
    
    // Respuestas sobre ubicación - CON DIRECCIÓN EXACTA
    if (message.includes('dónde') || message.includes('ubicación') || message.includes('dirección') || message.includes('están') || message.includes('calle')) {
      return '📍 Nuestra dirección exacta es: Calle Colón, Valencia centro\n\nEstamos en pleno centro de Valencia, muy bien comunicadas y con discreción absoluta. Todas nuestras modelos operan desde esta ubicación con disponibilidad para salidas a hoteles.\n\nPara obtener el número exacto y confirmar su visita:\n📞 Llame al 645872227\n💬 Telegram: @Valeriaferreeer';
    }
    
    // Respuestas sobre contacto - CON TELÉFONO EXACTO
    if (message.includes('contacto') || message.includes('teléfono') || message.includes('llamar') || message.includes('whatsapp') || message.includes('numero')) {
      return '📞 Nuestro teléfono directo es: 645872227\n\nPuede contactarnos por múltiples vías:\n\n• Teléfono: 645872227\n• WhatsApp: 645872227\n• Telegram: @Valeriaferreeer\n• Email: info@valeriaferrer.com\n\nAtendemos 24/7 con total discreción y confidencialidad. No dude en contactarnos para cualquier consulta o reserva.';
    }
    
    // Respuestas sobre servicios
    if (message.includes('servicio') || message.includes('hacen') || message.includes('ofrecen')) {
      return 'Todas nuestras modelos ofrecen servicios de compañía de alta calidad con máxima discreción y profesionalismo:\n\n• Girlfriend Experience\n• Cenas de Negocios\n• Eventos Sociales\n• Acompañamiento Personal\n• Viajes\n• Tiempo privado\n\nCada modelo tiene sus especialidades particulares. Para conocer servicios específicos:\n📞 645872227';
    }
    
    // Respuestas sobre disponibilidad
    if (message.includes('disponible') || message.includes('disponibilidad') || message.includes('cuándo')) {
      return 'Nuestras modelos tienen disponibilidad variable. Para conocer la disponibilidad actual y realizar reservas, le recomendamos contactarnos directamente:\n\n📞 645872227 - Disponibilidad inmediata\n💬 @Valeriaferreeer - Consultas rápidas\n\nPodemos confirmar disponibilidad en tiempo real.';
    }
    
    // Respuestas sobre reservas
    if (message.includes('reserva') || message.includes('reservar') || message.includes('cita')) {
      return 'Para realizar una reserva, contacte directamente:\n\n📞 Llame al 645872227 para reserva inmediata\n💬 Escriba a @Valeriaferreeer para consultas\n\nProcesamos todas las reservas con:\n• Máxima confidencialidad\n• Discreción absoluta\n• Confirmación inmediata\n• Flexibilidad de horarios';
    }
    
    // Respuestas sobre qué preguntas hacer
    if (message.includes('qué preguntar') || message.includes('qué puedo preguntar') || message.includes('qué puedo saber') || message.includes('qué información')) {
      return 'Puede preguntarme sobre:\n\n👤 **Modelos específicos**: "¿Cuéntame de Teresa", "¿Quién es Gaby?"\n🔢 **Búsqueda por edad**: "¿Tienen chicas de 20 años?", "¿Qué modelos de 25 años?"\n💰 **Tarifas**: "¿Cuánto cuesta una hora?", "¿Tarifas VIP?"\n📍 **Ubicación**: "¿Dónde están ubicados?", "¿Cuál es la dirección?"\n📞 **Contacto**: "¿Cómo contacto?", "¿Número de teléfono?"\n⏰ **Disponibilidad**: "¿Están disponibles ahora?", "¿Cuándo puedo verlas?"\n🛎️ **Reservas**: "¿Cómo reservo?", "¿Necesito cita previa?"\n🎯 **Servicios**: "¿Qué servicios ofrecen?", "¿Qué incluyen?"\n\nEstoy aquí para ayudarle con cualquier información sobre Valeria Ferrer.';
    }
    
    // Respuesta por defecto
    return 'Gracias por su consulta. Soy el asistente virtual de Valeria Ferrer.\n\nPuedo ayudarle con:\n• Información de modelos específicos\n• Búsqueda por edad (ej: "¿chicas de 20 años?")\n• Tarifas estándar y VIP\n• Nuestra ubicación en Valencia\n• Contacto directo\n• Disponibilidad y reservas\n\n¿En qué puedo asistirle hoy?\n\n📞 Teléfono directo: 645872227\n💬 Telegram: @Valeriaferreeer';
  };

  // Funciones para botones de acceso directo
  const handleQuickButton = (buttonText: string) => {
    let response = '';
    
    switch(buttonText) {
      case 'Escorts disponibles':
        response = 'Actualmente tenemos 18 modelos disponibles:\n\n• Teresa - 20 años (Española)\n• Gaby - 25 años (Venezolana, VIP)\n• Elena - 24 años (Española)\n• Lana - 22 años (Española)\n• Mia - 20 años (Colombiana)\n• Estefany - 24 años (Colombiana)\n• Carla - 26 años (Española)\n• Maria - 29 años (Española)\n• Carlota - 23 años (Venezolana)\n• Claudia - 21 años (Española, VIP)\n• Silvia - 19 años (Venezolana)\n• Yaiza - 22 años (Española)\n• Andrea - 28 años (Uruguaya)\n• Naty - 23 años (Colombiana)\n• Erika - 22 años (Española)\n• Alicia - 18 años (Colombiana)\n• Paula - 26 años (Española, VIP)\n• Luna - 26 años (Colombiana)\n• Tania - 25 años (Colombiana)\n• Alba - 23 años (Española, VIP)\n\nPara más detalles sobre cualquier modelo:\n📞 645872227';
        break;
        
      case 'Horario/Cómo llegar':
        response = '📍 **Horario**: 24 horas disponibles\n\n**Ubicación**: Calle Colón, Valencia centro\n\nEstamos en pleno centro de Valencia, muy bien comunicadas y con discreción absoluta. Operamos 24/7 para su comodidad.\n\nPara obtener el número exacto y confirmar su visita:\n📞 Llame al 645872227\n💬 Telegram: @Valeriaferreeer\n\nAtendemos cualquier hora del día con total confidencialidad.';
        break;
        
      case 'Tarifas':
        response = '💰 **Tarifas Estándar**:\n\n• 30 minutos: 80 €\n• 45 minutos: 120 €\n• 1 hora: 150 €\n• 1,5 horas: 240 €\n• 2 horas: 300 €\n• 3 horas: 430 €\n• Salida: 200 €\n• Noche (10h): 1.200 €\n• Noche (24h): 2.800 €\n• Dos días (48h): 3.700 €\n\n💎 **Tarifas VIP** (Gaby, Claudia, Paula, Alba):\n\n• 30 minutos: 120 €\n• 45 minutos: 150 €\n• 1 hora: 180 €\n• 2 horas: 350 €\n• 3 horas: 520 €\n• Salida hotel: 250 €\n• Noche (10h): 2.000 €\n• Todo el día (24h): 3.000 €\n• Dos días (48h): 4.000 €\n\nPara reservas:\n📞 645872227';
        break;
        
      case 'A hotel o domicilio':
        response = '🏨 **Servicio a Hotel**:\n\nOfrecemos servicio de acompañamiento a hoteles en Valencia centro y alrededores. Todas nuestras modelos pueden desplazarse a su hotel con total discreción y profesionalismo.\n\n**Tarifas de salida**:\n• Estándar: 200 €\n• VIP: 250 €\n\n🏠 **Servicio a Domicilio**:\n\nDisponible para clientes VIP y habituales. Requiere verificación previa y reserva con antelación.\n\nPara coordinar servicio a hotel o domicilio:\n📞 Llame al 645872227\n💬 Telegram: @Valeriaferreeer\n\nTrabajamos con máxima discreción y confidencialidad.';
        break;
        
      case 'Reservo en Felina':
        response = '📞 **Para reservar directamente**:\n\n1. **Llame ahora**: 645872227\n   - Reserva inmediata\n   - Confirmación al instante\n   - Disponibilidad en tiempo real\n\n2. **Telegram**: @Valeriaferreeer\n   - Consultas rápidas\n   - Fotos adicionales\n   - Detalles de servicios\n\n3. **WhatsApp**: 645872227\n   - Reservas vía mensaje\n   - Confirmación visual\n   - Comodidad total\n\n🔒 **Proceso de reserva**:\n• Seleccione su modelo preferida\n• Confirme fecha y hora\n• Verificación discreta\n• Confirmación final\n\nTodas las reservas se procesan con máxima confidencialidad.\n\n¿Listo para reservar? Llame ahora: 📞 645872227';
        break;
        
      case 'Otras preguntas':
        response = '¿Qué necesita saber? Puedo ayudarle con:\n\n👤 **Información de modelos**: Edad, nacionalidad, características\n🔢 **Búsqueda por edad**: "¿Chicas de 20 años?"\n💰 **Tarifas específicas**: VIP, estándar, servicios especiales\n📍 **Ubicación exacta**: Dirección y cómo llegar\n⏰ **Disponibilidad**: Quién está disponible ahora\n🎯 **Servicios**: Girlfriend Experience, cenas, eventos\n🛎️ **Reservas**: Cómo reservar, métodos de pago\n📞 **Contacto**: Todas las formas de comunicarse\n\nEscriba su pregunta específica o use los botones de acceso rápido.\n\nO contacte directamente:\n📞 645872227\n💬 @Valeriaferreeer';
        break;
        
      case 'Contacto':
        response = '📞 **Contacto Directo Valeria Ferrer**:\n\n**Teléfono**: 645872227\n• Atención 24/7\n• Reservas inmediatas\n• Consultas rápidas\n\n**WhatsApp**: 645872227\n• Reservas vía mensaje\n• Confirmación visual\n• Comodidad total\n\n**Telegram**: @Valeriaferreeer\n• Chat privado\n• Fotos adicionales\n• Detalles completos\n\n**Email**: info@valeriaferrer.com\n• Consultas formales\n• Información detallada\n• Reservas programadas\n\n📍 **Ubicación**: Calle Colón, Valencia centro\n\nAtendemos todas las consultas con total discreción y confidencialidad absoluta.\n\nNo dude en contactarnos, estamos aquí para ayudarle.';
        break;
        
      default:
        response = 'Gracias por su interés. Para más información, contacte directamente:\n📞 645872227';
    }
    
    setMessages(prev => [...prev, { role: 'bot', content: response }]);
    setShowQuickButtons(false); // Ocultar botones después de seleccionar uno
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setShowQuickButtons(false); // Ocultar botones cuando el usuario escribe

    // Simular tiempo de respuesta para experiencia natural
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage);
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000); // 1-2 segundos de respuesta
  };

  return (
    <div className="fixed bottom-6 right-6458722270">
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#c2b2a3] text-black flex items-center justify-center shadow-2xl hover:bg-white transition-colors duration-300"
        id="chatbot-toggle"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
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
            <div className="p-4 bg-[#1a1a1a] border-b border-white/5">
              {/* Contact Badge */}
              <div className="flex items-center justify-center mb-4">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center space-x-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                      <img 
                        src="/BOT.jpg" 
                        alt="Valeria"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#1a1a1a] animate-pulse"></div>
                  </div>
                  <span className="text-white font-medium">Valeria</span>
                </motion.div>
              </div>
              
              {/* Close Button */}
              <div className="flex justify-end">
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-[#c2b2a3] text-black'
                        : 'bg-[#1a1a1a] text-gray-300 border border-white/5'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] text-gray-500 p-3 rounded-2xl rounded-tl-none border border-white/5">
                    <span className="text-[10px] uppercase tracking-widest">Escribiendo...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Buttons */}
            {showQuickButtons && (
              <div className="px-4 py-3 bg-[#1a1a1a] border-t border-white/5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickButton('Escorts disponibles')}
                    className="px-3 py-2 bg-[#c2b2a3]/20 hover:bg-[#c2b2a3]/30 text-[#c2b2a3] rounded-lg text-xs font-medium transition-colors border border-[#c2b2a3]/30"
                  >
                    Escorts disponibles
                  </button>
                  <button
                    onClick={() => handleQuickButton('Horario/Cómo llegar')}
                    className="px-3 py-2 bg-[#c2b2a3]/20 hover:bg-[#c2b2a3]/30 text-[#c2b2a3] rounded-lg text-xs font-medium transition-colors border border-[#c2b2a3]/30"
                  >
                    Horario/Cómo llegar
                  </button>
                  <button
                    onClick={() => handleQuickButton('Tarifas')}
                    className="px-3 py-2 bg-[#c2b2a3]/20 hover:bg-[#c2b2a3]/30 text-[#c2b2a3] rounded-lg text-xs font-medium transition-colors border border-[#c2b2a3]/30"
                  >
                    Tarifas
                  </button>
                  <button
                    onClick={() => handleQuickButton('A hotel o domicilio')}
                    className="px-3 py-2 bg-[#c2b2a3]/20 hover:bg-[#c2b2a3]/30 text-[#c2b2a3] rounded-lg text-xs font-medium transition-colors border border-[#c2b2a3]/30"
                  >
                    A hotel o domicilio
                  </button>
                  <button
                    onClick={() => handleQuickButton('Reservo en Felina')}
                    className="px-3 py-2 bg-[#c2b2a3]/20 hover:bg-[#c2b2a3]/30 text-[#c2b2a3] rounded-lg text-xs font-medium transition-colors border border-[#c2b2a3]/30"
                  >
                    Reservo en Felina
                  </button>
                  <button
                    onClick={() => handleQuickButton('Otras preguntas')}
                    className="px-3 py-2 bg-[#c2b2a3]/20 hover:bg-[#c2b2a3]/30 text-[#c2b2a3] rounded-lg text-xs font-medium transition-colors border border-[#c2b2a3]/30"
                  >
                    Otras preguntas
                  </button>
                </div>
                <button
                  onClick={() => handleQuickButton('Contacto')}
                  className="w-full mt-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-xs font-medium transition-colors border border-emerald-600/30"
                >
                  📞 Contacto Directo
                </button>
              </div>
            )}

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
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-[#c2b2a3] text-black text-xs font-semibold hover:bg-white disabled:opacity-50 disabled:hover:bg-[#c2b2a3] transition-all"
                >
                  Enviar
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
