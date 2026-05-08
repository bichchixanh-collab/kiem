Tạo một file HTML duy nhất (all-in-one: HTML + CSS + JavaScript) mô phỏng giao diện game MMORPG Tu Tiên Kiếm Hiệp phong cách cổ điển Trung Hoa chơi trên mobile browser. Toàn bộ game chạy bằng dữ liệu giả lập (mock data) trong JavaScript, không cần backend.

═══════════════════════════════════════════ 🎨 PHONG CÁCH THIẾT KẾ (VISUAL STYLE) ═══════════════════════════════════════════

Màu sắc chủ đạo: Nền đen/nâu trầm (#0d0a06, #1a1208), vàng kim (#c9a84c, #f0d080), đỏ son (#8b1a1a, #cc2200), trắng ngà (#f5ead0)

Typography: Font chữ Hán cổ phong (Google Fonts: "Noto Serif SC" hoặc "Ma Shan Zheng"), tên nhân vật/cảnh giới dùng chữ Hán kết hợp phiên âm

Texture: Giả lập nền giấy xuyến chỉ / thủy mặc bằng CSS (gradient + noise filter + box-shadow layered)

Border/Frame: Viền hoa văn Trung Hoa (dùng CSS clip-path hoặc SVG inline), góc trang trí kiểu "như ý vân đầu"

Particle effects: Linh khí tản mạn (floating orbs, CSS keyframe animation), kiếm quang lóe sáng khi chiến đấu

Tất cả panel/card có hiệu ứng glow màu vàng kim khi hover/active

Responsive: Viewport cố định 390×844px (iPhone 14 Pro), overflow hidden, không scroll ngang

═══════════════════════════════════════════ 🗺️ CẤU TRÚC MÀN HÌNH CHÍNH (MAIN SCREEN) ═══════════════════════════════════════════

Màn hình chính chia 3 lớp (z-index layers):

LAYER 1 — Background Scene (bottom):

Canvas hoặc div mô phỏng cảnh núi non thủy mặc (CSS layered gradients + pseudo-elements)

Hiệu ứng mây trôi chậm (CSS animation translateX loop)

Nhân vật chibi đứng giữa màn hình (dùng emoji hoặc SVG đơn giản có animation thở nhẹ)

LAYER 2 — HUD Interface (middle): TOP BAR: - Avatar nhân vật (tròn, viền vàng, level badge) - Tên nhân vật + Cảnh giới (vd: "Vân Thiên — Trúc Cơ Kỳ Ba Tầng") - HP bar (đỏ), MP/Linh lực bar (xanh lam), EXP bar (vàng) — thanh mảnh nằm ngang có animation fill - Góc phải: Hệ biểu tượng (Vàng 💰, Linh Thạch 💎, Thể lực ⚡)

BOTTOM CENTER — Radial Menu (Floating Action Button chính): - Nút trung tâm hình bát quái (☯) phát sáng, nhấn để mở/đóng radial menu - Khi mở: 6 nút con tỏa ra hình tròn (animation mở xòe 300ms ease-out) gồm: ⚔️ Chiến Đấu | 🎒 Túi Đồ | 🗺️ Bản Đồ 👥 Bang Hội | 📜 Nhiệm Vụ | 🏪 Thương Thành - Mỗi nút con có: icon + label nhỏ + ripple effect khi nhấn + tooltip fade-in - Nút nổi thứ 2 (góc phải): Mở nhanh Kỹ Năng / Công Pháp - Nút nổi thứ 3 (góc trái): Chat / Thông Báo (badge số)

BOTTOM RIGHT — Joystick ảo (D-pad): - Vùng tròn bán trong suốt, kéo để di chuyển nhân vật (mock: chỉ cần animation nhân vật dịch chuyển nhẹ trên màn hình)

LAYER 3 — Panels/Modals (top):

Tất cả panel mở dạng slide-up từ dưới hoặc scale-in từ tâm

Có nền mờ (backdrop-filter: blur) khi panel mở

Nút đóng hình "✕" phong cách cổ tự

═══════════════════════════════════════════ ⚔️ HỆ THỐNG CHIẾN ĐẤU TỰ DO (ACTION 2D ARENA) ═══════════════════════════════════════════

▌TỔNG QUAN: Chiến đấu phong cách game kiếm hiệp PC (Võ Lâm Truyền Kỳ, Kiếm Thế): nhân vật di chuyển tự do trên arena 2D, tấn công và dùng kỹ năng theo thời gian thực. Hỗ trợ cả chế độ thủ công lẫn auto farm.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 🗺️ ARENA & MÔI TRƯỜNG CHIẾN ĐẤU ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Map khu vực: Canvas 2D hoặc CSS positioned div, scroll được theo nhân vật (camera follow)

Nền bản đồ: texture thủy mặc, có cây cối/đá/sương mù trang trí

Minimap góc trên phải: thu nhỏ toàn khu vực, chấm xanh = nhân vật, chấm đỏ/xanh lá = quái vật

Hiển thị vùng aggro của quái đỏ (vòng tròn bán trong suốt màu đỏ nhạt) khi nhân vật lại gần

Ranh giới bản đồ: nhân vật không thể ra ngoài (bounce lại + shake nhẹ)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 🎮 ĐIỀU KHIỂN THỦ CÔNG ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DI CHUYỂN:

Joystick ảo góc dưới trái: kéo để di chuyển 8 hướng, mượt mà

Nhân vật có animation đi/chạy (CSS keyframe: bob lên xuống)

Tốc độ di chuyển chịu ảnh hưởng stat Tốc Độ + loại giáp mặc

TẤN CÔNG THƯỜNG:

Nút "Tấn Công" (⚔️) góc dưới phải: nhấn để ra đòn về phía địch gần nhất

HỆ THỐNG COMBO (3–5 đòn liên tiếp): 

Nhấn liên tục trong 0.8s giữa mỗi đòn → nối comboCombo counter hiển thị to (x1 → x2 → x3 ... x5) với màu tăng dần (trắng → vàng → cam → đỏ → tím)

Mỗi bậc combo: damage multiplier tăng (+15% mỗi bậc)

Đòn cuối combo (x5): hiệu ứng đặc biệt — kiếm quang lớn, sát thương ×2.5, animation nhân vật xoay người

Ngắt combo nếu không nhấn trong 0.8s: counter reset về 0

Combo counter animation: số bật lên + rung + glow

KỸ NĂNG (4 slot, góc dưới phải cạnh nút tấn công):

Nhấn skill bất kỳ lúc, kể cả giữa combo → xen kỹ năng vào chuỗi đòn

Cooldown hiển thị bằng pie-timer sweep (CSS conic-gradient animation)

Thiếu MP: nút xám + rung + tooltip "Không đủ Linh Lực"

Kỹ năng AoE: vòng tròn chỉ báo vùng ảnh hưởng hiện ra 0.3s trước khi nổ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 👾 HỆ THỐNG QUÁI VẬT (2 LOẠI) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOẠI 1 — QUÁI THỤ ĐỘNG (Tên màu XANH LÁ 🟢):

Di chuyển ngẫu nhiên, tuần tra trong phạm vi nhỏ (idle patrol)

KHÔNG tự tấn công người chơi trước

Bị tấn công mới phản đòn → chỉ công vào người chơi đã đánh nó

Sau khi đánh xong / nhân vật chạy xa: quái reset về vị trí ban đầu

Tên hiển thị phía trên đầu: [🟢 Huyết Lang Lv.12]

Phù hợp để farm an toàn, không cần lo bị kéo đám

LOẠI 2 — QUÁI CÔNG KÍCH (Tên màu ĐỎ 🔴):

Có vùng aggro (bán kính cố định, hiển thị vòng đỏ nhạt quanh quái)

Khi nhân vật bước vào vùng aggro → quái lập tức quay đầu, tăng tốc lao về phía người chơi + phát âm thanh cảnh báo

Có thể gọi thêm quái xung quanh (chain aggro) nếu quái cùng loại ở gần

Tên: [🔴 Ma Ảnh Lv.35 ⚠️] — icon ⚠️ nhấp nháy khi đang aggro

Khi đuổi mà nhân vật chạy ra ngoài vùng leash → quái quay về, hồi máu nhanh về đủ

CHỈ SỐ QUÁI: HP bar hiện phía trên đầu quái (mảnh, màu đỏ), tên + cấp độ luôn nổi theo nhân vật quái.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 💀 HỆ THỐNG BOSS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Boss có kích thước lớn hơn quái thường (1.5–2×), tên màu vàng cam 🟠:

HP BAR ĐẶC BIỆT:

Thanh HP boss hiển thị TO ở giữa trên cùng màn hình chiến đấu

Chia thành các đoạn (segment) tương ứng với giai đoạn

Khi hết 1 segment → boss vào giai đoạn mới (flash đỏ toàn màn hình)

NHIỀU GIAI ĐOẠN & PATTERN: [Giai Đoạn 1 — HP 100%→70%]: • Pattern thường: đòn đơn, đòn quét ngang, tốc độ vừa • Cảnh báo đòn: vùng màu đỏ xuất hiện 0.5s TRƯỚC khi đánh (người chơi kịp né)

[Giai Đoạn 2 — HP 70%→40%]: • Boss ENRAGE: mắt đỏ rực, aura tím bao quanh • Thêm pattern mới: xoay 360° (AoE), triệu hồi quái nhỏ • Tốc độ tăng 30%, damage tăng 20% • Cutscene mini: boss animation roar + màn hình rung 0.5s

[Giai Đoạn 3 — HP 40%→0%]: • Boss ĐIÊN CUỒNG: animation không ngừng nghỉ • Mưa đòn liên hoàn, pattern đan xen liên tục • Kỹ năng tối thượng: charge 2s (thanh charge hiển thị), nếu không né kịp → damage cực lớn + stun 1s • Nhạc nền thay đổi (Web Audio API tempo tăng)

REWARD BOSS:

Animation boss tan biến (particle vỡ vụn màu vàng)

Rương vàng rơi ra giữa màn hình → nhấn để mở

Mở rương: từng item bay ra với hiệu ứng (hiếm = flash màu tương ứng)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 🤖 HỆ THỐNG AUTO FARM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VẬT PHẨM MỞ KHÓA AUTO FARM: • "Phù Lệnh Tự Động" — item tiêu hao, có thời hạn sử dụng: Loại Thường: 1 giờ | Loại Tốt: 3 giờ | Loại Cao Cấp: 12 giờ • Khi không có Phù Lệnh (hoặc hết hạn): nút Auto bị khóa (🔒 xám), tooltip: "Cần Phù Lệnh Tự Động để kích hoạt" • Đồng hồ đếm ngược thời gian còn lại hiển thị cạnh nút Auto (đổi sang màu đỏ khi còn <10 phút) • Phù Lệnh mua tại Thương Thành hoặc nhận từ nhiệm vụ/sự kiện

KÍCH HOẠT AUTO FARM: • Nút [AUTO] nằm góc trên phải màn hình chiến đấu • Khi bật: nút sáng xanh lam + icon xoay tròn (loading-like) • Hiển thị badge "AUTO" nhấp nháy nhẹ trên màn hình chính

AUTO FARM THỰC HIỆN: Di chuyển & Nhắm mục tiêu: - Tự tìm quái gần nhất trong bán kính X (ưu tiên quái xanh để an toàn) - Có thể cài đặt: "Ưu tiên quái xanh / Ưu tiên quái đỏ / Mọi loại" - Tự di chuyển đến vị trí tấn công tối ưu (không đứng trong AoE quái) - Tự kéo quái 1 con ra khỏi đám nếu là quái thụ độngChiến đấu tự động: - Tự đánh thường kết hợp combo tự động - Tự dùng kỹ năng theo thứ tự ưu tiên cài sẵn (có thể chỉnh): + Ưu tiên 1: Kỹ năng sát thương cao nhất còn CD + Ưu tiên 2: Kỹ năng AoE khi có ≥2 quái gần nhau + Ưu tiên 3: Đánh thường / combo - Tự dùng thuốc HP khi HP < 40% (nếu có trong túi) - Tự nhặt item rơi sau khi quái chết

Điều kiện dừng auto: - Hết Phù Lệnh (thông báo + auto tắt) - HP < 15% mà không còn thuốc → dừng + cảnh báo đỏ - Túi đồ đầy → dừng + thông báo - Người chơi nhấn nút STOP hoặc thoát khu vực

BẢNG CÀI ĐẶT AUTO (popup khi giữ nút AUTO 0.5s):

[Toggle] Ưu tiên loại quái: Xanh / Đỏ / Tất cả

[Toggle] Tự uống thuốc HP: Bật/Tắt (ngưỡng %)

[Toggle] Tự nhặt đồ: Chỉ hiếm trở lên / Tất cả

[Drag to sort] Thứ tự ưu tiên kỹ năng (kéo để đổi chỗ)

[Input] Thời gian auto tối đa rồi tự dừng

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ✨ HIỆU ỨNG CHIẾN ĐẤU ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Số sát thương bay lên: màu trắng (thường) / vàng (combo) / đỏ (chí mạng) / tím (kỹ năng đặc biệt) / xanh (hồi máu)

Chí mạng: số to hơn 1.5× + "TRỌNG KÍCH!" text + flash vàng nhanh

Né đòn: "MISS" màu xám bay lên + nhân vật afterimage (bóng mờ)

Khi nhận đòn: màn hình flash đỏ nhẹ ở rìa (vignette), nhân vật rung, HP bar nhảy giảm

Hiệu ứng đòn đánh chạm quái: spark/slash CSS animation tại điểm va chạm

Kỹ năng ngũ hành: Kim ⚪ → ánh bạc + tiếng kiếm Mộc 🟢 → dây leo bắn ra Thủy 🔵 → sóng nước lan rộng Hỏa 🔴 → bùng lửa + ember bay Thổ 🟤 → đá vỡ + bụi tung

Afterimage khi dash/di chuyển nhanh: 3 bóng mờ dần biến mất

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 📊 TRẠNG THÁI & HỒI PHỤC ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Buff/Debuff icon hàng ngang dưới HP bar (kích thước nhỏ, có countdown)

Ngoài chiến đấu: HP/MP tự hồi chậm (animation thanh từ từ tăng)

"Nhập Định" khi đứng yên 3s ngoài chiến đấu: hồi nhanh hơn + aura vàng

Chết: màn hình chuyển đen trắng + "Nhục Thân Tổn Thương" → nút Hồi Sinh tại chỗ (tốn Linh Thạch) hoặc Về Làng (miễn phí)

═══════════════════════════════════════════ 🌟 HỆ THỐNG NHÂN VẬT ĐẦY ĐỦ ═══════════════════════════════════════════

A. CẢNH GIỚI TU LUYỆN (9 đại cảnh giới × 9 tiểu tầng): Luyện Khí → Trúc Cơ → Kim Đan → Nguyên Anh → Hóa Thần → Luyện Hư → Hợp Thể → Đại Thừa → Độ Kiếp (Phi Thăng)

Panel Đột Phá: Hiệu ứng sấm sét + thiên lôi + màn hình flash khi lên cảnh giới

Thanh tiến độ cảnh giới hiển thị trên màn hình chính

Mỗi cảnh giới mở khóa kỹ năng/khu vực mới

B. HỆ PHÁI / MÔN PHÁI (chọn 1 trong 5 khi tạo nhân vật): ☁️ Thanh Vân Môn (Kiếm Tu) | 🔥 Hỏa Linh Tông (Hỏa Tu) 🌊 Huyền Thủy Các (Thủy Tu) | ☠️ Ma Giáo (Ma Tu) 🌿 Vạn Thảo Đường (Dược Tu)

Mỗi phái có màu sắc riêng, kỹ năng độc đáo, NPC thầy

Biểu tượng phái hiển thị cạnh tên nhân vật

C. KỸ NĂNG & CÔNG PHÁP: Panel kỹ năng dạng grid (4 cột):

Kỹ năng chủ động (có cooldown, tốn MP)

Kỹ năng bị động (aura icon luôn sáng)

Công pháp tu luyện (tăng stat khi ngồi thiền)

Mỗi kỹ năng có: tên Hán + mô tả + cấp độ (1–10) + nút Thăng Cấp (tốn điểm kỹ năng)

Animation học kỹ năng: sách phát sáng → chữ Hán bay vào người

D. NGŨ HÀNH THUỘC TÍNH: Kim 🥇 | Mộc 🌿 | Thủy 💧 | Hỏa 🔥 | Thổ 🟤

Radar chart hiển thị 5 thuộc tính nhân vật

Khắc chế vòng: Kim→Mộc→Thổ→Thủy→Hỏa→Kim

Buff/debuff hiển thị icon trên thanh trạng thái chiến đấu

Trang bị và kỹ năng mang thuộc tính tương ứng

═══════════════════════════════════════════ 🎒 HỆ THỐNG TRANG BỊ & RÈN LUYỆN ═══════════════════════════════════════════

Panel Túi Đồ (6 cột × 8 hàng grid):

Slot trang bị nhân vật hình người (silhouette) với 8 vị trí: Vũ khí, Phòng giáp, Mũ, Giày, Nhẫn (×2), Bùa hộ mệnh, Linh Khí

Mỗi item có màu viền theo độ hiếm: Trắng < Xanh < Tím < Cam < Đỏ (Thần Khí) < Vàng (Tiên Khí)

Nhấn giữ item: context menu nổi lên (Trang Bị / Dùng / Bán / Ném)

Tooltip hover: stat chi tiết + yêu cầu cảnh giới

Panel Rèn Luyện:

Cường Hóa (+1 → +15): thanh tiến độ, tỉ lệ thành công giảm dần, animation búa đập + lửa lò rèn khi nâng cấp thành công

Đúc Hồn: ghép 3 item cùng loại → item cao hơn (animation hợp nhất xoáy tròn)

Khắc Văn: thêm thuộc tính phụ bằng Linh Văn ThạchTinh Luyện: reroll chỉ số phụ

═══════════════════════════════════════════ 🗺️ BẢN ĐỒ & KHÁM PHÁ THẾ GIỚI ═══════════════════════════════════════════

Panel Bản Đồ (full-screen overlay):

World map dạng cổ họa (SVG hoặc CSS art): 5 đại khu vực khác nhau 

Linh Sơn Cốc (khu đầu, level 1–20)

Huyền Thiên Bình Nguyên (level 21–50)

Ma Uyên (level 51–80, vùng tối nguy hiểm)

Tiên Đảo Bồng Lai (level 81–120, bị khóa)

Thượng Cổ Di Tích (endgame)

Điểm đánh dấu: Làng/Thành (🏘️), Dungeon (☠️), Boss (💀), NPC đặc biệt (⭐), Điểm thu thập tài nguyên (🌿)

Tap vào địa điểm: popup mô tả + nút "Truyền Tống" (tốn Linh Thạch) hoặc "Đi Bộ"

Fog of war: vùng chưa khám phá bị che mờ

═══════════════════════════════════════════ 👥 BANG HỘI & PVP ═══════════════════════════════════════════

Panel Bang Hội:

Thông tin bang: tên, cấp độ, biểu tượng, số thành viên, thông báo bang

Danh sách thành viên dạng list: avatar + tên + cảnh giới + online/offline status

Chat bang hội (mock realtime: tin nhắn tự động xuất hiện mỗi vài giây)

Nút: Đóng Góp Linh Thạch / Kho Bang / Bang Chiến

PvP Arena:

Bảng xếp hạng (top 100, highlight rank của mình)

Nút Thách Đấu: chọn đối thủ gần rank → vào màn chiến đấu

Mùa giải countdown timer

Phần thưởng hạng (hiển thị rõ theo mốc rank)

═══════════════════════════════════════════ 📜 NHIỆM VỤ & CỐT TRUYỆN ═══════════════════════════════════════════

Panel Nhiệm vụ (tabs): [Chính Tuyến] [Hỗ Trợ] [Nhật Thường] [Thành Tựu]

Mỗi nhiệm vụ: tên + mô tả ngắn lore + tiến độ (vd: "Tiêu diệt Huyết Lang 3/10") + phần thưởng hiển thị rõ

Nhiệm vụ chính có đoạn hội thoại NPC: dialog box dạng visual novel (ảnh NPC bên cạnh, text xuất hiện từng chữ typewriter effect, nút "Tiếp Theo")

Nhật thường: reset lúc 0:00, thanh hoàn thành hàng ngày với mốc thưởng

Thành tựu: grid icon, khóa/mở, click nhận thưởng có animation stamp "ĐÃ NHẬN"

═══════════════════════════════════════════ 🐉 THÚ CƯỠI & LINH THÚ ═══════════════════════════════════════════

Panel Linh Thú (dạng pokedex):

Grid thú đã sở hữu / chưa mở khóa (silhouette xám)

Mỗi thú: tên + cấp độ + hệ ngũ hành + 3 kỹ năng riêng + stat

Nút: Xuất Chiến / Cất / Đổi Tên / Thăng Cấp (tốn Linh Đan)

Thú cưỡi: animation nhân vật ngồi trên thú di chuyển (đơn giản)

Thu phục: % thành công, animation bắt thú (vòng tròn thu nhỏ dần)

═══════════════════════════════════════════ 🏪 ĐẤU GIÁ & GIAO DỊCH ═══════════════════════════════════════════

Panel Thương Thành (tabs): [Cửa Hàng NPC] [Đấu Giá] [Chợ Người Chơi] [Đổi Đồ]

Cửa Hàng NPC: grid item mua bằng Vàng/Linh Thạch, tab theo loại hàng

Đấu Giá: list item đang đấu giá, có countdown timer, nút "Trả Giá" (nhập số + confirm), animation "BẠN BỊ VƯỢT GIÁ" khi bị outbid

Chợ Người Chơi: đăng bán item từ túi, tìm kiếm theo tên/thuộc tính

Thông báo giao dịch thành công: toast popup vàng góc trên

═══════════════════════════════════════════ 🔔 HỆ THỐNG PHỤ TRỢ ═══════════════════════════════════════════

Thông báo hệ thống: toast notifications góc trên, xếp chồng tối đa 3 cái

Chat toàn server: scrolling text cuộn tự động dưới màn hình (mock data đa dạng)

Sự kiện giới hạn: popup banner ảnh + countdown khi vào game

Thiền Định (Tu Luyện offline): nút "Nhập Định", timer chạy, nhận EXP theo thời gian thực, animation ngồi thiền + linh khí xoáy

Âm thanh: Web Audio API tạo tiếng kiếm "shwing", tiếng chuông, BGM nhẹ dạng synthesized (không cần file ngoài) — có nút bật/tắt âm thanh

═══════════════════════════════════════════ ✨ HIỆU ỨNG & ANIMATION ĐẶC BIỆT ═══════════════════════════════════════════

Ripple effect: TẤT CẢ nút đều có ripple (vàng/đỏ tùy loại nút) khi nhấn

Long-press: giữ nút 500ms → haptic-like animation + menu ngữ cảnh

Transition giữa các panel: slide + fade + scale tùy loại panel

Số tăng/giảm: animation countup/countdown khi stat thay đổi

Level up: full-screen flash vàng + chữ "ĐẲNG CẤP THĂNG" to + particle burst

Cảnh giới đột phá: animation sấm sét CSS (lightning bolt SVG animated) + âm thanh

Idle animation: nhân vật thở (scale nhẹ), tóc/áo bay (CSS transform)Parallax: layer bầu trời/mây/núi dịch chuyển tốc độ khác nhau khi "di chuyển"

═══════════════════════════════════════════ 📱 YÊU CẦU KỸ THUẬT ═══════════════════════════════════════════

Một file HTML duy nhất, không import file ngoài (trừ Google Fonts qua @import CSS)

Không dùng framework JS (vanilla JS thuần)

CSS Variables cho toàn bộ color system

Tất cả dữ liệu game (nhân vật, item, kỹ năng, quái vật, nhiệm vụ) khai báo trong const JS object ở đầu file

localStorage để lưu tiến trình tự động mỗi 30 giây

Màn hình tạo nhân vật khi chưa có save data: chọn tên + chọn môn phái + animation intro thủy mặc cuộn ra

Tối ưu 60fps trên mobile (dùng CSS transform thay top/left, requestAnimationFrame cho animation JS)

Viewport meta: width=device-width, initial-scale=1, maximum-scale=1 (khóa zoom)

Toàn bộ text có shadow để đọc rõ trên nền họa tiết

Bắt đầu với màn hình tạo nhân vật, sau đó vào màn hình chính đầy đủ. Viết code hoàn chỉnh, có thể chạy ngay khi mở file trong trình duyệt mobile.
