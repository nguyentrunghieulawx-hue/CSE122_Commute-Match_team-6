/* =====================================================
   Kiểm thử MockApi ở chế độ json-server (cần server đang chạy).
   Chạy:  node tools/test-mock-api-server.js http://localhost:3000
   ===================================================== */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const URL_MAY_CHU = process.argv[2] || "http://localhost:3000";

const kho = { cm_api_mode: "server", cm_api_url: URL_MAY_CHU };
const ctx = {
  console, setTimeout, Promise, Date, Math, JSON, Error, Number, String, Object, Array, fetch,
  localStorage: {
    getItem: (k) => (k in kho ? kho[k] : null),
    setItem: (k, v) => { kho[k] = String(v); },
    removeItem: (k) => { delete kho[k]; }
  },
  document: { readyState: "complete", body: { getAttribute: () => null }, querySelectorAll: () => [], addEventListener: () => {} }
};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", "mock-api.js"), "utf8"), ctx);
const api = ctx.MockApi;

(async () => {
  assert.strictEqual(api.cheDo(), "server");

  const u = await api.xacThuc("taixe@example.com", "12345678");
  assert.strictEqual(u.id, "u002");
  console.log("  ĐẠT  Đăng nhập qua json-server");

  const ds = await api.timChuyen({ diemDi: "Cầu Giấy", diemDen: "Hòa Lạc" });
  assert.strictEqual(ds[0].ma, "CM-2408");
  console.log("  ĐẠT  Tìm chuyến qua json-server (" + ds.length + " kết quả)");

  const c = await api.taoChuyen({ taiXeId: "u002", diemDi: "Long Biên", diemDen: "Hoàn Kiếm", ngayKhoiHanh: "2026-11-01", gioKhoiHanh: "07:00", tongSoGhe: 2, giaMoiGhe: 20000 });
  const yc = await api.guiYeuCau({ chuyenId: c.id, hanhKhachId: "u001" });
  await api.duyetYeuCau(yc.id);
  assert.strictEqual((await api.layChuyenTheoId(c.id)).soGheConLai, 1);
  console.log("  ĐẠT  Tạo chuyến → gửi yêu cầu → duyệt (trừ ghế) qua json-server");

  /* Dữ liệu phải được ghi xuống db.json */
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, "mock-api", "db.json"), "utf8"));
  assert.ok(db.trips.some((t) => t.id === c.id && t.soGheConLai === 1), "db.json chưa có chuyến mới");
  assert.ok(db.joinRequests.some((r) => r.id === yc.id && r.trangThai === "accepted"));
  console.log("  ĐẠT  Thay đổi đã được ghi vào db.json");

  await nemLoi(api.dangKy({ hoTen: "X", email: "taixe@example.com", matKhau: "12345678" }), "đã được đăng ký");
  console.log("  ĐẠT  Lỗi nghiệp vụ trả về đúng thông điệp");

  const tk = await api.layThongKe();
  assert.ok(tk.tongChuyen >= 6);
  console.log("  ĐẠT  Thống kê qua json-server");

  /* Máy chủ tắt → thông điệp rõ ràng */
  kho.cm_api_url = "http://127.0.0.1:1";
  await nemLoi(api.layChuyen(), "Không kết nối được máy chủ mock");
  console.log("  ĐẠT  Báo lỗi rõ ràng khi json-server không chạy");

  console.log("\nChế độ json-server: tất cả đạt");
})().catch((e) => { console.log("  LỖI  " + e.message); process.exitCode = 1; });

async function nemLoi(p, chua) {
  try { await p; } catch (e) { assert.ok(e.message.includes(chua), e.message); return; }
  throw new Error("Lẽ ra phải báo lỗi: " + chua);
}
