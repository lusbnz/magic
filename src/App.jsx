import React, { useState } from 'react';
import { Sparkles, RefreshCw, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

import InputForm from './components/InputForm';
import TuViBoard from './components/TuViBoard';
import AiAnalysisView from './components/AiAnalysisView';

import { createTuViChart } from './utils/tuViEngine';
import { analyzeTuViWithAI } from './services/aiService';

export default function App() {
  const [chartData, setChartData] = useState(null);
  const [analysisText, setAnalysisText] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedCungIndex, setSelectedCungIndex] = useState(null);

  const handleGenerateChart = async (formData) => {
    setLoading(true);
    setChartData(null);
    setAnalysisText('');

    try {
      // 1. Tạo bàn lá số theo thuật toán
      const chart = createTuViChart(formData);
      setChartData(chart);
      setSelectedCungIndex(chart.menhPos);

      // Hiệu ứng nhẹ ấm áp
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c48b4d', '#f59e0b', '#d97706', '#fef3c7']
      });

      // 2. Gọi AI luận giải
      const aiResult = await analyzeTuViWithAI(chart, apiKey);
      setAnalysisText(aiResult);
    } catch (err) {
      console.error("Lỗi tạo lá số:", err);
      alert("Đã xảy ra lỗi khi tạo lá số. Xin vui lòng kiểm tra lại thông tin!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setChartData(null);
    setAnalysisText('');
    setSelectedCungIndex(null);
  };

  const selectedCung = chartData && selectedCungIndex !== null 
    ? chartData.cungList[selectedCungIndex] 
    : null;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#2d261e] flex flex-col justify-between relative">
      {/* Top Navigation Bar */}
      <nav className="border-b border-[#e8e3d7] bg-[#ffffff]/90 backdrop-blur sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2d261e] flex items-center justify-center text-[#ffffff] font-bold text-sm shadow-sm">
              <Compass className="w-4 h-4 text-[#facc15]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-[#2d261e]">
              Tử Vi <span className="text-xs font-normal text-[#8c7f6e]">/ Đẩu Số Tinh Hoa</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#786d5e] hidden sm:inline-block">
              Hệ thống an sao & hỏi đáp AI tức thì
            </span>
            <div className="h-4 w-[1px] bg-[#e8e3d7] hidden sm:block"></div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#fef7ee] text-[#c48b4d] border border-[#fbd38d] font-semibold">
              Warm Aesthetic
            </span>
          </div>
        </div>
      </nav>

      {/* Main Container Full Width */}
      <div className="w-full px-4 sm:px-6 py-6 sm:py-7 flex-1">
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
              onSubmit={handleGenerateChart}
              loading={loading}
              apiKey={apiKey}
              setApiKey={setApiKey}
            />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Action Header bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl warm-card bg-[#ffffff]">
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

              <button
                onClick={handleReset}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#f7f4ed] hover:bg-[#ede7da] text-[#2d261e] flex items-center gap-1.5 transition-colors border border-[#e8e3d7] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Lập Lá Số Khác
              </button>
            </div>

            {/* Layout 2 cột: Cột trái Bàn Lá Số 12 Cung, Cột phải Luận Giải Chi Tiết AI (Sidebar) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Cột trái (Bàn Lá Số chiếm 8/12 cột) */}
              <div className="lg:col-span-8 space-y-6">
                <TuViBoard
                  chartData={chartData}
                  selectedCungIndex={selectedCungIndex}
                  onSelectCung={(idx) => setSelectedCungIndex(idx)}
                />
              </div>

              {/* Cột phải: Luận Giải Chi Tiết Của AI (Sidebar bám dính sticky, chiếm 4/12 cột) */}
              <div className="lg:col-span-4">
                <AiAnalysisView
                  analysisText={analysisText}
                  selectedCung={selectedCung}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clean Warm Footer */}
      <footer className="border-t border-[#e8e3d7] py-5 bg-[#ffffff] text-center text-xs text-[#8c7f6e] mt-8">
        <div className="w-full px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Tử Vi — Ứng dụng Huyền Học Tinh Hoa & Trí Tuệ Nhân Tạo.</span>
          <span className="text-[#5e5343] font-medium">Ấm áp • Tối giản • Chuẩn xác</span>
        </div>
      </footer>
    </div>
  );
}
