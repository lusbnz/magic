/**
 * Thư viện tính toán Âm Lịch Việt Nam (Hồ Ngọc Đức algorithm)
 */

function INT(d) {
  return Math.floor(d);
}

export function jdFromDate(dd, mm, yy) {
  let a = INT((14 - mm) / 12);
  let y = yy + 4800 - a;
  let m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

export function jdToDate(jd) {
  let a, b, c, d, e, m, day, month, year;
  if (jd > 2299160) {
    let a1 = jd + 32044;
    let b1 = INT((4 * a1 + 3) / 146097);
    let c1 = a1 - INT((146097 * b1) / 4);
    let d1 = INT((4 * c1 + 3) / 1461);
    let e1 = c1 - INT((1461 * d1) / 4);
    let m1 = INT((5 * e1 + 2) / 153);
    day = e1 - INT((153 * m1 + 2) / 5) + 1;
    month = m1 + 3 - 12 * INT(m1 / 10);
    year = 100 * b1 + d1 - 4800 + INT(m1 / 10);
  } else {
    let b1 = 0;
    let c1 = jd + 32082;
    let d1 = INT((4 * c1 + 3) / 1461);
    let e1 = c1 - INT((1461 * d1) / 4);
    let m1 = INT((5 * e1 + 2) / 153);
    day = e1 - INT((153 * m1 + 2) / 5) + 1;
    month = m1 + 3 - 12 * INT(m1 / 10);
    year = d1 - 4800 + INT(m1 / 10);
  }
  return [day, month, year];
}

export function getNewMoonDay(k, timeZone = 7) {
  let T = k / 1236.85;
  let T2 = T * T;
  let T3 = T2 * T;
  let dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr);
  C1 = C1 - 0.0004 * Math.sin(3 * dr * Mpr);
  C1 = C1 + 0.0104 * Math.sin(2 * dr * F) - 0.0051 * Math.sin((M + Mpr) * dr);
  C1 = C1 - 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
  C1 = C1 - 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
  C1 = C1 + 0.001 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((2 * Mpr + M) * dr);
  let JdNew = Jd1 + C1;
  return INT(JdNew + 0.5 + timeZone / 24);
}

export function getSunLongitude(dayNumber, timeZone = 7) {
  let T = (dayNumber - 2451545.5 - timeZone / 24) / 36525;
  let T2 = T * T;
  let dr = Math.PI / 180;
  let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let M = 357.5291 + 35999.05029 * T - 0.0001537 * T2;
  let C = (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr);
  C = C + (0.019993 - 0.000101 * T) * Math.sin(2 * dr * M) + 0.000289 * Math.sin(3 * dr * M);
  let theta = L0 + C;
  theta = theta * dr;
  theta = theta - Math.PI * 2 * INT(theta / (Math.PI * 2));
  return INT((theta / Math.PI) * 6);
}

