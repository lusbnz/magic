/**
 * Synastry & Compatibility Engine (So Sánh Hợp Tuổi & Đối Chiếu 2 Lá Số Tử Vi)
 * Phân tích chuyên sâu 5 Trụ Cột: Ngũ Hành Nạp Âm, Thiên Can, Địa Chi, Cung Phi Bát Trạch, Tử Vi Đẩu Số
 */

import { CAN, CHI, MENH_NGU_HANH } from './lunarCalendar.js';

// 8 Cung Phi Bát Trạch
export const CUNG_PHI_INFO = {
  1: { name: "Khảm", element: "Thủy", group: "Đông Tứ Mệnh", huongTot: "Đông Nam, Đông, Nam, Bắc", desc: "Nước sâu mưu lược, trí tuệ linh hoạt, trầm tĩnh thấu đáo" },
  2: { name: "Khôn", element: "Thổ", group: "Tây Tứ Mệnh", huongTot: "Đông Bắc, Tây Bắc, Tây, Tây Nam", desc: "Đất mẹ bao dung, điềm đạm nhu thuận, chịu thương chịu khó" },
  3: { name: "Chấn", element: "Mộc", group: "Đông Tứ Mệnh", huongTot: "Nam, Bắc, Đông Nam, Đông", desc: "Sấm sét kiên cường, dũng cảm quyết đoán, giàu nhiệt huyết" },
  4: { name: "Tốn", element: "Mộc", group: "Đông Tứ Mệnh", huongTot: "Bắc, Nam, Đông, Đông Nam", desc: "Gió mát linh hoạt, dịu dàng khéo léo, giao tiếp tinh tế" },
  6: { name: "Càn", element: "Kim", group: "Tây Tứ Mệnh", huongTot: "Tây, Tây Nam, Đông Bắc, Tây Bắc", desc: "Trời cao vững chãi, uy nghiêm quân tử, gánh vác trách nhiệm" },
  7: { name: "Đoài", element: "Kim", group: "Tây Tứ Mệnh", huongTot: "Tây Bắc, Tây Nam, Đông Bắc, Tây", desc: "Đầm hồ tươi vui, hoạt ngôn sắc sảo, lạc quan yêu đời" },
  8: { name: "Cấn", element: "Thổ", group: "Tây Tứ Mệnh", huongTot: "Tây Nam, Tây, Tây Bắc, Đông Bắc", desc: "Núi cao kiên định, chân thành cẩn trọng, thủ tín đáng tin" },
  9: { name: "Ly", element: "Hỏa", group: "Đông Tứ Mệnh", huongTot: "Đông, Đông Nam, Bắc, Nam", desc: "Lửa sáng quang minh, nhiệt tình hào sảng, trọng danh dự" }
};

// Tính Cung Phi Bát Trạch theo năm sinh & giới tính
export function getCungPhi(lunarYear, gender) {
  const y = parseInt(lunarYear);
  const isMale = gender === 'nam' || gender === 'Nam' || gender === 'Nam mạng';
  
  const last2Digits = y % 100;
  let sum = Math.floor(last2Digits / 10) + (last2Digits % 10);
  while (sum > 9) {
    sum = Math.floor(sum / 10) + (sum % 10);
  }

  let code = 0;
  if (y < 2000) {
    if (isMale) {
      code = (10 - sum) % 9 || 9;
    } else {
      code = (sum + 5) % 9 || 9;
    }
  } else {
    if (isMale) {
      code = (9 - sum) % 9 || 9;
    } else {
      code = (sum + 6) % 9 || 9;
    }
  }

  if (code === 5) {
    code = isMale ? 2 : 8;
  }

  return {
    code,
    ...CUNG_PHI_INFO[code]
  };
}

