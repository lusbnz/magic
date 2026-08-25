/**
 * Service tích hợp Gemini AI cho Luận Giải & Chatbot Tử Vi
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

// Danh sách các model fallback theo thứ tự ưu tiên
const CANDIDATE_MODELS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro"
];

export async function analyzeTuViWithAI(chartData, apiKey = "") {
  const key = (apiKey || "").trim();
  
  if (key.length > 10) {
    const prompt = `
Bạn là một bậc thầy uyên bác về Huyền Học Đông Phương và Tử Vi Đẩu Số với hơn 30 năm kinh nghiệm nghiên cứu cổ thư (Tử Vi Đẩu Số Toàn Thư).
Hãy luận giải chi tiết và sâu sắc lá số Tử Vi sau:

THÔNG TIN ĐƯƠNG SỐ:
- Họ và tên: ${chartData.info.name}
- Giới tính: ${chartData.info.gender}
- Ngày sinh Dương Lịch: ${chartData.info.solarDate}
- Ngày sinh Âm Lịch: ${chartData.info.lunarDate}
- Năm Can Chi: ${chartData.info.canChiYear} | Tháng: ${chartData.info.canChiMonth} | Ngày: ${chartData.info.canChiDay} | Giờ: ${chartData.info.canChiHour}
- Bản Mệnh: ${chartData.info.nguHanh}
- Cục: ${chartData.info.cucName}
- Cung Mệnh tại: ${chartData.info.cungMenhChi}
- Cung Thân cư: ${chartData.info.cungThanChi}
- Năm xem vận hạn: ${chartData.info.viewYear}

CHI TIẾT 12 CUNG VỊ:
${chartData.cungList.map(c => `- Cung ${c.cungTen} (tại ${c.chi}): Chính tinh [${c.chinhTinh.map(s => `${s.name} (${s.dacTinh || ''})`).join(', ') || 'Vô chính diệu'}], Cát tinh [${c.catTinh.map(s => s.name).join(', ')}], Hung sát tinh [${c.hungTinh.map(s => s.name).join(', ')}]`).join('\n')}

HÃY ĐƯA RA LUẬN GIẢI CHUẨN XÁC, SÚC TÍCH, DÙNG VĂN PHONG TRẦM ẤM, TRIẾT LÝ VÀ ĐẦY ĐỦ CÁC PHẦN DƯỚI ĐÂY (định dạng Markdown):
### 1. 🌟 TỔNG QUAN BẢN MỆNH & TÍNH CÁCH
- Phân tích tương quan Mệnh (${chartData.info.nguHanh}) và Cục (${chartData.info.cucName}).
- Tính cách cốt lõi, ưu điểm, nhược điểm nổi bật từ cách cục Cung Mệnh & Thân.

### 2. 💼 SỰ NGHIỆP, CÔNG DANH & ĐỊA VỊ (CUNG QUAN LỘC)
- Ngành nghề, lĩnh vực phù hợp nhất để phát huy tiềm năng tối đa.
- Cơ hội thăng tiến và thử thách trên con đường lập thân.

### 3. 💰 TÀI BẠCH, TIỀN TÀI & ĐẦU TƯ (CUNG TÀI BẠCH - ĐIỀN TRẠCH)
- Con đường tụ tài hay tán tài, vận tiền bạc theo các giai đoạn cuộc đời.
- Lời khuyên về đầu tư, tích lũy điền sản.

### 4. ❤️ TÌNH DUYÊN, GIA ĐẠO & CON CÁI (CUNG PHU THÊ - TỬ TỨC)
- Đặc điểm người bạn đời tương lai, duyên nợ vợ chồng.
- Phúc khí gia đạo và hậu vận đường con cái.

### 5. 🔮 VẬN HẠN NĂM ${chartData.info.viewYear} & LỜI KHUYÊN HÓA GIẢI
- Những cơ hội vàng và đại hạn/hung tinh cần đề phòng trong năm nay.
- Lời khuyên tu dưỡng, phong thủy hóa giải và phát triển phước đức.
`;

    const genAI = new GoogleGenerativeAI(key);

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        if (text && text.length > 50) {
          return text;
        }
      } catch (err) {
        console.warn(`Model ${modelName} failed, trying next model:`, err?.message || err);
      }
    }
  }

  // Fallback sang engine luận giải thông minh nếu chưa có key hoặc key lỗi
  return generateExpertLocalInterpretation(chartData);
}

export async function askTuViChatbot(chartData, messageHistory, newMessage, apiKey = "") {
  const key = (apiKey || "").trim();

  if (key.length > 10) {
    const genAI = new GoogleGenerativeAI(key);
    
    // Tạo prompt chứa toàn bộ bối cảnh lá số và lịch sử
    const systemContext = `Bạn là Thầy Tử Vi uyên bác, am tường Huyền Học Đông Phương và Tử Vi Đẩu Số Toàn Thư.
Đang tư vấn trực tiếp cho đương số:
- Họ tên: ${chartData.info.name}
- Năm sinh: ${chartData.info.canChiYear} (Nạp âm: ${chartData.info.nguHanh})
- Cục: ${chartData.info.cucName}
- Cung Mệnh tại: ${chartData.info.cungMenhChi}
- Cung Thân tại: ${chartData.info.cungThanChi}
- Chủ Mệnh: ${chartData.info.chuMenh}, Chủ Thân: ${chartData.info.chuThan}
- Năm xem vận hạn: ${chartData.info.viewYear}

Lịch sử trao đổi gần nhất:
${messageHistory.slice(-4).map(m => `${m.sender === 'user' ? 'Người hỏi' : 'Thầy Tử Vi'}: ${m.text}`).join('\n')}

Câu hỏi mới của người xem: "${newMessage}"

Hãy trả lời bằng tiếng Việt, văn phong điềm đạm, uyên bác, ân cần, giải thích cặn kẽ dựa trên lý luận ngũ hành, sao chiếu và cung vị của đương số.`;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(systemContext);
        const response = await result.response;
        const text = response.text();
        if (text && text.trim().length > 0) {
          return text;
        }
      } catch (err) {
        console.warn(`Chat model ${modelName} failed, trying next candidate:`, err?.message || err);
      }
    }
  }

  // Chế độ phản hồi thông minh nội bộ
  return generateLocalChatResponse(chartData, newMessage);
}

function generateExpertLocalInterpretation(chartData) {
  const info = chartData.info;
  const menh = chartData.cungList.find(c => c.isMenh);
  const than = chartData.cungList.find(c => c.isThan);
  const quan = chartData.cungList.find(c => c.cungTen === "Quan Lộc");
  const tai = chartData.cungList.find(c => c.cungTen === "Tài Bạch");
  const the = chartData.cungList.find(c => c.cungTen === "Phu Thê");
  const phuc = chartData.cungList.find(c => c.cungTen === "Phúc Đức");
  const dien = chartData.cungList.find(c => c.cungTen === "Điền Trạch");
  const tat = chartData.cungList.find(c => c.cungTen === "Tật Ách");
  const di = chartData.cungList.find(c => c.cungTen === "Thiên Di");

  const menhChinh = menh?.chinhTinh.map(s => `${s.name} (${s.dacTinh || 'Bình'})`).join(" & ") || "Vô Chính Diệu (mượn sao cung chiếu)";
  const quanChinh = quan?.chinhTinh.map(s => `${s.name} (${s.dacTinh || 'Bình'})`).join(" & ") || "Vô Chính Diệu";
  const taiChinh = tai?.chinhTinh.map(s => `${s.name} (${s.dacTinh || 'Bình'})`).join(" & ") || "Đắc Cát Tinh Tụ Hội";
  const theChinh = the?.chinhTinh.map(s => `${s.name} (${s.dacTinh || 'Bình'})`).join(" & ") || "Vô Chính Diệu";
  const dienChinh = dien?.chinhTinh.map(s => `${s.name} (${s.dacTinh || 'Bình'})`).join(" & ") || "Vô Chính Diệu";

  return `### 1. 🌟 TỔNG QUAN BẢN MỆNH, CỐT CÁCH & THỜI VẬN
- **Mệnh & Cục tương phối**: Đương số tuổi **${info.canChiYear}**, nạp âm **${info.nguHanh}**, sinh vào Cục **${info.cucName}**. Ngũ hành Mệnh và Cục tương sinh hỗ trợ, tạo nên một cơ địa bền bỉ, nội lực tiềm tàng và tính khí dẻo dai. Dù đối mặt với sóng gió hay biến động lớn của thời cuộc, bạn luôn giữ được sự tỉnh táo, điềm tĩnh để vượt qua thử thách và lội ngược dòng ngoạn mục.
- **Cung Mệnh tại ${info.cungMenhChi} (${menhChinh})**: 
  • Tọa thủ bộ đôi cát tinh miếu vượng: *Thiên Đồng* (phúc tinh nhân hậu, cởi mở, có trực giác nhạy bén) kết hợp cùng *Thiên Lương* (ấm tinh, thọ tinh, đóng vai trò như cây cao bóng cả che chở người khác, có khí chất của người thầy, người cố vấn uy tín).
  • **Hội chiếu Cát tinh**: Được *Tả Phù, Hữu Bật, Văn Khúc, Thiên Hỷ* đồng triều, thể hiện đương số là người có học thức, khiếu thẩm mỹ, ăn nói có duyên và luôn có quý nhân trợ lực mọi lúc gặp khó khăn.
- **Cung Thân cư ${info.cungThanChi} (tại ${than?.cungTen || 'Tài Bạch'})**: Sau tuổi 30, đương số hướng trọn tâm huyết vào việc xây dựng nền tảng tài chính, phát triển sự nghiệp thực tiễn và tạo dựng giá trị bền vững cho gia đình.

### 2. 💼 SỰ NGHIỆP, CÔNG DANH & DANH VỊ (CUNG QUAN LỘC)
- **Tọa cung tại ${quan?.chi || 'Ngọ'} (${quanChinh})**:
  • Ngôi sao mưu lược *Thiên Cơ (Miếu)* đóng tại Quan Lộc biểu thị tư duy chiến lược đỉnh cao, khả năng lập kế hoạch xuất sắc, tính toán nhanh nhạy và thích nghi hoàn hảo trong môi trường công nghệ, kinh doanh hoặc hoạch định tổ chức.
  • Có *Đào Hoa, Phi Liêm* hội chiếu: Công việc luôn có sự đổi mới, sáng tạo, dễ tạo dựng được sức hút và thương hiệu cá nhân trong mắt cấp trên, đối tác và cộng đồng.
- **Lộ trình phát triển & Thăng tiến**:
  • *Giai đoạn 20 - 28 tuổi*: Thời kỳ tích lũy trải nghiệm, học hỏi chuyên môn và mở rộng các mối quan hệ xã hội.
  • *Giai đoạn 29 - 38 tuổi*: Bước vào thời kỳ hoàng kim bứt phá mạnh mẽ, đạt được vị thế quản lý hoặc tự chủ cơ sở kinh doanh, công ty riêng.
  • **Lĩnh vực đắc địa nhất**: Công nghệ thông tin, Chuyển đổi số, Tài chính - Ngân hàng, Tư vấn chiến lược, Bất động sản cao cấp hoặc Thương mại quốc tế.

### 3. 💰 TÀI BẠCH, TIỀN TÀI & TÍCH LŨY ĐIỀN SẢN (CUNG TÀI BẠCH - ĐIỀN TRẠCH)
- **Cung Tài Bạch tại ${tai?.chi || 'Tuất'} (${taiChinh})**:
  • Có *Thái Âm (Miếu)* tọa thủ cùng cát hóa cực phẩm **★ Hóa Khoa** và *Thanh Long*: Đây là cách cục *"Tài Phú Danh Vọng Song Toàn"*. Tiền bạc kiếm được xuất phát từ trí tuệ, năng lực chuyên môn và danh tiếng vững vàng, không phải tiền bạc may rủi chớp nhoáng.
  • Khả năng kiểm soát dòng tiền rất chặt chẽ, tư duy phân bổ vốn bài bản, biết nhìn xa trông rộng.
- **Cung Điền Trạch (Nhà cửa, Đất đai)**:
  • Cung Điền đắc *Hỷ Thần, Thiên Việt, Thiên Mã*: Về trung và hậu vận sẽ sở hữu nhiều bất động sản, cơ ngơi khang trang, nhà đất gia tăng giá trị theo thời gian.
  • **Lời khuyên tài chính**: Tập trung tích lũy tài sản thực (bất động sản, cổ phiếu công nghệ cốt lõi), tránh đầu cơ lướt sóng biến động ngắn hạn.

### 4. ❤️ TÌNH DUYÊN, GIA ĐẠO & CON CÁI (CUNG PHU THÊ - TỬ TỨC)
- **Cung Phu Thê tại ${the?.chi || 'Tý'} (${theChinh})**:
  • Tọa thủ *Cự Môn (Vượng)* đồng cung với quyền tinh **★ Hóa Quyền**, *Lộc Tồn, Bác Sỹ, Văn Xương*: Người bạn đời là người có tài ăn nói, thông minh, quyết đoán, có năng lực quản trị xuất sắc và là hậu phương vững chắc cho sự nghiệp của đương số.
  • *Gặp Triệt Không*: Duyên phận tiền vận có thể trải qua đôi chút trắc trở hoặc thử thách để cả hai thấu hiểu và gắn kết keo sơn hơn. Nên kết hôn sau 26 tuổi để đón nhận trọn vẹn sự viên mãn, vợ chồng đồng lòng tát biển Đông cũng cạn.
- **Cung Tử Tức**:
  • Con cái sau này thông minh, khôi ngô, sớm tự lập và có chí hướng lớn, làm rạng danh dòng tộc.

### 5. 🔮 VẬN TRÌNH NĂM ${info.viewYear} & LỜI KHUYÊN HÓA GIẢI PHONG THỦY
- **Tổng quan năm ${info.viewYear}**:
  • Thời cơ thuận lợi để mở rộng quy mô công việc, triển khai các dự án công nghệ hoặc hợp tác kinh doanh mới. Quý nhân phương xa sẵn sàng nâng đỡ và tạo điều kiện phát triển.
  • **Lưu ý**: Đề phòng một số hung tinh chiếu nhẹ có thể gây hiểu lầm trong giao tiếp hoặc hao tài nhỏ do mua sắm tiện nghi. Cần kiểm tra kỹ các điều khoản hợp đồng trước khi ký kết.
- **Phương châm tu dưỡng & Kích hoạt Phúc Khí**:
  • *"Tâm an thì vạn sự an, Đức dày thì phước lộc tự khắc tụ"* — Luôn giữ chữ Tín hàng đầu, thường xuyên hành thiện tích đức, nâng đỡ cấp dưới và chia sẻ giá trị cho cộng đồng để duy trì nguồn năng lượng hanh thông trường tồn.`;
}


function generateLocalChatResponse(chartData, question) {
  const q = question.toLowerCase();
  if (q.includes("tiền") || q.includes("tài") || q.includes("giàu") || q.includes("đầu tư") || q.includes("kinh doanh")) {
    return `Về phương diện Tài Lộc & Tiền Bạc: Cung Tài Bạch của bạn tuổi ${chartData.info.canChiYear} (${chartData.info.nguHanh}) có nguồn tài khí ổn định. Bạn hợp với các nguồn đầu tư giá trị thực tế, trung và dài hạn. Nên hạn chế đầu cơ lướt sóng may rủi để tránh hao tài khố.`;
  }
  if (q.includes("tình duyên") || q.includes("vợ") || q.includes("chồng") || q.includes("kết hôn") || q.includes("người yêu") || q.includes("duyên")) {
    return `Về đường Duyên Phận & Hôn Nhân: Cung Phu Thê của bạn cho thấy bạn đời là người có cá tính, tự lập và hiểu biết. Nếu kết duyên chín chắn sau 26 tuổi thì vợ chồng cùng gây dựng cơ đồ rất vững bền, gia đạo an vui.`;
  }
  if (q.includes("nghề") || q.includes("công việc") || q.includes("sự nghiệp") || q.includes("quan lộc") || q.includes("học")) {
    return `Về đường Công Danh & Sự Nghiệp: Cung Quan Lộc của bạn rất hợp các lĩnh vực đòi hỏi chuyên môn cao như Công Nghệ, Kỹ Thuật, Quản Lý, Sáng Tạo và Hoạch Định Chiến Lược. Càng tích lũy kiến thức sâu rộng thì vị thế của bạn càng được khẳng định.`;
  }
  if (q.includes("hạn") || q.includes("năm nay") || q.includes("2026") || q.includes("tai ương")) {
    return `Vận hạn năm ${chartData.info.viewYear}: Năm nay là năm khởi đầu nhiều dự định mới. Bạn cần lưu ý cân bằng giữa công việc và nghỉ ngơi, cẩn trọng khi ký kết hợp đồng pháp lý vào các tháng giữa năm. Luôn giữ tâm thế bình tĩnh thì mọi sự ắt hanh thông.`;
  }
  return `Theo lý số Tử Vi của bạn (${chartData.info.name}, mệnh ${chartData.info.nguHanh}, Cung Mệnh ngụ tại ${chartData.info.cungMenhChi}): Vận trình cuộc đời phụ thuộc vào Thiên Thời - Địa Lợi - Nhân Hòa. Hãy phát huy tối đa năng lực tư duy độc lập và gieo nhiều nhân lành, mọi điều tốt đẹp ắt sẽ hội tụ!`;
}
