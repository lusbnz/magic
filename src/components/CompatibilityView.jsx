import React, { useState } from 'react';
import { 
  Heart, 
  Briefcase, 
  Sparkles, 
  Layers, 
  Users, 
  ArrowRightLeft,
  Table,
  Bot,
  RefreshCw,
  BookOpen,
  Compass,
  Zap,
  Building,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { createTuViChart } from '../utils/tuViEngine';
import { calculateOverallCompatibility } from '../utils/compatibilityEngine';
import { analyzeCompatibilityWithAI } from '../services/aiService';
import { GIO_CHI } from '../utils/lunarCalendar';

export default function CompatibilityView({ 
  savedProfiles = [], 
  apiKey = '', 
  onOpenHistory 
}) {
  const [compareType, setCompareType] = useState('marriage'); // 'marriage' | 'business'

  // Profile 1 Form
  const [p1, setP1] = useState({
    name: 'Đinh Quốc Việt',
    gender: 'nam',
    solarDay: 6,
    solarMonth: 12,
    solarYear: 2003,
    hourChiIndex: 10,
    viewYear: 2026
  });

  // Profile 2 Form
  const [p2, setP2] = useState({
    name: 'Nguyễn Thị Nga Quỳnh',
    gender: 'nu',
    solarDay: 8,
    solarMonth: 2,
    solarYear: 2005,
    hourChiIndex: 0,
    viewYear: 2026
  });

  const [compatResult, setCompatResult] = useState(null);
  const [chart1, setChart1] = useState(null);
  const [chart2, setChart2] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysisText, setAiAnalysisText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const currentAiReqId = React.useRef(0);

  const handleQuickSelectP1 = (profileId) => {
    const prof = savedProfiles.find(p => p.id === profileId);
    if (prof) {
      setP1({
        name: prof.name,
        gender: prof.gender,
        solarDay: prof.solarDay,
        solarMonth: prof.solarMonth,
        solarYear: prof.solarYear,
        hourChiIndex: prof.hourChiIndex,
        viewYear: prof.viewYear || 2026
      });
    }
  };

  const handleQuickSelectP2 = (profileId) => {
    const prof = savedProfiles.find(p => p.id === profileId);
    if (prof) {
      setP2({
        name: prof.name,
        gender: prof.gender,
        solarDay: prof.solarDay,
        solarMonth: prof.solarMonth,
        solarYear: prof.solarYear,
        hourChiIndex: prof.hourChiIndex,
        viewYear: prof.viewYear || 2026
      });
    }
  };

  const handleRunAiAnalysis = async (compatData) => {
    const data = compatData || compatResult;
    if (!data) return;
    const reqId = ++currentAiReqId.current;
    setIsAiLoading(true);
    setAiAnalysisText('');

    try {
      const result = await analyzeCompatibilityWithAI(data, apiKey, (streamed) => {
        if (reqId === currentAiReqId.current) {
          setAiAnalysisText(streamed);
        }
      });
      if (reqId === currentAiReqId.current && result) {
        setAiAnalysisText(result);
      }
    } catch (err) {
      console.error("AI compatibility error:", err);
    } finally {
      if (reqId === currentAiReqId.current) {
        setIsAiLoading(false);
      }
    }
  };

  const handleAnalyze = () => {
    setIsLoading(true);
    setAiAnalysisText('');

    try {
      const c1 = createTuViChart(p1);
      const c2 = createTuViChart(p2);
      setChart1(c1);
      setChart2(c2);

      const res = calculateOverallCompatibility(c1, c2, compareType);
      setCompatResult(res);

      if (res.totalScore >= 70) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#ec4899', '#8b5cf6']
        });
      }

      // Tự động gọi Luận giải AI
      handleRunAiAnalysis(res);
    } catch (err) {
      console.error("Lỗi đối chiếu:", err);
      alert("Đã có lỗi xảy ra trong quá trình đối chiếu. Xin vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Chế Độ So Đôi */}
      <div className="warm-card p-5 sm:p-6 bg-[#ffffff] border-2 border-[#ded6c7] rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eee8dc] pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-[#fef7ee] text-[#c48b4d] border border-[#fbd38d]">
                <ArrowRightLeft className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#241e17] tracking-tight">
                So Sánh Hợp Tuổi & Đối Chiếu Lá Số Tử Vi
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6e6456]">
              Phân tích đa chiều: Ngũ Hành Nạp Âm, Thiên Can Hóa Hợp, Địa Chi Tam/Lục Hợp, Cung Phi Bát Trạch & Tử Vi Đẩu Số.
            </p>
          </div>

          {/* Selector Mục Đích So Đôi (Không bao giờ xuống dòng) */}
          <div className="flex items-center p-1 bg-[#f4eee1] rounded-xl border border-[#e5decfa] self-start md:self-auto flex-nowrap shrink-0">
            <button
              onClick={() => setCompareType('marriage')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                compareType === 'marriage'
                  ? 'bg-[#ffffff] text-[#e11d48] shadow-xs'
                  : 'text-[#6e6456] hover:text-[#241e17]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${compareType === 'marriage' ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Hôn Nhân & Tình Duyên</span>
            </button>
            <button
              onClick={() => setCompareType('business')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                compareType === 'business'
                  ? 'bg-[#ffffff] text-[#0284c7] shadow-xs'
                  : 'text-[#6e6456] hover:text-[#241e17]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Đối Tác Làm Ăn</span>
            </button>
          </div>
        </div>

        {/* 2 Cột Nhập Thông Tin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* Người thứ 1 */}
          <div className="p-4 rounded-xl bg-[#faf7f0] border border-[#e8e2d5] space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#c48b4d] uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                {compareType === 'marriage' ? 'Người thứ 1 (Chồng / Bạn Nam)' : 'Người thứ 1 (Chủ trì / Bạn)'}
              </span>
              {savedProfiles.length > 0 && (
                <select
                  onChange={(e) => handleQuickSelectP1(e.target.value)}
                  defaultValue=""
                  className="text-[11px] font-semibold bg-white border border-[#ded6c7] rounded-lg px-2 py-1 text-[#5e5343] focus:outline-none"
                >
                  <option value="" disabled>Chọn từ Lịch Sử...</option>
                  {savedProfiles.map(p => (
                    <option key={`p1-${p.id}`} value={p.id}>{p.name} ({p.gender === 'nam' ? 'Nam' : 'Nữ'}, {p.solarYear})</option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#6e6456] mb-1">Họ và Tên</label>
                <input
                  type="text"
                  value={p1.name}
                  onChange={(e) => setP1({ ...p1, name: e.target.value })}
                  placeholder="Nhập họ tên..."
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-[#ded6c7] rounded-lg text-[#241e17] focus:border-[#c48b4d] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e6456] mb-1">Giới tính</label>
                  <select
                    value={p1.gender}
                    onChange={(e) => setP1({ ...p1, gender: e.target.value })}
                    className="w-full text-xs font-semibold px-2.5 py-2 bg-white border border-[#ded6c7] rounded-lg text-[#241e17] focus:outline-none"
                  >
                    <option value="nam">Nam</option>
                    <option value="nu">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6e6456] mb-1">Giờ sinh</label>
                  <select
                    value={p1.hourChiIndex}
                    onChange={(e) => setP1({ ...p1, hourChiIndex: parseInt(e.target.value) })}
                    className="w-full text-xs font-semibold px-2 py-2 bg-white border border-[#ded6c7] rounded-lg text-[#241e17] focus:outline-none truncate"
                  >
                    {GIO_CHI.map((g, idx) => (
                      <option key={`p1-g-${idx}`} value={idx}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e6456] mb-1">Ngày / Tháng / Năm Sinh (Dương Lịch)</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={p1.solarDay}
                    onChange={(e) => setP1({ ...p1, solarDay: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs font-bold text-center px-2 py-2 bg-white border border-[#ded6c7] rounded-lg text-[#241e17]"
                    placeholder="Ngày"
                  />
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={p1.solarMonth}
                    onChange={(e) => setP1({ ...p1, solarMonth: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs font-bold text-center px-2 py-2 bg-white border border-[#ded6c7] rounded-lg text-[#241e17]"
                    placeholder="Tháng"
                  />
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={p1.solarYear}
                    onChange={(e) => setP1({ ...p1, solarYear: parseInt(e.target.value) || 2000 })}
                    className="w-full text-xs font-bold text-center px-2 py-2 bg-white border border-[#ded6c7] rounded-lg text-[#241e17]"
                    placeholder="Năm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Người thứ 2 */}
          <div className="p-4 rounded-xl bg-[#faf7f0] border border-[#e8e2d5] space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#0284c7] uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                {compareType === 'marriage' ? 'Người thứ 2 (Vợ / Bạn Nữ)' : 'Người thứ 2 (Đối tác / Cộng sự)'}
              </span>
              {savedProfiles.length > 0 && (
                <select
                  onChange={(e) => handleQuickSelectP2(e.target.value)}
                  defaultValue=""
                  className="text-[11px] font-semibold bg-white border border-[#ded6c7] rounded-lg px-2 py-1 text-[#5e5343] focus:outline-none"
                >
                  <option value="" disabled>Chọn từ Lịch Sử...</option>
                  {savedProfiles.map(p => (
                    <option key={`p2-${p.id}`} value={p.id}>{p.name} ({p.gender === 'nam' ? 'Nam' : 'Nữ'}, {p.solarYear})</option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#6e6456] mb-1">Họ và Tên</label>
                <input
                  type="text"
                  value={p2.name}
                  onChange={(e) => setP2({ ...p2, name: e.target.value })}
                  placeholder="Nhập họ tên..."
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-[#ded6c7] rounded-lg text-[#241e17] focus:border-[#0284c7] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e6456] mb-1">Giới tính</label>
                  <select
                    value={p2.gender}
                    onChange={(e) => setP2({ ...p2, gender: e.target.value })}
                    className="w-full text-xs font-semibold px-2.5 py-2 bg-white border border-[#ded6c7] rounded-lg text-[#241e17] focus:outline-none"
                  >
                    <option value="nam">Nam</option>
                    <option value="nu">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6e6456] mb-1">Giờ sinh</label>
                  <select
                    value={p2.hourChiIndex}
                    onChange={(e) => setP2({ ...p2, hourChiIndex: parseInt(e.target.value) })}
                    className="w-full text-xs font-semibold px-2 py-2 bg-white border border-[#ded6c7] rounded-lg text-[#241e17] focus:outline-none truncate"
                  >
                    {GIO_CHI.map((g, idx) => (
                      <option key={`p2-g-${idx}`} value={idx}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e6456] mb-1">Ngày / Tháng / Năm Sinh (Dương Lịch)</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={p2.solarDay}
                    onChange={(e) => setP2({ ...p2, solarDay: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs font-bold text-center px-2 py-2 bg-white border border-[#ded6c7] rounded-lg text-[#241e17]"
                    placeholder="Ngày"
                  />
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={p2.solarMonth}
                    onChange={(e) => setP2({ ...p2, solarMonth: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs font-bold text-center px-2 py-2 bg-white border border-[#ded6c7] rounded-lg text-[#241e17]"
                    placeholder="Tháng"
                  />
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={p2.solarYear}
                    onChange={(e) => setP2({ ...p2, solarYear: parseInt(e.target.value) || 2000 })}
                    className="w-full text-xs font-bold text-center px-2 py-2 bg-white border border-[#ded6c7] rounded-lg text-[#241e17]"
                    placeholder="Năm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nút Bấm Phân Tích */}
        <div className="mt-5 pt-4 border-t border-[#eee8dc] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div />
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#241e17] hover:bg-[#3d3224] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : 'text-[#facc15]'}`} />
            <span>{isLoading ? 'Đang Lập Lá Số & Phân Tích...' : 'Phân Tích & Đối Chiếu Ngay'}</span>
          </button>
        </div>
      </div>

      {/* KẾT QUẢ PHÂN TÍCH */}
      {compatResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* 1. Card Điểm Tổng Quát (Overall Score Card) */}
          <div className="warm-card p-6 rounded-2xl bg-[#ffffff] border-2 border-[#ded6c7] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Radial Score Badge */}
              <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-[#faf7f0] border-4 border-[#c48b4d]/30 shadow-inner shrink-0">
                <div className="text-center">
                  <span className="text-3xl font-black text-[#241e17]">{compatResult.totalScore}</span>
                  <span className="text-[11px] font-bold text-[#8c7f6e] block -mt-1">/ 100đ</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#8c7f6e] uppercase tracking-wider block mb-1">
                  Đánh Giá Mức Độ Hòa Hợp
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#241e17] mb-2">
                  {compatResult.overallRating}
                </h3>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f4eee1] text-[#5e5343] border border-[#e5decfa]">
                    {compatResult.info1.name} ({compatResult.info1.canChiYear})
                  </span>
                  <span className="text-xs text-[#8c7f6e] font-bold">⟷</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f4eee1] text-[#5e5343] border border-[#e5decfa]">
                    {compatResult.info2.name} ({compatResult.info2.canChiYear})
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="w-full md:w-72 space-y-2 p-3.5 rounded-xl bg-[#faf7f0] border border-[#e8e2d5] text-xs">
              <div className="flex justify-between font-bold text-[#5e5343]">
                <span>Tỷ lệ hòa hợp:</span>
                <span className="text-[#241e17]">{compatResult.totalScore}%</span>
              </div>
              <div className="w-full bg-[#ede7da] rounded-full h-2.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700" 
                  style={{ 
                    width: `${compatResult.totalScore}%`,
                    backgroundColor: compatResult.ratingColor 
                  }}
                />
              </div>
              <p className="text-[11px] text-[#8c7f6e] text-center pt-0.5">
                {compareType === 'marriage' ? 'Độ hòa hợp Hôn Nhân & Gia Đạo' : 'Độ hòa hợp Kinh Doanh & Làm Ăn'}
              </p>
            </div>
          </div>

          {/* 2. BẢNG ĐỐI CHIẾU THÔNG TIN 2 LÁ SỐ SONG SONG (DUAL PROFILE OVERVIEW) */}
          <div className="warm-card p-5 sm:p-6 bg-[#ffffff] border-2 border-[#ded6c7] rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee8dc] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#fef7ee] text-[#c48b4d] border border-[#fbd38d]">
                  <Table className="w-4 h-4" />
                </span>
                <h4 className="text-base font-black text-[#241e17]">
                  Bảng Đối Chiếu Thông Số 2 Lá Số Song Song
                </h4>
              </div>
              <span className="text-xs font-bold text-[#8c7f6e] bg-[#faf7f0] px-2.5 py-1 rounded-lg border border-[#e8e2d5]">
                Đồng quy chiếu 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#faf7f0] border-b border-[#e8e2d5] text-[#6e6456]">
                    <th className="py-2.5 px-3 font-bold w-1/4">Yếu Tố Đối Chiếu</th>
                    <th className="py-2.5 px-3 font-black text-[#c48b4d] w-3/8">
                      {compatResult.info1.name} ({compatResult.info1.gender?.includes('Nam') || compatResult.info1.gender === 'nam' ? 'Nam' : 'Nữ'})
                    </th>
                    <th className="py-2.5 px-3 font-black text-[#0284c7] w-3/8">
                      {compatResult.info2.name} ({compatResult.info2.gender?.includes('Nam') || compatResult.info2.gender === 'nam' ? 'Nam' : 'Nữ'})
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2ece1] text-[#382f25]">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#786d5e] bg-[#fdfcfb]">Sinh Thần Bát Tự</td>
                    <td className="py-2.5 px-3 font-semibold">{compatResult.info1.solarDate} ({compatResult.info1.canChiHour}, {compatResult.info1.canChiDay})</td>
                    <td className="py-2.5 px-3 font-semibold">{compatResult.info2.solarDate} ({compatResult.info2.canChiHour}, {compatResult.info2.canChiDay})</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#786d5e] bg-[#fdfcfb]">Bản Mệnh (Nạp Âm)</td>
                    <td className="py-2.5 px-3"><strong className="text-[#c2410c]">{compatResult.info1.nguHanh}</strong></td>
                    <td className="py-2.5 px-3"><strong className="text-[#0284c7]">{compatResult.info2.nguHanh}</strong></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#786d5e] bg-[#fdfcfb]">Cục (Ngũ Cục)</td>
                    <td className="py-2.5 px-3 font-bold">{compatResult.info1.cucName}</td>
                    <td className="py-2.5 px-3 font-bold">{compatResult.info2.cucName}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#786d5e] bg-[#fdfcfb]">Cung Phi Bát Tự</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold">{compatResult.info1.cungPhi?.name}</span> ({compatResult.info1.cungPhi?.element} - {compatResult.info1.cungPhi?.group})
                      <span className="block text-[11px] text-[#8c7f6e]">Hợp hướng: {compatResult.info1.cungPhi?.huongTot}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold">{compatResult.info2.cungPhi?.name}</span> ({compatResult.info2.cungPhi?.element} - {compatResult.info2.cungPhi?.group})
                      <span className="block text-[11px] text-[#8c7f6e]">Hợp hướng: {compatResult.info2.cungPhi?.huongTot}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#786d5e] bg-[#fdfcfb]">Cung Mệnh (Tử Vi)</td>
                    <td className="py-2.5 px-3">
                      Cung <strong className="text-[#241e17]">{compatResult.info1.cungMenhChi}</strong> — Chính tinh: <strong className="text-[#c48b4d]">{compatResult.tuViDetails?.menh1Stars}</strong>
                    </td>
                    <td className="py-2.5 px-3">
                      Cung <strong className="text-[#241e17]">{compatResult.info2.cungMenhChi}</strong> — Chính tinh: <strong className="text-[#0284c7]">{compatResult.tuViDetails?.menh2Stars}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#786d5e] bg-[#fdfcfb]">Cung Thân (Tử Vi)</td>
                    <td className="py-2.5 px-3 font-semibold">Cung {compatResult.info1.cungThanChi}</td>
                    <td className="py-2.5 px-3 font-semibold">Cung {compatResult.info2.cungThanChi}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#786d5e] bg-[#fdfcfb]">
                      {compareType === 'marriage' ? 'Cung Phu Thê' : 'Cung Quan Lộc'}
                    </td>
                    <td className="py-2.5 px-3">
                      {compareType === 'marriage' 
                        ? `Cung ${compatResult.tuViDetails?.phuThe1Chi || 'Phu Thê'}: ${compatResult.tuViDetails?.phuStars1}` 
                        : `Cung Quan: ${compatResult.tuViDetails?.quanStars1}`}
                    </td>
                    <td className="py-2.5 px-3">
                      {compareType === 'marriage' 
                        ? `Cung ${compatResult.tuViDetails?.phuThe2Chi || 'Phu Thê'}: ${compatResult.tuViDetails?.phuStars2}` 
                        : `Cung Quan: ${compatResult.tuViDetails?.quanStars2}`}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#786d5e] bg-[#fdfcfb]">Chủ Mệnh / Chủ Thân</td>
                    <td className="py-2.5 px-3 text-[11.5px]">Chủ Mệnh: <strong>{compatResult.info1.chuMenh}</strong> • Chủ Thân: <strong>{compatResult.info1.chuThan}</strong></td>
                    <td className="py-2.5 px-3 text-[11.5px]">Chủ Mệnh: <strong>{compatResult.info2.chuMenh}</strong> • Chủ Thân: <strong>{compatResult.info2.chuThan}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. CHI TIẾT 5 TRỤ CỘT ĐỐI CHIẾU NÂNG CAO */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#241e17] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c48b4d]" />
              Chi Tiết 5 Trụ Cột Tương Hợp Phong Thủy & Tử Vi
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compatResult.pillars.map((pillar) => (
                <div 
                  key={pillar.id}
                  className="p-4 sm:p-4.5 rounded-xl warm-card bg-white border border-[#ded6c7] flex flex-col justify-between space-y-3 shadow-2xs hover:border-[#c48b4d]/60 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-[#f2ece1]">
                      <span className="text-xs font-black text-[#241e17]">{pillar.title}</span>
                      <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                        pillar.score >= 18 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : pillar.score >= 14 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {pillar.score}/{pillar.maxScore}đ
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-extrabold text-[#c48b4d] block mb-1">
                        {pillar.status}
                      </span>
                      <span className="text-[11px] font-semibold text-[#5e5343] bg-[#faf7f0] px-2 py-1 rounded-md inline-block border border-[#eee8dc]">
                        {pillar.tag}
                      </span>
                    </div>

                    <p className="text-xs text-[#382f25] leading-relaxed">
                      {pillar.desc}
                    </p>

                    {pillar.detail && (
                      <div className="pt-2 border-t border-[#f4eee1] text-[11.5px] text-[#786d5e] leading-relaxed bg-[#fdfbf7] p-2 rounded-lg">
                        💡 <strong className="text-[#5e5343]">Phân tích sâu:</strong> {pillar.detail}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Thẻ Cung Phối Ngẫu / Cung Quan Lộc Tử Vi Chuyên Sâu */}
              <div className="p-4 sm:p-4.5 rounded-xl warm-card bg-white border border-[#ded6c7] flex flex-col justify-between space-y-3 shadow-2xs">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f2ece1]">
                    <span className="text-xs font-black text-[#241e17]">
                      {compareType === 'marriage' ? '6. Cung Phu Thê & Tình Duyên' : '6. Cung Quan Lộc & Tài Lộc'}
                    </span>
                    <span className="text-[11px] font-bold text-[#8c7f6e]">Tử Vi</span>
                  </div>

                  <div className="space-y-2 text-xs text-[#5e5343]">
                    <div className="p-2 rounded-lg bg-[#faf7f0] border border-[#eee8dc]">
                      <span className="text-[11px] text-[#8c7f6e] block font-bold">{compatResult.info1.name}:</span>
                      <span className="font-bold text-[#241e17]">
                        {compareType === 'marriage' 
                          ? `Cung ${compatResult.tuViDetails?.phuThe1Chi || 'Phu Thê'} (${compatResult.tuViDetails?.phuStars1})` 
                          : `Cung Quan Lộc (${compatResult.tuViDetails?.quanStars1})`}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#faf7f0] border border-[#eee8dc]">
                      <span className="text-[11px] text-[#8c7f6e] block font-bold">{compatResult.info2.name}:</span>
                      <span className="font-bold text-[#241e17]">
                        {compareType === 'marriage' 
                          ? `Cung ${compatResult.tuViDetails?.phuThe2Chi || 'Phu Thê'} (${compatResult.tuViDetails?.phuStars2})` 
                          : `Cung Quan Lộc (${compatResult.tuViDetails?.quanStars2})`}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#f4eee1] text-[11.5px] text-[#786d5e] leading-relaxed bg-[#fdfbf7] p-2 rounded-lg">
                    ✨ <strong className="text-[#5e5343]">Đánh giá:</strong> Cung phối ngẫu hai bên hòa hợp tinh tú, không bị hung sát tinh xâm phạm nghiêm trọng, tạo nền tảng vững chắc cho sự gắn kết lâu bền.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. LUẬN GIẢI CHUYÊN SÂU AI SO ĐÔI (5 MỤC TOÀN DIỆN) */}
          <div className="warm-card p-5 sm:p-6 bg-[#ffffff] border-2 border-[#ded6c7] rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eee8dc] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#fef7ee] border border-[#fbd38d] flex items-center justify-center text-[#c48b4d] shadow-2xs">
                  <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-[#241e17] tracking-tight">
                      Luận Giải Chi Tiết AI So Đôi 2 Lá Số
                    </h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fef7ee] text-[#c48b4d] border border-[#fbd38d]">
                      <Bot className="w-3 h-3 mr-1" /> {apiKey ? 'Gemini Flash' : 'Engine Chuyên Sâu'}
                    </span>
                  </div>
                  <p className="text-xs text-[#786d5e]">
                    Phân tích vận trình nhân duyên, phong thủy bát trạch và phương pháp hóa giải xung khắc
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunAiAnalysis()}
                  disabled={isAiLoading}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#faf7f0] hover:bg-[#ede7da] text-[#5e5343] flex items-center gap-1.5 transition-colors border border-[#e8e2d5] cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                  {isAiLoading ? 'Đang luận giải...' : 'Tạo lại luận giải'}
                </button>
              </div>
            </div>

            {/* AI Loading Shimmer State */}
            {isAiLoading && !aiAnalysisText ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {[
                  { label: 'Tổng Quan Duyên Phận', badge: 'Độ Hòa Hợp', icon: Compass, color: 'text-amber-700 bg-amber-50 border-amber-200' },
                  { label: 'Bản Mệnh & Can Chi', badge: 'Tương Sinh Tương Khắc', icon: Zap, color: 'text-blue-700 bg-blue-50 border-blue-200' },
                  { label: 'Cung Phi Bát Trạch', badge: 'Khí Trường Gia Đạo', icon: Building, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                  { label: 'Tử Vi Đối Chiếu', badge: 'Mệnh Thân Phối Ngẫu', icon: Heart, color: 'text-rose-700 bg-rose-50 border-rose-200' },
                  { label: 'Lời Khuyên & Hóa Giải', badge: 'Bí Quyết Vun Đắp', icon: Lightbulb, color: 'text-purple-700 bg-purple-50 border-purple-200' }
                ].map((skel, sIdx) => {
                  const Icon = skel.icon;
                  return (
                    <div
                      key={sIdx}
                      className={`p-4 rounded-xl shimmer-card shadow-2xs space-y-3 ${sIdx === 4 ? 'md:col-span-2' : ''}`}
                    >
                      <div className="flex items-center gap-2 border-b border-[#eee7d8] pb-2">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border ${skel.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[13px] font-black text-[#241e17]">{skel.label}:</span>
                        <span className="text-[12px] font-bold text-[#5e5343]">{skel.badge}</span>
                        <div className="w-12 h-3.5 rounded shimmer-wave ml-auto" />
                      </div>
                      <div className="space-y-2 pt-1">
                        <div className="h-3.5 rounded shimmer-wave w-full" />
                        <div className="h-3.5 rounded shimmer-wave w-[90%]" />
                        <div className="h-3.5 rounded shimmer-wave w-[75%]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Danh sách 5 mục AI Luận giải */
              <div className="space-y-3.5 pt-1">
                {(() => {
                  const rawSecs = (aiAnalysisText || '').split(/###\s*/).filter(Boolean);
                  const parsedSections = [];

                  const getCompatSectionMeta = (headerText, fallbackIdx) => {
                    const textUpper = (headerText || '').toUpperCase();
                    if (textUpper.includes('TỔNG QUAN') || textUpper.includes('DUYÊN PHẬN') || /^[#\s*•]*1[\s.]/.test(headerText || '')) {
                      return { id: 'sec-1', label: 'Tổng Quan', icon: Compass, color: 'text-amber-700 bg-amber-50 border-amber-200', badge: 'Duyên Phận & Mức Hòa Hợp' };
                    }
                    if (textUpper.includes('TƯƠNG SINH') || textUpper.includes('NGŨ HÀNH') || textUpper.includes('CAN CHI') || /^[#\s*•]*2[\s.]/.test(headerText || '')) {
                      return { id: 'sec-2', label: 'Bản Mệnh & Can Chi', icon: Zap, color: 'text-blue-700 bg-blue-50 border-blue-200', badge: 'Tương Sinh & Tương Khắc' };
                    }
                    if (textUpper.includes('CUNG PHI') || textUpper.includes('BÁT TRẠCH') || textUpper.includes('KHÍ TRƯỜNG') || /^[#\s*•]*3[\s.]/.test(headerText || '')) {
                      return { id: 'sec-3', label: 'Cung Phi Bát Trạch', icon: Building, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', badge: 'Khí Trường Gia Đạo' };
                    }
                    if (textUpper.includes('MỆNH') || textUpper.includes('TỬ VI') || textUpper.includes('PHỐI NGẪU') || /^[#\s*•]*4[\s.]/.test(headerText || '')) {
                      return { id: 'sec-4', label: 'Tử Vi Đối Chiếu', icon: Heart, color: 'text-rose-700 bg-rose-50 border-rose-200', badge: 'Mệnh Thân & Phối Ngẫu' };
                    }
                    if (textUpper.includes('KHUYÊN') || textUpper.includes('HÓA GIẢI') || textUpper.includes('PHƯƠNG PHÁP') || /^[#\s*•]*5[\s.]/.test(headerText || '')) {
                      return { id: 'sec-5', label: 'Lời Khuyên Hóa Giải', icon: Lightbulb, color: 'text-purple-700 bg-purple-50 border-purple-200', badge: 'Bí Quyết Vun Đắp' };
                    }
                    const defaultMetas = [
                      { id: 'sec-1', label: 'Tổng Quan', icon: Compass, color: 'text-amber-700 bg-amber-50 border-amber-200', badge: 'Duyên Phận & Mức Hòa Hợp' },
                      { id: 'sec-2', label: 'Bản Mệnh & Can Chi', icon: Zap, color: 'text-blue-700 bg-blue-50 border-blue-200', badge: 'Tương Sinh & Tương Khắc' },
                      { id: 'sec-3', label: 'Cung Phi Bát Trạch', icon: Building, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', badge: 'Khí Trường Gia Đạo' },
                      { id: 'sec-4', label: 'Tử Vi Đối Chiếu', icon: Heart, color: 'text-rose-700 bg-rose-50 border-rose-200', badge: 'Mệnh Thân & Phối Ngẫu' },
                      { id: 'sec-5', label: 'Lời Khuyên Hóa Giải', icon: Lightbulb, color: 'text-purple-700 bg-purple-50 border-purple-200', badge: 'Bí Quyết Vun Đắp' }
                    ];
                    return defaultMetas[fallbackIdx] || { id: `sec-${fallbackIdx}`, label: 'Luận Giải', icon: BookOpen, color: 'text-slate-700 bg-slate-50 border-slate-200', badge: 'Chi Tiết' };
                  };

                  for (let i = 0; i < rawSecs.length; i++) {
                    const sec = rawSecs[i].trim();
                    if (!sec) continue;
                    const lines = sec.split('\n');
                    const headerLine = lines[0].trim();
                    const content = lines.slice(1).join('\n').trim();
                    if (!content && (headerLine === '--' || headerLine === '---' || headerLine.length > 80 || headerLine.startsWith('Dưới đây'))) continue;
                    
                    const title = headerLine.replace(/^[\d.\s🌟💼💰❤️🔮⚡🏛️💡]+/, '').trim();
                    const meta = getCompatSectionMeta(headerLine, parsedSections.length);
                    parsedSections.push({
                      idx: parsedSections.length,
                      rawTitle: headerLine,
                      title: title || meta.label,
                      content: content || headerLine,
                      meta
                    });
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {parsedSections.map((sec, idx) => {
                        const Icon = sec.meta.icon;
                        const isFullWidth = idx === 4 || parsedSections.length === 1;

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl bg-[#faf7f0] border border-[#e8e2d5] shadow-2xs hover:border-[#c48b4d]/60 transition-all ${
                              isFullWidth ? 'md:col-span-2' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2 border-b border-[#eee7d8] pb-2 mb-2.5">
                              <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border ${sec.meta.color}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <h5 className="text-[13.5px] sm:text-[14px] font-black text-[#241e17] tracking-tight flex-1">
                                {sec.meta.label}: <span className="font-bold text-[#5e5343]">{sec.meta.badge}</span>
                              </h5>
                            </div>

                            <div className="space-y-2 text-[#332b22] text-[13px] leading-relaxed">
                              {sec.content.split('\n').filter(Boolean).map((p, pIdx) => {
                                const clean = p.trim().replace(/^[-*•]\s*/, '').trim();
                                const parts = clean.split(/(\*\*.*?\*\*|\*[^*]+?\*)/g);
                                return (
                                  <div key={pIdx} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#c48b4d] mt-1.5 flex-shrink-0" />
                                    <p className="flex-1 leading-relaxed">
                                      {parts.map((part, partIdx) => {
                                        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                                          return (
                                            <strong key={partIdx} className="font-extrabold text-[#c48b4d]">
                                              {part.slice(2, -2)}
                                            </strong>
                                          );
                                        }
                                        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                                          return (
                                            <strong key={partIdx} className="font-bold text-[#b45309]">
                                              {part.slice(1, -1)}
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
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