// Bảng phối Bát Cung Bát Trạch
const BAT_TRACH_MATRIX = {
  "Càn-Càn": { name: "Phục Vị", isCat: true, score: 16, desc: "Củng cố sức mạnh tinh thần, bình an hòa thuận, gắn kết đồng tâm hiệp lực", advice: "Hợp hướng Tây Bắc, duy trì sự tôn trọng lẫn nhau để gia đạo an khang." },
  "Càn-Đoài": { name: "Sinh Khí", isCat: true, score: 20, desc: "Đại Cát bậc nhất: Thu hút tài lộc dồi dào, công danh hiển đạt, con cái thông minh hiếu thuận", advice: "Hợp hướng Tây, cùng nhau kinh doanh đầu tư sẽ gặt hái thành quả lớn." },
  "Càn-Cấn": { name: "Thiên Y", isCat: true, score: 18, desc: "Trời ban phúc lộc: Thân tâm an lạc, sức khỏe dẻo dai, quý nhân luôn dang tay tương trợ", advice: "Hợp hướng Đông Bắc, gia đình êm ấm, ít ốm đau bệnh tật." },
  "Càn-Khôn": { name: "Diên Niên", isCat: true, score: 19, desc: "Thượng Cát (Âm Dương Hòa Hợp): Tình cảm mặn nồng son sắt, bách niên giai lão, tài lộc tích tụ bền vững", advice: "Hợp hướng Tây Nam (hướng Diên Niên), cuộc sống gia đạo viên mãn, vợ chồng đồng lòng tát biển Đông cũng cạn." },
  "Càn-Khảm": { name: "Lục Sát", isCat: false, score: 6, desc: "Khí trường xáo trộn: Dễ nảy sinh hiểu lầm vụn vặt, bất đồng trong chi tiêu tài chính", advice: "Hóa giải bằng cách chọn hướng phòng ngủ Thiên Y, Sinh Khí và sinh con mang ngũ hành trung gian." },
  "Càn-Ly": { name: "Tuyệt Mệnh", isCat: false, score: 2, desc: "Kim Hỏa xung khắc mạnh: Khí trường đối chọi, cần chú trọng sức khỏe và giữ tâm bình khí hòa", advice: "Dùng phong thủy bổ khuyết: Đặt bếp hướng Thiên Y, dùng các vật phẩm phong thủy hành Thổ để chuyển hóa Hỏa sinh Thổ, Thổ sinh Kim." },
  "Càn-Chấn": { name: "Ngũ Quỷ", isCat: false, score: 4, desc: "Hao tài tốn của: Dễ gặp thị phi bên ngoài tác động, tính khí cả hai đều nóng nảy", advice: "Cần phân định rạch ròi tài chính và lắng nghe trước khi tranh luận." },
  "Càn-Tốn": { name: "Họa Hại", isCat: false, score: 8, desc: "Trắc trở nhỏ: Công việc đôi lúc không như ý muốn, gặp phải chuyện thị phi vụn vặt", advice: "Tích cực làm việc thiện, tu tâm dưỡng tính để chuyển hung thành cát." },

  "Khảm-Khảm": { name: "Phục Vị", isCat: true, score: 16, desc: "Bình ổn tâm trí, gắn kết vững bền, thấu hiểu chiều sâu suy nghĩ của nhau", advice: "Hợp hướng Bắc, đồng điệu về lý tưởng sống." },
  "Khảm-Tốn": { name: "Sinh Khí", isCat: true, score: 20, desc: "Thủy Mộc tương sinh đại cát: Phúc lộc vẹn toàn, tiền tài nở rộ, con cái giỏi giang", advice: "Hợp hướng Đông Nam, kinh doanh buôn bán đại thắng." },
  "Khảm-Chấn": { name: "Thiên Y", isCat: true, score: 18, desc: "Gia đình an khang thịnh vượng, luôn có quý nhân trợ lực lúc khó khăn", advice: "Hợp hướng Đông, cuộc sống nhẹ nhàng bình an." },
  "Khảm-Ly": { name: "Diên Niên", isCat: true, score: 19, desc: "Thủy Hỏa Ký Tế: Cặp đôi âm dương bổ khuyết tuyệt đẹp, tình yêu nồng cháy và trường tồn", advice: "Hợp hướng Nam, luôn giữ lửa yêu thương và thấu hiểu." },
  "Khảm-Cấn": { name: "Ngũ Quỷ", isCat: false, score: 4, desc: "Dễ bất đồng quan điểm sống, cần tránh chuyện tiền bạc mập mờ", advice: "Hóa giải bằng hướng phòng ngủ Sinh Khí và dùng màu sắc tương sinh." },
  "Khảm-Khôn": { name: "Tuyệt Mệnh", isCat: false, score: 2, desc: "Thổ Thủy tương khắc: Khí huyết không thuận, cần chăm lo sức khỏe cả hai", advice: "Dùng hành Kim trung gian (trang sức vàng bạc, phòng ngủ hướng Tây) để Thổ sinh Kim, Kim sinh Thủy." },
  "Khảm-Đoài": { name: "Họa Hại", isCat: false, score: 8, desc: "Khẩu thiệt thị phi: Dễ cãi vã vì những điều nhỏ nhặt", advice: "Nên nhường nhịn và tránh tranh cãi trong lúc nóng giận." },

  "Cấn-Cấn": { name: "Phục Vị", isCat: true, score: 16, desc: "Ổn định vững chắc như bàn thạch, đồng lòng gìn giữ gia phong", advice: "Hợp hướng Đông Bắc, cùng chí hướng xây dựng cơ đồ." },
  "Cấn-Khôn": { name: "Sinh Khí", isCat: true, score: 20, desc: "Đại Cát Thổ Thổ tương trợ: Gia sản ngày càng tích lũy, điền trạch hưng vượng", advice: "Hợp hướng Tây Nam, rất thuận lợi cho việc mua bán nhà đất, tích trữ tài sản." },
  "Cấn-Đoài": { name: "Diên Niên", isCat: true, score: 19, desc: "Thổ sinh Kim tốt lành: Tình cảm vợ chồng thủy chung, hòa thuận từ trẻ đến già", advice: "Hợp hướng Tây, gia đình trên dưới thuận hòa." },
  "Cấn-Chấn": { name: "Lục Sát", isCat: false, score: 6, desc: "Khác biệt tính cách: Một người quá cứng nhắc, một người quá nóng nảy", advice: "Cần học cách lắng nghe và bao dung cho thiếu sót của nhau." },
  "Cấn-Tốn": { name: "Tuyệt Mệnh", isCat: false, score: 2, desc: "Mộc Thổ giao tranh: Trắc trở trong hợp tác, cần nhiều nỗ lực hòa giải", advice: "Hóa giải bằng việc sinh con hợp tuổi và đặt bàn thờ hướng Phục Vị." },
  "Cấn-Ly": { name: "Họa Hại", isCat: false, score: 8, desc: "Thị phi nho nhỏ ngoài xã hội, không ảnh hưởng lớn đến tình cảm", advice: "Giữ vững niềm tin vào đối phương." },

  "Chấn-Chấn": { name: "Phục Vị", isCat: true, score: 16, desc: "Đồng tâm hiệp lực, sự nghiệp thăng hoa, cùng nhau vượt qua mọi thử thách", advice: "Hợp hướng Đông, hỗ trợ nhau hết mình." },
  "Chấn-Ly": { name: "Sinh Khí", isCat: true, score: 20, desc: "Mộc Hỏa tương sinh rực rỡ: Danh tiếng vang xa, sự nghiệp hanh thông đại cát", advice: "Hợp hướng Nam, công danh tài lộc tấn tới." },
  "Chấn-Tốn": { name: "Diên Niên", isCat: true, score: 19, desc: "Gió mây tương ngộ: Thuận buồm xuôi gió, nhân duyên bền chặt như keo sơn", advice: "Hợp hướng Đông Nam, hạnh phúc bền lâu." },
  "Chấn-Đoài": { name: "Tuyệt Mệnh", isCat: false, score: 2, desc: "Kim Mộc tương tàn: Dễ xảy ra tranh chấp quyền lợi hoặc mâu thuẫn gia đình", advice: "Dùng hành Thủy trung gian (hồ cá, màu xanh dương, hướng Bắc) để Kim sinh Thủy, Thủy sinh Mộc." },
  "Chấn-Khôn": { name: "Họa Hại", isCat: false, score: 8, desc: "Trở ngại vụn vặt trong công việc làm ăn", advice: "Cẩn thận trong giấy tờ ký kết." },

  "Tốn-Tốn": { name: "Phục Vị", isCat: true, score: 16, desc: "Thanh nhã hòa mục, tâm đầu ý hợp, cùng yêu thích sự tự do và sáng tạo", advice: "Hợp hướng Đông Nam, hỗ trợ công việc nghệ thuật, sáng tạo." },
  "Tốn-Ly": { name: "Thiên Y", isCat: true, score: 18, desc: "Mộc sinh Hỏa ấm cúng: Tài lộc dồi dào, gia đạo ấm êm hạnh phúc", advice: "Hợp hướng Nam, sức khỏe tốt, con cái ngoan ngoãn." },
  "Tốn-Đoài": { name: "Lục Sát", isCat: false, score: 6, desc: "Khác biệt trong cách chi tiêu và thói quen sinh hoạt", advice: "Cần thống nhất kế hoạch tài chính rõ ràng." },
  "Tốn-Khôn": { name: "Ngũ Quỷ", isCat: false, score: 4, desc: "Dễ hiểu lầm ý nhau do thiếu sự chia sẻ cởi mở", advice: "Tăng cường tâm sự và chia sẻ cảm xúc mỗi ngày." },

  "Ly-Ly": { name: "Phục Vị", isCat: true, score: 16, desc: "Nhiệt huyết nhân đôi, sáng rỡ gia phong, đầy năng lượng tích cực", advice: "Hợp hướng Nam, cần kiềm chế cái tôi cá nhân." },
  "Ly-Đoài": { name: "Ngũ Quỷ", isCat: false, score: 4, desc: "Hỏa thiêu Kim khí: Dễ bốc hỏa, lời nói vô tình làm tổn thương nhau", advice: "Dùng hành Thổ trung gian (đá phong thủy, màu vàng đất) để làm dịu ngọn lửa." },
  "Ly-Khôn": { name: "Lục Sát", isCat: false, score: 6, desc: "Bất đồng sở thích và quan điểm đối nội đối ngoại", advice: "Tôn trọng sở thích và không gian riêng của nhau." },

  "Khôn-Khôn": { name: "Phục Vị", isCat: true, score: 16, desc: "Bao dung hiền hòa, vun đắp tổ ấm vững bền, tài chính an toàn", advice: "Hợp hướng Tây Nam, tích lũy điền sản rất tốt." },
  "Khôn-Đoài": { name: "Thiên Y", isCat: true, score: 18, desc: "Thổ sinh Kim đại lợi: Trời ban phúc lộc, làm ăn khấm khá, con đàn cháu đống", advice: "Hợp hướng Tây, gia đình hạnh phúc viên mãn." },

  "Đoài-Đoài": { name: "Phục Vị", isCat: true, score: 16, desc: "Tràn ngập niềm vui, đồng điệu tiếng cười, cuộc sống thi vị", advice: "Hợp hướng Tây, luôn vui vẻ lạc quan." }
};

