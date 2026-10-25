/* =====================================================
   Kiểm thử các trang thật trong Chrome/Edge headless (không cần cài thêm thư viện).
   Dùng Chrome DevTools Protocol qua WebSocket có sẵn trong Node >= 22.
   Chạy:  node tools/test-pages-browser.js
   ===================================================== */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const os = require("os");

const ROOT = path.resolve(__dirname, "..");
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
].find((p) => fs.existsSync(p));
const CONG_WEB = 5577, CONG_DEBUG = 9333;
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };

/* ---------- Server tĩnh tối giản cho thư mục gốc repo ---------- */
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": MIME[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});

const cho = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- Kết nối CDP ---------- */
async function moTab() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${CONG_DEBUG}/json/new?about:blank`, { method: "PUT" });
      return await r.json();
    } catch (e) { await cho(250); }
  }
  throw new Error("Không mở được Chrome headless");
}

function ketNoi(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const choKetQua = new Map();
  const loiTrang = [];
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && choKetQua.has(m.id)) { choKetQua.get(m.id)(m); choKetQua.delete(m.id); }
    if (m.method === "Runtime.exceptionThrown") {
      const d = m.params.exceptionDetails;
      loiTrang.push((d.exception && d.exception.description) || d.text);
    }
  };
  const gui = (method, params = {}) => new Promise((ok) => {
    const i = ++id; choKetQua.set(i, ok); ws.send(JSON.stringify({ id: i, method, params }));
  });
  return new Promise((ok) => { ws.onopen = () => ok({ gui, loiTrang, dong: () => ws.close() }); });
}

/* Đăng ký kịch bản: mỗi kịch bản nhận bộ công cụ c */
const kichBan = [];
function kiem(ten, fn) { kichBan.push({ ten, fn }); }
function dung(dk, thongBao) { if (!dk) throw new Error(thongBao); }

/* ================= KỊCH BẢN ================= */

kiem("Login: sai mật khẩu bị từ chối", async (c) => {
  await c.moTrang("HIEU/login.html");
  await c.chay(`document.getElementById("oMatKhau").value="sai-mat-khau"`);
  await c.bam('[data-viec="dang-nhap"]');
  dung(await c.chay(`document.getElementById("khoiOtp").classList.contains("d-none")`), "Lẽ ra không được sang bước OTP");
  dung((await c.text("#cmToast")).includes("không đúng"), "Không báo sai mật khẩu: " + await c.text("#cmToast"));
});

kiem("Login: tài xế đăng nhập qua OTP → lưu phiên → vào Lịch chuyến", async (c) => {
  await c.bam('[data-vai-tro="driver"]');
  dung(await c.chay(`document.getElementById("oEmail").value`) === "taixe@example.com", "Không điền sẵn tài khoản demo");
  await c.bam('[data-viec="dang-nhap"]');
  await c.chay(`document.getElementById("oMaOtp").value=document.getElementById("oMaOtpHien").textContent`);
  await c.bam('[data-viec="xac-nhan-otp"]');
  await cho(900);
  const phien = JSON.parse(await c.chay(`localStorage.getItem("cm_session")`));
  dung(phien && phien.id === "u002" && phien.vaiTro === "driver", "Phiên sai: " + JSON.stringify(phien));
  dung((await c.chay("location.pathname")).endsWith("driver-schedule.html"), "Không chuyển tới driver-schedule");
});

kiem("Lịch chuyến: số liệu + danh sách từ MockApi, avatar/chuông cập nhật", async (c) => {
  await c.moTrang("HIEU/driver-schedule.html");
  dung(await c.text("#soSapToi") === "1", "Sắp tới phải là 1, đang là " + await c.text("#soSapToi"));
  dung(await c.text("#soChoDuyet") === "2", "Chờ duyệt phải là 2");
  const ds = await c.text("#dsChuyen");
  dung(ds.includes("CM-2408") && ds.includes("CM-2390"), "Danh sách thiếu chuyến: " + ds.slice(0, 120));
  dung(await c.text('a[title="Hồ sơ"]') === "MA", "Avatar phải là MA");
  dung(await c.text('a[title="Thông báo"]') === "2", "Chuông phải là 2");
});

kiem("Tạo chuyến: lưu qua MockApi, hiện mã CM mới, có trong Lịch chuyến", async (c) => {
  await c.moTrang("HIEU/driver-trip-create.html");
  await c.chay(`(function(){var d=new Date();d.setDate(d.getDate()+3);
    document.getElementById("diemDi").value="Cầu Giấy";document.getElementById("diemDen").value="Khu CNC Hòa Lạc";
    document.getElementById("ngayDi").value=d.toISOString().slice(0,10);document.getElementById("gioDi").value="07:20";
    document.getElementById("soGhe").value="3";document.getElementById("giaMoiGhe").value="36000";
    document.getElementById("formChuyen").requestSubmit();})()`);
  await cho(900);
  dung((await c.text("#noiDungThanhCong")).includes("CM-2427"), "Không thấy mã CM-2427: " + await c.text("#noiDungThanhCong"));
  await c.moTrang("HIEU/driver-schedule.html");
  dung((await c.text("#dsChuyen")).includes("CM-2427"), "Lịch chuyến chưa có chuyến vừa tạo");
});

kiem("Duyệt yêu cầu: trừ ghế, cập nhật tab", async (c) => {
  await c.moTrang("HIEU/driver-join-requests.html");
  dung((await c.text("#nhomTab")).includes("Đang chờ 2"), "Tab đang chờ phải là 2: " + await c.text("#nhomTab"));
  await c.bam('[data-viec="duyet"][data-id="r001"]');
  const tab = await c.text("#nhomTab");
  dung(tab.includes("Đang chờ 1") && tab.includes("Đã duyệt 2"), "Số tab chưa cập nhật: " + tab);
  const ghe = await c.chay(`MockApi.layChuyenTheoId("t001").then(function(x){return x.soGheConLai})`);
  dung(ghe === 1, "Ghế còn lại của t001 phải là 1, đang là " + ghe);
});


kiem("Hành khách: tìm → gợi ý → gửi yêu cầu → thấy ở Chuyến của tôi", async (c) => {
  await c.chay(`localStorage.removeItem("cm_session")`); // trang rider dùng tài khoản demo hành khách
  await c.moTrang("DAI/rider-trip-search.html");
  await c.bam('[data-action="search"]');
  await cho(800);
  dung((await c.chay("location.pathname")).endsWith("rider-match-results.html"), "Không sang trang kết quả");
  dung(/^\d+ chuyến phù hợp$/.test(await c.text("#mrTieuDe")), "Tiêu đề sai: " + await c.text("#mrTieuDe"));
  const ds = await c.text("#mrDanhSach");
  dung(ds.includes("CM-2427") && ds.includes("CM-2426"), "Kết quả thiếu chuyến: " + ds.slice(0, 150));
  const id = await c.chay(`(function(){var b=[].slice.call(document.querySelectorAll('#mrDanhSach [data-modal="joinModal"]')).filter(function(x){return !x.disabled && x.closest("article").textContent.indexOf("CM-2427")>=0})[0];return b&&b.dataset.id})()`);
  await c.bam(`[data-modal="joinModal"][data-id="${id}"]`);
  dung((await c.text("#mrTenChuyen")).includes("CM-2427"), "Hộp thoại không đúng chuyến");
  await c.bam('[data-action="confirm-join"]');
  await cho(1200);
  dung((await c.chay("location.pathname")).endsWith("rider-my-trips.html"), "Không chuyển sang Chuyến của tôi");
  await cho(500);
  await c.bam('#mtTabs [data-loc="pending"]');
  dung((await c.text("#mtDanhSach")).includes("CM-2427"), "Tab Đang chờ chưa có yêu cầu vừa gửi");
});

kiem("Chuyến của tôi: hủy chuyến đã duyệt → trả lại ghế", async (c) => {
  await c.moTrang("DAI/rider-my-trips.html");
  await c.chay("window.confirm = function(){ return true; }");
  dung((await c.text("#mtDanhSach")).includes("CM-2408"), "Tab Đã duyệt thiếu CM-2408");
  await c.bam('[data-action="cancel"][data-id="r003"]');
  const ghe = await c.chay(`MockApi.layChuyenTheoId("t001").then(function(x){return x.soGheConLai})`);
  dung(ghe === 2, "Ghế t001 phải trả về 2, đang là " + ghe);
});

kiem("Thông báo: đếm chưa đọc, đọc tất cả, xóa", async (c) => {
  await c.moTrang("DAI/notifications.html");
  const truoc = await c.text('#tbTabs [data-loc="unread"]');
  dung(/Chưa đọc [1-9]/.test(truoc), "Phải có thông báo chưa đọc: " + truoc);
  await c.bam('[data-action="read-all"]');
  await cho(400);
  dung(await c.text('#tbTabs [data-loc="unread"]') === "Chưa đọc 0", "Chưa đánh dấu hết");
  dung(await c.text('a[title="Thông báo"]') === "0", "Chuông chưa về 0");
  const soTruoc = await c.chay(`document.querySelectorAll("#tbDanhSach .dai-item").length`);
  await c.bam('#tbDanhSach [data-action="delete"]');
  dung(await c.chay(`document.querySelectorAll("#tbDanhSach .dai-item").length`) === soTruoc - 1, "Xóa không được");
});

kiem("Admin dashboard: số liệu tính từ dữ liệu", async (c) => {
  await c.moTrang("DUC/admin-dashboard.html");
  dung(await c.text("#adSoNguoiDung") === "9", "Số người dùng phải là 9: " + await c.text("#adSoNguoiDung"));
  dung(await c.text("#adSoChuyen") === "6", "Số chuyến phải là 6 (5 mẫu + 1 mới): " + await c.text("#adSoChuyen"));
  dung(await c.chay(`document.querySelectorAll("#adBieuDo .chart-bar").length`) === 6, "Biểu đồ phải có 6 cột");
});

kiem("Quản lý người dùng: tìm kiếm, khóa tài khoản → không đăng nhập được", async (c) => {
  await c.moTrang("DUC/admin-user-management.html");
  dung(await c.chay(`document.querySelectorAll("#umBang tr").length`) === 9, "Bảng phải có 9 người");
  await c.chay(`var o=document.getElementById("umTim");o.value="ngọc";o.dispatchEvent(new Event("input"))`);
  dung(await c.chay(`document.querySelectorAll("#umBang tr").length`) === 1, "Tìm 'ngọc' phải ra 1 dòng");
  await c.bam('[data-action="toggle-lock"][data-id="u005"]');
  dung((await c.text("#umBang")).includes("Tạm khóa"), "Chưa hiện Tạm khóa");
  const loi = await c.chay(`MockApi.xacThuc("baongoc@example.com","12345678").then(function(){return "ok"},function(e){return e.message})`);
  dung(loi.includes("tạm khóa"), "Tài khoản bị khóa vẫn đăng nhập được");
});

kiem("Quản lý người dùng: thêm mới + chặn email trùng", async (c) => {
  await c.chay(`var o=document.getElementById("umTim");o.value="";o.dispatchEvent(new Event("input"))`);
  await c.bam("[data-them]");
  await c.chay(`document.getElementById("umHoTen").value="Người Mới";document.getElementById("umEmail").value="taixe@example.com"`);
  await c.bam('[data-action="save-user"]');
  dung((await c.text("#toast")).includes("đã được dùng"), "Không chặn email trùng: " + await c.text("#toast"));
  await c.chay(`document.getElementById("umEmail").value="nguoimoi@example.com"`);
  await c.bam('[data-action="save-user"]');
  dung(await c.chay(`document.querySelectorAll("#umBang tr").length`) === 10, "Chưa thêm được người dùng");
});


kiem("Quản lý chuyến: lọc gắn cờ, chi tiết, gỡ cờ, lưu trữ", async (c) => {
  await c.moTrang("DUC/admin-trip-management.html");
  await c.chay(`var s=document.getElementById("tmLoc");s.selectedIndex=3;s.dispatchEvent(new Event("change"))`);
  dung(await c.chay(`document.querySelectorAll("#tmBang tr").length`) === 1 && (await c.text("#tmBang")).includes("CM-2412"), "Lọc gắn cờ phải ra CM-2412");
  await c.bam('[data-modal="tripAdminModal"][data-id="t002"]');
  dung((await c.text("#tmChiTiet")).includes("Chi tiết chuyến CM-2412"), "Hộp thoại chi tiết sai");
  await c.bam('#tmChiTiet [data-action="unflag"]');
  dung((await c.text("#tmBang")).includes("Không có chuyến"), "Gỡ cờ xong bảng lọc phải trống");
  await c.chay(`var s=document.getElementById("tmLoc");s.selectedIndex=0;s.dispatchEvent(new Event("change"))`);
  await c.bam('[data-action="archive"][data-id="t004"]');
  dung(await c.chay(`MockApi.layChuyenTheoId("t004").then(function(x){return x.trangThai})`) === "archived", "Chưa lưu trữ được");
});

kiem("Đăng ký: email trùng bị chặn, tài khoản mới đăng nhập được", async (c) => {
  await c.moTrang("HIEU/register.html");
  await c.chay(`document.getElementById("oHoTen").value="Khách Mới";document.getElementById("oEmail").value="hanhkhach@example.com";
    document.getElementById("oMatKhau").value="matkhau123";document.getElementById("oDongY").checked=true`);
  await c.bam('[data-viec="dang-ky"]');
  dung(await c.chay(`document.getElementById("khoiOtp").classList.contains("d-none")`), "Email trùng vẫn sang bước OTP");
  await c.chay(`document.getElementById("oEmail").value="khachmoi@example.com"`);
  await c.bam('[data-viec="dang-ky"]');
  await c.chay(`document.getElementById("oMaOtp").value=document.getElementById("oMaOtpHien").textContent`);
  await c.bam('[data-viec="xac-nhan-otp"]');
  const kq = await c.chay(`MockApi.xacThuc("khachmoi@example.com","matkhau123").then(function(u){return u.hoTen},function(e){return e.message})`);
  dung(kq === "Khách Mới", "Không đăng nhập được tài khoản mới: " + kq);
});

kiem("Các trang khác vẫn chạy, không lỗi JS", async (c) => {
  for (const p of ["HIEU/index.html", "HIEU/driver-trip-detail.html", "DAI/profile.html", "DAI/settings.html",
    "DAI/rider-trip-detail.html", "DUC/coordinator-mobility-dashboard.html", "DUC/admin-report-center.html"]) {
    await c.moTrang(p);
    dung(await c.chay("typeof MockApi") === "object", p + ": chưa nạp MockApi");
    if (c.loiTrang.length) throw new Error(p + ": " + c.loiTrang.join(" | "));
  }
});

/* ================= CHẠY ================= */
async function main() {
  if (!CHROME) { console.log("Không tìm thấy Chrome/Edge — bỏ qua kiểm thử trình duyệt."); return; }
  await new Promise((r) => server.listen(CONG_WEB, r));
  const hoSo = fs.mkdtempSync(path.join(os.tmpdir(), "cm-chrome-"));
  const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${CONG_DEBUG}`, `--user-data-dir=${hoSo}`,
    "--no-first-run", "--disable-gpu", "about:blank"], { stdio: "ignore" });

  let dat = 0;
  try {
    const tab = await moTab();
    const t = await ketNoi(tab.webSocketDebuggerUrl);
    await t.gui("Runtime.enable");
    await t.gui("Page.enable");

    const c = { loiTrang: t.loiTrang };
    c.chay = async (bieuThuc) => {
      const r = await t.gui("Runtime.evaluate", { expression: bieuThuc, awaitPromise: true, returnByValue: true });
      const d = r.result.exceptionDetails;
      if (d) throw new Error((d.exception && d.exception.description) || d.text);
      return r.result.result.value;
    };
    c.moTrang = async (duongDan) => {
      t.loiTrang.length = 0;
      await t.gui("Page.navigate", { url: `http://127.0.0.1:${CONG_WEB}/${duongDan}` });
      await cho(300);
      for (let i = 0; i < 40; i++) { if (await c.chay("document.readyState") === "complete") break; await cho(150); }
      await cho(800); // đợi MockApi (độ trễ giả lập) + render
    };
    c.text = (sel) => c.chay(`(document.querySelector(${JSON.stringify(sel)})||{}).textContent||""`);
    c.bam = async (sel) => { await c.chay(`document.querySelector(${JSON.stringify(sel)}).click()`); await cho(800); };

    /* Bắt đầu với dữ liệu sạch */
    await c.moTrang("HIEU/login.html");
    await c.chay("localStorage.clear(); sessionStorage.clear()");

    for (const k of kichBan) {
      try {
        await k.fn(c);
        if (t.loiTrang.length) throw new Error("Lỗi JS trên trang: " + t.loiTrang.join(" | "));
        dat++; console.log("  ĐẠT  " + k.ten);
      } catch (e) { console.log("  LỖI  " + k.ten + "\n        " + e.message); }
    }
    t.dong();
  } finally {
    chrome.kill();
    server.close();
    await cho(800);
    try { fs.rmSync(hoSo, { recursive: true, force: true }); } catch (e) { /* Chrome còn giữ file */ }
  }
  console.log("\n" + dat + "/" + kichBan.length + " kịch bản trên trình duyệt đạt");
  process.exitCode = dat === kichBan.length ? 0 : 1;
}

main().catch((e) => { console.error(e); process.exitCode = 1; server.close(); });

