/**
 * Service tích hợp Gemini AI và Engine Luận Giải Chuyên Sâu Tự Động cho Tử Vi Đẩu Số
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

// Danh sách các model AI thế hệ mới theo thứ tự ưu tiên
const CANDIDATE_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.5-flash"
];

export async function analyzeTuViWithAI(chartData, apiKey = "", onStreamChunk = null) {
  const key = (apiKey || "").trim();
  
  if (key.length > 10) {
    const prompt = `
Bạn là bậc thầy Tử Vi Đẩu Số Toàn Thư. Hãy viết ngay bản luận giải chuyên sâu theo đúng 5 mục (bắt đầu ngay từ mục 1, tuyệt đối không viết lời chào hỏi hay dẫn nhập ban đầu):
ĐƯƠNG SỐ: ${chartData.info.name} (${chartData.info.gender}, ${chartData.info.amDuongGender})
Sinh: ${chartData.info.solarDate} (ÂL: ${chartData.info.lunarDate}), Giờ ${chartData.info.canChiHour}, Ngày ${chartData.info.canChiDay}, Năm ${chartData.info.canChiYear} (${chartData.info.nguHanh}, ${chartData.info.cucName})
Mệnh tại ${chartData.info.cungMenhChi}, Thân cư ${chartData.info.cungThanChi}, Chủ Mệnh: ${chartData.info.chuMenh}, Chủ Thân: ${chartData.info.chuThan}
Năm xem hạn: ${chartData.info.viewYearCanChi || chartData.info.viewYear}

12 CUNG VỊ:
${chartData.cungList.map(c => `- Cung ${c.cungTen} (${c.chi} - ${c.cungCanChi}): Chính tinh [${c.chinhTinh.map(s => `${s.name} (${s.dacTinh || ''})`).join(', ') || 'Vô chính diệu'}], Cát [${c.catTinh.map(s => s.name).join(', ')}], Hung [${c.hungTinh.map(s => s.name).join(', ')}], Lưu [${c.luuTinh.map(s => s.name).join(', ')}]`).join('\n')}

BẮT ĐẦU NGAY VỚI 5 MỤC DƯỚI ĐÂY:
### 1. 🌟 TỔNG QUAN BẢN MỆNH & TÍNH CÁCH
- Tương quan Mệnh (${chartData.info.nguHanh}) & Cục (${chartData.info.cucName}), tính cách cốt lõi từ Cung Mệnh & Thân.

### 2. 💼 SỰ NGHIỆP & CÔNG DANH (CUNG QUAN LỘC)
- Phân tích sao thủ cung Quan Lộc, ngành nghề phát huy tối đa tiềm năng và vận thế thăng tiến.

### 3. 💰 TÀI LỘC & ĐIỀN SẢN (CUNG TÀI BẠCH - ĐIỀN TRẠCH)
- Nguồn tụ tài, cơ hội tích lũy tài chính và vận số nhà đất, điền sản.

### 4. ❤️ TÌNH DUYÊN & GIA ĐẠO (CUNG PHU THÊ - TỬ TỨC)
- Duyên nợ bạn đời, bí quyết hòa hợp gia đạo và hậu vận con cái.

### 5. 🔮 VẬN HẠN NĂM ${chartData.info.viewYear} & LỜI KHUYÊN HÓA GIẢI
- Phân tích sao lưu chiếu năm ${chartData.info.viewYear}, lời khuyên tu tâm dưỡng tính và tích phước cải vận.
`;

    const genAI = new GoogleGenerativeAI(key);

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Sử dụng Streaming Response để chữ xuất hiện liên tục ngay lập tức
        if (typeof onStreamChunk === 'function') {
          const resultStream = await model.generateContentStream(prompt);
          let accumulated = "";
          for await (const chunk of resultStream.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              accumulated += chunkText;
              onStreamChunk(accumulated);
            }
          }
          if (accumulated && accumulated.length > 50) {
            return accumulated;
          }
        } else {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          if (text && text.length > 50) {
            return text;
          }
        }
      } catch (err) {
        console.warn(`Model ${modelName} failed, trying next candidate:`, err?.message || err);
      }
    }
  }

  // Luận giải động tự động theo thuật toán chuyên sâu nếu không dùng API key
  return generateDynamicExpertInterpretation(chartData);
}

// Từ điển ý nghĩa 14 Chính Tinh khi thủ Mệnh/Quan/Tài
const STAR_MEANINGS = {
  "Tử Vi": {
    menh: "Đế tinh chí tôn, phong thái ung dung, đĩnh đạc, có tài lãnh đạo, tính tự trọng cao và luôn có khát vọng vươn lên vị trí dẫn đầu.",
    quan: "Rất hợp vai trò lãnh đạo, quản lý cấp cao, điều hành doanh nghiệp, cơ quan hành chính hoặc tự chủ kinh doanh lớn.",
    tai: "Tài lộc chính đính, tụ tài bền vững, dễ được quý nhân tài trợ và hậu thuẫn nguồn vốn lớn."
  },
  "Thiên Cơ": {
    menh: "Mưu tinh mẫn tiệp, tư duy sắc bén, trí tuệ linh hoạt, giỏi tính toán mưu lược và thích ứng cực nhanh với sự thay đổi.",
    quan: "Hợp lĩnh vực công nghệ, lập kế hoạch, tư vấn chiến lược, nghiên cứu khoa học, tài chính hoặc truyền thông sáng tạo.",
    tai: "Tài lộc biến động nhanh nhạy, kiếm tiền bằng chất xám, đầu óc tính toán và các cơ hội công nghệ đổi mới."
  },
  "Thái Dương": {
    menh: "Quang minh chính đại, nhiệt huyết, bác ái, phóng khoáng, trọng danh dự và có sức ảnh hưởng tích cực lan tỏa đến cộng đồng.",
    quan: "Hợp ngành ngoại giao, pháp lý, chính trị, giáo dục, truyền thông đại chúng hoặc quản lý doanh nghiệp quy mô lớn.",
    tai: "Tiền bạc đi kèm với danh tiếng, lấy chữ Tín làm đầu, chi tiêu rộng rãi và biết tạo phước lộc từ hoạt động xã hội."
  },
  "Vũ Khúc": {
    menh: "Tài tinh cương nghị, quyết đoán, giàu ý chí độc lập, kỷ luật cao, nói ít làm nhiều và có năng khiếu kinh doanh thiên bẩm.",
    quan: "Đặc biệt xuất sắc trong ngành tài chính, ngân hàng, kế toán, bất động sản, quân đội hoặc quản trị kinh doanh thực chiến.",
    tai: "Là đại tài tinh, khả năng tích lũy tiền bạc phi thường, biết giữ tiền và phân bổ vốn rất chặt chẽ."
  },
  "Thiên Đồng": {
    menh: "Phúc tinh đôn hậu, tính tình vui vẻ, hòa nhã, có tâm hồn nghệ sĩ, giàu trực giác và dễ đón nhận quý nhân tương trợ.",
    quan: "Hợp công việc dịch vụ, du lịch, giải trí, văn hóa nghệ thuật, chăm sóc cộng đồng hoặc đối ngoại thân thiện.",
    tai: "Tiền bạc tụ tán tùy duyên, hay gặp may mắn bất ngờ, về hậu vận tài khố sung túc đủ đầy."
  },
  "Liêm Trinh": {
    menh: "Chính khí thanh liêm, sắc sảo, tự tôn cao, dám chịu trách nhiệm, tính cách cương trực và có sức hút đào hoa tiềm ẩn.",
    quan: "Hợp ngành luật pháp, công an, giám sát, kỹ thuật công nghệ cao, quản trị nhân sự hoặc nghệ thuật chuyên nghiệp.",
    tai: "Kiếm tiền bằng thực lực và kỷ luật nghiêm ngặt, đề phòng tranh chấp hợp đồng để giữ trọn tài lộc."
  },
  "Thiên Phủ": {
    menh: "Lệnh tinh kho báu, điềm đạm, bao dung, chín chắn, biết nhìn xa trông rộng và sở hữu phong thái của người gầy dựng cơ nghiệp.",
    quan: "Hợp vị trí giám đốc tài chính, quản lý tài sản, ngân hàng, kinh doanh thương mại hoặc chủ quản cơ sở độc lập.",
    tai: "Đắc cách 'Kho Vàng Trời Ban', quản lý dòng tiền xuất sắc, tiền bạc vào nhiều ra ít, tích lũy điền sản rất lớn."
  },
  "Thái Âm": {
    menh: "Nguyệt tinh dịu dàng, tinh tế, giàu tình cảm, có gu thẩm mỹ cao, kín đáo và có duyên kỳ lạ với bất động sản.",
    quan: "Hợp lĩnh vực bất động sản, tài chính đầu tư, nghệ thuật thiết kế, văn chương, kinh doanh thời trang hoặc khách sạn cao cấp.",
    tai: "Tài phú dồi dào, kiếm tiền âm thầm nhưng bền chặt, càng về trung và hậu vận điền sản nhà đất càng phồn thịnh."
  },
  "Tham Lang": {
    menh: "Đa tài đa nghệ, năng động, quảng giao, nhiều khát vọng lớn, tính cách cuốn hút và không ngừng tìm kiếm đột phá.",
    quan: "Rất hợp khởi nghiệp, thương mại quốc tế, giải trí, marketing, ẩm thực, làm đẹp hoặc các ngành nghề xu hướng mới.",
    tai: "Có duyên đón nhận những khoản hoạch tài, tiền tài đến từ sự nhạy bén thương trường và quan hệ đối ngoại rộng rãi."
  },
  "Cự Môn": {
    menh: "Hùng biện, tư duy phản biện sâu sắc, óc quan sát tỉ mỉ, có khả năng nhìn thấu bản chất vấn đề và tài diễn thuyết lôi cuốn.",
    quan: "Đắc địa trong ngành luật sư, tư vấn chuyên sâu, giảng dạy, ngoại giao, nghiên cứu học thuật hoặc truyền thông báo chí.",
    tai: "Kiếm tiền nhờ khẩu tài và chất xám uyên bác, cần chú ý giữ hòa khí để tài lộc luôn suôn sẻ hanh thông."
  },
  "Thiên Tướng": {
    menh: "Ấn tinh trượng nghĩa, ngay thẳng, hết lòng vì tập thể, có năng lực phò tá và quản trị điều hành mẫu mực.",
    quan: "Hợp làm phó tướng đắc lực, giám đốc điều hành (COO), y khoa, sư phạm, công chức hoặc quản lý chất lượng.",
    tai: "Tài lộc minh bạch, ổn định, được cấp trên tin cậy giao phó những nguồn tài chính quan trọng."
  },
  "Thiên Lương": {
    menh: "Ấm tinh thọ tinh, nhân hậu, đức độ, thích giúp đỡ che chở người khác, có khí chất của bậc thầy, người chỉ đường đáng kính.",
    quan: "Hợp ngành y tế, dược phẩm, giáo dục, tâm lý, công tác xã hội, bảo hiểm hoặc cố vấn chiến lược độc lập.",
    tai: "Tiền bạc thanh khiết, tích đức sinh tài, phước báu càng dày thì tài lộc và tuổi thọ càng tăng tiến."
  },
  "Thất Sát": {
    menh: "Tướng tinh dũng mãnh, quyết đoán, khí phách kiên cường, dám nghĩ dám làm, không ngại đương đầu với gian nan thử thách.",
    quan: "Hợp ngành quân đội, công an, cơ khí chế tạo, kiến trúc công trình, phẫu thuật hoặc dẫn đầu các dự án mạo hiểm.",
    tai: "Kiếm tiền bằng sự táo bạo và can trường, trải qua sóng gió thời trẻ để đạt được cơ đồ rực rỡ lúc trưởng thành."
  },
  "Phá Quân": {
    menh: "Tiên phong cải cách, dám phá vỡ quy chuẩn cũ để dựng xây cái mới, ý chí độc lập cao, giàu tinh thần dấn thân phiêu lưu.",
    quan: "Rất hợp môi trường đổi mới sáng tạo, công nghệ đột phá, xây dựng, xuất nhập khẩu hoặc kinh doanh mạo hiểm.",
    tai: "Tài vận có những bước ngoặt lớn, dũng cảm chuyển hướng đúng thời điểm sẽ tạo dựng gia sản đồ sộ."
  }
};

/**
 * Trình sinh luận giải động chuyên sâu dựa trên lá số cụ thể
 */
