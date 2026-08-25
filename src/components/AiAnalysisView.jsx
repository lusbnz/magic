import React from 'react';
import { 
  Sparkles, 
  Compass, 
  Briefcase, 
  Coins, 
  Heart, 
  ShieldAlert, 
  BookOpen
} from 'lucide-react';

export default function AiAnalysisView({ analysisText, selectedCung }) {
  if (!analysisText) return null;

  // Phân loại icon và nhãn tương ứng cho 5 mục luận giải
  const getSectionMeta = (idx) => {
    const metas = [
      {
        id: 'menh',
        label: 'Tổng Quan',
        icon: Compass,
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badge: 'Cốt Cách & Bản Mệnh'
      },
      {
        id: 'quan',
        label: 'Sự Nghiệp',
        icon: Briefcase,
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        badge: 'Công Danh & Địa Vị'
      },
      {
        id: 'tai',
        label: 'Tài Lộc',
        icon: Coins,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        badge: 'Tiền Tài & Điền Sản'
      },
      {
        id: 'the',
        label: 'Tình Duyên',
        icon: Heart,
        color: 'text-rose-700 bg-rose-50 border-rose-200',
        badge: 'Gia Đạo & Duyên Nợ'
      },
      {
        id: 'han',
        label: 'Vận Hạn',
        icon: ShieldAlert,
        color: 'text-purple-700 bg-purple-50 border-purple-200',
        badge: 'Lời Khuyên Hóa Giải'
      }
    ];
    return metas[idx] || {
      id: `sec-${idx}`,
      label: 'Luận Giải',
      icon: BookOpen,
      color: 'text-slate-700 bg-slate-50 border-slate-200',
      badge: 'Chi Tiết'
    };
  };

  const sections = analysisText.split('###').filter(Boolean).map((sec, idx) => {
    const lines = sec.trim().split('\n');
    const title = lines[0].replace(/^[\d.\s🌟💼💰❤️🔮]+/, '').trim();
    const rawTitle = lines[0].trim();
    const content = lines.slice(1).join('\n');
    const meta = getSectionMeta(idx);
    return { idx, rawTitle, title, content, meta };
  });

  return (
    <div className="warm-card p-4 sm:p-5 flex flex-col h-full sticky top-20 shadow-sm">
      {/* Header Sidebar */}
      <div className="flex items-center justify-between border-b border-[#eee8dc] pb-3 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#fef7ee] border border-[#fbd38d] flex items-center justify-center text-[#c48b4d] shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#241e17] tracking-tight">
              Luận Giải Chi Tiết
            </h3>
            <p className="text-[11px] text-[#786d5e]">
              Phân tích vận trình & lời khuyên
            </p>
          </div>
        </div>

        {selectedCung && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#f5f1e8] text-[#c48b4d] border border-[#ded6c7]">
            Cung {selectedCung.cungTen}
          </span>
        )}
      </div>

      {/* Toàn bộ danh sách Luận Giải liền mạch dạng cuộn độc lập */}
      <div className="space-y-3.5 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
        {sections.map((sec) => {
          const Icon = sec.meta.icon;

          return (
            <div
              key={sec.idx}
              className="p-4 rounded-xl bg-[#faf7f0] border border-[#e8e2d5] shadow-2xs hover:border-[#c48b4d]/60 transition-all"
            >
              {/* Tiêu đề mục gọn gàng 1 dòng */}
              <div className="flex items-center gap-2 border-b border-[#eee7d8] pb-2 mb-2.5">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border ${sec.meta.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-[13.5px] sm:text-[14px] font-black text-[#241e17] tracking-tight flex-1">
                  {sec.meta.label}: <span className="font-bold text-[#5e5343]">{sec.meta.badge}</span>
                </h4>
              </div>

              {/* Nội dung diễn giải */}
              <div className="space-y-2 text-[#332b22] text-[13px] leading-relaxed">
                {sec.content.split('\n').filter(Boolean).map((paragraph, pIdx) => {
                  const isBullet = paragraph.trim().startsWith('-');
                  const cleanText = isBullet ? paragraph.trim().substring(1).trim() : paragraph.trim();
                  const parts = cleanText.split(/(\*\*.*?\*\*)/g);

                  return (
                    <div key={pIdx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c48b4d] mt-1.5 flex-shrink-0" />
                      <p className="flex-1 leading-relaxed">
                        {parts.map((part, partIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={partIdx} className="font-extrabold text-[#1a1510] text-[#c48b4d]/95 font-medium">
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return <span key={partIdx}>{part}</span>;
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
