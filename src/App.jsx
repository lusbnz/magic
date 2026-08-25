import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Compass, History, ChevronLeft, ChevronRight, PanelRightOpen, PanelRightClose, Bot } from 'lucide-react';
import confetti from 'canvas-confetti';

import InputForm from './components/InputForm';
import TuViBoard from './components/TuViBoard';
import AiAnalysisView from './components/AiAnalysisView';
import HistorySidebar from './components/HistorySidebar';

import { createTuViChart } from './utils/tuViEngine';
import { analyzeTuViWithAI } from './services/aiService';
import { getAllProfiles, saveProfile, deleteProfile, clearAllProfiles } from './utils/historyDb';

export default function App() {
  const [formData, setFormData] = useState({
    name: 'Nguyễn Thị Nga Quỳnh',
    gender: 'nu',
    solarDay: 8,
    solarMonth: 2,
    solarYear: 2005,
    hourChiIndex: 0, // Tý (23h-01h)
    viewYear: 2026
  });

  const [chartData, setChartData] = useState(null);
  const [analysisText, setAnalysisText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBoardLoading, setIsBoardLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false); // Mặc định thu gọn chiều ngang khi mới lập lá số
  const defaultKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' ? atob('QVEuQWI4Uk42SkI2Y3c4OTNsTGVHSUZVdk5DdEpITkZncTRGQWtZSUtucC15MmxQYWVTSUE=') : '');
  const [apiKey, setApiKey] = useState(defaultKey);
  const [selectedCungIndex, setSelectedCungIndex] = useState(null);
  const currentRequestIdRef = React.useRef(0);

  // History Sidebar state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState([]);

  const loadHistoryProfiles = async () => {
    try {
      const list = await getAllProfiles();
      setSavedProfiles(list);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  useEffect(() => {
    loadHistoryProfiles();
  }, []);

  const handleGenerateChart = async (dataToSubmit) => {
    const data = dataToSubmit || formData;
    const requestId = ++currentRequestIdRef.current;

    setLoading(true);
    setIsBoardLoading(true);
    setIsAiLoading(true);
    setIsAiOpen(false); // Mặc định thu gọn chiều ngang để hiển thị rộng rãi Thiên Bàn
    setAnalysisText('');

    try {
      // 1. Tự động lưu thông tin form vào IndexedDB
      await saveProfile(data);
      await loadHistoryProfiles();

      // 2. Tạo bàn lá số
      const chart = createTuViChart(data);
      if (requestId !== currentRequestIdRef.current) return;

      setChartData(chart);
      setSelectedCungIndex(chart.menhPos);

      // Hiệu ứng Shimmer mượt mà cho 12 Cung (600ms) trước khi mở đầy đủ
      await new Promise(resolve => setTimeout(resolve, 600));
      if (requestId !== currentRequestIdRef.current) return;

      setIsBoardLoading(false);
      setLoading(false); // Tắt loading của form ngay khi lá số đã sẵn sàng

      // Hiệu ứng nhẹ ấm áp
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c48b4d', '#f59e0b', '#d97706', '#fef3c7']
      });

      // 3. Gọi AI luận giải với Real-time Streaming (chữ xuất hiện liên tục ngay khi AI viết)
      const aiResult = await analyzeTuViWithAI(chart, apiKey, (accumulatedText) => {
        if (requestId === currentRequestIdRef.current) {
          setAnalysisText(accumulatedText);
        }
      });
      if (requestId !== currentRequestIdRef.current) return;
      setAnalysisText(aiResult);
    } catch (err) {
      if (requestId === currentRequestIdRef.current) {
        console.error("Lỗi tạo lá số:", err);
        alert("Đã xảy ra lỗi khi tạo lá số. Xin vui lòng kiểm tra lại thông tin!");
      }
    } finally {
      if (requestId === currentRequestIdRef.current) {
        setLoading(false);
        setIsBoardLoading(false);
        setIsAiLoading(false);
      }
    }
  };

  const handleSelectProfileFromHistory = (profile) => {
    // Hủy bỏ trạng thái loading cũ nếu có
    currentRequestIdRef.current++;
    setLoading(false);
    setIsBoardLoading(false);
    setIsAiLoading(false);
    setIsAiOpen(false);

    const profileData = {
      name: profile.name,
      gender: profile.gender,
      solarDay: profile.solarDay,
      solarMonth: profile.solarMonth,
      solarYear: profile.solarYear,
      hourChiIndex: profile.hourChiIndex,
      viewYear: profile.viewYear
    };
    setFormData(profileData);

    // Nếu đang ở màn hình lá số, chuyển về form hoặc có thể bấm xem lại
    if (chartData) {
      setChartData(null);
      setAnalysisText('');
      setSelectedCungIndex(null);
    }
  };

  const handleDeleteProfile = async (id) => {
    await deleteProfile(id);
    await loadHistoryProfiles();
  };

  const handleClearAllProfiles = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử các lá số đã lưu?')) {
      await clearAllProfiles();
      await loadHistoryProfiles();
    }
  };

  const handleReset = () => {
    currentRequestIdRef.current++;
    setLoading(false);
    setIsBoardLoading(false);
    setIsAiLoading(false);
    setChartData(null);
    setAnalysisText('');
    setSelectedCungIndex(null);
  };

  const selectedCung = chartData && selectedCungIndex !== null 
    ? chartData.cungList[selectedCungIndex] 
    : null;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#2d261e] flex flex-col justify-between relative">
      {/* History Sidebar */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        profiles={savedProfiles}
        onSelectProfile={handleSelectProfileFromHistory}
        onDeleteProfile={handleDeleteProfile}
        onClearAll={handleClearAllProfiles}
      />

      {/* Main Container Full Width */}
      <div className={`w-full px-3 sm:px-5 ${chartData ? 'py-2 sm:py-3' : 'py-6 sm:py-7'} flex-1`}>
        {!chartData ? (
          <div>
            {/* Header intro */}
            <div className="text-center max-w-xl mx-auto mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d261e] tracking-tight mb-2">
                Giải Mã Vận Mệnh Tử Vi Bằng AI
              </h1>
              <p className="text-sm text-[#786d5e]">
                Thuật toán Tử Vi Đẩu Số kết hợp Trí Tuệ Nhân Tạo giúp tra cứu cung vị, ý nghĩa từng tinh tú và trò chuyện trực tiếp với Thầy AI.
              </p>
            </div>

            <InputForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleGenerateChart}
              loading={loading}
              apiKey={apiKey}
              setApiKey={setApiKey}
              onOpenHistory={() => setIsHistoryOpen(true)}
              historyCount={savedProfiles.length}
            />
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Action Header bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl warm-card bg-[#ffffff]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8c7f6e]">Đương số:</span>
                <span className="text-sm font-bold text-[#2d261e]">
                  {chartData.info.name}
                </span>
                <span className="text-[#d8d0bf] text-xs">|</span>
                <span className="text-xs text-[#5e5343] font-medium">
                  {chartData.info.canChiYear} ({chartData.info.nguHanh})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Nút Bật/Tắt Luận Giải AI */}
                <button
                  onClick={() => setIsAiOpen(!isAiOpen)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border cursor-pointer shadow-2xs ${
                    isAiOpen 
                      ? 'bg-[#2d261e] text-white border-[#2d261e]' 
                      : 'bg-[#fef7ee] hover:bg-[#faedd9] text-[#c48b4d] border-[#fbd38d]'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : 'text-[#facc15]'}`} />
                  <span>{isAiOpen ? 'Đang Mở Luận Giải AI' : 'Mở Luận Giải AI'}</span>
                  {isAiLoading ? (
                    <span className="inline-block w-2 h-2 rounded-full bg-[#f59e0b] animate-ping ml-0.5" />
                  ) : analysisText ? (
                    <span className="inline-block w-2 h-2 rounded-full bg-[#10b981] ml-0.5" />
                  ) : null}
                </button>

                <div className="h-4 w-[1px] bg-[#e8e3d7] hidden sm:block"></div>

                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#faf7f0] hover:bg-[#ede7da] text-[#5e5343] flex items-center gap-1.5 transition-colors border border-[#e8e3d7] cursor-pointer"
                >
                  <History className="w-3.5 h-3.5 text-[#c48b4d]" /> Hồ Sơ Đã Lưu
                </button>
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#2d261e] hover:bg-[#453a2e] text-[#ffffff] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Lập Lá Số Khác
                </button>
              </div>
            </div>

            {/* Layout: Khi thu gọn chiều ngang (isAiOpen = false), Bàn lá số mở rộng 100% full width. Khi mở rộng, chia 8/12 và 4/12 */}
            <div className={`grid grid-cols-1 ${isAiOpen ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-6 items-start transition-all duration-300`}>
              {/* Cột Bàn Lá Số */}
              <div className={`${isAiOpen ? 'lg:col-span-8' : 'w-full'} space-y-6 transition-all duration-300`}>
                <TuViBoard
                  chartData={chartData}
                  selectedCungIndex={selectedCungIndex}
                  onSelectCung={(idx) => setSelectedCungIndex(idx)}
                  isLoading={isBoardLoading}
                />
              </div>

              {/* Cột Luận Giải Chi Tiết Của AI (Mở rộng / Thu gọn chiều ngang) */}
              {isAiOpen && (
                <div className="lg:col-span-4 transition-all duration-300">
                  <AiAnalysisView
                    analysisText={analysisText}
                    selectedCung={selectedCung}
                    isLoading={isAiLoading}
                    onClose={() => setIsAiOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* Nút Tab Nổi Cạnh Phải Màn Hình khi đang thu gọn chiều ngang */}
            {!isAiOpen && (
              <button
                onClick={() => setIsAiOpen(true)}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#2d261e] hover:bg-[#43392e] text-white py-3.5 px-2 rounded-l-2xl shadow-2xl flex flex-col items-center gap-2 cursor-pointer transition-all border-l border-t border-b border-[#43392e] group"
                title="Mở bảng Luận Giải Chi Tiết AI"
              >
                <Sparkles className="w-4 h-4 text-[#facc15] group-hover:scale-110 transition-transform" />
                <span className="[writing-mode:vertical-rl] text-[11px] font-extrabold tracking-widest text-[#f8fafc]">
                  LUẬN GIẢI AI
                </span>
                {isAiLoading ? (
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
                ) : analysisText ? (
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                ) : null}
                <ChevronLeft className="w-3.5 h-3.5 text-white/70 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