export function evaluateBatTrach(cungPhi1, cungPhi2) {
  const key1 = `${cungPhi1.name}-${cungPhi2.name}`;
  const key2 = `${cungPhi2.name}-${cungPhi1.name}`;
  const result = BAT_TRACH_MATRIX[key1] || BAT_TRACH_MATRIX[key2] || {
    name: "Bình Hòa",
    isCat: true,
    score: 14,
    desc: "Mối quan hệ trung hòa, phụ thuộc vào nỗ lực cả hai",
    advice: "Luôn tôn trọng và vun đắp tình cảm."
  };
  return result;
}

// 2. Ngũ Hành Nạp Âm Chi Tiết
export function evaluateNguHanhNapAm(nguHanh1, nguHanh2) {
  const getBaseElement = (nh) => {
    if (nh.includes("Kim")) return "Kim";
    if (nh.includes("Mộc")) return "Mộc";
    if (nh.includes("Thủy")) return "Thủy";
    if (nh.includes("Hỏa")) return "Hỏa";
    if (nh.includes("Thổ")) return "Thổ";
    return "Thủy";
  };

  const e1 = getBaseElement(nguHanh1);
  const e2 = getBaseElement(nguHanh2);

  const sinhMap = { "Kim": "Thủy", "Thủy": "Mộc", "Mộc": "Hỏa", "Hỏa": "Thổ", "Thổ": "Kim" };
  const khacMap = { "Kim": "Mộc", "Mộc": "Thổ", "Thổ": "Thủy", "Thủy": "Hỏa", "Hỏa": "Kim" };

  if (e1 === e2) {
    return {
      score: 16,
      status: "Tương Hợp (Đồng Hành)",
      isGood: true,
      desc: `Hai bạn cùng thuộc hành ${e1} (${nguHanh1} ⟷ ${nguHanh2}). Tính cách có nhiều nét tương đồng, dễ đồng cảm và thấu hiểu lý tưởng sống của nhau.`,
      detail: `Lưỡng ${e1} thành khí: Hai người có sự gắn kết tự nhiên, cùng chung quan điểm tài chính và phong cách sinh hoạt.`
    };
  } else if (sinhMap[e1] === e2) {
    return {
      score: 20,
      status: "Tương Sinh Đại Cát (Sinh Xuất)",
      isGood: true,
      desc: `Bản mệnh ${e1} sinh dưỡng cho ${e2} (${nguHanh1} sinh ${nguHanh2}). Bạn là nguồn năng lượng, hậu phương vững chắc và mang lại may mắn lớn cho đối phương.`,
      detail: `Sự kết hợp hoàn hảo giữa ${nguHanh1} và ${nguHanh2} giúp đối phương ngày càng phát triển công danh và cảm thấy an tâm trong cuộc sống.`
    };
  } else if (sinhMap[e2] === e1) {
    return {
      score: 19,
      status: "Được Tương Sinh (Sinh Nhập)",
      isGood: true,
      desc: `Bản mệnh ${e2} sinh dưỡng cho ${e1} (${nguHanh2} sinh ${nguHanh1}). Đối phương đóng vai trò như dòng dưỡng chất mát lành nuôi dưỡng bản mệnh của bạn, luôn là điểm tựa cát lành.`,
      detail: `Mối quan hệ mang tính nuôi dưỡng sâu sắc: ${nguHanh2} hỗ trợ đắc lực cho ${nguHanh1} vượt qua mọi thăng trầm và gặt hái thành công.`
    };
  } else if (khacMap[e1] === e2) {
    return {
      score: 8,
      status: "Tương Khắc Nhẹ (Khắc Xuất)",
      isGood: false,
      desc: `${e1} khắc ${e2} (${nguHanh1} khắc ${nguHanh2}). Bạn có phần lấn lướt và áp đặt lên đối phương, cần học cách lắng nghe và tôn trọng sự tự do của người kia.`,
      detail: `Để hóa giải, nên sử dụng ngũ hành trung gian ${sinhMap[e2]} trong trang trí nhà cửa hoặc chọn người hợp tuổi làm trung gian hòa giải.`
    };
  } else {
    return {
      score: 6,
      status: "Bị Tương Khắc (Khắc Nhập)",
      isGood: false,
      desc: `${e2} khắc ${e1} (${nguHanh2} khắc ${nguHanh1}). Bạn dễ cảm thấy áp lực và bị gò bó trong mối quan hệ này nếu không tìm được tiếng nói chung.`,
      detail: `Phương pháp hóa giải: Sử dụng ngũ hành cầu nối ${sinhMap[e1]} để chuyển hóa năng lượng xung khắc thành tương sinh tuần hoàn.`
    };
  }
}

