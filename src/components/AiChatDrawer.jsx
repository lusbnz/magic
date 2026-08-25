import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react';
import { askTuViChatbot } from '../services/aiService';

export default function AiChatDrawer({ chartData, apiKey }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Xin chào ${chartData.info.name}! Tôi là Trợ Lý Tử Vi. Lá số của bạn bản mệnh ${chartData.info.nguHanh}, Cung Mệnh tọa tại ${chartData.info.cungMenhChi}. Bạn có câu hỏi nào về công danh, tài chính, hôn nhân hay vận hạn không?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const quickQuestions = [
    "Năm 2026 này tôi cần lưu ý điều gì?",
    "Ngành nghề nào phù hợp với cung Quan Lộc?",
    "Cung Tài Bạch của tôi tụ tài hay tán tài?",
    "Đặc điểm người bạn đời tương lai?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const question = textToSend || input;
    if (!question.trim() || loading) return;

    const userMsg = { sender: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await askTuViChatbot(chartData, messages, question, apiKey);
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'Xin lỗi, không thể kết nối tới mô hình AI lúc này. Vui lòng thử lại sau.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="do-card p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-semibold">
            <Bot className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Hỏi Đáp Trực Tuyến Với AI
            </h3>
            <p className="text-xs text-slate-400">
              Tư vấn ngữ cảnh dựa trên dữ liệu lá số của bạn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          AI Sẵn sàng
        </div>
      </div>

      {/* Gợi ý câu hỏi nhanh */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="text-xs px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Cửa sổ tin nhắn */}
      <div className="h-64 overflow-y-auto space-y-3 p-3.5 rounded-lg bg-[#0c1220] border border-slate-800 mb-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3 text-blue-400" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-lg px-3.5 py-2 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white font-normal'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/60'
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-md bg-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-center text-xs text-slate-400 italic p-1.5">
            <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            AI đang phân tích câu hỏi...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Form gửi */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          className="do-input flex-1 text-xs sm:text-sm"
          placeholder="Nhập câu hỏi của bạn cho AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="do-btn-primary px-4 py-2 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
