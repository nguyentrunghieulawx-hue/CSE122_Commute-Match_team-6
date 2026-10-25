/* =====================================================
   Kiểm thử MockApi (js/mock-api.js) trong Node — không cần trình duyệt.
   Giả lập localStorage + document tối thiểu rồi chạy các luồng chính.
   Chạy:  node tools/test-mock-api.js
   ===================================================== */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

function taoMoiTruong() {
  const kho = {};
  const ctx = {
    console, setTimeout, Promise, Date, Math, JSON, Error, Number, String, Object, Array,
    localStorage: {
      getItem: (k) => (k in kho ? kho[k] : null),
      setItem: (k, v) => { kho[k] = String(v); },
      removeItem: (k) => { delete kho[k]; }
    },
    document: {
      readyState: "complete",
      body: { getAttribute: () => null },
      querySelectorAll: () => [],
      addEventListener: () => {}
    }
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", "mock-api.js"), "utf8"), ctx);
  return { api: ctx.MockApi, kho };
}

async function nemLoi(promise, chua) {
  try { await promise; } catch (e) {
    if (chua) assert.ok(e.message.includes(chua), "Sai thông điệp lỗi: " + e.message);
    return e;
  }
  throw new Error("Lẽ ra phải báo lỗi: " + chua);
}

const cacBai = [];
function bai(ten, fn) { cacBai.push({ ten, fn }); }

bai("Đăng nhập đúng / sai / bị khóa", async ({ api }) => {
  const u = await api.xacThuc("HanhKhach@example.com", "12345678");
  assert.strictEqual(u.vaiTro, "rider");
  assert.strictEqual(u.matKhau, undefined, "Không được trả mật khẩu");
  await nemLoi(api.xacThuc("hanhkhach@example.com", "sai"), "không đúng");
  await nemLoi(api.xacThuc("hoangnam@example.com", "12345678"), "tạm khóa");
});

bai("Phiên đăng nhập + tài khoản demo theo vai trò trang", async ({ api, kho }) => {
  assert.strictEqual(api.layPhien("driver").id, "u002");
  const u = await api.xacThuc("admin@example.com", "12345678");
  api.batDauPhien(u);
  assert.strictEqual(kho.cmRole, "admin");
  assert.strictEqual(api.layPhien().id, "u009");
  assert.strictEqual(api.layPhien("rider").id, "u001", "Trang rider dùng tài khoản demo rider");
  api.dangXuat();
  assert.strictEqual(kho.cm_session, undefined);
});

bai("Đăng ký: tạo tài khoản, chặn email trùng, đăng nhập được", async ({ api }) => {
  const u = await api.dangKy({ hoTen: "Test User", email: "moi@example.com", matKhau: "abcdefgh", vaiTro: "driver" });
  assert.strictEqual(u.vaiTro, "driver");
  await nemLoi(api.dangKy({ hoTen: "X", email: "MOI@example.com", matKhau: "abcdefgh" }), "đã được đăng ký");
  await nemLoi(api.dangKy({ hoTen: "X", email: "a@b.c", matKhau: "123" }), "8 ký tự");
  assert.strictEqual((await api.xacThuc("moi@example.com", "abcdefgh")).id, u.id);
  assert.strictEqual(await api.demThongBaoChuaDoc(u.id), 1, "Có thông báo chào mừng");
});

bai("Tìm chuyến: khớp địa điểm không dấu, xếp theo điểm phù hợp", async ({ api }) => {
  const ds = await api.timChuyen({ diemDi: "Cầu Giấy, Hà Nội", diemDen: "Khu CNC Hòa Lạc", ngay: "2026-10-26", gio: "07:15" });
  assert.ok(ds.length >= 2, "Ít nhất 2 chuyến tới Hòa Lạc");
  assert.strictEqual(ds[0].ma, "CM-2408");
  assert.ok(ds.every((c) => c.trangThai === "upcoming"));
  assert.strictEqual(ds[0].taiXe.hoTen, "Nguyễn Minh Anh");
  const khongDau = await api.timChuyen({ diemDen: "hoa lac" });
  assert.ok(khongDau.some((c) => c.ma === "CM-2408"));
  assert.strictEqual((await api.timChuyen({ diemDi: "Vũng Tàu", diemDen: "Đà Lạt" })).length, 0);
});

bai("Tạo chuyến: kiểm tra dữ liệu + sinh mã CM tăng dần", async ({ api }) => {
  await nemLoi(api.taoChuyen({ taiXeId: "u002", diemDi: "A", diemDen: "B", ngayKhoiHanh: "2026-11-01", gioKhoiHanh: "07:00", tongSoGhe: 9, giaMoiGhe: 30000 }), "1 đến 7");
  const c = await api.taoChuyen({ taiXeId: "u002", diemDi: "Long Biên", diemDen: "Hoàn Kiếm", ngayKhoiHanh: "2026-11-01", gioKhoiHanh: "07:00", tongSoGhe: 3, giaMoiGhe: 25000 });
  assert.strictEqual(c.ma, "CM-2427");
  assert.strictEqual(c.soGheConLai, 3);
  const cuaTaiXe = await api.layChuyen({ taiXeId: "u002" });
  assert.ok(cuaTaiXe.some((x) => x.id === c.id));
});

bai("Gửi yêu cầu → tài xế duyệt → trừ ghế + thông báo hai chiều", async ({ api }) => {
  const truoc = await api.demThongBaoChuaDoc("u002");
  const yc = await api.guiYeuCau({ chuyenId: "t002", hanhKhachId: "u001", diemDon: "Ga Hà Đông", loiNhan: "Hi" });
  assert.strictEqual(yc.trangThai, "pending");
  assert.strictEqual(await api.demThongBaoChuaDoc("u003"), 1, "Tài xế t002 (u003) nhận thông báo");
  assert.strictEqual(await api.demThongBaoChuaDoc("u002"), truoc);
  await nemLoi(api.guiYeuCau({ chuyenId: "t002", hanhKhachId: "u001" }), "đã gửi yêu cầu");
  await api.duyetYeuCau(yc.id);
  assert.strictEqual((await api.layChuyenTheoId("t002")).soGheConLai, 0);
  const tb = await api.layThongBao("u001");
  assert.ok(tb.some((n) => n.tieuDe === "Yêu cầu đã được duyệt" && n.noiDung.includes("CM-2412")));
  await nemLoi(api.duyetYeuCau(yc.id), "đã được xử lý");
  await nemLoi(api.guiYeuCau({ chuyenId: "t002", hanhKhachId: "u005" }), "hết chỗ");
  await nemLoi(api.guiYeuCau({ chuyenId: "t001", hanhKhachId: "u002" }), "chính mình");
});

bai("Hủy yêu cầu đã duyệt → trả lại ghế; từ chối không đổi ghế", async ({ api }) => {
  await api.huyYeuCau("r003");
  assert.strictEqual((await api.layChuyenTheoId("t001")).soGheConLai, 3);
  await api.tuChoiYeuCau("r002");
  assert.strictEqual((await api.layChuyenTheoId("t001")).soGheConLai, 3);
  const choDuyet = await api.layYeuCau({ taiXeId: "u002", trangThai: "pending" });
  assert.deepStrictEqual(choDuyet.map((r) => r.id), ["r001"]);
  assert.strictEqual(choDuyet[0].hanhKhach.hoTen, "Phạm Bảo Ngọc");
  await nemLoi(api.huyYeuCau("r004"), "đã diễn ra");
});

bai("Thông báo: đánh dấu đã đọc, đọc tất cả, xóa", async ({ api }) => {
  assert.strictEqual(await api.demThongBaoChuaDoc("u001"), 2);
  await api.danhDauDaDoc("n003");
  assert.strictEqual(await api.demThongBaoChuaDoc("u001"), 1);
  assert.strictEqual(await api.danhDauTatCaDaDoc("u001"), 1);
  assert.strictEqual(await api.demThongBaoChuaDoc("u001"), 0);
  await api.xoaThongBao("n006");
  assert.strictEqual((await api.layThongBao("u001")).length, 3);
});

bai("Quản trị: sửa / khóa người dùng, chặn email trùng, thêm mới", async ({ api }) => {
  const u = await api.capNhatNguoiDung("u005", { trangThai: "locked", hoTen: "Ngọc P." });
  assert.strictEqual(u.trangThai, "locked");
  await nemLoi(api.xacThuc("baongoc@example.com", "12345678"), "tạm khóa");
  await nemLoi(api.capNhatNguoiDung("u005", { email: "taixe@example.com" }), "đã được dùng");
  await api.taoNguoiDung({ hoTen: "Admin Tạo", email: "taomoi@example.com", vaiTro: "coordinator" });
  assert.strictEqual((await api.xacThuc("taomoi@example.com", "12345678")).vaiTro, "coordinator");
  const ds = await api.layNguoiDung();
  assert.strictEqual(ds.length, 10);
  assert.ok(ds.every((x) => x.matKhau === undefined));
});

bai("Thống kê tính từ dữ liệu; lưu trữ chuyến làm giảm số gắn cờ", async ({ api }) => {
  const tk = await api.layThongKe();
  assert.strictEqual(tk.tongNguoiDung, 9);
  assert.strictEqual(tk.nguoiDungBiKhoa, 1);
  assert.strictEqual(tk.tongChuyen, 5);
  assert.strictEqual(tk.chuyenGanCo, 1);
  assert.strictEqual(tk.tangTruong.giaTri.length, 6);
  await api.capNhatChuyen("t002", { trangThai: "archived" });
  assert.strictEqual((await api.layThongKe()).chuyenGanCo, 0);
});

bai("Dữ liệu giữ lại sau khi ghi; datLaiDuLieu khôi phục mẫu", async ({ api, kho }) => {
  await api.capNhatNguoiDung("u001", { hoTen: "Đổi Tên" });
  assert.ok(kho.cm_mockdb_v1.includes("Đổi Tên"), "Đã ghi xuống localStorage");
  await api.datLaiDuLieu();
  assert.strictEqual((await api.layNguoiDungTheoId("u001")).hoTen, "Hoàng Anh");
});

bai("Định dạng hiển thị", async ({ api }) => {
  const d = api.dinhDang;
  assert.strictEqual(d.tien(35000), "35.000đ");
  assert.strictEqual(d.ngayNgan("2026-10-26"), "26/10");
  assert.strictEqual(d.thu("2026-10-26"), "Thứ Hai");
  assert.strictEqual(d.vietTat("Phạm Bảo Ngọc"), "BN");
  assert.strictEqual(d.diem(4.8), "4,8");
  assert.strictEqual(d.html('<b a="1">'), "&lt;b a=&quot;1&quot;&gt;");
});

(async () => {
  let dat = 0;
  for (const b of cacBai) {
    try {
      await b.fn(taoMoiTruong()); // mỗi bài một localStorage sạch
      dat++;
      console.log("  ĐẠT  " + b.ten);
    } catch (e) {
      console.log("  LỖI  " + b.ten + "\n        " + e.message);
    }
  }
  console.log("\n" + dat + "/" + cacBai.length + " bài kiểm thử đạt");
  process.exitCode = dat === cacBai.length ? 0 : 1;
})();