// 3. Thiên Can Năm Sinh Chi Tiết
export function evaluateThienCan(can1, can2) {
  const c1 = can1.split(' ')[0];
  const c2 = can2.split(' ')[0];

  const CAN_ELEMENTS = {
    "Giáp": "Dương Mộc", "Ất": "Âm Mộc",
    "Bính": "Dương Hỏa", "Đinh": "Âm Hỏa",
    "Mậu": "Dương Thổ", "Kỷ": "Âm Thổ",
    "Canh": "Dương Kim", "Tân": "Âm Kim",
    "Nhâm": "Dương Thủy", "Quý": "Âm Thủy"
  };

  const hopMap = {
    "Giáp": "Kỷ", "Kỷ": "Giáp",
    "Ất": "Canh", "Canh": "Ất",
    "Bính": "Tân", "Tân": "Bính",
    "Đinh": "Nhâm", "Nhâm": "Đinh",
    "Mậu": "Quý", "Quý": "Mậu"
  };

  const khacMap = {
    "Giáp": ["Mậu", "Canh"], "Ất": ["Kỷ", "Tân"],
    "Bính": ["Canh", "Nhâm"], "Đinh": ["Tân", "Quý"],
    "Mậu": ["Nhâm", "Giáp"], "Kỷ": ["Quý", "Ất"],
    "Canh": ["Giáp", "Bính"], "Tân": ["Ất", "Đinh"],
    "Nhâm": ["Bính", "Mậu"], "Quý": ["Đinh", "Kỷ"]
  };

  const el1 = CAN_ELEMENTS[c1] || "";
  const el2 = CAN_ELEMENTS[c2] || "";

  if (hopMap[c1] === c2) {
    return {
      score: 20,
      status: "Thiên Can Hóa Hợp (Thượng Cát)",
      isGood: true,
      desc: `Thiên Can ${c1} (${el1}) và ${c2} (${el2}) thuộc cặp Can Hợp hóa khí tốt lành. Hai người có lực hút tự nhiên, ăn ý trong lời ăn tiếng nói và dễ đồng lòng trong mọi quyết định.`,
      detail: `Cặp đôi Can Hợp mang lại hòa khí lâu bền, giảm thiểu tối đa các tranh cãi không đáng có trong cuộc sống chung.`
    };
  } else if (khacMap[c1]?.includes(c2) || khacMap[c2]?.includes(c1)) {
    return {
      score: 6,
      status: "Thiên Can Tương Khắc",
      isGood: false,
      desc: `Thiên Can ${c1} (${el1}) và ${c2} (${el2}) có sự xung khắc về hành khí. Đôi khi có sự đối lập về quan điểm cá nhân, cần nhẫn nại giải thích thay vì áp đặt.`,
      detail: `Lời khuyên: Rèn luyện thói quen lắng nghe trọn vẹn ý kiến của đối phương trước khi phản hồi.`
    };
  } else {
    return {
      score: 14,
      status: "Thiên Can Bình Hòa / Tương Sinh",
      isGood: true,
      desc: `Thiên Can ${c1} (${el1}) và ${c2} (${el2}) bình hòa, tương sinh mềm dẻo. Mối quan hệ diễn ra tự nhiên, không có lực cản hay xung đột từ thiên khí.`,
      detail: `Quan hệ ổn định, dễ tạo dựng môi trường thuận lợi để cùng nhau phát triển sự nghiệp và gia đạo.`
    };
  }
}