export function generateDynamicExpertInterpretation(chartData) {
  const info = chartData.info;
  const cungList = chartData.cungList;

  const menh = cungList.find(c => c.isMenh) || cungList[0];
  const than = cungList.find(c => c.isThan) || cungList[0];
  const quan = cungList.find(c => c.cungTen === "Quan Lộc") || cungList[4];
  const tai = cungList.find(c => c.cungTen === "Tài Bạch") || cungList[8];
  const the = cungList.find(c => c.cungTen === "Phu Thê") || cungList[10];
  const dien = cungList.find(c => c.cungTen === "Điền Trạch") || cungList[3];
  const phuc = cungList.find(c => c.cungTen === "Phúc Đức") || cungList[2];
  const tuTuc = cungList.find(c => c.cungTen === "Tử Tức") || cungList[9];
  const di = cungList.find(c => c.cungTen === "Thiên Di") || cungList[6];

  // Danh sách tên chính tinh & đặc tính
  const formatStars = (cung) => {
    if (!cung || cung.chinhTinh.length === 0) {
      return "Vô Chính Diệu (mượn tinh diệu cung xung chiếu)";
    }
    return cung.chinhTinh.map(s => `**${s.name}** (${s.dacTinh || 'Đắc'})`).join(" & ");
  };

  const getStarNames = (cung) => cung ? cung.chinhTinh.map(s => s.name) : [];
  const getCatNames = (cung) => cung ? cung.catTinh.map(s => s.name) : [];
  const getHungNames = (cung) => cung ? cung.hungTinh.map(s => s.name) : [];

  const menhStarNames = getStarNames(menh);
  const quanStarNames = getStarNames(quan);
  const taiStarNames = getStarNames(tai);
  const theStarNames = getStarNames(the);

  // 1. Phân tích Cung Mệnh & Thân
  let menhAnalysisText = "";
  if (menhStarNames.length > 0) {
    menhAnalysisText = menhStarNames.map(name => STAR_MEANINGS[name]?.menh || `Chính tinh ${name} chủ về sự kiên định và tài năng độc đáo.`).join(" ");
  } else {
    menhAnalysisText = "Mệnh Vô Chính Diệu là người mẫn cảm, linh hoạt, khả năng hấp thu kiến thức cực nhanh và thích ứng uyển chuyển với mọi hoàn cảnh xã hội.";
  }

  const menhCatText = getCatNames(menh).length > 0 
    ? `Hội tụ các cát tinh trợ lực: *${getCatNames(menh).slice(0, 6).join(", ")}*, tạo nên nguồn trợ lực quý báu từ quý nhân và bạn bè.`
    : "Bản mệnh cần dựa nhiều vào nỗ lực tự thân và sự trau dồi chuyên môn bền bỉ.";

  // Thân cư
  const thanCuMap = {
    "Mệnh": "Thân cư Mệnh: Thể hiện tính cách nhất quán trước sau như một, tự lực tự cường và sống kiên định theo lý tưởng riêng.",
    "Phúc Đức": "Thân cư Phúc Đức: Coi trọng cội nguồn gia tộc, hướng về đời sống tâm linh thiện lành và luôn tìm kiếm sự an lạc nội tâm.",
    "Quan Lộc": "Thân cư Quan Lộc: Đặt sự nghiệp và công danh làm trọng tâm cuộc đời, không ngừng phấn đấu nâng cao vị thế xã hội.",
    "Tài Bạch": "Thân cư Tài Bạch: Rất thực tế, nhạy bén với cơ hội tài chính, chú trọng tích lũy của cải để tạo dựng nền tảng vững chắc.",
    "Phu Thê": "Thân cư Phu Thê: Đời sống và sự nghiệp gắn bó mật thiết với người bạn đời, chịu ảnh hưởng tích cực từ hôn nhân viên mãn.",
    "Thiên Di": "Thân cư Thiên Di: Năng động, thích dịch chuyển, có duyên lập nghiệp phương xa hoặc gặt hái thành công trong môi trường quốc tế."
  };
  const thanCuText = thanCuMap[than?.cungTen] || `Thân cư ${than?.cungTen || 'Tài Bạch'}: Định hướng hậu vận tập trung vào việc kiến tạo giá trị thực tế.`;

  // 2. Phân tích Quan Lộc
  let quanAnalysisText = "";
  if (quanStarNames.length > 0) {
    quanAnalysisText = quanStarNames.map(name => STAR_MEANINGS[name]?.quan || `Chính tinh ${name} mang lại thế mạnh đặc thù trong công việc.`).join(" ");
  } else {
    quanAnalysisText = "Cung Quan Lộc Vô Chính Diệu cho thấy bạn hợp với các công việc mang tính tự do, linh hoạt, tư vấn chiến lược, công nghệ đổi mới hoặc làm việc nhóm đa chức năng.";
  }

  // 3. Phân tích Tài Bạch & Điền Trạch
  let taiAnalysisText = "";
  if (taiStarNames.length > 0) {
    taiAnalysisText = taiStarNames.map(name => STAR_MEANINGS[name]?.tai || `Chính tinh ${name} bổ trợ cho nguồn thu nhập bền vững.`).join(" ");
  } else {
    taiAnalysisText = "Cung Tài Bạch Vô Chính Diệu cho thấy dòng tiền lưu chuyển linh hoạt. Cần chú trọng kế hoạch quản trị rủi ro và tích lũy có hệ thống.";
  }

  const dienCat = getCatNames(dien);
  const dienText = dienCat.length > 0
    ? `Cung Điền Trạch tọa tại **${dien?.chi}** hội tụ cát tinh *${dienCat.slice(0, 4).join(", ")}*: Hậu vận đất đai, nhà cửa hưng vượng, sở hữu cơ ngơi khang trang ấm cúng.`
    : `Cung Điền Trạch tại **${dien?.chi}**: Tích lũy bất động sản nên theo hướng dài hạn, pháp lý rõ ràng, an cư ắt sẽ lập nghiệp vẻ vang.`;

  // 4. Phân tích Phu Thê
  let theAnalysisText = "";
  if (theStarNames.length > 0) {
    theAnalysisText = `Người bạn đời là người có tài năng, khí chất và cá tính rõ nét thông qua ảnh hưởng của bộ sao ${theStarNames.join(", ")}.`;
  } else {
    theAnalysisText = "Cung Phu Thê Vô Chính Diệu: Duyên phận đến tự nhiên, vợ chồng nên thấu hiểu, tôn trọng không gian riêng của nhau để tình cảm luôn bền chặt.";
  }

  // 5. Vận hạn năm xem
  const viewYear = info.viewYear || 2026;
  const viewYearCanChi = info.viewYearCanChi || "Bính Ngọ (2026)";

  return `### 1. 🌟 TỔNG QUAN BẢN MỆNH & TÍNH CÁCH
- **Bản Mệnh & Cục**: Đương số **${info.name}** (${info.gender} - ${info.amDuongGender}), tuổi **${info.canChiYear}**, nạp âm **${info.nguHanh}**, thuộc Cục **${info.cucName}** ${info.cucMenhRelation}. Cân lượng tính số: **${info.canLuongText}**.
- **Cung Mệnh tại ${info.cungMenhChi} (${formatStars(menh)})**:
  • ${menhAnalysisText}
  • ${menhCatText}
- **Cung Thân cư ${info.cungThanChi} (tại ${than?.cungTen || 'Mệnh'})**:
  • ${thanCuText}

### 2. 💼 SỰ NGHIỆP, CÔNG DANH & ĐỊA VỊ (CUNG QUAN LỘC)
- **Tọa cung Quan Lộc tại ${quan?.chi} (${formatStars(quan)})**:
  • ${quanAnalysisText}
  • Cát hung tinh hội chiếu: *${[...getCatNames(quan), ...getHungNames(quan)].slice(0, 5).join(", ") || "Hội chiếu thanh nhã"}*.
- **Định hướng & Lộ trình phát triển**:
  • Phát huy tối đa sở trường chuyên môn độc lập, mở rộng kết nối với các đối tác uy tín.
  • Luôn giữ tinh thần học hỏi liên tục để nắm bắt kịp thời các làn sóng công nghệ và xu hướng thời đại.

### 3. 💰 TÀI BẠCH, TIỀN TÀI & ĐẦU TƯ (CUNG TÀI BẠCH - ĐIỀN TRẠCH)
- **Cung Tài Bạch tại ${tai?.chi} (${formatStars(tai)})**:
  • ${taiAnalysisText}
  • Năng lực điều tiết tài chính: Nên ưu tiên đầu tư vào giá trị thực, nâng cao năng lực bản thân và các tài sản có tính thanh khoản cao.
- **Cung Điền Trạch (Nhà cửa, Đất đai)**:
  • ${dienText}

### 4. ❤️ TÌNH DUYÊN, GIA ĐẠO & CON CÁI (CUNG PHU THÊ - TỬ TỨC)
- **Cung Phu Thê tại ${the?.chi} (${formatStars(the)})**:
  • ${theAnalysisText}
  • Vợ chồng đồng lòng sẽ biến nghịch cảnh thành cơ hội phát triển. Nên kết hôn khi tư tưởng và kinh tế đã vững vàng.
- **Cung Tử Tức tại ${tuTuc?.chi} (${formatStars(tuTuc)})**:
  • Đường con cái sau này thông minh, hiếu thảo, biết tự lập và là niềm tự hào của cha mẹ.

### 5. 🔮 VẬN HẠN NĂM ${viewYearCanChi} & LỜI KHUYÊN HÓA GIẢI
- **Dự báo vận trình năm ${viewYear}**:
  • Thời cơ để củng cố nền tảng, thiết lập các mục tiêu trọng tâm trong công việc và học tập.
  • Cần chú ý cân bằng giữa làm việc và nghỉ ngơi, giữ gìn sức khỏe, cẩn trọng khi thực hiện các giao dịch giấy tờ lớn.
- **Phương châm tu dưỡng & Kích hoạt Phước Đức**:
  • *"Tâm an vạn sự thái, Đức dày phước tự sinh"* — Luôn giữ gìn sự chính trực, gieo nhiều hạt giống thiện lành và tương trợ mọi người xung quanh để mở rộng vận khí hanh thông trường cửu.`;
}

