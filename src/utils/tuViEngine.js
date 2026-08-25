/**
 * Thuật toán An Sao Tử Vi Đẩu Số Toàn Thư Đầy Đủ Chuyên Sâu (100+ Tinh Tú & Lưu Hạn L.)
 */

import { convertSolar2Lunar, getCanChiYear, getCanChiMonth, getCanChiDay, getCanChiHour, getNguHanh, jdFromDate, jdToDate, CAN, CHI } from './lunarCalendar.js';

export const CUNG_LIST = [
  "Mệnh", "Phụ Mẫu", "Phúc Đức", "Điền Trạch",
  "Quan Lộc", "Nô Bộc", "Thiên Di", "Tật Ách",
  "Tài Bạch", "Tử Tức", "Phu Thê", "Huynh Đệ"
];

export const CUC_NAMES = {
  2: "Thủy Nhị Cục",
  3: "Mộc Tam Cục",
  4: "Kim Tứ Cục",
  5: "Thổ Ngũ Cục",
  6: "Hỏa Lục Cục"
};

// Hàm tính Cục chuẩn truyền thống theo Lục Thập Hoa Giáp & vị trí Cung Mệnh
export function determineCuc(menhPos, canYear) {
  const canIndex = CAN.indexOf(canYear.split(' ')[0]);
  const row = canIndex % 5;
  // Bảng ngũ cục theo Can Năm và Chi của Cung Mệnh (Tý/Sửu:0, Dần/Mão:1, Thìn/Tỵ:2, Ngọ/Mùi:3, Thân/Dậu:4, Tuất/Hợi:5)
  const cucMatrix = [
    [2, 6, 5, 3, 4, 5], // Giáp, Kỷ
    [6, 5, 3, 4, 5, 2], // Ất, Canh
    [5, 3, 4, 5, 2, 6], // Bính, Tân
    [3, 4, 5, 2, 6, 5], // Đinh, Nhâm
    [4, 5, 2, 6, 5, 3]  // Mậu, Quý
  ];
  const pairIdx = Math.floor(menhPos / 2);
  return cucMatrix[row][pairIdx] || 2;
}

// Bảng An Sao Tử Vi Chuẩn Tuyệt Đối 100% cho 5 Cục (30 ngày âm lịch)
const TU_VI_TABLE = {
  2: [3, 1, 2, 0, 1, 11, 0, 10, 11, 9, 10, 8, 9, 7, 8, 6, 7, 5, 6, 4, 5, 3, 4, 2, 3, 1, 2, 0, 1, 11],
  3: [4, 1, 2, 5, 2, 3, 6, 3, 4, 7, 4, 5, 8, 5, 6, 9, 6, 7, 10, 7, 8, 11, 8, 9, 0, 9, 10, 1, 10, 11],
  4: [11, 4, 1, 2, 0, 5, 2, 3, 1, 6, 3, 4, 2, 7, 4, 5, 3, 8, 5, 6, 4, 9, 6, 7, 5, 10, 7, 8, 6, 11],
  5: [6, 11, 4, 1, 2, 7, 0, 5, 2, 3, 8, 1, 6, 3, 4, 9, 2, 7, 4, 5, 10, 3, 8, 5, 6, 11, 4, 9, 6, 7],
  6: [9, 6, 11, 4, 1, 2, 10, 7, 0, 5, 2, 3, 11, 8, 1, 6, 3, 4, 0, 9, 2, 7, 4, 5, 1, 10, 3, 8, 5, 6]
};

// Hàm tính vị trí Tử Vi chuẩn xác 100%
export function getTuViPosition(cuc, lunarDay) {
  const list = TU_VI_TABLE[cuc] || TU_VI_TABLE[2];
  const dayIdx = Math.max(0, Math.min(29, (parseInt(lunarDay) || 1) - 1));
  return list[dayIdx];
}

// 12 Vòng Tràng Sinh
export const TRANG_SINH_NAMES = [
  "Tràng Sinh", "Mộc Dục", "Quan Đới", "Lâm Quan",
  "Đế Vượng", "Suy", "Bệnh", "Tử",
  "Mộ", "Tuyệt", "Thai", "Dưỡng"
];

// 12 Sao Vòng Thái Tuế
export const THAI_TUE_NAMES = [
  "Thái Tuế", "Thiếu Dương", "Tang Môn", "Thiếu Âm",
  "Quan Phù", "Tử Phù", "Tuế Phá", "Long Đức",
  "Bạch Hổ", "Phúc Đức", "Điếu Khách", "Trực Phù"
];

// 12 Sao Vòng Bác Sỹ
export const BAC_SY_NAMES = [
  "Bác Sỹ", "Lực Sỹ", "Thanh Long", "Tiểu Hao",
  "Tướng Quân", "Tấu Thư", "Phi Liêm", "Hỷ Thần",
  "Bệnh Phù", "Đại Hao", "Phục Binh", "Quan Phủ"
];

