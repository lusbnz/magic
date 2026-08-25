import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { askTuViChatbot } from '../services/aiService';

export default function RightChatPanel({ chartData, apiKey }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Chào bạn ${chartData.info.name}! Tôi là Thầy Tử Vi. Lá số của bạn bản mệnh ${chartData.info.nguHanh}, Cung Mệnh tọa tại ${chartData.info.cungMenhChi}. Bạn muốn tìm hiểu kỹ hơn về khía cạnh nào?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const quickQuestions = [
    "Năm 2026 cần lưu ý gì?",
    "Ngành nghề hợp mệnh?",
    "Cung Tài Bạch giữ tiền tốt không?",
    "Tình duyên & hôn nhân?"
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
        { sender: 'ai', text: 'Xin lỗi, lúc này kết nối AI đang gián đoạn, xin vui lòng thử lại.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="warm-card p-5 flex flex-col h-full sticky top-20 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#eee8dc] pb-3.5 mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#fef7ee] border border-[#fbd38d] text-[#c48b4d] flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#241e17]">
              Hỏi Đáp Trợ Lý AI
            </h3>
            <p className="text-xs text-[#6e6456]">
              Tư vấn trực tiếp theo lá số
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          Trực tuyến
        </div>
      </div>

      {/* Gợi ý câu hỏi nhanh */}
      <div className="mb-3.5">
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#f5f1e8] hover:bg-[#eae3d4] text-[#4d4234] hover:text-[#241e17] border border-[#ded6c7] transition-all text-left font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Cửa sổ tin nhắn */}
      <div className="flex-1 min-h-[380px] max-h-[520px] overflow-y-auto space-y-3.5 p-4 rounded-2xl bg-[#faf7f0] border border-[#ded6c7] mb-3.5">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-[#fef7ee] border border-[#fbd38d] text-[#c48b4d] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13.5px] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#241e17] text-[#ffffff] font-medium shadow-sm'
                  : 'bg-[#ffffff] text-[#241e17] border border-[#ded6c7] shadow-xs'
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-[#ded6c7] text-[#4d4234] flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-center text-xs text-[#c48b4d] italic p-1.5 font-medium">
            <div className="w-4 h-4 border-2 border-[#c48b4d] border-t-transparent rounded-full animate-spin" />
            AI đang chiêm nghiệm lá số...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Form chat */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 pt-1"
      >
        <input
          type="text"
          className="warm-input flex-1 text-xs sm:text-sm py-2.5"
          placeholder="Nhập câu hỏi cho Thầy AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="warm-btn-accent px-4 py-2.5 text-xs sm:text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
