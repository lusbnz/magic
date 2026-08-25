import React, { useState, useRef, useEffect } from 'react';
import CungBox from './CungBox';

export default function TuViBoard({ chartData, selectedCungIndex, onSelectCung, isLoading = false }) {
  // Skeleton Shimmer Loading State cho Thiên Bàn 12 Cung & Trung Cung
  if (isLoading || !chartData) {
    const skeletonCungPositions = [5, 6, 7, 8, 4, 9, 3, 10, 2, 1, 0, 11];
    return (
      <div className="warm-card p-4 sm:p-6 mb-6 relative">
        {/* Header Loading */}
        <div className="flex flex-col border-b border-[#eee8dc] pb-3 mb-4 gap-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#241e17] tracking-tight">
                  Thiên Bàn 12 Cung & Mối Quan Hệ Chiếu Mệnh
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fef7ee] text-[#c48b4d] border border-[#fbd38d] animate-pulse">
                  Đang an sao & đối chiếu...
                </span>
              </div>
              <p className="text-xs text-[#6e6456]">
                Hệ thống đang thiết lập tọa độ 12 Cung và các luồng liên kết Tam Hợp / Chính Chiếu
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-6 w-20 rounded bg-[#eff6ff] border border-blue-200 animate-pulse"></div>
              <div className="h-6 w-24 rounded bg-[#fff1f2] border border-rose-200 animate-pulse"></div>
            </div>
          </div>
          {/* Skeleton Legend */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#f2ece1]">
            <div className="h-4 w-16 bg-[#ede5d4] rounded animate-pulse"></div>
            <div className="h-4 w-28 bg-[#ecfdf5] rounded animate-pulse"></div>
            <div className="h-4 w-28 bg-[#fef2f2] rounded animate-pulse"></div>
            <div className="h-4 w-28 bg-[#fffbeb] rounded animate-pulse"></div>
          </div>
        </div>

        {/* Grid 4x4 Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 relative z-0 items-stretch">
          {/* Hàng 1: 4 Cung trên (Tỵ, Ngọ, Mùi, Thân) */}
          {[5, 6, 7, 8].map((idx) => (
            <div key={`skel-${idx}`} className="p-3 rounded-xl border-2 border-[#e8e2d5] bg-[#faf7f0] flex flex-col justify-between h-48 shimmer-card">
              <div className="flex justify-between items-center pb-1.5 border-b border-[#eee8dc]">
                <div className="h-3.5 w-14 bg-[#ede5d4] rounded-md shimmer-wave"></div>
                <div className="h-3.5 w-10 bg-[#ede5d4] rounded-md shimmer-wave"></div>
              </div>
              <div className="my-auto space-y-2">
                <div className="h-5 w-24 mx-auto bg-[#e5decfa] rounded shimmer-wave"></div>
                <div className="h-4 w-20 mx-auto bg-[#fed7aa] rounded shimmer-wave"></div>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <div className="h-3 w-full bg-[#d1fae5] rounded shimmer-wave"></div>
                  <div className="h-3 w-full bg-[#fee2e2] rounded shimmer-wave"></div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-[#eee8dc]">
                <div className="h-3 w-12 bg-[#ede5d4] rounded shimmer-wave"></div>
                <div className="h-3 w-12 bg-[#ede5d4] rounded shimmer-wave"></div>
              </div>
            </div>
          ))}

          {/* Hàng 2: Thìn, TRUNG CUNG (col-span-2 row-span-2), Dậu */}
          <div className="p-3 rounded-xl border-2 border-[#e8e2d5] bg-[#faf7f0] flex flex-col justify-between h-48 shimmer-card">
            <div className="flex justify-between items-center pb-1.5 border-b border-[#eee8dc]">
              <div className="h-3.5 w-14 bg-[#ede5d4] rounded-md shimmer-wave"></div>
              <div className="h-3.5 w-10 bg-[#ede5d4] rounded-md shimmer-wave"></div>
            </div>
            <div className="my-auto space-y-2">
              <div className="h-5 w-24 mx-auto bg-[#e5decfa] rounded shimmer-wave"></div>
              <div className="h-4 w-20 mx-auto bg-[#fed7aa] rounded shimmer-wave"></div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <div className="h-3 w-full bg-[#d1fae5] rounded shimmer-wave"></div>
                <div className="h-3 w-full bg-[#fee2e2] rounded shimmer-wave"></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-[#eee8dc]">
              <div className="h-3 w-12 bg-[#ede5d4] rounded shimmer-wave"></div>
              <div className="h-3 w-12 bg-[#ede5d4] rounded shimmer-wave"></div>
            </div>
          </div>

          {/* TRUNG CUNG SKELETON (2x2) */}
          <div className="md:col-span-2 md:row-span-2 rounded-2xl bg-[#faf7f0] border-2 border-[#ded6c7] p-5 flex flex-col justify-between text-center relative shadow-xs shimmer-card min-h-[380px]">
            <div className="space-y-2">
              <div className="h-3.5 w-40 mx-auto bg-[#fde68a] rounded-md shimmer-wave"></div>
              <div className="h-7 w-52 mx-auto bg-[#ede5d4] rounded-lg shimmer-wave"></div>
              <div className="h-5 w-64 mx-auto bg-[#eee7d8] rounded-full shimmer-wave"></div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-3 pt-3 border-t border-[#e5decfa]">
              {[...Array(8)].map((_, i) => (
                <div key={`tc-skel-${i}`} className="h-4 bg-[#ede5d4] rounded shimmer-wave"></div>
              ))}
              <div className="col-span-2 h-5 bg-[#f4eee1] rounded shimmer-wave"></div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#e5decfa]">
              <div className="h-4 w-28 bg-[#ede5d4] rounded shimmer-wave"></div>
              <div className="h-3 w-36 bg-[#ede5d4] rounded shimmer-wave"></div>
            </div>
          </div>

          {/* Dậu */}
          <div className="p-3 rounded-xl border-2 border-[#e8e2d5] bg-[#faf7f0] flex flex-col justify-between h-48 shimmer-card">
            <div className="flex justify-between items-center pb-1.5 border-b border-[#eee8dc]">
              <div className="h-3.5 w-14 bg-[#ede5d4] rounded-md shimmer-wave"></div>
              <div className="h-3.5 w-10 bg-[#ede5d4] rounded-md shimmer-wave"></div>
            </div>
            <div className="my-auto space-y-2">
              <div className="h-5 w-24 mx-auto bg-[#e5decfa] rounded shimmer-wave"></div>
              <div className="h-4 w-20 mx-auto bg-[#fed7aa] rounded shimmer-wave"></div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <div className="h-3 w-full bg-[#d1fae5] rounded shimmer-wave"></div>
                <div className="h-3 w-full bg-[#fee2e2] rounded shimmer-wave"></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-[#eee8dc]">
              <div className="h-3 w-12 bg-[#ede5d4] rounded shimmer-wave"></div>
              <div className="h-3 w-12 bg-[#ede5d4] rounded shimmer-wave"></div>
            </div>
          </div>

          {/* Hàng 3: Mão, Tuất */}
          {[3, 10].map((idx) => (
            <div key={`skel-${idx}`} className="p-3 rounded-xl border-2 border-[#e8e2d5] bg-[#faf7f0] flex flex-col justify-between h-48 shimmer-card">
              <div className="flex justify-between items-center pb-1.5 border-b border-[#eee8dc]">
                <div className="h-3.5 w-14 bg-[#ede5d4] rounded-md shimmer-wave"></div>
                <div className="h-3.5 w-10 bg-[#ede5d4] rounded-md shimmer-wave"></div>
              </div>
              <div className="my-auto space-y-2">
                <div className="h-5 w-24 mx-auto bg-[#e5decfa] rounded shimmer-wave"></div>
                <div className="h-4 w-20 mx-auto bg-[#fed7aa] rounded shimmer-wave"></div>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <div className="h-3 w-full bg-[#d1fae5] rounded shimmer-wave"></div>
                  <div className="h-3 w-full bg-[#fee2e2] rounded shimmer-wave"></div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-[#eee8dc]">
                <div className="h-3 w-12 bg-[#ede5d4] rounded shimmer-wave"></div>
                <div className="h-3 w-12 bg-[#ede5d4] rounded shimmer-wave"></div>
              </div>
            </div>
          ))}

          {/* Hàng 4: Dần, Sửu, Tý, Hợi */}
          {[2, 1, 0, 11].map((idx) => (
            <div key={`skel-${idx}`} className="p-3 rounded-xl border-2 border-[#e8e2d5] bg-[#faf7f0] flex flex-col justify-between h-48 shimmer-card">
              <div className="flex justify-between items-center pb-1.5 border-b border-[#eee8dc]">
                <div className="h-3.5 w-14 bg-[#ede5d4] rounded-md shimmer-wave"></div>
                <div className="h-3.5 w-10 bg-[#ede5d4] rounded-md shimmer-wave"></div>
              </div>
              <div className="my-auto space-y-2">
                <div className="h-5 w-24 mx-auto bg-[#e5decfa] rounded shimmer-wave"></div>
                <div className="h-4 w-20 mx-auto bg-[#fed7aa] rounded shimmer-wave"></div>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <div className="h-3 w-full bg-[#d1fae5] rounded shimmer-wave"></div>
                  <div className="h-3 w-full bg-[#fee2e2] rounded shimmer-wave"></div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-[#eee8dc]">
                <div className="h-3 w-12 bg-[#ede5d4] rounded shimmer-wave"></div>
                <div className="h-3 w-12 bg-[#ede5d4] rounded shimmer-wave"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { info, cungList } = chartData;
  const [hoveredCungIdx, setHoveredCungIdx] = useState(null);
  
  const containerRef = useRef(null);
  const cungRefs = useRef({});

  // Cung đang active (khi hover)
  const activeCungIdx = hoveredCungIdx;
  const activeCung = activeCungIdx !== null ? cungList[activeCungIdx] : null;

  const tamHopSet = activeCung ? new Set(activeCung.tamHopIndices) : new Set();
  const chinhChieuIdx = activeCung ? activeCung.chinhChieuIndex : null;

  // Tính tọa độ pixel thực tế của điểm tiếp giáp mép ngoài (Edge Intersection Point)
  const getBoxEdgePoint = (fromIdx, toIdx) => {
    if (!containerRef.current) return null;
    const cRect = containerRef.current.getBoundingClientRect();
    const elFrom = cungRefs.current[fromIdx];
    const elTo = cungRefs.current[toIdx];
    if (!elFrom || !elTo) return null;

    const rFrom = elFrom.getBoundingClientRect();
    const rTo = elTo.getBoundingClientRect();

    // Tọa độ tâm của box From và box To tính tương đối theo container
    const cFrom = {
      x: rFrom.left + rFrom.width / 2 - cRect.left,
      y: rFrom.top + rFrom.height / 2 - cRect.top
    };
    const cTo = {
      x: rTo.left + rTo.width / 2 - cRect.left,
      y: rTo.top + rTo.height / 2 - cRect.top
    };

    const dx = cTo.x - cFrom.x;
    const dy = cTo.y - cFrom.y;
    if (dx === 0 && dy === 0) return cFrom;

    const halfW = rFrom.width / 2;
    const halfH = rFrom.height / 2;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    let scale;
    if (absDx * halfH > absDy * halfW) {
      scale = halfW / absDx;
    } else {
      scale = halfH / absDy;
    }

    return {
      x: cFrom.x + dx * scale,
      y: cFrom.y + dy * scale
    };
  };

  // Tính đường Chính Chiếu
  let chieuLine = null;
  if (activeCungIdx !== null && chinhChieuIdx !== null) {
    const p1 = getBoxEdgePoint(activeCungIdx, chinhChieuIdx);
    const p2 = getBoxEdgePoint(chinhChieuIdx, activeCungIdx);
    if (p1 && p2) {
      chieuLine = { p1, p2 };
    }
  }

  // Tính 3 đường Tam Hợp
  let tamHopLines = [];
  if (activeCung && activeCung.tamHopIndices && activeCung.tamHopIndices.length === 2) {
    const i0 = activeCungIdx;
    const i1 = activeCung.tamHopIndices[0];
    const i2 = activeCung.tamHopIndices[1];

    const p01_start = getBoxEdgePoint(i0, i1);
    const p01_end = getBoxEdgePoint(i1, i0);
    if (p01_start && p01_end) tamHopLines.push({ p1: p01_start, p2: p01_end });

    const p12_start = getBoxEdgePoint(i1, i2);
    const p12_end = getBoxEdgePoint(i2, i1);
    if (p12_start && p12_end) tamHopLines.push({ p1: p12_start, p2: p12_end });

    const p20_start = getBoxEdgePoint(i2, i0);
    const p20_end = getBoxEdgePoint(i0, i2);
    if (p20_start && p20_end) tamHopLines.push({ p1: p20_start, p2: p20_end });
  }

  return (
    <div className="warm-card p-4 sm:p-6 mb-6 relative">
      {/* Header */}
      <div className="flex flex-col border-b border-[#eee8dc] pb-3 mb-4 gap-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#241e17] tracking-tight">
              Thiên Bàn 12 Cung & Mối Quan Hệ Chiếu Mệnh
            </h3>
            <p className="text-xs text-[#6e6456]">
              Rê chuột vào cung bất kỳ để xem các đường nối <strong className="text-blue-600">Tam Hợp</strong> và <strong className="text-rose-600">Chính Chiếu</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
            <span className="flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              <span className="w-2 h-0.5 bg-blue-600 inline-block"></span> Tam Hợp
            </span>
            <span className="flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              <span className="w-2 h-0.5 bg-rose-600 inline-block"></span> Chính Chiếu
            </span>
          </div>
        </div>

        {/* Thanh Chú Thích Ký Hiệu Trực Quan (Legend Bar) để người xem hiểu ngay */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-[#f2ece1] text-[11px] text-[#6b5f4f]">
          <span className="font-bold text-[#423728] flex items-center gap-1">
            📌 Chú thích:
          </span>
          <span className="flex items-center gap-1">
            <strong className="text-[#047857] font-bold bg-[#ecfdf5] px-1 rounded border border-[#a7f3d0]">+Sao</strong> Cát tinh (May mắn, trợ lực)
          </span>
          <span className="flex items-center gap-1">
            <strong className="text-[#b91c1c] font-bold bg-[#fef2f2] px-1 rounded border border-[#fecaca]">-Sao</strong> Hung sát tinh (Thử thách)
          </span>
          <span className="flex items-center gap-1">
            <strong className="text-[#b45309] font-bold bg-[#fffbeb] px-1 rounded border border-[#fde68a]">★ Sao</strong> Tứ Hóa Cát (Lộc/Quyền/Khoa)
          </span>
          <span className="flex items-center gap-1">
            <strong className="text-[#991b1b] font-bold bg-[#fef2f2] px-1 rounded border border-[#fecaca]">⚡ Hóa Kỵ</strong> Trắc trở, thị phi
          </span>
          <span className="flex items-center gap-1">
            <strong className="text-[#9a3412] font-bold bg-[#ffedd5] px-1 rounded border border-[#fed7aa]">(Miếu/Vượng/Hãm)</strong> Độ sáng & Uy lực
          </span>
        </div>
      </div>

      {/* Vùng Grid bàn cờ 4x4 */}
      <div ref={containerRef} className="relative z-0">
        {/* Lớp SVG hiển thị đường nối: Nằm TRÊN các Card và TRUNG CUNG (z-10), nhưng DƯỚI Tooltip (z-30 / z-50) */}
        {activeCung && (
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block" 
            style={{ overflow: 'visible' }}
          >
            {/* 3 Đường nối Tam Hợp (Màu xanh dương mờ nhẹ nhàng, thanh mảnh) */}
            {tamHopLines.map((line, idx) => (
              <line
                key={`tamhop-${idx}`}
                x1={line.p1.x}
                y1={line.p1.y}
                x2={line.p2.x}
                y2={line.p2.y}
                stroke="#2563eb"
                strokeWidth="1.2"
                strokeDasharray="4,4"
                strokeLinecap="round"
                opacity="0.28"
              />
            ))}

            {/* Đường nối Chính Chiếu (Màu đỏ Rose mờ nhẹ nhàng, thanh mảnh) */}
            {chieuLine && (
              <line
                x1={chieuLine.p1.x}
                y1={chieuLine.p1.y}
                x2={chieuLine.p2.x}
                y2={chieuLine.p2.y}
                stroke="#e11d48"
                strokeWidth="1.2"
                strokeDasharray="5,5"
                strokeLinecap="round"
                opacity="0.28"
              />
            )}
          </svg>
        )}

        {/* Bàn 12 Cung Grid 4x4: Đặt z-0 cho grid chung */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 relative z-0 items-stretch">
          {/* Hàng 1: Tỵ (5), Ngọ (6), Mùi (7), Thân (8) */}
          <div 
            ref={el => cungRefs.current[5] = el} 
            className={`flex relative ${hoveredCungIdx === 5 ? 'z-30' : 'z-0'}`}
          >
            <CungBox
              cungData={cungList[5]}
              isSelected={selectedCungIndex === 5}
              isTamHop={tamHopSet.has(5)}
              isChinhChieu={chinhChieuIdx === 5}
              onClick={() => onSelectCung(5)}
              onMouseEnter={() => setHoveredCungIdx(5)}
              onMouseLeave={() => setHoveredCungIdx(null)}
            />
          </div>
          <div 
            ref={el => cungRefs.current[6] = el} 
            className={`flex relative ${hoveredCungIdx === 6 ? 'z-30' : 'z-0'}`}
          >
            <CungBox
              cungData={cungList[6]}
              isSelected={selectedCungIndex === 6}
              isTamHop={tamHopSet.has(6)}
              isChinhChieu={chinhChieuIdx === 6}
              onClick={() => onSelectCung(6)}
              onMouseEnter={() => setHoveredCungIdx(6)}
              onMouseLeave={() => setHoveredCungIdx(null)}
            />
          </div>
          <div 
            ref={el => cungRefs.current[7] = el} 
            className={`flex relative ${hoveredCungIdx === 7 ? 'z-30' : 'z-0'}`}
          >
            <CungBox
              cungData={cungList[7]}
              isSelected={selectedCungIndex === 7}
              isTamHop={tamHopSet.has(7)}
              isChinhChieu={chinhChieuIdx === 7}
              onClick={() => onSelectCung(7)}
              onMouseEnter={() => setHoveredCungIdx(7)}
              onMouseLeave={() => setHoveredCungIdx(null)}
            />
          </div>
          <div 
            ref={el => cungRefs.current[8] = el} 
            className={`flex relative ${hoveredCungIdx === 8 ? 'z-30' : 'z-0'}`}
          >
            <CungBox
              cungData={cungList[8]}
              isSelected={selectedCungIndex === 8}
              isTamHop={tamHopSet.has(8)}
              isChinhChieu={chinhChieuIdx === 8}
              onClick={() => onSelectCung(8)}
              onMouseEnter={() => setHoveredCungIdx(8)}
              onMouseLeave={() => setHoveredCungIdx(null)}
            />
          </div>

          {/* Hàng 2: Thìn (4), TRUNG CUNG (col-span-2 row-span-2), Dậu (9) */}
          <div 
            ref={el => cungRefs.current[4] = el} 
            className={`flex relative ${hoveredCungIdx === 4 ? 'z-30' : 'z-0'}`}
          >
            <CungBox
              cungData={cungList[4]}
              isSelected={selectedCungIndex === 4}
              isTamHop={tamHopSet.has(4)}
              isChinhChieu={chinhChieuIdx === 4}
              onClick={() => onSelectCung(4)}
              onMouseEnter={() => setHoveredCungIdx(4)}
              onMouseLeave={() => setHoveredCungIdx(null)}
            />
          </div>

          {/* TRUNG CUNG (Thiên Bàn Thông Tin Trung Tâm - Chuẩn mực đầy đủ) */}
          <div className="md:col-span-2 md:row-span-2 rounded-2xl bg-[#faf7f0] border-2 border-[#ded6c7] p-4 sm:p-5 flex flex-col justify-between text-center relative shadow-xs z-0">
            <div>
              <span className="text-[11px] font-black text-[#c48b4d] uppercase tracking-wider block mb-0.5">
                LÁ SỐ TỬ VI ĐẨU SỐ TOÀN THƯ
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-[#1a1510] tracking-tight mb-1">
                {info.name}
              </h4>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#eee7d8] text-[#4d4234] text-xs font-bold border border-[#ddd3c1]">
                <span>{info.amDuongGender || info.gender}</span>
                <span>•</span>
                <span>Năm: {info.canChiYear}</span>
                <span>•</span>
                <span>Tháng: {info.canChiMonth}</span>
              </div>
            </div>

            {/* Bảng Chi Tiết Sinh Thần Bát Tự & Cân Lượng */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-left my-2 pt-2.5 border-t border-[#e5decfa] text-xs sm:text-[12.5px] text-[#382f25]">
              <div>
                <span className="text-[#786d5e]">Dương Lịch:</span> <strong className="text-[#241e17] font-bold ml-1">{info.solarDate}</strong>
              </div>
              <div>
                <span className="text-[#786d5e]">Giờ Sinh:</span> <strong className="text-[#241e17] font-bold ml-1">{info.canChiHour}</strong>
              </div>
              <div>
                <span className="text-[#786d5e]">Âm Lịch:</span> <strong className="text-[#241e17] font-bold ml-1">{info.lunarDate}</strong>
              </div>
              <div>
                <span className="text-[#786d5e]">Ngày Can Chi:</span> <strong className="text-[#241e17] font-bold ml-1">{info.canChiDay}</strong>
              </div>
              <div>
                <span className="text-[#786d5e]">Bản Mệnh:</span> <strong className="text-[#c2410c] font-black ml-1">{info.nguHanh}</strong>
              </div>
              <div>
                <span className="text-[#786d5e]">Cục:</span> <strong className="text-[#241e17] font-bold ml-1">{info.cucName}</strong>
              </div>
              <div className="col-span-2 text-[11.5px] bg-[#f4eee1] px-2 py-0.5 rounded text-[#5c4e3c] font-medium">
                <span>Quan hệ Mệnh Cục: </span><strong className="text-[#241e17] font-bold">{info.cucMenhRelation}</strong>
              </div>
              <div>
                <span className="text-[#786d5e]">Cân Lượng:</span> <strong className="text-[#b45309] font-black ml-1">{info.canLuongText || '3 lượng 7 chỉ'}</strong>
              </div>
              <div>
                <span className="text-[#786d5e]">Lai Nhân Cung:</span> <strong className="text-[#4f46e5] font-black ml-1">{info.laiNhanCung || 'Mệnh'}</strong>
              </div>
              <div>
                <span className="text-[#786d5e]">Chủ Mệnh:</span> <strong className="text-[#047857] font-bold ml-1">{info.chuMenh}</strong>
              </div>
              <div>
                <span className="text-[#786d5e]">Chủ Thân:</span> <strong className="text-[#2563eb] font-bold ml-1">{info.chuThan}</strong>
              </div>
            </div>

            <div className="text-xs text-[#786d5e] border-t border-[#e5decfa] pt-1.5 font-medium flex justify-between items-center">
              <span>Năm xem: <strong className="text-[#c48b4d]">{info.viewYearCanChi || info.viewYear}</strong></span>
              <span className="text-[11px] text-[#a89f91]">Đầy đủ 100+ Tinh Tú & Lưu Hạn L.</span>
            </div>
          </div>

          <div 
            ref={el => cungRefs.current[9] = el} 
            className={`flex relative ${hoveredCungIdx === 9 ? 'z-30' : 'z-0'}`}
          >
            <CungBox
              cungData={cungList[9]}
              isSelected={selectedCungIndex === 9}
              isTamHop={tamHopSet.has(9)}
              isChinhChieu={chinhChieuIdx === 9}
              onClick={() => onSelectCung(9)}
              onMouseEnter={() => setHoveredCungIdx(9)}
              onMouseLeave={() => setHoveredCungIdx(null)}
            />
          </div>

          {/* Hàng 3: Mão (3), Tuất (10) */}
          <div 
            ref={el => cungRefs.current[3] = el} 
            className={`flex relative ${hoveredCungIdx === 3 ? 'z-30' : 'z-0'}`}
          >
            <CungBox
              cungData={cungList[3]}
              isSelected={selectedCungIndex === 3}
              isTamHop={tamHopSet.has(3)}
              isChinhChieu={chinhChieuIdx === 3}
              onClick={() => onSelectCung(3)}
              onMouseEnter={() => setHoveredCungIdx(3)}
              onMouseLeave={() => setHoveredCungIdx(null)}
            />
          </div>
          <div 
            ref={el => cungRefs.current[10] = el} 
            className={`flex relative ${hoveredCungIdx === 10 ? 'z-30' : 'z-0'}`}
          >
            <CungBox
              cungData={cungList[10]}
              isSelected={selectedCungIndex === 10}
              isTamHop={tamHopSet.has(10)}
              isChinhChieu={chinhChieuIdx === 10}
              onClick={() => onSelectCung(10)}
              onMouseEnter={() => setHoveredCungIdx(10)}
              onMouseLeave={() => setHoveredCungIdx(null)}
            />
          </div>

          {/* Hàng 4: Dần (2), Sửu (1), Tý (0), Hợi (11) */}
          <div 
            ref={el => cungRefs.current[2] = el} 
            className={`flex relative ${hoveredCungIdx === 2 ? 'z-30' : 'z-0'}`}
          >
            <CungBox
              cungData={cungList[2]}
              isSelected={selectedCungIndex === 2}
              isTamHop={tamHopSet.has(2)}
              isChinhChieu={chinhChieuIdx === 2}
              onClick={() => onSelectCung(2)}
              onMouseEnter={() => setHoveredCungIdx(2)}
              onMouseLeave={() => setHoveredCungIdx(null)}
            />
          </div>
          <div 
            ref={el => cungRefs.current[1] = el} 
            className={`flex relative ${hoveredCungIdx === 1 ? 'z-30' : 'z-0'}`}
          >
            <CungBox
              cungData={cungList[1]}
              isSelected={selectedCungIndex === 1}
              isTamHop={tamHopSet.has(1)}
              isChinhChieu={chinhChieuIdx === 1}
              onClick={() => onSelectCung(1)}
              onMouseEnter={() => setHoveredCungIdx(1)}
              onMouseLeave={() => setHoveredCungIdx(null)}
            />
          </div>
          <div 
            ref={el => cungRefs.current[0] = el} 
            className={`flex relative ${hoveredCungIdx === 0 ? 'z-30' : 'z-0'}`}
          >
            <CungBox
              cungData={cungList[0]}
              isSelected={selectedCungIndex === 0}
              isTamHop={tamHopSet.has(0)}
              isChinhChieu={chinhChieuIdx === 0}
              onClick={() => onSelectCung(0)}
              onMouseEnter={() => setHoveredCungIdx(0)}
              onMouseLeave={() => setHoveredCungIdx(null)}
            />
          </div>
          <div 
            ref={el => cungRefs.current[11] = el} 
            className={`flex relative ${hoveredCungIdx === 11 ? 'z-30' : 'z-0'}`}
          >
            <CungBox
              cungData={cungList[11]}
              isSelected={selectedCungIndex === 11}
              isTamHop={tamHopSet.has(11)}
              isChinhChieu={chinhChieuIdx === 11}
              onClick={() => onSelectCung(11)}
              onMouseEnter={() => setHoveredCungIdx(11)}
              onMouseLeave={() => setHoveredCungIdx(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
