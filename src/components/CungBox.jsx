import React, { useState } from 'react';
import { STAR_DEFINITIONS, CUNG_DEFINITIONS, TRANG_SINH_DEFINITIONS, DAC_TINH_DEFINITIONS } from '../utils/starDefinitions';
import { Info, ShieldAlert, Sparkles, Zap, Lock, Compass, ArrowRightLeft, Triangle, Activity, Calendar, Layers, MapPin } from 'lucide-react';

export default function CungBox({ 
  cungData = {}, 
  isSelected = false, 
  isTamHop = false, 
  isChinhChieu = false, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}) {
  const { 
    chi = '', 
    cungCanChi = '',
    cungElement = '',
    cungTen = '', 
    isMenh = false, 
    isThan = false, 
    daiHan = 0, 
    thangTieuHan = '',
    daiVanText = '',
    luuNienText = '',
    hasTriet = false, 
    hasTuan = false, 
    trangSinh = '', 
    chinhTinh = [], 
    catTinh = [], 
    hungTinh = [],
    luuTinh = []
  } = cungData || {};

  const [hoveredStar, setHoveredStar] = useState(null);
  const [hoveredCung, setHoveredCung] = useState(false);
  const [hoveredDaiHan, setHoveredDaiHan] = useState(false);
  const [hoveredTieuHan, setHoveredTieuHan] = useState(false);
  const [hoveredCanChiCung, setHoveredCanChiCung] = useState(false);
  const [hoveredDaiVan, setHoveredDaiVan] = useState(false);
  const [hoveredLuuNien, setHoveredLuuNien] = useState(false);
  const [hoveredTuần, setHoveredTuần] = useState(false);
  const [hoveredTriệt, setHoveredTriệt] = useState(false);
  const [hoveredMenh, setHoveredMenh] = useState(false);
  const [hoveredThan, setHoveredThan] = useState(false);
  const [hoveredTamHop, setHoveredTamHop] = useState(false);
  const [hoveredChieu, setHoveredChieu] = useState(false);
  const [hoveredTrangSinh, setHoveredTrangSinh] = useState(false);

  const cungMeaning = CUNG_DEFINITIONS[cungTen] || "Một trong 12 cung vị biểu thị phương diện cuộc đời.";
  const isRightEdge = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Mùi'].includes(chi);

  let borderBgClass = 'bg-[#ffffff] border-2 border-[#e2dcd0] hover:border-[#c48b4d]/80 hover:bg-[#fefcf8] shadow-2xs';
  if (isChinhChieu) {
    borderBgClass = 'bg-[#fff1f2] border-2 border-rose-400 shadow-2xs';
  } else if (isTamHop) {
    borderBgClass = 'bg-[#eff6ff] border-2 border-blue-400 shadow-2xs';
  }

  const safeChinhTinh = Array.isArray(chinhTinh) ? chinhTinh : [];
  const safeCatTinh = Array.isArray(catTinh) ? catTinh : [];
  const safeHungTinh = Array.isArray(hungTinh) ? hungTinh : [];
  const safeLuuTinh = Array.isArray(luuTinh) ? luuTinh : [];

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`p-3 rounded-xl cursor-pointer transition-all duration-150 flex flex-col justify-between select-none relative hover:z-30 w-full h-full text-[#241e17] ${borderBgClass}`}
    >
      {/* 1. THANH TRÊN CÙNG: 4 Góc Thông Số (Can Chi Cung + Ngũ Hành | Tuổi Đại Hạn + Tiểu Hạn Tháng) */}
      <div className="flex items-center justify-between border-b border-[#eee8dc] pb-1 mb-1.5 text-[11px]">
        {/* Góc trên trái: Can Chi Cung & Ngũ Hành (Có popover giải nghĩa) */}
        <div 
          className="flex items-center gap-1 font-mono relative cursor-help"
          onMouseEnter={() => setHoveredCanChiCung(true)}
          onMouseLeave={() => setHoveredCanChiCung(false)}
        >
          <span className="font-extrabold text-[#786d5e] hover:text-[#c48b4d]">{cungCanChi || chi}</span>
          <span className="text-[10px] text-[#a89f91] font-medium">{cungElement}</span>

          {hoveredCanChiCung && (
            <div 
              className={`absolute top-6 ${isRightEdge ? 'right-0' : 'left-0'} z-50 w-64 p-3 rounded-xl bg-[#241e17] text-[#ffffff] text-xs shadow-2xl border border-[#43392e] pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-normal`}
              style={{ zIndex: 100 }}
            >
              <div className="font-bold text-[#fde047] mb-1 text-[12px] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> Tọa Vị: Cung {cungCanChi || chi} ({cungElement})
              </div>
              <p className="text-[11px] leading-relaxed text-[#f1f5f9] break-words">
                • <strong>Can Chi Cung:</strong> Thiên Can kết hợp Địa Chi an vị cung này.<br/>
                • <strong>Ngũ Hành ({cungElement}):</strong> Khí chất âm/dương ngũ hành của bản cung, dùng để xét tương sinh/tương khắc với Bản Mệnh và sao tọa thủ.
              </p>
            </div>
          )}
        </div>

        {/* Góc trên phải: Tuổi Đại Hạn & Tháng Tiểu Hạn */}
        <div className="flex items-center gap-1.5 font-mono">
          {/* Tuổi Đại Hạn */}
          <div 
            className="relative cursor-help"
            onMouseEnter={() => setHoveredDaiHan(true)}
            onMouseLeave={() => setHoveredDaiHan(false)}
          >
            <span className="font-bold text-[#c48b4d] hover:underline">
              {daiHan}t
            </span>

            {hoveredDaiHan && (
              <div 
                className={`absolute top-6 right-0 z-50 w-56 p-2.5 rounded-xl bg-[#241e17] text-[#ffffff] text-xs shadow-2xl border border-[#43392e] pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-normal`}
                style={{ zIndex: 100 }}
              >
                <div className="font-bold text-[#fde047] mb-1 text-[12px]">
                  📅 Đại Hạn 10 Năm ({daiHan} - {daiHan + 9} tuổi)
                </div>
                <p className="text-[11px] leading-relaxed text-[#f1f5f9] break-words">
                  Giai đoạn 10 năm cuộc đời của bạn chịu sự chi phối mạnh mẽ nhất bởi các tinh tú tại cung này.
                </p>
              </div>
            )}
          </div>

          {/* Tiểu Hạn Tháng */}
          <div 
            className="relative cursor-help"
            onMouseEnter={() => setHoveredTieuHan(true)}
            onMouseLeave={() => setHoveredTieuHan(false)}
          >
            <span className="text-[10.5px] text-[#6b7280] font-semibold bg-[#f3f4f6] hover:bg-[#e5e7eb] px-1 py-0.2 rounded border border-[#e5e7eb]">
              {thangTieuHan || 'Th.1'}
            </span>

            {hoveredTieuHan && (
              <div 
                className={`absolute top-6 right-0 z-50 w-60 p-2.5 rounded-xl bg-[#241e17] text-[#ffffff] text-xs shadow-2xl border border-[#43392e] pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-normal`}
                style={{ zIndex: 100 }}
              >
                <div className="font-bold text-sky-400 mb-1 text-[12px] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Tiểu Hạn: Tháng {thangTieuHan.replace('Th.', '')} Âm Lịch
                </div>
                <p className="text-[11px] leading-relaxed text-[#f1f5f9] break-words">
                  Vị trí đóng tiểu hạn của <strong>Tháng {thangTieuHan.replace('Th.', '')} Âm Lịch</strong> trong năm xem hạn. Dùng để luận đoán cát hung chi tiết theo từng tháng.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. HEADER TÊN CUNG & CÁC HUY HIỆU (TUẦN / TRIỆT / MỆNH / THÂN) */}
      <div className="flex items-center justify-between pb-1 mb-1.5 gap-1 relative">
        <div className="flex items-center gap-1.5 relative flex-nowrap min-w-0">
          {/* Tên Cung */}
          <div
            className="flex items-center gap-1 relative cursor-help"
            onMouseEnter={() => setHoveredCung(true)}
            onMouseLeave={() => setHoveredCung(false)}
          >
            <span className="text-[14.5px] sm:text-[15.5px] font-black text-[#1a1510] tracking-tight hover:text-[#c48b4d] transition-colors whitespace-nowrap leading-none uppercase">
              {cungTen}
            </span>

            {/* Popover giải thích Cung vị */}
            {hoveredCung && (
              <div 
                className={`absolute top-7 ${isRightEdge ? 'right-0' : 'left-0'} z-50 w-64 p-3 rounded-xl bg-[#241e17] text-[#ffffff] text-xs shadow-2xl border border-[#43392e] pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-normal`}
                style={{ zIndex: 100 }}
              >
                <div className="font-bold text-[#fde047] mb-1 flex items-center gap-1.5 text-[13px]">
                  <Info className="w-3.5 h-3.5 text-[#facc15]" /> Cung {cungTen}
                </div>
                <p className="text-xs leading-relaxed text-[#f1f5f9] break-words">
                  {cungMeaning}
                </p>
              </div>
            )}
          </div>

          {/* Huy hiệu Triệt Không */}
          {hasTriet && (
            <div 
              className="relative cursor-help inline-flex items-center"
              onMouseEnter={() => setHoveredTriệt(true)}
              onMouseLeave={() => setHoveredTriệt(false)}
            >
              <span className="h-5 px-1.5 inline-flex items-center justify-center rounded bg-[#1e293b] hover:bg-[#0f172a] text-white text-[9px] font-black tracking-wider whitespace-nowrap leading-none">
                TRIỆT
              </span>

              {hoveredTriệt && (
                <div 
                  className={`absolute top-6 ${isRightEdge ? 'right-0' : 'left-0'} z-50 w-64 p-3 rounded-xl bg-[#1e293b] text-[#ffffff] text-xs shadow-2xl border border-[#334155] pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-normal`}
                  style={{ zIndex: 100 }}
                >
                  <div className="font-bold text-[#f87171] mb-1 text-[12px] flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Triệt Không (Triệt Lộ Không Vong)
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#f1f5f9] break-words">
                    • <strong>Tác dụng:</strong> Ngăn chặn, làm đảo ngược tính chất của sao đóng tại cung này (Sao tốt giảm tốt, sao xấu giảm xấu).<br/>
                    • <strong>Thời gian:</strong> Tác động mạnh mẽ nhất từ thuở thiếu thời đến trước 30 tuổi (Tiền vận).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Huy hiệu Tuần Không */}
          {hasTuan && (
            <div 
              className="relative cursor-help inline-flex items-center"
              onMouseEnter={() => setHoveredTuần(true)}
              onMouseLeave={() => setHoveredTuần(false)}
            >
              <span className="h-5 px-1.5 inline-flex items-center justify-center rounded bg-[#475569] hover:bg-[#334155] text-amber-200 text-[9px] font-black tracking-wider whitespace-nowrap leading-none">
                TUẦN
              </span>

              {hoveredTuần && (
                <div 
                  className={`absolute top-6 ${isRightEdge ? 'right-0' : 'left-0'} z-50 w-64 p-3 rounded-xl bg-[#334155] text-[#ffffff] text-xs shadow-2xl border border-[#475569] pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-normal`}
                  style={{ zIndex: 100 }}
                >
                  <div className="font-bold text-[#fde047] mb-1 text-[12px] flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Tuần Không (Tuần Trung Không Vong)
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#f1f5f9] break-words">
                    • <strong>Tác dụng:</strong> Bao bọc, làm dịu và làm chậm lại các biến cố trong cung.<br/>
                    • <strong>Thời gian:</strong> Tác động bền bỉ, êm dịu kéo dài suốt cả cuộc đời, càng về hậu vận (sau 30 tuổi) càng rõ nét.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Badge MỆNH / THÂN */}
        <div className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
          {isMenh && (
            <div 
              className="relative cursor-help inline-flex items-center"
              onMouseEnter={() => setHoveredMenh(true)}
              onMouseLeave={() => setHoveredMenh(false)}
            >
              <span className="h-5 px-1.5 inline-flex items-center justify-center rounded bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5] text-[9.5px] font-black whitespace-nowrap leading-none">
                MỆNH
              </span>
              {hoveredMenh && (
                <div 
                  className={`absolute top-6 ${isRightEdge ? 'right-0' : 'left-0'} z-50 w-56 p-2.5 rounded-xl bg-[#241e17] text-[#ffffff] text-xs shadow-2xl border border-[#43392e] pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-normal`}
                  style={{ zIndex: 100 }}
                >
                  <div className="font-bold text-[#f87171] mb-1 text-[12px]">
                    🚩 Cung Mệnh (Gốc rễ bản mệnh)
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#f1f5f9] break-words">
                    Biểu thị tư chất bẩm sinh, cốt cách, diện mạo, tính tình và tổng quan vận mệnh từ lúc sinh ra đến trước năm 30 tuổi.
                  </p>
                </div>
              )}
            </div>
          )}

          {isThan && (
            <div 
              className="relative cursor-help inline-flex items-center"
              onMouseEnter={() => setHoveredThan(true)}
              onMouseLeave={() => setHoveredThan(false)}
            >
              <span className="h-5 px-1.5 inline-flex items-center justify-center rounded bg-[#f3e8ff] text-[#6b21a8] border border-[#d8b4fe] text-[9.5px] font-black whitespace-nowrap leading-none">
                THÂN
              </span>
              {hoveredThan && (
                <div 
                  className={`absolute top-6 ${isRightEdge ? 'right-0' : 'left-0'} z-50 w-56 p-2.5 rounded-xl bg-[#241e17] text-[#ffffff] text-xs shadow-2xl border border-[#43392e] pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-normal`}
                  style={{ zIndex: 100 }}
                >
                  <div className="font-bold text-[#d8b4fe] mb-1 text-[12px]">
                    🌟 Thân Cư Cung (Hậu vận)
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#f1f5f9] break-words">
                    Biểu thị sự nghiệp, hành động thực tế và vận trình cuộc sống sau tuổi 30 (Hậu vận). Cung Thân đóng ở đâu thì tâm huyết của đương số sẽ dồn vào phương diện đó.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. DANH SÁCH 14 CHÍNH TINH */}
      <div className="space-y-1 mb-2">
        {safeChinhTinh.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {safeChinhTinh.map((star, idx) => {
              const def = STAR_DEFINITIONS[star.name];
              const isHovered = hoveredStar === star.name;

              return (
                <div
                  key={idx}
                  className="relative inline-block cursor-help"
                  onMouseEnter={() => setHoveredStar(star.name)}
                  onMouseLeave={() => setHoveredStar(null)}
                >
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-[#ffedd5] text-[#9a3412] border border-[#fed7aa] flex items-center gap-1 hover:bg-[#fed7aa] transition-colors">
                    <span>{star.name}</span>
                    {star.dacTinh && (
                      <span className="text-[10px] text-[#ea580c] font-bold">({star.dacTinh})</span>
                    )}
                  </span>

                  {/* Popover giải thích Sao Chính Tinh */}
                  {isHovered && def && (
                    <div 
                      className={`absolute bottom-full ${isRightEdge ? 'right-0' : 'left-0'} mb-2 z-50 w-72 p-3.5 rounded-xl bg-[#241e17] text-[#ffffff] shadow-2xl border border-[#43392e] pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-normal`}
                      style={{ zIndex: 100 }}
                    >
                      <div className="flex items-center justify-between border-b border-[#3f3529] pb-1.5 mb-2">
                        <span className="font-bold text-[#facc15] text-[13px]">
                          {star.name} {star.dacTinh ? `(${star.dacTinh})` : ''}
                        </span>
                        <span className="text-xs text-[#cbd5e1] font-medium">
                          {def.type}
                        </span>
                      </div>
                      
                      {star.dacTinh && DAC_TINH_DEFINITIONS[star.dacTinh] && (
                        <div className="mb-2 p-1.5 rounded-lg bg-[#2e261d] border border-[#4d3e2d] text-[11px]">
                          <div className="font-bold text-[#fbbf24] flex items-center justify-between">
                            <span>Độ sáng: {star.dacTinh}</span>
                            <span className="text-[10px] text-amber-300 font-normal">
                              {DAC_TINH_DEFINITIONS[star.dacTinh].level}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-[#e2e8f0] mt-0.5 leading-snug">
                            {DAC_TINH_DEFINITIONS[star.dacTinh].meaning}
                          </p>
                        </div>
                      )}

                      <div className="text-xs text-[#6ee7b7] font-semibold mb-1">
                        {def.nature}
                      </div>
                      <p className="text-xs leading-relaxed text-[#f1f5f9] break-words">
                        {def.meaning}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <span className="text-[11.5px] text-[#8c7f6e] italic block py-0.5">Vô chính diệu (Không có chính tinh)</span>
        )}
      </div>

      {/* 4. PHỤ TINH: 2 CỘT CÁT TINH (TRÁI) & HUNG TINH (PHẢI) */}
      <div className="flex-1 grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-[#f0ece1]">
        {/* Cột Cát Tinh (Xanh Lá) */}
        <div className="space-y-0.5">
          {safeCatTinh.map((star, idx) => {
            const def = STAR_DEFINITIONS[star.name];
            const isHovered = hoveredStar === star.name;

            return (
              <div
                key={idx}
                className="relative cursor-help leading-tight"
                onMouseEnter={() => setHoveredStar(star.name)}
                onMouseLeave={() => setHoveredStar(null)}
              >
                <span className={`font-semibold hover:underline flex items-center gap-0.5 ${star.isTuHoa ? 'text-[#b45309] font-black' : 'text-[#047857]'}`}>
                  {star.isTuHoa ? (
                    <>★ {star.name}</>
                  ) : (
                    <span>{star.name}{star.dacTinh ? ` (${star.dacTinh})` : ''}</span>
                  )}
                </span>

                {isHovered && def && (
                  <div 
                    className={`absolute bottom-full ${isRightEdge ? 'right-0' : 'left-0'} mb-2 z-50 w-64 p-3 rounded-xl bg-[#241e17] text-[#ffffff] shadow-2xl border border-[#43392e] pointer-events-none animate-in fade-in duration-150 whitespace-normal`}
                    style={{ zIndex: 100 }}
                  >
                    <div className="font-bold text-[#34d399] text-xs mb-1 flex items-center justify-between">
                      <span>{star.isTuHoa ? `★ ${star.name} (Tứ Hóa Cát)` : star.name}</span>
                      <span className="text-[10.5px] text-slate-300 font-normal">({def.type})</span>
                    </div>
                    <div className="text-[11px] text-[#fde047] font-medium mb-1">
                      {def.nature}
                    </div>
                    <p className="text-xs text-[#f1f5f9] leading-relaxed break-words">
                      {def.meaning}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cột Hung Tinh (Đỏ) */}
        <div className="space-y-0.5 text-right">
          {safeHungTinh.map((star, idx) => {
            const def = STAR_DEFINITIONS[star.name];
            const isHovered = hoveredStar === star.name;

            return (
              <div
                key={idx}
                className="relative cursor-help leading-tight"
                onMouseEnter={() => setHoveredStar(star.name)}
                onMouseLeave={() => setHoveredStar(null)}
              >
                <span className={`font-semibold hover:underline inline-flex items-center gap-0.5 ${star.isTuHoa ? 'text-[#991b1b] font-black' : 'text-[#b91c1c]'}`}>
                  {star.isTuHoa ? (
                    <>⚡ {star.name}</>
                  ) : (
                    <span>{star.name}{star.dacTinh ? ` (${star.dacTinh})` : ''}</span>
                  )}
                </span>

                {isHovered && def && (
                  <div 
                    className="absolute bottom-full right-0 mb-2 z-50 w-64 p-3 rounded-xl bg-[#241e17] text-[#ffffff] shadow-2xl border border-[#43392e] pointer-events-none animate-in fade-in duration-150 text-left whitespace-normal"
                    style={{ zIndex: 100 }}
                  >
                    <div className="font-bold text-[#f87171] text-xs mb-1 flex items-center justify-between">
                      <span>{star.isTuHoa ? `⚡ ${star.name} (Tứ Hóa Kỵ)` : star.name}</span>
                      <span className="text-[10.5px] text-slate-300 font-normal">({def.type})</span>
                    </div>
                    <div className="text-[11px] text-[#fca5a5] font-medium mb-1">
                      {def.nature}
                    </div>
                    <p className="text-xs text-[#f1f5f9] leading-relaxed break-words">
                      {def.meaning}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. BỘ SAO LƯU NIÊN (L.) NĂM XEM HẠN (Có Tooltip Giải Nghĩa) */}
      {safeLuuTinh.length > 0 && (
        <div className="pt-1 mt-1 border-t border-dashed border-[#e6dfd1] flex flex-wrap gap-1 text-[10.5px]">
          {safeLuuTinh.map((lStar, idx) => {
            const def = STAR_DEFINITIONS[lStar.name];
            const isHovered = hoveredStar === lStar.name;

            return (
              <div 
                key={idx} 
                className="relative cursor-help"
                onMouseEnter={() => setHoveredStar(lStar.name)}
                onMouseLeave={() => setHoveredStar(null)}
              >
                <span 
                  className={`font-mono font-bold px-1 rounded hover:underline ${lStar.isHung ? 'text-[#dc2626] bg-[#fef2f2] border border-[#fecaca]' : 'text-[#2563eb] bg-[#eff6ff] border border-[#bfdbfe]'}`}
                >
                  {lStar.name}
                </span>

                {isHovered && def && (
                  <div 
                    className={`absolute bottom-full ${isRightEdge ? 'right-0' : 'left-0'} mb-2 z-50 w-64 p-3 rounded-xl bg-[#241e17] text-[#ffffff] shadow-2xl border border-[#43392e] pointer-events-none animate-in fade-in duration-150 whitespace-normal`}
                    style={{ zIndex: 100 }}
                  >
                    <div className="font-bold text-amber-300 text-xs mb-1 flex items-center justify-between">
                      <span>{lStar.name}</span>
                      <span className="text-[10px] text-slate-300 font-normal">({def.type})</span>
                    </div>
                    <div className="text-[11px] text-[#6ee7b7] font-medium mb-1">
                      {def.nature}
                    </div>
                    <p className="text-xs text-[#f1f5f9] leading-relaxed break-words">
                      {def.meaning}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 6. FOOTER CUNG: 2 Góc Dưới (ĐV. Cung | Vòng Tràng Sinh + Chiếu | LN. Cung) */}
      <div className="border-t border-[#f0ece1] pt-1.5 mt-1.5 flex items-center justify-between text-[11px] text-[#786d5e] min-h-[22px]">
        {/* Góc dưới trái: Đại Vận Cung (ĐV.NÔ, ĐV.PHÚC) */}
        <div 
          className="relative cursor-help"
          onMouseEnter={() => setHoveredDaiVan(true)}
          onMouseLeave={() => setHoveredDaiVan(false)}
        >
          <span className="text-[10px] font-mono font-bold text-[#9ca3af] hover:text-[#4b5563]">
            {daiVanText}
          </span>

          {hoveredDaiVan && (
            <div 
              className={`absolute bottom-full left-0 mb-2 z-50 w-60 p-2.5 rounded-xl bg-[#241e17] text-[#ffffff] text-xs shadow-2xl border border-[#43392e] pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-normal`}
              style={{ zIndex: 100 }}
            >
              <div className="font-bold text-amber-300 mb-1 text-[12px] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Đại Vận Cung: {daiVanText}
              </div>
              <p className="text-[11px] leading-relaxed text-[#f1f5f9] break-words">
                Biểu thị cung vị gốc tương ứng của <strong>Đại Vận 10 năm</strong>. Dùng để đối chiếu tương tác giữa Bản Cung và Đại Hạn.
              </p>
            </div>
          )}
        </div>

        {/* Trọng tâm: Vòng Tràng Sinh */}
        <div 
          className="relative cursor-help"
          onMouseEnter={() => setHoveredTrangSinh(true)}
          onMouseLeave={() => setHoveredTrangSinh(false)}
        >
          <span className="font-semibold text-[#5e5343] hover:text-[#c48b4d] transition-colors flex items-center gap-1">
            {trangSinh || 'Tràng Sinh'}
          </span>

          {hoveredTrangSinh && TRANG_SINH_DEFINITIONS[trangSinh || 'Tràng Sinh'] && (
            <div 
              className={`absolute bottom-full ${isRightEdge ? 'right-0' : 'left-0'} mb-2 z-50 w-64 p-3 rounded-xl bg-[#241e17] text-[#ffffff] text-xs shadow-2xl border border-[#43392e] pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-normal`}
              style={{ zIndex: 100 }}
            >
              <div className="font-bold text-[#fde047] mb-1 text-[12px] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Vòng Tràng Sinh: {trangSinh || 'Tràng Sinh'}
              </div>
              <div className="text-[11px] text-emerald-300 font-semibold mb-1">
                {TRANG_SINH_DEFINITIONS[trangSinh || 'Tràng Sinh'].nature}
              </div>
              <p className="text-[11px] leading-relaxed text-[#f1f5f9] break-words">
                {TRANG_SINH_DEFINITIONS[trangSinh || 'Tràng Sinh'].meaning}
              </p>
            </div>
          )}
        </div>
        
        {/* Góc dưới phải: Trạng thái Chiếu hoặc Lưu Niên Cung (LN.PHỐI, LN.HUYNH) */}
        {isChinhChieu ? (
          <div 
            className="relative cursor-help"
            onMouseEnter={() => setHoveredChieu(true)}
            onMouseLeave={() => setHoveredChieu(false)}
          >
            <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-1 py-0.2 rounded border border-rose-200 hover:bg-rose-100 transition-colors">
              ● Chiếu
            </span>
          </div>
        ) : isTamHop ? (
          <div 
            className="relative cursor-help"
            onMouseEnter={() => setHoveredTamHop(true)}
            onMouseLeave={() => setHoveredTamHop(false)}
          >
            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-1 py-0.2 rounded border border-blue-200 hover:bg-blue-100 transition-colors">
              ▲ Hợp
            </span>
          </div>
        ) : (
          <div 
            className="relative cursor-help"
            onMouseEnter={() => setHoveredLuuNien(true)}
            onMouseLeave={() => setHoveredLuuNien(false)}
          >
            <span className="text-[10px] font-mono font-bold text-[#9ca3af] hover:text-[#4b5563]">
              {luuNienText}
            </span>

            {hoveredLuuNien && (
              <div 
                className={`absolute bottom-full right-0 mb-2 z-50 w-60 p-2.5 rounded-xl bg-[#241e17] text-[#ffffff] text-xs shadow-2xl border border-[#43392e] pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-normal`}
                style={{ zIndex: 100 }}
              >
                <div className="font-bold text-sky-400 mb-1 text-[12px] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Lưu Niên Cung: {luuNienText}
                </div>
                <p className="text-[11px] leading-relaxed text-[#f1f5f9] break-words">
                  Vị trí cung vị của <strong>Lưu Niên 1 năm hiện tại</strong>. Dùng để xem tiểu hạn các sự việc phát sinh trong năm xem vận hạn.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
