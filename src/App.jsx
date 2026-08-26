import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Compass, History, ArrowRightLeft, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

import InputForm from './components/InputForm';
import TuViBoard from './components/TuViBoard';
import AiAnalysisView from './components/AiAnalysisView';
import FloatingChatWidget from './components/FloatingChatWidget';
import HistorySidebar from './components/HistorySidebar';
import CompatibilityView from './components/CompatibilityView';

import { createTuViChart } from './utils/tuViEngine';
import { analyzeTuViWithAI } from './services/aiService';
import { getAllProfiles, saveProfile, deleteProfile, clearAllProfiles } from './utils/historyDb';

export default function App() {
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'compatibility'
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
  const [loading, setLoading] = useState(false);
  const [isBoardLoading, setIsBoardLoading] = useState(false);
  const [selectedCungIndex, setSelectedCungIndex] = useState(null);
  
  // AI Analysis States
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem('tuvi_gemini_api_key') || '';
    } catch (e) {
      return '';
    }
  });
  const [analysisText, setAnalysisText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiAnalysisOpen, setIsAiAnalysisOpen] = useState(false);

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
    setAnalysisText('');
    setIsAiAnalysisOpen(false);

    try {
      // 1. Tự động lưu thông tin form vào IndexedDB
      await saveProfile(data);
      await loadHistoryProfiles();

      // 2. Tạo bàn lá số
      const chart = createTuViChart(data);
      if (requestId !== currentRequestIdRef.current) return;

      setChartData(chart);
      setSelectedCungIndex(chart.menhPos);

      // 3. Khởi chạy Luận giải AI song song (Streaming)
      analyzeTuViWithAI(chart, apiKey, (chunk) => {
        if (requestId === currentRequestIdRef.current) {
          setAnalysisText(chunk);
        }
      }).then((result) => {
        if (requestId === currentRequestIdRef.current && result) {
          setAnalysisText(result);
        }
      }).catch((aiErr) => {
        console.error("AI analysis error:", aiErr);
      }).finally(() => {
        if (requestId === currentRequestIdRef.current) {
          setIsAiLoading(false);
        }
      });

      // Hiệu ứng Shimmer mượt mà cho 12 Cung (400ms) trước khi mở đầy đủ
      await new Promise(resolve => setTimeout(resolve, 400));
      if (requestId !== currentRequestIdRef.current) return;

      setIsBoardLoading(false);
      setLoading(false);

      // Hiệu ứng nhẹ ấm áp
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c48b4d', '#f59e0b', '#d97706', '#fef3c7']
      });
    } catch (err) {
      console.error("Lỗi tạo lá số:", err);
      alert("Đã xảy ra lỗi khi tạo lá số. Xin vui lòng kiểm tra lại thông tin!");
    } finally {
      if (requestId === currentRequestIdRef.current) {
        setLoading(false);
        setIsBoardLoading(false);
      }
    }
  };

  const handleSelectProfileFromHistory = (profile) => {
    currentRequestIdRef.current++;
    setLoading(false);
    setIsBoardLoading(false);
    setIsAiLoading(false);

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

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 w-full space-y-6">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#eee8dc] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fef7ee] border border-[#fbd38d] flex items-center justify-center text-[#c48b4d] shadow-sm">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-[#241e17] tracking-tight">
                Tử Vi Đẩu Số Toàn Thư
              </h1>
              <p className="text-xs text-[#8c7f6e]">
                An sao chính xác 100% theo cổ thư & Thuật số phong thủy tích hợp AI
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1 bg-[#f4eee1] rounded-2xl border border-[#e5decfa]">
            <button
              onClick={() => setActiveTab('single')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'single'
                  ? 'bg-[#241e17] text-white shadow-xs'
                  : 'text-[#6e6456] hover:text-[#241e17]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Lá Số Cá Nhân</span>
            </button>
            <button
              onClick={() => setActiveTab('compatibility')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'compatibility'
                  ? 'bg-[#241e17] text-white shadow-xs'
                  : 'text-[#6e6456] hover:text-[#241e17]'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 text-[#facc15]" />
              <span>So Đôi / Hợp Tuổi</span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] bg-[#fef7ee] text-[#c48b4d] font-bold">
                Mới
              </span>
            </button>
          </div>
        </div>

        {activeTab === 'compatibility' ? (
          <CompatibilityView
            savedProfiles={savedProfiles}
            apiKey={apiKey}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        ) : !chartData ? (
          <div>
            {/* Header intro */}
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2d261e] tracking-tight mb-2">
                Tra Cứu & Lập Lá Số Tử Vi
              </h2>
              <p className="text-sm text-[#786d5e]">
                Thuật toán Tử Vi Đẩu Số cổ truyền giúp tra cứu 12 cung vị, đắc hãm và luận giải chuyên sâu cùng Thầy AI.
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
          <div className="space-y-3">
            {/* Action Header bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl warm-card bg-[#ffffff] border border-[#ded6c7]">
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
                {/* Nút bật tắt Luận Giải AI */}
                <button
                  onClick={() => setIsAiAnalysisOpen(!isAiAnalysisOpen)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border shadow-2xs ${
                    isAiAnalysisOpen
                      ? 'bg-[#2d261e] text-white border-[#2d261e]'
                      : 'bg-[#fef7ee] hover:bg-[#faedd9] text-[#c48b4d] border-[#fbd38d]'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : 'text-[#facc15]'}`} />
                  <span>{isAiAnalysisOpen ? 'Đang Mở Luận Giải AI' : 'Mở Luận Giải AI'}</span>
                  {isAiLoading ? (
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping ml-0.5"></span>
                  ) : analysisText ? (
                    <span className="w-2 h-2 rounded-full bg-[#10b981] ml-0.5"></span>
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

            {/* Layout: Khi thu gọn (isAiAnalysisOpen = false), Bàn lá số mở rộng 100%. Khi mở rộng, chia 8/12 và 4/12 */}
            <div className={`grid grid-cols-1 ${isAiAnalysisOpen ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-6 items-start transition-all duration-300`}>
              {/* Cột Bàn Lá Số */}
              <div className={`${isAiAnalysisOpen ? 'lg:col-span-8' : 'w-full'} space-y-6 transition-all duration-300`}>
                <TuViBoard
                  chartData={chartData}
                  selectedCungIndex={selectedCungIndex}
                  onSelectCung={(idx) => setSelectedCungIndex(idx)}
                  isLoading={isBoardLoading}
                />
              </div>

              {/* Cột Luận Giải Chi Tiết Của AI (Thu gọn sang phải) */}
              {isAiAnalysisOpen && (
                <div className="lg:col-span-4 transition-all duration-300">
                  <AiAnalysisView
                    analysisText={analysisText}
                    selectedCung={chartData.cungList[selectedCungIndex]}
                    isLoading={isAiLoading}
                    onClose={() => setIsAiAnalysisOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* Nút Tab Nổi Cạnh Phải Màn Hình khi đang thu gọn */}
            {!isAiAnalysisOpen && (
              <button
                onClick={() => setIsAiAnalysisOpen(true)}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#2d261e] hover:bg-[#43392e] text-white py-3.5 px-2 rounded-l-2xl shadow-2xl flex flex-col items-center gap-2 cursor-pointer transition-all border-l border-t border-b border-[#43392e] group animate-in slide-in-from-right duration-200"
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

      {/* Trợ Lý AI Chatbot Nổi (Floating Chat Widget) */}
      {chartData && (
        <FloatingChatWidget chartData={chartData} apiKey={apiKey} />
      )}
    </div>
  );
}