export function convertSolar2Lunar(dd, mm, yy, timeZone = 7) {
  let dayNumber = jdFromDate(dd, mm, yy);
  let k = INT((dayNumber - 2415021.0769986) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  let lunarDay = dayNumber - monthStart + 1;
  let diff = INT((monthStart - a11) / 29);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    let leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = 1;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return [lunarDay, lunarMonth, lunarYear, lunarLeap];
}

function getLunarMonth11(yy, timeZone = 7) {
  let off = jdFromDate(31, 12, yy) - 2415021;
  let k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  let sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11, timeZone = 7) {
  let k = INT((a11 - 2415021.0769986) / 29.530588853);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

export const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
export const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
export const GIO_CHI = [
  "Tý (23h-01h)",
  "Sửu (01h-03h)",
  "Dần (03h-05h)",
  "Mão (05h-07h)",
  "Thìn (07h-09h)",
  "Tỵ (09h-11h)",
  "Ngọ (11h-13h)",
  "Mùi (13h-15h)",
  "Thân (15h-17h)",
  "Dậu (17h-19h)",
  "Tuất (19h-21h)",
  "Hợi (21h-23h)"
];

export function getCanChiYear(year) {
  let canIndex = (year + 6) % 10;
  let chiIndex = (year + 8) % 12;
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}

export function getCanChiMonth(lunarMonth, lunarYear) {
  let yearCanIndex = (lunarYear + 6) % 10;
  // Tháng 1 (Dần) bắt đầu từ can theo năm (Giáp Kỷ khởi Bính Dần,...)
  let startCan = (yearCanIndex * 2 + 2) % 10;
  let monthCan = (startCan + (lunarMonth - 1)) % 10;
  let monthChi = (lunarMonth + 1) % 12; // Tháng 1 là Dần (index 2)
  return `${CAN[monthCan]} ${CHI[monthChi]}`;
}

export function getCanChiDay(solarDay, solarMonth, solarYear) {
  let jd = jdFromDate(solarDay, solarMonth, solarYear);
  let canIndex = (jd + 9) % 10;
  let chiIndex = (jd + 1) % 12;
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}

export function getCanChiHour(hourChiIndex, dayCanIndex) {
  // Giáp Kỷ khởi Giáp Tý, Ất Canh khởi Bính Tý, Bính Tân khởi Mậu Tý, Đinh Nhâm khởi Canh Tý, Mậu Quý khởi Nhâm Tý
  let startCan = (dayCanIndex * 2) % 10;
  let hourCan = (startCan + hourChiIndex) % 10;
  return `${CAN[hourCan]} ${CHI[hourChiIndex]}`;
}

export const MENH_NGU_HANH = {
  "Giáp Tý": "Hải Trung Kim", "Ất Sửu": "Hải Trung Kim", "Bính Dần": "Lư Trung Hỏa", "Đinh Mão": "Lư Trung Hỏa",
  "Mậu Thìn": "Đại Lâm Mộc", "Kỷ Tỵ": "Đại Lâm Mộc", "Canh Ngọ": "Lộ Bàng Thổ", "Tân Mùi": "Lộ Bàng Thổ",
  "Nhâm Thân": "Kiếm Phong Kim", "Quý Dậu": "Kiếm Phong Kim", "Giáp Tuất": "Sơn Đầu Hỏa", "Ất Hợi": "Sơn Đầu Hỏa",
  "Bính Tý": "Giản Hạ Thủy", "Đinh Sửu": "Giản Hạ Thủy", "Mậu Dần": "Thành Đầu Thổ", "Kỷ Mão": "Thành Đầu Thổ",
  "Canh Thìn": "Bạch Lạp Kim", "Tân Tỵ": "Bạch Lạp Kim", "Nhâm Ngọ": "Dương Liễu Mộc", "Quý Mùi": "Dương Liễu Mộc",
  "Giáp Thân": "Tuyền Trung Thủy", "Ất Dậu": "Tuyền Trung Thủy", "Bính Tuất": "Ốc Thượng Thổ", "Đinh Hợi": "Ốc Thượng Thổ",
  "Mậu Tý": "Tích Lịch Hỏa", "Kỷ Sửu": "Tích Lịch Hỏa", "Canh Dần": "Tùng Bách Mộc", "Tân Mão": "Tùng Bách Mộc",
  "Nhâm Thìn": "Trường Lưu Thủy", "Quý Tỵ": "Trường Lưu Thủy", "Giáp Ngọ": "Sa Trung Kim", "Ất Mùi": "Sa Trung Kim",
  "Bính Thân": "Sơn Hạ Hỏa", "Đinh Dậu": "Sơn Hạ Hỏa", "Mậu Tuất": "Bình Địa Mộc", "Kỷ Hợi": "Bình Địa Mộc",
  "Canh Tý": "Bích Thượng Thổ", "Tân Sửu": "Bích Thượng Thổ", "Nhâm Dần": "Kim Bạch Kim", "Quý Mão": "Kim Bạch Kim",
  "Giáp Thìn": "Phú Đăng Hỏa", "Ất Tỵ": "Phú Đăng Hỏa", "Bính Ngọ": "Thiên Hà Thủy", "Đinh Mùi": "Thiên Hà Thủy",
  "Mậu Thân": "Đại Trạch Thổ", "Kỷ Dậu": "Đại Trạch Thổ", "Canh Tuất": "Thoa Xuyến Kim", "Tân Hợi": "Thoa Xuyến Kim",
  "Nhâm Tý": "Tang Đố Mộc", "Quý Sửu": "Tang Đố Mộc", "Giáp Dần": "Đại Khê Thủy", "Ất Mão": "Đại Khê Thủy",
  "Bính Thìn": "Sa Trung Thổ", "Đinh Tỵ": "Sa Trung Thổ", "Mậu Ngọ": "Thiên Thượng Hỏa", "Kỷ Mùi": "Thiên Thượng Hỏa",
  "Canh Thân": "Thạch Lựu Mộc", "Tân Dậu": "Thạch Lựu Mộc", "Nhâm Tuất": "Đại Hải Thủy", "Quý Hợi": "Đại Hải Thủy"
};

export function getNguHanh(canChiYear) {
  return MENH_NGU_HANH[canChiYear] || "Chưa rõ";
}
