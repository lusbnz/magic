import React from 'react';
import { Calendar, User, Clock, Sparkles, ArrowRight, History } from 'lucide-react';
import { GIO_CHI } from '../utils/lunarCalendar';

export default function InputForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  loading, 
  onOpenHistory, 
  historyCount = 0 
}) {

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="warm-card p-6 md:p-8 bg-[#ffffff]">
        {/* Header */}
        <div className="mb-6 border-b border-[#f0ece1] pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#fef7ee] border border-[#fbd38d] text-[#c48b4d] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-[#c48b4d]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2d261e] tracking-tight">
                Lập Lá Số Tử Vi
              </h2>
              <p className="text-xs text-[#786d5e]">
                Nhập thông tin sinh thần bát tự để an sao và luận giải trực tiếp
              </p>
            </div>
          </div>

          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fcfbf9] hover:bg-[#fef7ee] text-[#786d5e] hover:text-[#c48b4d] border border-[#e8e3d7] hover:border-[#fbd38d] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <History className="w-3.5 h-3.5" />
              <span>Hồ sơ đã lưu</span>
              {historyCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#c48b4d] text-white text-[10px] flex items-center justify-center font-bold ml-0.5">
                  {historyCount}
                </span>
              )}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ tên & Giới tính */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#4d4234] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#8c7f6e]" /> Họ và tên
              </label>
              <input
                type="text"
                required
                className="warm-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Nguyễn Thị Nga Quỳnh"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4d4234] mb-1.5">
                Giới tính
              </label>
              <select
                className="warm-input"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="nam">Nam mạng</option>
                <option value="nu">Nữ mạng</option>
              </select>
            </div>
          </div>

          {/* Ngày Tháng Năm Sinh */}
          <div>
            <label className="block text-xs font-semibold text-[#4d4234] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8c7f6e]" /> Ngày sinh (Dương Lịch)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <select
                className="warm-input"
                value={formData.solarDay}
                onChange={(e) => setFormData({ ...formData, solarDay: e.target.value })}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Ngày {d}
                  </option>
                ))}
              </select>

              <select
                className="warm-input"
                value={formData.solarMonth}
                onChange={(e) => setFormData({ ...formData, solarMonth: e.target.value })}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1920"
                max="2035"
                className="warm-input"
                value={formData.solarYear}
                onChange={(e) => setFormData({ ...formData, solarYear: e.target.value })}
                placeholder="Năm sinh"
              />
            </div>
          </div>

          {/* Giờ Sinh & Năm Xem */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4d4234] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8c7f6e]" /> Giờ sinh (Chi)
              </label>
              <select
                className="warm-input"
                value={formData.hourChiIndex}
                onChange={(e) => setFormData({ ...formData, hourChiIndex: parseInt(e.target.value) })}
              >
                {GIO_CHI.map((gio, idx) => (
                  <option key={idx} value={idx}>
                    Giờ {gio}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4d4234] mb-1.5">
                Năm xem hạn
              </label>
              <input
                type="number"
                min="2020"
                max="2040"
                className="warm-input"
                value={formData.viewYear}
                onChange={(e) => setFormData({ ...formData, viewYear: e.target.value })}
              />
            </div>
          </div>

          {/* Nút Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="warm-btn-primary w-full py-2.5 font-semibold text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang lập lá số...
                </>
              ) : (
                <>
                  Lập Lá Số Tử Vi
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