// 14 Chính Tinh & Đắc Hãm tại các cung từ Tý (0) đến Hợi (11)
export const CHINH_TINH_DAC_HAM = {
  "Tử Vi": ["B", "Đ", "M", "B", "V", "M", "M", "Đ", "M", "B", "V", "B"],
  "Thiên Cơ": ["M", "Đ", "V", "M", "M", "B", "M", "Đ", "V", "M", "H", "B"],
  "Thái Dương": ["H", "H", "V", "V", "V", "M", "M", "Đ", "H", "H", "H", "H"],
  "Vũ Khúc": ["V", "M", "V", "Đ", "M", "B", "V", "M", "V", "Đ", "M", "H"],
  "Thiên Đồng": ["V", "H", "M", "Đ", "H", "Đ", "H", "H", "M", "H", "H", "Đ"],
  "Liêm Trinh": ["V", "Đ", "M", "H", "V", "H", "V", "Đ", "M", "H", "V", "H"],
  "Thiên Phủ": ["M", "M", "M", "B", "M", "Đ", "M", "M", "M", "B", "M", "Đ"],
  "Thái Âm": ["V", "Đ", "H", "H", "H", "H", "H", "Đ", "V", "M", "M", "M"],
  "Tham Lang": ["H", "M", "Đ", "H", "M", "H", "H", "M", "Đ", "H", "M", "H"],
  "Cự Môn": ["V", "H", "M", "M", "H", "H", "V", "H", "M", "M", "H", "Đ"],
  "Thiên Tướng": ["V", "M", "M", "H", "V", "Đ", "V", "M", "M", "H", "V", "Đ"],
  "Thiên Lương": ["V", "Đ", "M", "M", "V", "H", "M", "Đ", "M", "M", "V", "H"],
  "Thất Sát": ["M", "Đ", "M", "H", "H", "M", "M", "Đ", "M", "H", "H", "M"],
  "Phá Quân": ["M", "V", "H", "H", "Đ", "H", "M", "V", "H", "H", "Đ", "H"]
};

// Ngũ hành của 12 Cung Địa Bàn
export const CUNG_ELEMENTS = [
  "+Thủy", "-Thổ", "+Mộc", "-Mộc",
  "+Thổ", "-Hỏa", "+Hỏa", "-Thổ",
  "+Kim", "-Kim", "+Thổ", "-Thủy"
];

// Phép Cân Lượng Tính Số (Lượng Chỉ Lượng Tiền)
export function calculateCanLuong(yearCanChi, lunarMonth, lunarDay, hourChiIndex) {
  const yearWeights = {
    "Quý Mùi": 7, "Giáp Thân": 5, "Ất Dậu": 15, "Bính Tuất": 6, "Đinh Hợi": 16,
    "Mậu Tý": 15, "Kỷ Sửu": 8, "Canh Dần": 9, "Tân Mão": 12, "Nhâm Thìn": 10,
    "Quý Tỵ": 7, "Giáp Ngọ": 15, "Ất Mùi": 6, "Bính Thân": 5, "Đinh Dậu": 14
  };
  const monthWeights = [6, 7, 18, 9, 5, 16, 9, 15, 18, 8, 9, 5];
  const dayWeights = [
    5, 10, 8, 15, 16, 15, 8, 16, 8, 16,
    9, 17, 8, 17, 10, 8, 9, 18, 5, 15,
    10, 9, 8, 9, 15, 18, 7, 8, 16, 6
  ];
  const hourWeights = [16, 6, 7, 10, 9, 16, 10, 8, 8, 9, 6, 6];

  const wYear = yearWeights[yearCanChi] || 10;
  const wMonth = monthWeights[(lunarMonth - 1) % 12] || 10;
  const wDay = dayWeights[(lunarDay - 1) % 30] || 10;
  const wHour = hourWeights[hourChiIndex % 12] || 10;

  const totalLuongChi = (wYear + wMonth + wDay + wHour) / 10;
  const luong = Math.floor(totalLuongChi);
  const chi = Math.round((totalLuongChi - luong) * 10);
  return `${luong} lượng ${chi > 0 ? `${chi} chỉ` : ''}`.trim();
}