/**
 * Trả lời thông minh khi trò chuyện với Chatbot Thầy Tử Vi
 */
export async function askTuViChatbot(chartData, messageHistory, newMessage, apiKey = "") {
  const key = (apiKey || "").trim();

  if (key.length > 10) {
    const genAI = new GoogleGenerativeAI(key);
    
    const systemContext = `Bạn là Thầy Tử Vi uyên bác, am tường Huyền Học Đông Phương và Tử Vi Đẩu Số Toàn Thư.
Đang tư vấn trực tiếp cho đương số:
- Họ tên: ${chartData.info.name}
- Giới tính: ${chartData.info.gender} (${chartData.info.amDuongGender})
- Năm sinh: ${chartData.info.canChiYear} (Bản Mệnh: ${chartData.info.nguHanh})
- Cục: ${chartData.info.cucName}
- Cung Mệnh tại: ${chartData.info.cungMenhChi}
- Cung Thân tại: ${chartData.info.cungThanChi}
- Chủ Mệnh: ${chartData.info.chuMenh}, Chủ Thân: ${chartData.info.chuThan}
- Năm xem vận hạn: ${chartData.info.viewYear}

Chi tiết các cung vị của đương số:
${chartData.cungList.map(c => `- Cung ${c.cungTen} (${c.chi}): Chính tinh [${c.chinhTinh.map(s => s.name).join(', ') || 'Vô chính diệu'}], Cát tinh [${c.catTinh.map(s => s.name).join(', ')}], Hung tinh [${c.hungTinh.map(s => s.name).join(', ')}]`).join('\n')}

Lịch sử trao đổi gần nhất:
${messageHistory.slice(-4).map(m => `${m.sender === 'user' ? 'Người hỏi' : 'Thầy Tử Vi'}: ${m.text}`).join('\n')}

Câu hỏi mới của người xem: "${newMessage}"

Hãy trả lời bằng tiếng Việt, văn phong điềm đạm, uyên bác, ân cần, giải thích cặn kẽ dựa trên lý luận ngũ hành, sao chiếu và cung vị thực tế của đương số.`;

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

  // Chế độ phản hồi thông minh nội bộ dựa trên lá số thực tế
  return generateDynamicLocalChatResponse(chartData, newMessage);
}

function generateDynamicLocalChatResponse(chartData, question) {
  const q = question.toLowerCase();
  const info = chartData.info;
  const cungList = chartData.cungList;

  const getCung = (name) => cungList.find(c => c.cungTen === name);

  if (q.includes("tiền") || q.includes("tài") || q.includes("giàu") || q.includes("đầu tư") || q.includes("kinh doanh")) {
    const tai = getCung("Tài Bạch");
    const stars = tai?.chinhTinh.map(s => s.name).join(", ") || "Vô chính diệu";
    return `Về đường Tài Lộc: Cung Tài Bạch của đương số **${info.name}** ngụ tại cung **${tai?.chi}** với các sao **${stars}**. Cát tinh hội tụ mang lại cơ hội tích lũy vững chắc theo thời gian. Bạn nên ưu tiên đầu tư vào năng lực chuyên môn thực tế và giữ vững kỷ luật tài chính, tránh tâm lý đầu cơ ngắn hạn.`;
  }

  if (q.includes("tình duyên") || q.includes("vợ") || q.includes("chồng") || q.includes("kết hôn") || q.includes("người yêu") || q.includes("duyên")) {
    const the = getCung("Phu Thê");
    const stars = the?.chinhTinh.map(s => s.name).join(", ") || "Vô chính diệu";
    return `Về đường Tình Duyên & Hôn Nhân: Cung Phu Thê tại **${the?.chi}** (chính tinh: **${stars}**) cho thấy người bạn đời là người có cá tính, tự lập và có năng lực. Để hôn nhân bền vững viên mãn, hai bạn nên học cách lắng nghe, nhường nhịn và đồng lòng chia sẻ các mục tiêu dài hạn.`;
  }

  if (q.includes("nghề") || q.includes("công việc") || q.includes("sự nghiệp") || q.includes("quan lộc") || q.includes("học")) {
    const quan = getCung("Quan Lộc");
    const stars = quan?.chinhTinh.map(s => s.name).join(", ") || "Vô chính diệu";
    return `Về đường Công Danh & Sự Nghiệp: Cung Quan Lộc của bạn tại **${quan?.chi}** (chính tinh: **${stars}**). Bạn rất có duyên với các lĩnh vực đòi hỏi chuyên môn cao, tính sáng tạo và khả năng giải quyết vấn đề độc lập. Càng rèn luyện tay nghề và xây dựng uy tín cá nhân, vị thế của bạn càng được khẳng định.`;
  }

  if (q.includes("sức khỏe") || q.includes("bệnh") || q.includes("tật")) {
    const tat = getCung("Tật Ách");
    return `Về phương diện Sức Khỏe: Cung Tật Ách tại **${tat?.chi}** nhắc nhở bạn nên duy trì chế độ sinh hoạt điều độ, chú ý chăm sóc hệ tiêu hóa và hệ thần kinh khi làm việc căng thẳng. Thường xuyên vận động thể thao và giữ tâm thái an nhiên là phương thuốc dưỡng sinh tốt nhất.`;
  }

  if (q.includes("hạn") || q.includes("năm nay") || q.includes("2026") || q.includes("tai ương")) {
    return `Vận hạn năm ${info.viewYear}: Năm ${info.viewYearCanChi} là thời điểm tốt để mở mang kiến thức, củng cố nội lực và chuẩn bị cho các bước tiến lớn. Hãy thận trọng trong các quyết định ký kết hợp đồng và luôn giữ tâm đức thiện lành, mọi việc ắt sẽ chuyển nguy thành an.`;
  }

  const menh = cungList.find(c => c.isMenh);
  const menhStars = menh?.chinhTinh.map(s => s.name).join(", ") || "Vô chính diệu";
  return `Theo lý số Tử Vi của đương số **${info.name}** (tuổi ${info.canChiYear}, mệnh ${info.nguHanh}, Cung Mệnh tại ${info.cungMenhChi} thủ sao **${menhStars}**): Vận mệnh nằm trong tay người biết nỗ lực và tu dưỡng. Khi bạn thấu hiểu bản thân và hành động đúng thời cơ, vạn sự lành ắt sẽ tự tìm đến!`;
}

/**
 * Phân tích Luận Giải So Đôi 2 Lá Số (Synastry / Tương Hợp) bằng Gemini AI
 */
export async function analyzeCompatibilityWithAI(compatResult, apiKey = "", onStreamChunk = null) {
  const key = (apiKey || "").trim();
  const { info1, info2, totalScore, overallRating, pillars, compareType } = compatResult;
  const isMarriage = compareType === 'marriage';

  if (key.length > 10) {
    const prompt = `
Bạn là bậc thầy Tử Vi Đẩu Số & Phong Thủy Bát Trạch hàng đầu. Hãy viết bản luận giải chuyên sâu về mức độ hòa hợp giữa 2 đương số dưới đây (bắt đầu ngay từ mục 1, tuyệt đối không viết lời chào hỏi hay dẫn nhập):

MỤC ĐÍCH ĐỐI CHIẾU: ${isMarriage ? 'HÔN NHÂN & TÌNH DUYÊN (VỢ - CHỒNG)' : 'HỢP TÁC LÀM ĂN & KINH DOANH (ĐỐI TÁC)'}
TỔNG ĐIỂM HÒA HỢP: ${totalScore}/100 - ĐÁNH GIÁ: ${overallRating}

NGƯỜI 1: ${info1.name} (${info1.gender})
- Năm sinh: ${info1.canChiYear} (${info1.lunarDate}), Mệnh: ${info1.nguHanh}, Cục: ${info1.cucName}, Cung Phi: ${info1.cungPhi?.name} (${info1.cungPhi?.element})
- Cung Mệnh: ${info1.cungMenhChi}, Chủ Mệnh: ${info1.chuMenh}, Chủ Thân: ${info1.chuThan}

NGƯỜI 2: ${info2.name} (${info2.gender})
- Năm sinh: ${info2.canChiYear} (${info2.lunarDate}), Mệnh: ${info2.nguHanh}, Cục: ${info2.cucName}, Cung Phi: ${info2.cungPhi?.name} (${info2.cungPhi?.element})
- Cung Mệnh: ${info2.cungMenhChi}, Chủ Mệnh: ${info2.chuMenh}, Chủ Thân: ${info2.chuThan}

KẾT QUẢ ĐỐI CHIẾU 5 TRỤ CỘT:
${pillars.map(p => `- ${p.title}: ${p.score}/${p.maxScore}đ [${p.status}] -> ${p.desc}`).join('\n')}

BẮT ĐẦU NGAY VỚI 5 MỤC DƯỚI ĐÂY:
### 1. 🌟 TỔNG QUAN DUYÊN PHẬN & ĐỘ HÒA HỢP (${totalScore}/100)
- Nhận định tổng quát về nhân duyên, sự hòa hợp về tính cách và khí chất giữa hai người.

### 2. ⚡ PHÂN TÍCH TƯƠNG SINH - TƯƠNG KHẮC BẢN MỆNH & CAN CHI
- Phân tích chi tiết ngũ hành nạp âm (${info1.nguHanh} ⟷ ${info2.nguHanh}), can hợp/khắc, chi tam hợp/lục hợp.

### 3. 🏛️ CUNG PHI BÁT TRẠCH & KHÍ TRƯỜNG GIA ĐẠO
- Phối quẻ Cung Phi (${info1.cungPhi?.name} ⟷ ${info2.cungPhi?.name}): Đánh giá phúc lộc, sức khỏe, tài khí và hướng phát triển chung.

### 4. 🔮 ĐỐI CHIẾU CUNG MỆNH & CUNG PHỐI NGẪU TỬ VI
- Tương tác giữa các chính tinh thủ Mệnh - Thân và cung ${isMarriage ? 'Phu Thê' : 'Quan Lộc / Tài Bạch'} của hai người.

### 5. 💡 LỜI KHUYÊN PHONG THỦY & PHƯƠNG PHÁP HÓA GIẢI XUNG KHẮC
- Hướng dẫn cụ thể cách hóa giải điểm xung khắc (nếu có), chọn năm tốt sinh con / mở rộng kinh doanh, phong thủy nhà ở / văn phòng và thái độ ứng xử để bền chặt lâu dài.
`;

    const genAI = new GoogleGenerativeAI(key);

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        if (typeof onStreamChunk === 'function') {
          const resultStream = await model.generateContentStream(prompt);
          let accumulated = "";
          for await (const chunk of resultStream.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              accumulated += chunkText;
              onStreamChunk(accumulated);
            }
          }
          if (accumulated && accumulated.length > 50) {
            return accumulated;
          }
        } else {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          if (text && text.length > 50) {
            return text;
          }
        }
      } catch (err) {
        console.warn(`Model ${modelName} failed for compatibility, trying next:`, err?.message || err);
      }
    }
  }

  // Fallback luận giải tự động chất lượng cao
  return generateLocalCompatibilityReport(compatResult);
}