// 4. Địa Chi Năm Sinh Chi Tiết
export function evaluateDiaChi(chi1, chi2) {
  const TAM_HOP = [
    { group: ["Thân", "Tý", "Thìn"], name: "Thủy Cục Tam Hợp", desc: "Trí tuệ, linh hoạt, tài lộc dồi dào như nước nguồn" },
    { group: ["Dần", "Ngọ", "Tuất"], name: "Hỏa Cục Tam Hợp", desc: "Nhiệt huyết, danh vọng, rạng rỡ gia phong và sự nghiệp" },
    { group: ["Hợi", "Mão", "Mùi"], name: "Mộc Cục Tam Hợp", desc: "Nhân đức, trường tồn, con cái phát đạt và gia đạo an khang" },
    { group: ["Tỵ", "Dậu", "Sửu"], name: "Kim Cục Tam Hợp", desc: "Ý chí kiên định, kỷ luật, tụ tài bền vững và danh giá" }
  ];

  const LUC_HOP = [
    { pair: ["Tý", "Sửu"], desc: "Thổ Thủy hòa hợp, cùng nhau gầy dựng nền tảng vững chắc" },
    { pair: ["Dần", "Hợi"], desc: "Thủy Mộc tương sinh, phúc lộc song toàn" },
    { pair: ["Mão", "Tuất"], desc: "Hỏa hóa quang minh, hỗ trợ nhau thăng tiến" },
    { pair: ["Thìn", "Dậu"], desc: "Thổ Kim sinh tài, tiền tài dồi dào hưng vượng" },
    { pair: ["Tỵ", "Thân"], desc: "Thủy khí tương giao, thông minh tháo vát" },
    { pair: ["Ngọ", "Mùi"], desc: "Nhật Nguyệt tương hợp, gia đạo ấm êm bách niên giai lão" }
  ];

  const LUC_XUNG = [
    { pair: ["Tý", "Ngọ"], desc: "Thủy Hỏa tương tranh, dễ bất đồng vì những việc bất ngờ" },
    { pair: ["Sửu", "Mùi"], desc: "Thổ khí xung đột, cả hai đều cứng đầu không chịu nhường nhịn" },
    { pair: ["Dần", "Thân"], desc: "Kim Mộc đối đầu, cần học cách thỏa hiệp" },
    { pair: ["Mão", "Dậu"], desc: "Kim Mộc giao chiến, dễ tổn thương vì lời nói" },
    { pair: ["Thìn", "Tuất"], desc: "Thổ Thổ kích động, cái tôi cá nhân quá cao" },
    { pair: ["Tỵ", "Hợi"], desc: "Thủy Hỏa kích bác, cần giữ bình tĩnh lúc tranh luận" }
  ];

  const tamHopFound = TAM_HOP.find(t => t.group.includes(chi1) && t.group.includes(chi2));
  if (tamHopFound) {
    return {
      score: 20,
      status: `Tam Hợp Đại Cát (${tamHopFound.name})`,
      isGood: true,
      desc: `Địa Chi ${chi1} và ${chi2} thuộc thế Tam Hợp (${tamHopFound.name}). ${tamHopFound.desc}. Tạo thế kiềng ba chân vững chãi cho tương lai.`,
      detail: `Đây là một trong những nét quý tướng lớn nhất trong phong thủy hôn nhân và làm ăn, giúp gia đạo thịnh vượng bền vững.`
    };
  }

  const lucHopFound = LUC_HOP.find(l => (l.pair[0] === chi1 && l.pair[1] === chi2) || (l.pair[0] === chi2 && l.pair[1] === chi1));
  if (lucHopFound) {
    return {
      score: 20,
      status: "Lục Hợp Quý Tướng",
      isGood: true,
      desc: `Địa Chi ${chi1} và ${chi2} thuộc thế Lục Hợp. ${lucHopFound.desc}. Âm dương hòa hợp, gắn bó keo sơn và nâng đỡ lẫn nhau.`,
      detail: `Lục Hợp đem lại sự gắn kết tâm linh và tinh thần rất sâu sắc giữa hai người.`
    };
  }

  const lucXungFound = LUC_XUNG.find(x => (x.pair[0] === chi1 && x.pair[1] === chi2) || (x.pair[0] === chi2 && x.pair[1] === chi1));
  if (lucXungFound) {
    return {
      score: 4,
      status: "Địa Chi Lục Xung",
      isGood: false,
      desc: `Địa Chi ${chi1} và ${chi2} thuộc thế Lục Xung. ${lucXungFound.desc}.`,
      detail: `Cách hóa giải: Nhường nhịn lúc nóng giận, chọn các thành viên hợp tuổi trong gia đình hoặc dùng vật phẩm phong thủy Tam Hợp để trung hòa.`
    };
  }

  return {
    score: 14,
    status: "Địa Chi Bình Hòa",
    isGood: true,
    desc: `Địa Chi ${chi1} và ${chi2} bình hòa, không phạm xung hại phá tuyệt. Môi trường đời sống ổn định, dễ dàng thích nghi với thói quen của nhau.`,
    detail: `Nền tảng thuận lợi để cùng vun đắp tổ ấm hoặc hợp tác công việc bền lâu.`
  };
}