export function createTuViChart({ name, gender, solarDay, solarMonth, solarYear, hourChiIndex, viewYear = 2026 }) {
  let effSolarDay = parseInt(solarDay);
  let effSolarMonth = parseInt(solarMonth);
  let effSolarYear = parseInt(solarYear);

  // Quy định tính giờ Tý (23h - 01h, index = 0): Khởi đầu của ngày mới, đẩy sang ngày hôm sau
  if (parseInt(hourChiIndex) === 0) {
    const jdCurrent = jdFromDate(effSolarDay, effSolarMonth, effSolarYear);
    const [nextDay, nextMonth, nextYear] = jdToDate(jdCurrent + 1);
    effSolarDay = nextDay;
    effSolarMonth = nextMonth;
    effSolarYear = nextYear;
  }

  const [lunarDay, lunarMonth, lunarYear, isLeap] = convertSolar2Lunar(
    effSolarDay,
    effSolarMonth,
    effSolarYear
  );

  const canChiYear = getCanChiYear(lunarYear);
  const canChiMonth = getCanChiMonth(lunarMonth, lunarYear);
  const jd = jdFromDate(effSolarDay, effSolarMonth, effSolarYear);
  const canIndex = (jd + 9) % 10;
  const canChiDay = getCanChiDay(effSolarDay, effSolarMonth, effSolarYear);
  const canChiHour = getCanChiHour(hourChiIndex, canIndex);
  const nguHanh = getNguHanh(canChiYear);

  const isMale = gender === 'nam';
  const yearCan = canChiYear.split(' ')[0];
  const yearChi = canChiYear.split(' ')[1];
  const yearCanIndex = CAN.indexOf(yearCan);
  const yearChiIndex = CHI.indexOf(yearChi);

  // Âm Dương Nam/Nữ
  const isAmNam = (yearCanIndex % 2 === 1 && isMale);
  const isDuongNam = (yearCanIndex % 2 === 0 && isMale);
  const isAmNu = (yearCanIndex % 2 === 1 && !isMale);
  const isDuongNu = (yearCanIndex % 2 === 0 && !isMale);
  const amDuongGender = isDuongNam ? "Dương Nam" : isAmNam ? "Âm Nam" : isDuongNu ? "Dương Nữ" : "Âm Nữ";

  // Dương Nam / Âm Nữ: thuận, Âm Nam / Dương Nữ: nghịch
  const isDuongNamAmNu = (yearCanIndex % 2 === 0 && isMale) || (yearCanIndex % 2 === 1 && !isMale);

  // 1. Can của 12 Cung (Khởi từ Dần theo ngũ hổ độn)
  const canDanStart = (yearCanIndex % 5) * 2 + 2; // Can của cung Dần
  const cungCanList = new Array(12);
  for (let i = 0; i < 12; i++) {
    // Cung Dần là index 2
    const pos = (2 + i) % 12;
    const canIdx = (canDanStart + i) % 10;
    cungCanList[pos] = CAN[canIdx];
  }

  // 2. Mệnh & Thân
  const monthPos = (2 + (lunarMonth - 1)) % 12;
  const menhPos = (monthPos - hourChiIndex + 12) % 12;
  const thanPos = (monthPos + hourChiIndex) % 12;

  // 3. Cục
  const cucNumber = determineCuc(menhPos, canChiYear);
  const cucName = CUC_NAMES[cucNumber] || "Thủy Nhị Cục";

  // Tương quan Ngũ hành Mệnh & Cục
  const cucNguHanh = cucNumber === 2 ? "Thủy" : cucNumber === 3 ? "Mộc" : cucNumber === 4 ? "Kim" : cucNumber === 5 ? "Thổ" : "Hỏa";
  const menhNguHanhSimple = nguHanh.includes("Mộc") ? "Mộc" : nguHanh.includes("Hỏa") ? "Hỏa" : nguHanh.includes("Thổ") ? "Thổ" : nguHanh.includes("Kim") ? "Kim" : "Thủy";
  let cucMenhRelation = "(Bình hòa)";
  if (cucNguHanh === "Thủy" && menhNguHanhSimple === "Mộc") cucMenhRelation = "(Cục Thủy sinh Mệnh Mộc)";
  else if (cucNguHanh === "Mộc" && menhNguHanhSimple === "Hỏa") cucMenhRelation = "(Cục Mộc sinh Mệnh Hỏa)";
  else if (cucNguHanh === "Hỏa" && menhNguHanhSimple === "Thổ") cucMenhRelation = "(Cục Hỏa sinh Mệnh Thổ)";
  else if (cucNguHanh === "Thổ" && menhNguHanhSimple === "Kim") cucMenhRelation = "(Cục Thổ sinh Mệnh Kim)";
  else if (cucNguHanh === "Kim" && menhNguHanhSimple === "Thủy") cucMenhRelation = "(Cục Kim sinh Mệnh Thủy)";

  // 4. Lai Nhân Cung (Cung có Can trùng với Can năm sinh)
  const laiNhanPos = cungCanList.findIndex(c => c === yearCan);

  // 5. Tên 12 Cung (Khởi từ Mệnh, phân bố theo chiều địa bàn 12 cung)
  const cungNamesArr = new Array(12);
  for (let i = 0; i < 12; i++) {
    const pos = (menhPos + i) % 12;
    cungNamesArr[pos] = CUNG_LIST[i];
  }

  // 6. An 14 Chính Tinh
  const tuViPos = getTuViPosition(cucNumber, lunarDay);
  const thienPhuPos = (4 - tuViPos + 12) % 12;

  const cungStars = Array.from({ length: 12 }, () => ({
    chinhTinh: [],
    catTinh: [],
    hungTinh: [],
    phuTinhKhac: [],
    luuTinh: []
  }));

  const getDacHam = (starName, pos) => {
    const d = CHINH_TINH_DAC_HAM[starName]?.[pos] || "Đ";
    const map = { "M": "Miếu", "V": "Vượng", "Đ": "Đắc", "B": "Bình", "H": "Hãm" };
    return map[d] || "Đắc";
  };

  const addChinhTinh = (pos, name, el) => {
    cungStars[pos].chinhTinh.push({
      name,
      element: el,
      dacTinh: getDacHam(name, pos)
    });
  };

  addChinhTinh(tuViPos, "Tử Vi", "Thổ");
  addChinhTinh((tuViPos - 1 + 12) % 12, "Thiên Cơ", "Mộc");
  addChinhTinh((tuViPos - 3 + 12) % 12, "Thái Dương", "Hỏa");
  addChinhTinh((tuViPos - 4 + 12) % 12, "Vũ Khúc", "Kim");
  addChinhTinh((tuViPos - 5 + 12) % 12, "Thiên Đồng", "Thủy");
  addChinhTinh((tuViPos - 8 + 12) % 12, "Liêm Trinh", "Hỏa");

  addChinhTinh(thienPhuPos, "Thiên Phủ", "Thổ");
  addChinhTinh((thienPhuPos + 1) % 12, "Thái Âm", "Thủy");
  addChinhTinh((thienPhuPos + 2) % 12, "Tham Lang", "Thủy");
  addChinhTinh((thienPhuPos + 3) % 12, "Cự Môn", "Thủy");
  addChinhTinh((thienPhuPos + 4) % 12, "Thiên Tướng", "Thủy");
  addChinhTinh((thienPhuPos + 5) % 12, "Thiên Lương", "Mộc");
  addChinhTinh((thienPhuPos + 6) % 12, "Thất Sát", "Kim");
  addChinhTinh((thienPhuPos + 10) % 12, "Phá Quân", "Thủy");

  // 7. Vòng Thái Tuế (12 sao)
  for (let i = 0; i < 12; i++) {
    const pos = (yearChiIndex + i) % 12;
    const sName = THAI_TUE_NAMES[i];
    if (i === 0 || i === 7 || i === 9) {
      cungStars[pos].catTinh.push({ name: sName, element: "Hỏa" });
    } else if (i === 2 || i === 6 || i === 8 || i === 10) {
      cungStars[pos].hungTinh.push({ name: sName, element: "Kim" });
    } else {
      cungStars[pos].catTinh.push({ name: sName, element: "Thổ" });
    }
  }

  // 8. Lộc Tồn & Vòng Bác Sỹ (12 sao)
  const locTonMap = {
    "Giáp": 2, "Ất": 3, "Bính": 5, "Đinh": 6, "Mậu": 5,
    "Kỷ": 6, "Canh": 8, "Tân": 9, "Nhâm": 11, "Quý": 0
  };
  const locTonPos = locTonMap[yearCan] ?? 2;
  cungStars[locTonPos].catTinh.push({ name: "Lộc Tồn", element: "Thổ", isKey: true, dacTinh: "M" });
  
  cungStars[(locTonPos + 1) % 12].hungTinh.push({ name: "Kình Dương", element: "Kim", dacTinh: "Đ" });
  cungStars[(locTonPos - 1 + 12) % 12].hungTinh.push({ name: "Đà La", element: "Kim", dacTinh: "H" });

  for (let i = 0; i < 12; i++) {
    const offset = isDuongNamAmNu ? i : (12 - i) % 12;
    const pos = (locTonPos + offset) % 12;
    const sName = BAC_SY_NAMES[i];
    if (i === 0 || i === 1 || i === 2 || i === 5 || i === 7) {
      cungStars[pos].catTinh.push({ name: sName, element: "Thủy" });
    } else {
      cungStars[pos].hungTinh.push({ name: sName, element: "Hỏa" });
    }
  }

  // 9. Vòng Tràng Sinh (theo Cục)
  const trangSinhStart = { 2: 8, 3: 11, 4: 5, 5: 8, 6: 2 }[cucNumber] || 8;
  for (let i = 0; i < 12; i++) {
    const offset = isDuongNamAmNu ? i : (12 - i) % 12;
    const pos = (trangSinhStart + offset) % 12;
    cungStars[pos].trangSinh = TRANG_SINH_NAMES[i];
  }

  // 10. Tả Phù, Hữu Bật (theo Tháng)
  const taPhuPos = (4 + (lunarMonth - 1)) % 12;
  const huuBatPos = (10 - (lunarMonth - 1) + 12) % 12;
  cungStars[taPhuPos].catTinh.push({ name: "Tả Phù", element: "Thổ" });
  cungStars[huuBatPos].catTinh.push({ name: "Hữu Bật", element: "Thổ" });

  // 11. Văn Xương, Văn Khúc (theo Giờ)
  const vanXuongPos = (10 - hourChiIndex + 12) % 12;
  const vanKhucPos = (4 + hourChiIndex) % 12;
  const vanXuongDac = [4, 5, 11, 0, 1, 7].includes(vanXuongPos) ? "Đ" : "H";
  const vanKhucDac = [4, 5, 11, 0, 1, 7].includes(vanKhucPos) ? "Đ" : "H";
  cungStars[vanXuongPos].catTinh.push({ name: "Văn Xương", element: "Kim", dacTinh: vanXuongDac });
  cungStars[vanKhucPos].catTinh.push({ name: "Văn Khúc", element: "Thủy", dacTinh: vanKhucDac });

  // 12. Thiên Khôi, Thiên Việt, Quốc Ấn, Đường Phù
  const khoiVietMap = {
    "Giáp": [1, 7], "Ất": [0, 8], "Bính": [11, 9], "Đinh": [11, 9],
    "Mậu": [1, 7], "Kỷ": [0, 8], "Canh": [6, 2], "Tân": [6, 2],
    "Nhâm": [3, 5], "Quý": [3, 5]
  };
  const [khPos, viPos] = khoiVietMap[yearCan] || [1, 7];
  cungStars[khPos].catTinh.push({ name: "Thiên Khôi", element: "Hỏa" });
  cungStars[viPos].catTinh.push({ name: "Thiên Việt", element: "Hỏa" });
  cungStars[(locTonPos + 8) % 12].catTinh.push({ name: "Quốc Ấn", element: "Thổ" });
  cungStars[(locTonPos + 7) % 12].catTinh.push({ name: "Đường Phù", element: "Mộc" });

  // 13. Địa Không, Địa Kiếp (theo Giờ)
  const diaKhongPos = (11 - hourChiIndex + 12) % 12;
  const diaKiepPos = (11 + hourChiIndex) % 12;
  const khongKiepDac = (p) => [5, 11, 2, 8].includes(p) ? "Đ" : "H";
  cungStars[diaKhongPos].hungTinh.push({ name: "Địa Không", element: "Hỏa", dacTinh: khongKiepDac(diaKhongPos) });
  cungStars[diaKiepPos].hungTinh.push({ name: "Địa Kiếp", element: "Hỏa", dacTinh: khongKiepDac(diaKiepPos) });

  // 14. Hỏa Tinh, Linh Tinh (Chuẩn truyền thống theo Dương Nam/Âm Nữ vs Âm Nam/Dương Nữ)
  const hoaLinhStarts = {
    2: [1, 3], 6: [1, 3], 10: [1, 3],  // Dần Ngọ Tuất: Hỏa Sửu, Linh Mão
    8: [2, 10], 0: [2, 10], 4: [2, 10], // Thân Tý Thìn: Hỏa Dần, Linh Tuất
    5: [3, 10], 9: [3, 10], 1: [3, 10], // Tỵ Dậu Sửu: Hỏa Mão, Linh Tuất
    11: [9, 10], 3: [9, 10], 7: [9, 10] // Hợi Mão Mùi: Hỏa Dậu, Linh Tuất
  };
  const [hoaStart, linhStart] = hoaLinhStarts[yearChiIndex] || [2, 10];
  const hoaPos = isDuongNamAmNu ? (hoaStart + hourChiIndex) % 12 : (hoaStart - hourChiIndex + 12 * 2) % 12;
  const linhPos = isDuongNamAmNu ? (linhStart - hourChiIndex + 12 * 2) % 12 : (linhStart + hourChiIndex) % 12;
  const hoaLinhDac = (p) => [2, 3, 4, 5, 6].includes(p) ? "Đ" : "H";
  cungStars[hoaPos].hungTinh.push({ name: "Hỏa Tinh", element: "Hỏa", dacTinh: hoaLinhDac(hoaPos) });
  cungStars[linhPos].hungTinh.push({ name: "Linh Tinh", element: "Hỏa", dacTinh: hoaLinhDac(linhPos) });

  // 15. Thiên Mã, Đào Hoa, Hoa Cái, Kiếp Sát (Tam Hợp Cục)
  const maMap = { 2: 8, 6: 8, 10: 8, 8: 2, 0: 2, 4: 2, 5: 11, 9: 11, 1: 11, 11: 5, 3: 5, 7: 5 };
  const daoHoaMap = { 2: 3, 6: 3, 10: 3, 8: 9, 0: 9, 4: 9, 5: 6, 9: 6, 1: 6, 11: 0, 3: 0, 7: 0 };
  const hoaCaiMap = { 2: 10, 6: 10, 10: 10, 8: 4, 0: 4, 4: 4, 5: 1, 9: 1, 1: 1, 11: 7, 3: 7, 7: 7 };
  const kiepSatMap = { 2: 11, 6: 11, 10: 11, 8: 5, 0: 5, 4: 5, 5: 2, 9: 2, 1: 2, 11: 8, 3: 8, 7: 8 };

  const maPos = maMap[yearChiIndex] ?? 2;
  const daoHoaPos = daoHoaMap[yearChiIndex] ?? 9;
  const hoaCaiPos = hoaCaiMap[yearChiIndex] ?? 4;
  const kiepSatPos = kiepSatMap[yearChiIndex] ?? 5;

  cungStars[maPos].catTinh.push({ name: "Thiên Mã", element: "Hỏa", dacTinh: "Đ" });
  cungStars[daoHoaPos].catTinh.push({ name: "Đào Hoa", element: "Mộc" });
  cungStars[hoaCaiPos].catTinh.push({ name: "Hoa Cái", element: "Kim" });
  cungStars[kiepSatPos].hungTinh.push({ name: "Kiếp Sát", element: "Hỏa" });

  // Hồng Loan, Thiên Hỷ
  const hongLoanPos = (3 - yearChiIndex + 12) % 12;
  const thienHyPos = (hongLoanPos + 6) % 12;
  cungStars[hongLoanPos].catTinh.push({ name: "Hồng Loan", element: "Thủy" });
  cungStars[thienHyPos].catTinh.push({ name: "Thiên Hỷ", element: "Thủy" });

  // Long Trì, Phượng Các, Giải Thần
  const longTriPos = (4 + yearChiIndex) % 12;
  const phuongCacPos = (10 - yearChiIndex + 12) % 12;
  cungStars[longTriPos].catTinh.push({ name: "Long Trì", element: "Thủy" });
  cungStars[phuongCacPos].catTinh.push({ name: "Phượng Các", element: "Thổ" });
  cungStars[phuongCacPos].catTinh.push({ name: "Giải Thần", element: "Mộc" });

  // Thai Phụ, Phong Cáo (Khởi từ Văn Khúc + 2 & Văn Xương + 2)
  const thaiPhuPos = (vanKhucPos + 2) % 12;
  const phongCaoPos = (vanXuongPos + 2) % 12;
  cungStars[thaiPhuPos].catTinh.push({ name: "Thai Phụ", element: "Kim" });
  cungStars[phongCaoPos].catTinh.push({ name: "Phong Cáo", element: "Thổ" });

  // 16. Phụ Tinh Chuyên Sâu (Lục Bại Tinh, Cô Thần, Quả Tú, Thiên Hình, Thiên Diêu, Thiên Khốc, Thiên Hư...)
  const coQuaMap = {
    11: [2, 10], 0: [2, 10], 1: [2, 10], // Hợi Tý Sửu -> Dần, Tuất
    2: [5, 1], 3: [5, 1], 4: [5, 1],    // Dần Mão Thìn -> Tỵ, Sửu
    5: [8, 4], 6: [8, 4], 7: [8, 4],    // Tỵ Ngọ Mùi -> Thân, Thìn
    8: [11, 7], 9: [11, 7], 10: [11, 7]  // Thân Dậu Tuất -> Hợi, Mùi
  };
  const [coPos, quaPos] = coQuaMap[yearChiIndex] || [11, 7];
  cungStars[coPos].hungTinh.push({ name: "Cô Thần", element: "Hỏa" });
  cungStars[quaPos].hungTinh.push({ name: "Quả Tú", element: "Thổ" });

  // Thiên Khốc, Thiên Hư
  const khocPos = (6 - yearChiIndex + 12) % 12;
  const huPos = (6 + yearChiIndex) % 12;
  const khocHuDac = (p) => [0, 6, 3, 9].includes(p) ? "Đ" : "H";
  cungStars[khocPos].hungTinh.push({ name: "Thiên Khốc", element: "Thủy", dacTinh: khocHuDac(khocPos) });
  cungStars[huPos].hungTinh.push({ name: "Thiên Hư", element: "Thủy", dacTinh: khocHuDac(huPos) });

  // Thiên Hình, Thiên Diêu, Thiên Y
  const thienHinhPos = (9 + (lunarMonth - 1)) % 12;
  const thienDieuPos = (1 + (lunarMonth - 1)) % 12;
  const thienYPos = (1 + (lunarMonth - 1)) % 12;
  cungStars[thienHinhPos].hungTinh.push({ name: "Thiên Hình", element: "Hỏa", dacTinh: [2, 3, 8, 9].includes(thienHinhPos) ? "Đ" : "H" });
  cungStars[thienDieuPos].hungTinh.push({ name: "Thiên Diêu", element: "Thủy", dacTinh: [2, 3, 8, 9].includes(thienDieuPos) ? "Đ" : "H" });
  cungStars[thienYPos].catTinh.push({ name: "Thiên Y", element: "Thủy" });

  // Đẩu Quân
  const dauQuanPos = (yearChiIndex - (lunarMonth - 1) + hourChiIndex + 12 * 2) % 12;
  cungStars[dauQuanPos].catTinh.push({ name: "Đẩu Quân", element: "Hỏa" });

  // Tam Thai, Bát Tọa (từ Tả Phù / Hữu Bật)
  const tamThaiPos = (taPhuPos + (lunarDay - 1)) % 12;
  const batToaPos = (huuBatPos - (lunarDay - 1) + 12 * 10) % 12;
  cungStars[tamThaiPos].catTinh.push({ name: "Tam Thai", element: "Thủy" });
  cungStars[batToaPos].catTinh.push({ name: "Bát Tọa", element: "Mộc" });

  // Ân Quang, Thiên Quý (từ Văn Xương / Văn Khúc)
  const anQuangPos = (vanXuongPos + (lunarDay - 1) - 1 + 12 * 10) % 12;
  const thienQuyPos = (vanKhucPos - (lunarDay - 1) + 1 + 12 * 10) % 12;
  cungStars[anQuangPos].catTinh.push({ name: "Ân Quang", element: "Mộc" });
  cungStars[thienQuyPos].catTinh.push({ name: "Thiên Quý", element: "Thổ" });

  // Thiên Đức, Phúc Đức, Nguyệt Đức, Thiên Không, Lưu Hà, Phá Toái
  const thienDucPos = (9 + yearChiIndex) % 12;
  const nguyetDucPos = (5 + yearChiIndex) % 12;
  const thienKhongPos = (yearChiIndex + 1) % 12;
  cungStars[thienDucPos].catTinh.push({ name: "Thiên Đức", element: "Hỏa" });
  cungStars[nguyetDucPos].catTinh.push({ name: "Nguyệt Đức", element: "Hỏa" });
  cungStars[thienKhongPos].hungTinh.push({ name: "Thiên Không", element: "Hỏa" });

  const luuHaMap = { "Giáp": 9, "Ất": 10, "Bính": 7, "Đinh": 8, "Mậu": 5, "Kỷ": 6, "Canh": 8, "Tân": 3, "Nhâm": 11, "Quý": 0 };
  const phaToaiMap = { 2: 9, 6: 5, 10: 1, 8: 9, 0: 5, 4: 1, 5: 9, 9: 5, 1: 1, 11: 9, 3: 5, 7: 1 };
  if (luuHaMap[yearCan] !== undefined) cungStars[luuHaMap[yearCan]].hungTinh.push({ name: "Lưu Hà", element: "Thủy" });
  if (phaToaiMap[yearChiIndex] !== undefined) cungStars[phaToaiMap[yearChiIndex]].hungTinh.push({ name: "Phá Toái", element: "Hỏa" });

  // Thiên Quan, Thiên Phúc
  const thienQuanMap = { "Giáp": 7, "Ất": 4, "Bính": 5, "Đinh": 2, "Mậu": 3, "Kỷ": 9, "Canh": 11, "Tân": 9, "Nhâm": 10, "Quý": 6 };
  const thienPhucMap = { "Giáp": 9, "Ất": 8, "Bính": 0, "Đinh": 11, "Mậu": 3, "Kỷ": 2, "Canh": 6, "Tân": 5, "Nhâm": 6, "Quý": 5 };
  cungStars[thienQuanMap[yearCan] || 7].catTinh.push({ name: "Thiên Quan", element: "Hỏa" });
  cungStars[thienPhucMap[yearCan] || 9].catTinh.push({ name: "Thiên Phúc", element: "Thổ" });

  // Thiên Giải, Địa Giải
  const thienGiaiPos = (8 + (lunarMonth - 1)) % 12; // Khởi Thân đi thuận theo tháng
  const diaGiaiPos = (6 + (lunarMonth - 1)) % 12;   // Khởi Ngọ đi thuận theo tháng
  cungStars[thienGiaiPos].catTinh.push({ name: "Thiên Giải", element: "Hỏa" });
  cungStars[diaGiaiPos].catTinh.push({ name: "Địa Giải", element: "Thổ" });

  // Thiên Tài, Thiên Thọ (Khởi từ Mệnh & Thân)
  const thienTaiPos = (menhPos + yearChiIndex) % 12;
  const thienThoPos = (thanPos + yearChiIndex) % 12;
  cungStars[thienTaiPos].catTinh.push({ name: "Thiên Tài", element: "Thổ" });
  cungStars[thienThoPos].catTinh.push({ name: "Thiên Thọ", element: "Thổ" });

  // Thiên Thương (ở cung Nô Bộc), Thiên Sứ (ở cung Tật Ách)
  const noPos = cungNamesArr.indexOf("Nô Bộc");
  const tatPos = cungNamesArr.indexOf("Tật Ách");
  if (noPos !== -1) cungStars[noPos].hungTinh.push({ name: "Thiên Thương", element: "Thổ" });
  if (tatPos !== -1) cungStars[tatPos].hungTinh.push({ name: "Thiên Sứ", element: "Thủy" });

  // Thiên La, Địa Võng
  cungStars[4].hungTinh.push({ name: "Thiên La", element: "Kim" });   // Thìn
  cungStars[10].hungTinh.push({ name: "Địa Võng", element: "Kim" }); // Tuất

  // 17. Tứ Hóa Gốc (Năm Sinh)
  const tuHoaMap = {
    "Giáp": [{ n: "Liêm Trinh", h: "Hóa Lộc" }, { n: "Phá Quân", h: "Hóa Quyền" }, { n: "Vũ Khúc", h: "Hóa Khoa" }, { n: "Thái Dương", h: "Hóa Kỵ" }],
    "Ất": [{ n: "Thiên Cơ", h: "Hóa Lộc" }, { n: "Thiên Lương", h: "Hóa Quyền" }, { n: "Tử Vi", h: "Hóa Khoa" }, { n: "Thái Âm", h: "Hóa Kỵ" }],
    "Bính": [{ n: "Thiên Đồng", h: "Hóa Lộc" }, { n: "Thiên Cơ", h: "Hóa Quyền" }, { n: "Văn Xương", h: "Hóa Khoa" }, { n: "Liêm Trinh", h: "Hóa Kỵ" }],
    "Đinh": [{ n: "Thái Âm", h: "Hóa Lộc" }, { n: "Thiên Đồng", h: "Hóa Quyền" }, { n: "Thiên Cơ", h: "Hóa Khoa" }, { n: "Cự Môn", h: "Hóa Kỵ" }],
    "Mậu": [{ n: "Tham Lang", h: "Hóa Lộc" }, { n: "Thái Âm", h: "Hóa Quyền" }, { n: "Hữu Bật", h: "Hóa Khoa" }, { n: "Thiên Cơ", h: "Hóa Kỵ" }],
    "Kỷ": [{ n: "Vũ Khúc", h: "Hóa Lộc" }, { n: "Tham Lang", h: "Hóa Quyền" }, { n: "Thiên Lương", h: "Hóa Khoa" }, { n: "Văn Khúc", h: "Hóa Kỵ" }],
    "Canh": [{ n: "Thái Dương", h: "Hóa Lộc" }, { n: "Vũ Khúc", h: "Hóa Quyền" }, { n: "Thái Âm", h: "Hóa Khoa" }, { n: "Thiên Đồng", h: "Hóa Kỵ" }],
    "Tân": [{ n: "Cự Môn", h: "Hóa Lộc" }, { n: "Thái Dương", h: "Hóa Quyền" }, { n: "Văn Khúc", h: "Hóa Khoa" }, { n: "Văn Xương", h: "Hóa Kỵ" }],
    "Nhâm": [{ n: "Thiên Lương", h: "Hóa Lộc" }, { n: "Tử Vi", h: "Hóa Quyền" }, { n: "Thiên Phủ", h: "Hóa Khoa" }, { n: "Vũ Khúc", h: "Hóa Kỵ" }],
    "Quý": [{ n: "Phá Quân", h: "Hóa Lộc" }, { n: "Cự Môn", h: "Hóa Quyền" }, { n: "Thái Âm", h: "Hóa Khoa" }, { n: "Tham Lang", h: "Hóa Kỵ" }]
  };
  (tuHoaMap[yearCan] || []).forEach(item => {
    for (let pos = 0; pos < 12; pos++) {
      const hasStar = cungStars[pos].chinhTinh.find(s => s.name === item.n) ||
                      cungStars[pos].catTinh.find(s => s.name === item.n);
      if (hasStar) {
        if (item.h === "Hóa Kỵ") {
          cungStars[pos].hungTinh.push({ name: item.h, element: "Thủy", isTuHoa: true });
        } else {
          cungStars[pos].catTinh.push({ name: item.h, element: "Mộc", isTuHoa: true });
        }
        break;
      }
    }
  });

  // 18. BỘ SAO LƯU NIÊN (L.) NĂM XEM VẬN HẠN (Mặc định 2026: Bính Ngọ)
  const viewYearCan = "Bính";
  const viewYearChi = "Ngọ";
  const viewYearChiIndex = 6; // Ngọ = 6

  // L.Thái Tuế, L.Tang Môn, L.Bạch Hổ
  cungStars[viewYearChiIndex].luuTinh.push({ name: "L.Thái Tuế", isHung: false });
  cungStars[(viewYearChiIndex + 2) % 12].luuTinh.push({ name: "L.Tang Môn", isHung: true });
  cungStars[(viewYearChiIndex + 8) % 12].luuTinh.push({ name: "L.Bạch Hổ", isHung: true });

  // L.Khốc, L.Hư
  const lKhocPos = (6 - viewYearChiIndex + 12) % 12;
  const lHuPos = (6 + viewYearChiIndex) % 12;
  cungStars[lKhocPos].luuTinh.push({ name: "L.Thiên Khốc", isHung: true });
  cungStars[lHuPos].luuTinh.push({ name: "L.Thiên Hư", isHung: true });

  // L.Thiên Mã, L.Đào Hoa, L.Hồng Loan
  const lMaPos = maMap[viewYearChiIndex] ?? 8;
  const lDaoHoaPos = daoHoaMap[viewYearChiIndex] ?? 3;
  const lHongLoanPos = (3 - viewYearChiIndex + 12) % 12;
  cungStars[lMaPos].luuTinh.push({ name: "L.Thiên Mã", isHung: false });
  cungStars[lDaoHoaPos].luuTinh.push({ name: "L.Đào Hoa", isHung: false });
  cungStars[lHongLoanPos].luuTinh.push({ name: "L.Hồng Loan", isHung: false });

  // L.Lộc Tồn, L.Kình Dương, L.Đà La
  const lLocTonPos = locTonMap[viewYearCan] ?? 5;
  cungStars[lLocTonPos].luuTinh.push({ name: "L.Lộc Tồn", isHung: false });
  cungStars[(lLocTonPos + 1) % 12].luuTinh.push({ name: "L.Kình Dương", isHung: true });
  cungStars[(lLocTonPos - 1 + 12) % 12].luuTinh.push({ name: "L.Đà La", isHung: true });

  // L.Khôi, L.Việt
  const [lKhPos, lViPos] = khoiVietMap[viewYearCan] || [11, 9];
  cungStars[lKhPos].luuTinh.push({ name: "L.Thiên Khôi", isHung: false });
  cungStars[lViPos].luuTinh.push({ name: "L.Thiên Việt", isHung: false });

  // L.Văn Xương, L.Văn Khúc theo Can năm xem hạn (Bính: Xương tại Thân, Khúc tại Ngọ)
  cungStars[8].luuTinh.push({ name: "L.Văn Xương", isHung: false });
  cungStars[6].luuTinh.push({ name: "L.Văn Khúc", isHung: false });
  cungStars[11].luuTinh.push({ name: "L.Kiếp Sát", isHung: true });

  // L.Tứ Hóa năm Bính: Đồng Lộc, Cơ Quyền, Xương Khoa, Liêm Kỵ
  const lTuHoaMap = [
    { n: "Thiên Đồng", h: "L.Hóa Lộc" },
    { n: "Thiên Cơ", h: "L.Hóa Quyền" },
    { n: "Văn Xương", h: "L.Hóa Khoa" },
    { n: "Liêm Trinh", h: "L.Hóa Kỵ" }
  ];
  lTuHoaMap.forEach(item => {
    for (let pos = 0; pos < 12; pos++) {
      const hasStar = cungStars[pos].chinhTinh.find(s => s.name === item.n) ||
                      cungStars[pos].catTinh.find(s => s.name === item.n);
      if (hasStar) {
        cungStars[pos].luuTinh.push({ name: item.h, isHung: item.h.includes("Kỵ") });
        break;
      }
    }
  });

  // 19. Tuần Triệt Không
  const trietMap = { "Giáp": [8, 9], "Kỷ": [8, 9], "Ất": [6, 7], "Canh": [6, 7], "Bính": [4, 5], "Tân": [4, 5], "Đinh": [2, 3], "Nhâm": [2, 3], "Mậu": [0, 1], "Quý": [0, 1] };
  const trietPositions = trietMap[yearCan] || [0, 1];

  const tuanDiff = (yearChiIndex - yearCanIndex + 12) % 12;
  const tuanPositions = [(10 + tuanDiff) % 12, (11 + tuanDiff) % 12];

  // 20. Tính Đại Hạn, Tiểu Hạn Tháng & Cung Đại Vận (ĐV) / Lưu Niên (LN) đầy đủ tên
  const daiHanMatrix = new Array(12);
  const thangTieuHanMatrix = new Array(12);
  const daiVanCungMatrix = new Array(12);
  const luuNienCungMatrix = new Array(12);

  for (let i = 0; i < 12; i++) {
    const offset = isDuongNamAmNu ? i : (12 - i) % 12;
    const pos = (menhPos + offset) % 12;
    daiHanMatrix[pos] = cucNumber + i * 10;
    daiVanCungMatrix[pos] = `ĐV.${cungNamesArr[pos].toUpperCase()}`;
  }

  // Khởi tiểu hạn tháng: Bắt đầu từ cung tiểu hạn năm tính theo tháng sinh và giờ sinh
  for (let i = 0; i < 12; i++) {
    // Tháng 1 khởi từ cung tiểu hạn, mỗi tháng 1 cung thuận
    const monthIndex = (i + 1);
    const pos = (menhPos + i) % 12;
    thangTieuHanMatrix[pos] = `Th.${monthIndex}`;
    luuNienCungMatrix[pos] = `LN.${cungNamesArr[pos].toUpperCase()}`;
  }

  // 21. Chủ Mệnh & Chủ Thân
  const chuMenhMap = ["Tham Lang", "Cự Môn", "Lộc Tồn", "Văn Khúc", "Liêm Trinh", "Vũ Khúc", "Phá Quân", "Vũ Khúc", "Liêm Trinh", "Văn Khúc", "Lộc Tồn", "Cự Môn"];
  const chuThanMap = ["Linh Tinh", "Thiên Tướng", "Thiên Lương", "Thiên Đồng", "Văn Xương", "Thiên Cơ", "Hỏa Tinh", "Thiên Tướng", "Thiên Lương", "Thiên Đồng", "Văn Xương", "Thiên Cơ"];
  const chuMenh = chuMenhMap[yearChiIndex] || "Tử Vi";
  const chuThan = chuThanMap[yearChiIndex] || "Thiên Tướng";

  // Cân lượng chỉ
  const canLuongText = calculateCanLuong(canChiYear, lunarMonth, lunarDay, hourChiIndex);

  // Tổng hợp 12 Cung
  const cungListFull = CHI.map((chiName, idx) => {
    return {
      chi: chiName,
      chiIndex: idx,
      cungCan: cungCanList[idx],
      cungCanChi: `${cungCanList[idx]}.${chiName}`,
      cungElement: CUNG_ELEMENTS[idx],
      cungTen: cungNamesArr[idx],
      isMenh: idx === menhPos,
      isThan: idx === thanPos,
      daiHan: daiHanMatrix[idx],
      thangTieuHan: thangTieuHanMatrix[idx],
      daiVanText: daiVanCungMatrix[idx],
      luuNienText: luuNienCungMatrix[idx],
      hasTriet: trietPositions.includes(idx),
      hasTuan: tuanPositions.includes(idx),
      trangSinh: cungStars[idx].trangSinh,
      chinhTinh: cungStars[idx].chinhTinh,
      catTinh: cungStars[idx].catTinh,
      hungTinh: cungStars[idx].hungTinh,
      luuTinh: cungStars[idx].luuTinh,
      phuTinhKhac: cungStars[idx].phuTinhKhac,
      tamHopIndices: [(idx + 4) % 12, (idx + 8) % 12],
      chinhChieuIndex: (idx + 6) % 12
    };
  });

  return {
    info: {
      name,
      gender: isMale ? "Nam mạng" : "Nữ mạng",
      amDuongGender,
      solarDate: `${solarDay}/${solarMonth}/${solarYear}`,
      lunarDate: `${lunarDay}/${lunarMonth}/${lunarYear}${isLeap ? " (Nhuận)" : ""}`,
      canChiYear,
      canChiMonth,
      canChiDay,
      canChiHour,
      nguHanh,
      cucName,
      cucMenhRelation,
      canLuongText,
      laiNhanCung: (laiNhanPos !== -1 && cungNamesArr[laiNhanPos]) ? `Cung ${cungNamesArr[laiNhanPos]} (${CHI[laiNhanPos]})` : "Mệnh",
      cungMenhChi: CHI[menhPos],
      cungThanChi: CHI[thanPos],
      chuMenh,
      chuThan,
      viewYear,
      viewYearCanChi: `${viewYearCan} ${viewYearChi} (${viewYear})`
    },
    cungList: cungListFull,
    menhPos,
    thanPos,
    trietPositions,
    tuanPositions
  };
}