function generateLocalCompatibilityReport(compatResult) {
  const { info1, info2, totalScore, overallRating, pillars, compareType } = compatResult;
  const isMarriage = compareType === 'marriage';

  return `### 1. 🌟 TỔNG QUAN DUYÊN PHẬN & ĐỘ HÒA HỢP (${totalScore}/100 - ${overallRating})
Mối quan hệ giữa **${info1.name}** (${info1.canChiYear}, ${info1.nguHanh}) và **${info2.name}** (${info2.canChiYear}, ${info2.nguHanh}) đạt mức tương hợp **${totalScore}/100 điểm** (${overallRating}). Hai bạn sở hữu nhiều điểm giao thoa tốt về tư tưởng, có khả năng đồng hành lâu dài nếu cùng nhau vun đắp và lắng nghe.

### 2. ⚡ PHÂN TÍCH TƯƠNG SINH - TƯƠNG KHẮC BẢN MỆNH & CAN CHI
- **Ngũ Hành Nạp Âm:** ${pillars[0].desc}
- **Thiên Can:** ${pillars[2].desc}
- **Địa Chi:** ${pillars[3].desc}
Tổng thể ngũ hành và can chi cho thấy sự hỗ trợ nhịp nhàng về vận thế, giảm thiểu va chạm lớn trong đời sống thường nhật.

### 3. 🏛️ CUNG PHI BÁT TRẠCH & KHÍ TRƯỜNG
- Cung Phi của **${info1.name}** là **${info1.cungPhi?.name}** (${info1.cungPhi?.element}), của **${info2.name}** là **${info2.cungPhi?.name}** (${info2.cungPhi?.element}).
- Hai cung phối lại tạo nên khí trường **${pillars[1].status}**: ${pillars[1].desc}. Đây là yếu tố quan trọng quyết định sự êm ấm, thịnh vượng của không gian sống chung.

### 4. 🔮 ĐỐI CHIẾU CUNG MỆNH & TỬ VI
- ${pillars[4].desc}
- Sự kết hợp giữa các bộ sao thủ Mệnh giúp hai người vừa giữ được nét riêng, vừa bù đắp được những điểm còn thiếu của nhau trong việc quản lý tài chính và ra quyết định lớn.

### 5. 💡 LỜI KHUYÊN & PHƯƠNG PHÁP HÓA GIẢI
1. **Giao tiếp cởi mở:** Hãy luôn thẳng thắn chia sẻ những lo âu, tránh giữ kín trong lòng dễ gây hiểu lầm.
2. **Phong thủy hỗ trợ:** ${isMarriage ? 'Bố trí phòng ngủ và hướng bếp theo cung vị tương sinh, ưu tiên màu sắc ngũ hành trung gian để dung dưỡng hòa khí.' : 'Chọn màu sắc thương hiệu và phòng làm việc hòa hợp ngũ hành để kích hoạt tài lộc thuận buồm xuôi gió.'}
3. **Lấy Đức làm gốc:** "Vạn sự tại nhân, đức năng thắng số" - sự thấu hiểu, lòng bao dung và trách nhiệm chính là chiếc chìa khóa vạn năng đem lại hạnh phúc và thành công viên mãn!`;
}