// 5. Tử Vi Đẩu Số: Đối chiếu Mệnh - Thân & Phu Thê / Quan Lộc Chi Tiết
export function evaluateTuViCompatibility(chart1, chart2, compareType = 'marriage') {
  const menh1 = chart1.cungList[chart1.menhPos];
  const menh2 = chart2.cungList[chart2.menhPos];

  const stars1 = menh1.chinhTinh.map(s => `${s.name} (${s.dacTinh || 'Đ'})`);
  const stars2 = menh2.chinhTinh.map(s => `${s.name} (${s.dacTinh || 'Đ'})`);

  const bareStars1 = menh1.chinhTinh.map(s => s.name);
  const bareStars2 = menh2.chinhTinh.map(s => s.name);

  const isTuPhu = (stars) => stars.some(s => ["Tử Vi", "Thiên Phủ", "Vũ Khúc", "Thiên Tướng"].includes(s));
  const isSatPha = (stars) => stars.some(s => ["Thất Sát", "Phá Quân", "Tham Lang"].includes(s));
  const isCoNguyet = (stars) => stars.some(s => ["Thiên Cơ", "Thái Âm", "Thiên Đồng", "Thiên Lương"].includes(s));
  const isCuNhat = (stars) => stars.some(s => ["Cự Môn", "Thái Dương"].includes(s));

  let score = 16;
  let patternName = "Bổ Trợ Đa Dạng";
  let summary = "";
  let detailAnalysis = "";

  if (isTuPhu(bareStars1) && isTuPhu(bareStars2)) {
    score = 19;
    patternName = "Tử Phủ Đồng Lâm (Song Hành Quyền Quý)";
    summary = "Cả hai đều mang phong thái lãnh đạo, đĩnh đạc, trọng uy tín và có khát vọng lớn.";
    detailAnalysis = "Rất thuận lợi để cùng nhau quản trị doanh nghiệp lớn hoặc gây dựng gia thế danh giá, cần chú ý nhường nhịn nhau trong việc ra quyết định.";
  } else if ((isTuPhu(bareStars1) && isCoNguyet(bareStars2)) || (isCoNguyet(bareStars1) && isTuPhu(bareStars2))) {
    score = 20;
    patternName = "Tử Phủ Phối Hợp Cơ Nguyệt (Nhu Cương Bổ Khuyết)";
    summary = "Thế phối hợp tuyệt vời: Một người quyết đoán định hướng chiến lược, một người tỉ mỉ chu toàn chăm sóc hậu phương.";
    detailAnalysis = "Sự kết hợp giữa trí tuệ cơ mưu và uy lực lãnh đạo tạo nên một thể thống nhất cực kỳ vững mạnh trong cả gia đạo lẫn sự nghiệp.";
  } else if (isSatPha(bareStars1) && isSatPha(bareStars2)) {
    score = 16;
    patternName = "Sát Phá Tương Phùng (Dũng Cảm Xung Pha)";
    summary = "Cả hai đều cá tính mạnh mẽ, dám nghĩ dám làm, giàu năng lượng đổi mới.";
    detailAnalysis = "Tạo nên sức bật kinh doanh rất lớn khi thị trường biến động, tuy nhiên cần giữ bình tĩnh và không nên quyết định khi đang cảm xúc.";
  } else if (isCoNguyet(bareStars1) && isCoNguyet(bareStars2)) {
    score = 18;
    patternName = "Cơ Nguyệt Đồng Lương (Thanh Cao Thuần Hậu)";
    summary = "Tâm hồn đồng điệu, cuộc sống nhẹ nhàng tình cảm, giàu lòng trắc ẩn và biết chăm lo cho gia đình.";
    detailAnalysis = "Gia đạo êm ấm, ít sóng gió, thích hợp các ngành nghề chuyên môn cao, giáo dục, tài chính hoặc nghiên cứu sáng tạo.";
  } else {
    score = 16;
    patternName = "Giao Thoa Tinh Tú Đa Chiều";
    summary = "Hai lá số có sự giao thoa hài hòa giữa các bộ sao, tạo nên sự bù trừ phong phú trong tính cách và tư duy.";
    detailAnalysis = "Người này là mảnh ghép hoàn hảo cho những điểm mà người kia còn thiếu sót trong việc nhìn nhận cuộc sống.";
  }

  const phuThe1 = chart1.cungList.find(c => c.cungTen === "Phu Thê");
  const phuThe2 = chart2.cungList.find(c => c.cungTen === "Phu Thê");
  const quan1 = chart1.cungList.find(c => c.cungTen === "Quan Lộc");
  const quan2 = chart2.cungList.find(c => c.cungTen === "Quan Lộc");

  const phuStars1 = phuThe1?.chinhTinh.map(s => `${s.name} (${s.dacTinh || 'Đ'})`).join(', ') || 'Vô chính diệu';
  const phuStars2 = phuThe2?.chinhTinh.map(s => `${s.name} (${s.dacTinh || 'Đ'})`).join(', ') || 'Vô chính diệu';
  const quanStars1 = quan1?.chinhTinh.map(s => `${s.name} (${s.dacTinh || 'Đ'})`).join(', ') || 'Vô chính diệu';
  const quanStars2 = quan2?.chinhTinh.map(s => `${s.name} (${s.dacTinh || 'Đ'})`).join(', ') || 'Vô chính diệu';

  return {
    score,
    status: score >= 18 ? `Tử Vi Tương Hợp Cao (${patternName})` : `Tử Vi Bổ Trợ Tốt (${patternName})`,
    isGood: score >= 14,
    desc: summary,
    detail: detailAnalysis,
    details: {
      menh1Stars: stars1.join(', ') || 'Vô chính diệu',
      menh2Stars: stars2.join(', ') || 'Vô chính diệu',
      cungMenhChi1: chart1.info.cungMenhChi,
      cungMenhChi2: chart2.info.cungMenhChi,
      cungThanChi1: chart1.info.cungThanChi,
      cungThanChi2: chart2.info.cungThanChi,
      phuThe1Chi: phuThe1?.chi,
      phuThe2Chi: phuThe2?.chi,
      phuStars1,
      phuStars2,
      quanStars1,
      quanStars2,
      compareType
    }
  };
}

