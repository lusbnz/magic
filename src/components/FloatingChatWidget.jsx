import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Minus } from 'lucide-react';
import { askTuViChatbot } from '../services/aiService';

export default function FloatingChatWidget({ chartData, apiKey }) {
  const [isOpen, setIsOpen] = useState(false);
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
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

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
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Cửa sổ Chat Widget khi mở */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] max-h-[80vh] rounded-2xl bg-[#ffffff] border-2 border-[#ded6c7] shadow-2xl flex flex-col mb-3.5 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header của Chat Widget */}
          <div className="p-3.5 bg-[#faf7f0] border-b border-[#eee8dc] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#fef7ee] border border-[#fbd38d] text-[#c48b4d] flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#241e17] flex items-center gap-1.5">
                  Thầy Tử Vi
                  <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block"></span>
                </h4>
                <p className="text-[11px] text-[#786d5e]">
                  Tư vấn trực tiếp theo lá số
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#ede7da] text-[#786d5e] hover:text-[#241e17] transition-colors"
                title="Thu nhỏ"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#fee2e2] text-[#786d5e] hover:text-[#b91c1c] transition-colors"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gợi ý câu hỏi nhanh */}
          <div className="p-2.5 bg-[#ffffff] border-b border-[#f3eee4] overflow-x-auto no-scrollbar">
            <div className="flex gap-1.5 whitespace-nowrap">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#f5f1e8] hover:bg-[#eae3d4] text-[#4d4234] border border-[#ded6c7] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Danh sách tin nhắn */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#faf7f0]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-[#fef7ee] border border-[#fbd38d] text-[#c48b4d] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs sm:text-[13px] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#241e17] text-[#ffffff] font-medium shadow-xs'
                      : 'bg-[#ffffff] text-[#241e17] border border-[#ded6c7] shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-[#ded6c7] text-[#4d4234] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-xs text-[#c48b4d] italic p-1">
                <div className="w-3.5 h-3.5 border-2 border-[#c48b4d] border-t-transparent rounded-full animate-spin" />
                AI đang chiêm nghiệm lá số...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form nhập tin nhắn */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-[#ffffff] border-t border-[#eee8dc] flex gap-2"
          >
            <input
              type="text"
              className="warm-input flex-1 text-xs py-2"
              placeholder="Nhập câu hỏi cho Thầy Tử Vi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="warm-btn-accent px-3 py-2 text-xs font-bold disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Nút tròn nổi (Floating Button) để mở chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#241e17] hover:bg-[#382f25] text-white shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-[#c48b4d] relative cursor-pointer group"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#facc15]" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 text-[#facc15]" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10b981] border-2 border-white"></span>
          </>
        )}
      </button>
    </div>
  );
}
