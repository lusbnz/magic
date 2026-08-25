import React from 'react';
import { History, Trash2, User, Clock, Calendar, ArrowRight, X } from 'lucide-react';
import { GIO_CHI } from '../utils/lunarCalendar';

export default function HistorySidebar({
  isOpen,
  onClose,
  profiles,
  onSelectProfile,
  onDeleteProfile,
  onClearAll
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div 
        className="fixed inset-0 bg-[#2d261e]/30 backdrop-blur-[2px] z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar container */}
      <aside className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#ffffff] border-r border-[#e8e3d7] z-50 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#f0ece1] flex items-center justify-between bg-[#faf7f0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#fef7ee] border border-[#fbd38d] text-[#c48b4d] flex items-center justify-center font-bold">
              <History className="w-4 h-4 text-[#c48b4d]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2d261e]">Hồ Sơ Đã Xem</h3>
              <p className="text-[11px] text-[#786d5e]">Lưu trữ IndexedDB cục bộ</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#786d5e] hover:text-[#2d261e] hover:bg-[#ede7da] transition-colors cursor-pointer"
            title="Đóng sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {profiles.length === 0 ? (
            <div className="text-center py-12 px-4 text-[#8c7f6e]">
              <History className="w-8 h-8 mx-auto mb-2 text-[#d1c7b7] opacity-60" />
              <p className="text-xs font-semibold text-[#5e5343]">Chưa có hồ sơ nào</p>
              <p className="text-[11px] text-[#a89f91] mt-1">
                Khi bạn bấm "Xem Lá Số & Luận Giải", thông tin sẽ tự động được lưu tại đây.
              </p>
            </div>
          ) : (
            profiles.map((p) => {
              const hourName = GIO_CHI[p.hourChiIndex] ? GIO_CHI[p.hourChiIndex].split(' ')[0] : 'Tý';
              return (
                <div
                  key={p.id}
                  className="group relative p-3 rounded-xl border border-[#e8e3d7] bg-[#fcfbf9] hover:bg-[#fef7ee] hover:border-[#fbd38d] transition-all cursor-pointer shadow-2xs"
                  onClick={() => {
                    onSelectProfile(p);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <User className="w-3.5 h-3.5 text-[#c48b4d]" />
                        <span className="text-xs font-bold text-[#2d261e] truncate">
                          {p.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          p.gender === 'nam' 
                            ? 'bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]' 
                            : 'bg-[#fdf2f8] text-[#be185d] border border-[#fbcfe8]'
                        }`}>
                          {p.gender === 'nam' ? 'Nam' : 'Nữ'}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#5e5343] space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#8c7f6e]" />
                          <span>Sinh: {p.solarDay}/{p.solarMonth}/{p.solarYear}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8c7f6e]" />
                          <span>Giờ: {hourName}</span>
                          <span className="text-[#a89f91]">•</span>
                          <span>Hạn: {p.viewYear}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProfile(p.id);
                      }}
                      className="p-1.5 text-[#a89f91] hover:text-[#dc2626] hover:bg-[#fee2e2] rounded-md transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                      title="Xóa hồ sơ này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#f0ece1] flex items-center justify-between text-[10px] text-[#8c7f6e]">
                    <span>Bấm để nạp thông tin</span>
                    <ArrowRight className="w-3 h-3 text-[#c48b4d] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {profiles.length > 0 && (
          <div className="p-3 border-t border-[#f0ece1] bg-[#faf7f0]">
            <button
              onClick={onClearAll}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-[#dc2626] bg-[#ffffff] hover:bg-[#fee2e2] border border-[#fecaca] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa tất cả lịch sử
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