// Tổng hợp Đánh Giá Tương Hợp 2 Lá Số Toàn Diện (Tổng Điểm 100)
export function calculateOverallCompatibility(chart1, chart2, compareType = 'marriage') {
  const info1 = chart1.info;
  const info2 = chart2.info;

  // 1. Cung Phi Bát Trạch (20đ)
  const cungPhi1 = getCungPhi(info1.lunarDate.split('/')[2], info1.gender);
  const cungPhi2 = getCungPhi(info2.lunarDate.split('/')[2], info2.gender);
  const batTrach = evaluateBatTrach(cungPhi1, cungPhi2);

  // 2. Ngũ Hành Nạp Âm (20đ)
  const nguHanh = evaluateNguHanhNapAm(info1.nguHanh, info2.nguHanh);

  // 3. Thiên Can (20đ)
  const thienCan = evaluateThienCan(info1.canChiYear, info2.canChiYear);

  // 4. Địa Chi (20đ)
  const chi1 = info1.canChiYear.split(' ')[1];
  const chi2 = info2.canChiYear.split(' ')[1];
  const diaChi = evaluateDiaChi(chi1, chi2);

  // 5. Tử Vi Đẩu Số (20đ)
  const tuVi = evaluateTuViCompatibility(chart1, chart2, compareType);

  const totalScore = batTrach.score + nguHanh.score + thienCan.score + diaChi.score + tuVi.score;

  let overallRating = "Bình Hòa";
  let ratingColor = "#f59e0b";
  let ratingBadge = "bg-amber-50 text-amber-700 border-amber-200";

  if (totalScore >= 85) {
    overallRating = "Đại Cát (Hòa Hợp Tuyệt Vời)";
    ratingColor = "#10b981";
    ratingBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (totalScore >= 70) {
    overallRating = "Cát Lành (Khá Hòa Hợp)";
    ratingColor = "#059669";
    ratingBadge = "bg-teal-50 text-teal-700 border-teal-200";
  } else if (totalScore >= 55) {
    overallRating = "Bình Hòa (Cần Thấu Hiểu & Nhường Nhịn)";
    ratingColor = "#d97706";
    ratingBadge = "bg-amber-50 text-amber-800 border-amber-300";
  } else if (totalScore >= 40) {
    overallRating = "Có Xung Khắc (Cần Cải Thiện & Hóa Giải)";
    ratingColor = "#ea580c";
    ratingBadge = "bg-orange-50 text-orange-800 border-orange-300";
  } else {
    overallRating = "Xung Khắc Mạnh (Cần Thận Trọng & Hóa Giải Phong Thủy)";
    ratingColor = "#dc2626";
    ratingBadge = "bg-rose-50 text-rose-800 border-rose-300";
  }

  return {
    totalScore,
    overallRating,
    ratingColor,
    ratingBadge,
    pillars: [
      {
        id: "nguHanh",
        title: "1. Ngũ Hành Bản Mệnh (Nạp Âm)",
        score: nguHanh.score,
        maxScore: 20,
        status: nguHanh.status,
        isGood: nguHanh.isGood,
        desc: nguHanh.desc,
        detail: nguHanh.detail,
        tag: `${info1.nguHanh} ⟷ ${info2.nguHanh}`
      },
      {
        id: "cungPhi",
        title: "2. Cung Phi Bát Tự (Bát Trạch)",
        score: batTrach.score,
        maxScore: 20,
        status: `${batTrach.name} (${batTrach.isCat ? "Cát Khí" : "Hung Khí"})`,
        isGood: batTrach.isCat,
        desc: batTrach.desc,
        detail: `Lời khuyên hướng: ${batTrach.advice || "Bố trí không gian sống hài hòa"}`,
        tag: `${cungPhi1.name} (${cungPhi1.element} - ${cungPhi1.group}) ⟷ ${cungPhi2.name} (${cungPhi2.element} - ${cungPhi2.group})`
      },
      {
        id: "thienCan",
        title: "3. Thiên Can Năm Sinh",
        score: thienCan.score,
        maxScore: 20,
        status: thienCan.status,
        isGood: thienCan.isGood,
        desc: thienCan.desc,
        detail: thienCan.detail,
        tag: `Can ${info1.canChiYear.split(' ')[0]} ⟷ Can ${info2.canChiYear.split(' ')[0]}`
      },
      {
        id: "diaChi",
        title: "4. Địa Chi Năm Sinh (12 Con Giáp)",
        score: diaChi.score,
        maxScore: 20,
        status: diaChi.status,
        isGood: diaChi.isGood,
        desc: diaChi.desc,
        detail: diaChi.detail,
        tag: `Tuổi ${chi1} ⟷ Tuổi ${chi2}`
      },
      {
        id: "tuVi",
        title: "5. Tử Vi Đẩu Số (Mệnh & Thân)",
        score: tuVi.score,
        maxScore: 20,
        status: tuVi.status,
        isGood: tuVi.isGood,
        desc: tuVi.desc,
        detail: tuVi.detail,
        tag: `Mệnh [${tuVi.details.menh1Stars}] ⟷ Mệnh [${tuVi.details.menh2Stars}]`
      }
    ],
    tuViDetails: tuVi.details,
    info1: {
      ...info1,
      cungPhi: cungPhi1
    },
    info2: {
      ...info2,
      cungPhi: cungPhi2
    },
    compareType
  };
}
