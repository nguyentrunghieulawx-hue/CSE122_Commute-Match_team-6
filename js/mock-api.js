/* =====================================================
   CommuteMatch — MockApi dùng chung cho cả 3 thư mục HIEU / DAI / DUC
   -----------------------------------------------------
   - Mặc định dữ liệu lưu trong localStorage của trình duyệt
     → chạy được khi mở file trực tiếp, Live Server và GitHub Pages.
   - Có thể chuyển sang gọi json-server thật (tools/mock-api):
       MockApi.dungMayChu("http://localhost:3000")   // bật
       MockApi.dungTrinhDuyet()                      // về lại mặc định
   - Mọi hàm nghiệp vụ trả về Promise. Lỗi nghiệp vụ → reject(Error)
     với thông điệp tiếng Việt, trang chỉ cần hiện err.message.
   - Đặt lại dữ liệu mẫu: MockApi.datLaiDuLieu()
   Nhúng vào trang (trước file js riêng của trang):
       <script src="../js/mock-api.js"></script>
   ===================================================== */

(function (goc) {
  "use strict";

  /* ================= 1. DỮ LIỆU MẪU ================= */
  /* Tất cả tài khoản demo dùng mật khẩu 12345678 */
  var DU_LIEU_MAU = {
    users: [
      { id: "u001", hoTen: "Hoàng Anh", email: "hanhkhach@example.com", matKhau: "12345678", vaiTro: "rider", soDienThoai: "0901234567", trangThai: "active", danhGia: 4.8, soChuyen: 22, ngayTao: "2026-08-15" },
      { id: "u002", hoTen: "Nguyễn Minh Anh", email: "taixe@example.com", matKhau: "12345678", vaiTro: "driver", soDienThoai: "0912345678", trangThai: "active", danhGia: 4.9, soChuyen: 128, ngayTao: "2026-05-02" },
      { id: "u003", hoTen: "Trần Đức Long", email: "duclong@example.com", matKhau: "12345678", vaiTro: "driver", soDienThoai: "0923456789", trangThai: "active", danhGia: 4.8, soChuyen: 64, ngayTao: "2026-06-12" },
      { id: "u004", hoTen: "Lê Thu Hà", email: "thuha@example.com", matKhau: "12345678", vaiTro: "driver", soDienThoai: "0934567890", trangThai: "active", danhGia: 4.7, soChuyen: 41, ngayTao: "2026-07-08" },
      { id: "u005", hoTen: "Phạm Bảo Ngọc", email: "baongoc@example.com", matKhau: "12345678", vaiTro: "rider", soDienThoai: "0945678901", trangThai: "active", danhGia: 4.8, soChuyen: 22, ngayTao: "2026-09-03" },
      { id: "u006", hoTen: "Hoàng Lan", email: "hoanglan@example.com", matKhau: "12345678", vaiTro: "rider", soDienThoai: "0956789012", trangThai: "active", danhGia: 4.6, soChuyen: 8, ngayTao: "2026-10-02" },
      { id: "u007", hoTen: "Đỗ Hoàng Nam", email: "hoangnam@example.com", matKhau: "12345678", vaiTro: "rider", soDienThoai: "0967890123", trangThai: "locked", danhGia: 4.1, soChuyen: 5, ngayTao: "2026-10-10" },
      { id: "u008", hoTen: "Lê Minh Cường", email: "dieuphoi@example.com", matKhau: "12345678", vaiTro: "coordinator", soDienThoai: "0978901234", trangThai: "active", danhGia: 4.7, soChuyen: 0, ngayTao: "2026-04-10" },
      { id: "u009", hoTen: "Phạm Quốc Dũng", email: "admin@example.com", matKhau: "12345678", vaiTro: "admin", soDienThoai: "0989012345", trangThai: "active", danhGia: 5.0, soChuyen: 0, ngayTao: "2026-03-01" }
    ],
    trips: [
      { id: "t001", ma: "CM-2408", taiXeId: "u002", diemDi: "Cầu Giấy", diemDen: "Hòa Lạc", ngayKhoiHanh: "2026-10-26", gioKhoiHanh: "07:15", tongSoGhe: 3, soGheConLai: 2, giaMoiGhe: 35000, trangThai: "upcoming", biGanCo: false, ghiChu: "Không hút thuốc trên xe", diemDon: ["Cổng Big C Thăng Long", "Ngõ 18 Trần Thái Tông"] },
      { id: "t002", ma: "CM-2412", taiXeId: "u003", diemDi: "Hà Đông", diemDen: "ĐHQG Hà Nội", ngayKhoiHanh: "2026-10-26", gioKhoiHanh: "07:30", tongSoGhe: 3, soGheConLai: 1, giaMoiGhe: 30000, trangThai: "upcoming", biGanCo: true, ghiChu: "", diemDon: ["Ga Hà Đông", "Aeon Mall Hà Đông"] },
      { id: "t003", ma: "CM-2426", taiXeId: "u004", diemDi: "Mỹ Đình", diemDen: "Khu CNC Hòa Lạc", ngayKhoiHanh: "2026-10-26", gioKhoiHanh: "08:00", tongSoGhe: 1, soGheConLai: 0, giaMoiGhe: 40000, trangThai: "upcoming", biGanCo: false, ghiChu: "", diemDon: ["Bến xe Mỹ Đình", "Keangnam Landmark"] },
      { id: "t004", ma: "CM-2390", taiXeId: "u002", diemDi: "Hà Đông", diemDen: "Cầu Giấy", ngayKhoiHanh: "2026-10-23", gioKhoiHanh: "17:30", tongSoGhe: 4, soGheConLai: 1, giaMoiGhe: 30000, trangThai: "completed", biGanCo: false, ghiChu: "", diemDon: ["Ga Hà Đông"] },
      { id: "t005", ma: "CM-2385", taiXeId: "u003", diemDi: "Hà Đông", diemDen: "ĐHQG Hà Nội", ngayKhoiHanh: "2026-10-23", gioKhoiHanh: "07:30", tongSoGhe: 3, soGheConLai: 2, giaMoiGhe: 30000, trangThai: "completed", biGanCo: false, ghiChu: "", diemDon: ["Ga Hà Đông"] }
    ],
    joinRequests: [
      { id: "r001", chuyenId: "t001", hanhKhachId: "u005", soGhe: 1, diemDon: "Cổng Big C Thăng Long", lechTuyen: 2, loiNhan: "Mình sẽ có mặt trước 5 phút.", diemPhuHop: 94, trangThai: "pending", ngayGui: "2026-10-25T08:55:00" },
      { id: "r002", chuyenId: "t001", hanhKhachId: "u006", soGhe: 1, diemDon: "Ngõ 18 Trần Thái Tông", lechTuyen: 4, loiNhan: "", diemPhuHop: 88, trangThai: "pending", ngayGui: "2026-10-25T08:40:00" },
      { id: "r003", chuyenId: "t001", hanhKhachId: "u001", soGhe: 1, diemDon: "Cổng Big C Thăng Long", lechTuyen: 2, loiNhan: "", diemPhuHop: 96, trangThai: "accepted", ngayGui: "2026-10-24T15:00:00" },
      { id: "r004", chuyenId: "t005", hanhKhachId: "u001", soGhe: 1, diemDon: "Ga Hà Đông", lechTuyen: 1, loiNhan: "", diemPhuHop: 91, trangThai: "accepted", ngayGui: "2026-10-21T19:00:00" },
      { id: "r005", chuyenId: "t004", hanhKhachId: "u007", soGhe: 1, diemDon: "Ga Hà Đông", lechTuyen: 6, loiNhan: "", diemPhuHop: 72, trangThai: "rejected", ngayGui: "2026-10-20T12:00:00" }
    ],
    notifications: [
      { id: "n001", nguoiNhanId: "u002", tieuDe: "Bạn có yêu cầu tham gia mới", noiDung: "Phạm Bảo Ngọc muốn tham gia chuyến CM-2408.", loai: "trip", kyHieu: "YC", mau: "amber", lienKet: "driver-join-requests", daDoc: false, thoiGian: "2026-10-25T08:55:00" },
      { id: "n002", nguoiNhanId: "u002", tieuDe: "Bạn có yêu cầu tham gia mới", noiDung: "Hoàng Lan muốn tham gia chuyến CM-2408.", loai: "trip", kyHieu: "YC", mau: "amber", lienKet: "driver-join-requests", daDoc: false, thoiGian: "2026-10-25T08:40:00" },
      { id: "n003", nguoiNhanId: "u001", tieuDe: "Yêu cầu đã được duyệt", noiDung: "Bạn đã được xác nhận vào chuyến CM-2408 Cầu Giấy → Hòa Lạc.", loai: "trip", kyHieu: "OK", mau: "lime", lienKet: "rider-my-trips", daDoc: false, thoiGian: "2026-10-24T16:00:00" },
      { id: "n004", nguoiNhanId: "u001", tieuDe: "Nhắc lịch chuyến ngày mai", noiDung: "Chuyến CM-2408 khởi hành lúc 07:15 ngày 26/10.", loai: "trip", kyHieu: "LC", mau: "amber", lienKet: "rider-my-trips", daDoc: false, thoiGian: "2026-10-25T07:00:00" },
      { id: "n005", nguoiNhanId: "u001", tieuDe: "Chuyến đã hoàn thành", noiDung: "Cảm ơn bạn đã sử dụng CommuteMatch. Hãy đánh giá chuyến CM-2385.", loai: "trip", kyHieu: "HT", mau: "", lienKet: "rider-my-trips", daDoc: true, thoiGian: "2026-10-23T08:30:00" },
      { id: "n006", nguoiNhanId: "u001", tieuDe: "Chào mừng bạn đến CommuteMatch", noiDung: "Hoàn thiện hồ sơ để được ghép chuyến chính xác hơn.", loai: "system", kyHieu: "CM", mau: "", lienKet: "profile", daDoc: true, thoiGian: "2026-08-15T10:00:00" },
      { id: "n007", nguoiNhanId: "u008", tieuDe: "Báo cáo mới cần xử lý", noiDung: "RP-1024: Điểm đón không an toàn.", loai: "system", kyHieu: "BC", mau: "", lienKet: "coordinator-report-center", daDoc: false, thoiGian: "2026-10-25T08:00:00" },
      { id: "n008", nguoiNhanId: "u009", tieuDe: "Chuyến bị gắn cờ", noiDung: "CM-2412 có 1 báo cáo liên quan cần xem xét.", loai: "system", kyHieu: "GC", mau: "amber", lienKet: "admin-trip-management", daDoc: false, thoiGian: "2026-10-25T08:05:00" }
    ]
  };

  /* Chạy trong Node (tools/mock-api/server.js): chỉ xuất dữ liệu mẫu */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { DU_LIEU_MAU: DU_LIEU_MAU };
    return;
  }

  /* ================= 2. CẤU HÌNH ================= */
  var MAT_KHAU_DEMO = "12345678";
  var TAI_KHOAN_DEMO = { rider: "u001", driver: "u002", coordinator: "u008", admin: "u009" };
  var KHOA = {
    db: "cm_mockdb_v1",      // toàn bộ dữ liệu (chế độ trình duyệt)
    phien: "cm_session",     // người đang đăng nhập
    vaiTro: "cmRole",        // khóa cũ các trang DAI đang dùng để dựng menu
    cheDo: "cm_api_mode",    // "browser" (mặc định) | "server"
    url: "cm_api_url"        // địa chỉ json-server
  };
  var URL_MAC_DINH = "http://localhost:3000";
  var DO_TRE = 120;          // ms — giả lập độ trễ mạng


  /* ================= 3. TIỆN ÍCH ================= */
  function saoChep(x) { return x == null ? x : JSON.parse(JSON.stringify(x)); }
  function cho(ms) { return new Promise(function (xong) { setTimeout(xong, ms); }); }
  function loi(thongDiep) { return new Error(thongDiep); }
  function hai(n) { return String(n).padStart(2, "0"); }
  function taoId(tienTo) { return tienTo + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

  function bayGioISO() {
    var d = new Date();
    return d.getFullYear() + "-" + hai(d.getMonth() + 1) + "-" + hai(d.getDate()) +
      "T" + hai(d.getHours()) + ":" + hai(d.getMinutes()) + ":" + hai(d.getSeconds());
  }

  function docBoNho(khoa) {
    try { return localStorage.getItem(khoa); } catch (e) { return null; }
  }
  function ghiBoNho(khoa, giaTri) {
    try {
      if (giaTri === null) localStorage.removeItem(khoa);
      else localStorage.setItem(khoa, giaTri);
      return true;
    } catch (e) { return false; }
  }

  /* "Hòa Lạc" -> "hoa lac" để so khớp địa điểm không phân biệt dấu */
  function boDau(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();
  }
  /* "Khu CNC Hòa Lạc" khớp "Hòa Lạc"; "Cầu Giấy, Hà Nội" khớp "Cầu Giấy" */
  function khopDiaDiem(trongChuyen, nguoiTim) {
    var a = boDau(trongChuyen);
    var b = boDau(String(nguoiTim || "").split(",")[0]);
    if (!a || !b) return false;
    return a.indexOf(b) >= 0 || b.indexOf(a) >= 0;
  }
  function soPhut(gio) {
    var p = String(gio || "0:0").split(":");
    return Number(p[0]) * 60 + Number(p[1] || 0);
  }
  function anMatKhau(u) {
    if (!u) return u;
    var x = saoChep(u);
    delete x.matKhau;
    return x;
  }
  function timTheoId(ds, id) {
    for (var i = 0; i < ds.length; i++) if (ds[i].id === id) return ds[i];
    return null;
  }
  function tomTatNguoi(u) {
    return u ? { id: u.id, hoTen: u.hoTen, danhGia: u.danhGia || 0, soChuyen: u.soChuyen || 0 }
      : { id: "", hoTen: "(không rõ)", danhGia: 0, soChuyen: 0 };
  }
  function theoGioKhoiHanh(a, b) {
    return (a.ngayKhoiHanh + a.gioKhoiHanh).localeCompare(b.ngayKhoiHanh + b.gioKhoiHanh);
  }

  /* ---------- Định dạng hiển thị dùng chung cho các trang ---------- */
  var TEN_THU = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  var TEN_VAI_TRO = { rider: "Hành khách", driver: "Người chia sẻ xe", coordinator: "Điều phối viên", admin: "Quản trị viên" };

  var dinhDang = {
    /* 35000 -> "35.000đ" */
    tien: function (n) { return Number(n || 0).toLocaleString("vi-VN") + "đ"; },
    /* "2026-10-26" -> "26/10" */
    ngayNgan: function (iso) {
      var p = String(iso || "").slice(0, 10).split("-");
      return p.length < 3 ? "" : p[2] + "/" + p[1];
    },
    /* "2026-10-26" -> "Thứ Hai" */
    thu: function (iso) {
      var p = String(iso || "").slice(0, 10).split("-");
      if (p.length < 3) return "";
      return TEN_THU[new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])).getDay()];
    },
    /* 4.8 -> "4,8" */
    diem: function (x) {
      return Number(x || 0).toLocaleString("vi-VN", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    },
    /* "Phạm Bảo Ngọc" -> "BN" */
    vietTat: function (ten) {
      var w = String(ten || "").trim().split(/\s+/).filter(Boolean);
      if (!w.length) return "?";
      var chu = w.length > 1 ? w[w.length - 2].charAt(0) + w[w.length - 1].charAt(0) : w[0].slice(0, 2);
      return chu.toUpperCase();
    },
    /* "2026-10-25T08:55:00" -> "5 phút trước" */
    tuongDoi: function (iso) {
      var t = new Date(iso).getTime();
      if (isNaN(t)) return "";
      var s = Math.round((Date.now() - t) / 1000);
      if (s < 60) return "Vừa xong";
      if (s < 3600) return Math.floor(s / 60) + " phút trước";
      if (s < 86400) return Math.floor(s / 3600) + " giờ trước";
      if (s < 172800) return "Hôm qua";
      if (s < 604800) return Math.floor(s / 86400) + " ngày trước";
      return dinhDang.ngayNgan(iso) + "/" + String(iso).slice(0, 4);
    },
    vaiTro: function (ma) { return TEN_VAI_TRO[ma] || ma; },
    /* Chặn mã HTML khi chèn nội dung người dùng vào trang */
    html: function (s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }
  };


  /* ================= 4. KHO DỮ LIỆU (2 chế độ) ================= */
  var dbTam = null; // dùng khi trình duyệt chặn localStorage

  /* --- 4a. Lưu trong trình duyệt (mặc định) --- */
  var khoTrinhDuyet = {
    docDb: function () {
      var raw = docBoNho(KHOA.db);
      if (raw) {
        try { return JSON.parse(raw); } catch (e) { /* dữ liệu hỏng → tạo lại từ mẫu */ }
      }
      if (dbTam) return dbTam;
      var db = saoChep(DU_LIEU_MAU);
      this.ghiDb(db);
      return db;
    },
    ghiDb: function (db) {
      if (!ghiBoNho(KHOA.db, JSON.stringify(db))) dbTam = db;
    },
    danhSach: function (ten) {
      var self = this;
      return cho(DO_TRE).then(function () { return saoChep(self.docDb()[ten] || []); });
    },
    lay: function (ten, id) {
      var self = this;
      return cho(DO_TRE).then(function () { return saoChep(timTheoId(self.docDb()[ten] || [], id)); });
    },
    tao: function (ten, banGhi) {
      var self = this;
      return cho(DO_TRE).then(function () {
        var db = self.docDb();
        (db[ten] = db[ten] || []).push(saoChep(banGhi));
        self.ghiDb(db);
        return saoChep(banGhi);
      });
    },
    sua: function (ten, id, thayDoi) {
      var self = this;
      return cho(DO_TRE).then(function () {
        var db = self.docDb();
        var bg = timTheoId(db[ten] || [], id);
        if (!bg) throw loi("Không tìm thấy dữ liệu " + ten + "/" + id + ".");
        Object.assign(bg, thayDoi);
        self.ghiDb(db);
        return saoChep(bg);
      });
    },
    xoa: function (ten, id) {
      var self = this;
      return cho(DO_TRE).then(function () {
        var db = self.docDb();
        db[ten] = (db[ten] || []).filter(function (x) { return x.id !== id; });
        self.ghiDb(db);
        return null;
      });
    }
  };

  /* --- 4b. Gọi json-server (tools/mock-api, chạy "npm start") --- */
  var khoMayChu = {
    goi: function (duongDan, phuongThuc, duLieu) {
      var url = urlMayChu() + duongDan;
      var tuyChon = { method: phuongThuc || "GET", headers: { "Content-Type": "application/json" } };
      if (duLieu !== undefined) tuyChon.body = JSON.stringify(duLieu);
      return fetch(url, tuyChon).then(function (res) {
        if (res.status === 404) return null;
        if (!res.ok) throw loi("Máy chủ mock báo lỗi " + res.status + " (" + url + ").");
        return res.text().then(function (t) { return t ? JSON.parse(t) : null; });
      }, function () {
        throw loi("Không kết nối được máy chủ mock " + urlMayChu() +
          '. Hãy chạy "npm start" trong tools/mock-api hoặc gọi MockApi.dungTrinhDuyet().');
      });
    },
    danhSach: function (ten) {
      return this.goi("/" + ten).then(function (ds) { return ds || []; });
    },
    lay: function (ten, id) {
      return this.goi("/" + ten + "/" + encodeURIComponent(id));
    },
    tao: function (ten, banGhi) {
      return this.goi("/" + ten, "POST", banGhi);
    },
    sua: function (ten, id, thayDoi) {
      return this.goi("/" + ten + "/" + encodeURIComponent(id), "PATCH", thayDoi).then(function (kq) {
        if (!kq) throw loi("Không tìm thấy dữ liệu " + ten + "/" + id + ".");
        return kq;
      });
    },
    xoa: function (ten, id) {
      return this.goi("/" + ten + "/" + encodeURIComponent(id), "DELETE").then(function () { return null; });
    }
  };

  function cheDo() { return docBoNho(KHOA.cheDo) === "server" ? "server" : "browser"; }
  function urlMayChu() { return (docBoNho(KHOA.url) || URL_MAC_DINH).replace(/\/+$/, ""); }
  function kho() { return cheDo() === "server" ? khoMayChu : khoTrinhDuyet; }

  /* ================= 5. PHIÊN ĐĂNG NHẬP ================= */
  function docPhien() {
    try { return JSON.parse(docBoNho(KHOA.phien)) || null; } catch (e) { return null; }
  }

  function batDauPhien(nguoiDung) {
    var phien = { id: nguoiDung.id, hoTen: nguoiDung.hoTen, email: nguoiDung.email, vaiTro: nguoiDung.vaiTro };
    ghiBoNho(KHOA.phien, JSON.stringify(phien));
    ghiBoNho(KHOA.vaiTro, nguoiDung.vaiTro);
    return phien;
  }

  function dangXuat() { ghiBoNho(KHOA.phien, null); }

  /* Người dùng hiện tại. Nếu chưa đăng nhập (hoặc vai trò không khớp
     với trang đang xem) thì dùng tài khoản demo của vai trò đó
     để mọi trang vẫn mở trực tiếp được như trước. */
  function layPhien(vaiTroCan) {
    var phien = docPhien();
    if (phien && (!vaiTroCan || phien.vaiTro === vaiTroCan)) return phien;
    var vaiTro = vaiTroCan || (phien && phien.vaiTro) || docBoNho(KHOA.vaiTro) || "rider";
    var u = timTheoId(DU_LIEU_MAU.users, TAI_KHOAN_DEMO[vaiTro] || TAI_KHOAN_DEMO.rider);
    return { id: u.id, hoTen: u.hoTen, email: u.email, vaiTro: u.vaiTro, laDemo: true };
  }

  function taiKhoanDemo(vaiTro) {
    var u = timTheoId(DU_LIEU_MAU.users, TAI_KHOAN_DEMO[vaiTro]);
    return u ? { email: u.email, matKhau: MAT_KHAU_DEMO } : null;
  }


  /* ================= 6. NGHIỆP VỤ ================= */

  /* ----- 6a. Tài khoản ----- */
  function xacThuc(email, matKhau) {
    var e = String(email || "").trim().toLowerCase();
    return kho().danhSach("users").then(function (ds) {
      var u = ds.find(function (x) { return String(x.email).toLowerCase() === e; });
      if (!u || u.matKhau !== matKhau) throw loi("Email hoặc mật khẩu không đúng.");
      if (u.trangThai === "locked") throw loi("Tài khoản này đang bị tạm khóa. Vui lòng liên hệ quản trị viên.");
      return anMatKhau(u);
    });
  }

  function kiemTraEmail(email) {
    var e = String(email || "").trim().toLowerCase();
    return kho().danhSach("users").then(function (ds) {
      return ds.some(function (x) { return String(x.email).toLowerCase() === e; });
    });
  }

  function dangKy(duLieu) {
    var hoTen = String(duLieu.hoTen || "").trim();
    var email = String(duLieu.email || "").trim();
    if (!hoTen) return Promise.reject(loi("Bạn chưa nhập họ và tên."));
    if (email.indexOf("@") < 0) return Promise.reject(loi("Email chưa hợp lệ."));
    if (String(duLieu.matKhau || "").length < 8) return Promise.reject(loi("Mật khẩu cần ít nhất 8 ký tự."));

    return kiemTraEmail(email).then(function (daCo) {
      if (daCo) throw loi("Email này đã được đăng ký.");
      return kho().tao("users", {
        id: taoId("u"), hoTen: hoTen, email: email, matKhau: duLieu.matKhau,
        vaiTro: duLieu.vaiTro === "driver" ? "driver" : "rider",
        soDienThoai: "", trangThai: "active", danhGia: 0, soChuyen: 0, ngayTao: bayGioISO().slice(0, 10)
      });
    }).then(function (u) {
      return taoThongBao(u.id, "Chào mừng bạn đến CommuteMatch",
        "Hoàn thiện hồ sơ để được ghép chuyến chính xác hơn.", "system", "profile", "CM", "")
        .then(function () { return anMatKhau(u); });
    });
  }

  /* ----- 6b. Người dùng (quản trị) ----- */
  function layNguoiDung() {
    return kho().danhSach("users").then(function (ds) { return ds.map(anMatKhau); });
  }

  function layNguoiDungTheoId(id) {
    return kho().lay("users", id).then(anMatKhau);
  }

  function taoNguoiDung(duLieu) {
    var hoTen = String(duLieu.hoTen || "").trim();
    var email = String(duLieu.email || "").trim();
    if (!hoTen) return Promise.reject(loi("Bạn chưa nhập họ và tên."));
    if (email.indexOf("@") < 0) return Promise.reject(loi("Email chưa hợp lệ."));
    return kiemTraEmail(email).then(function (daCo) {
      if (daCo) throw loi("Email này đã được dùng cho tài khoản khác.");
      return kho().tao("users", {
        id: taoId("u"), hoTen: hoTen, email: email, matKhau: MAT_KHAU_DEMO,
        vaiTro: duLieu.vaiTro || "rider", soDienThoai: "", trangThai: duLieu.trangThai || "active",
        danhGia: 0, soChuyen: 0, ngayTao: bayGioISO().slice(0, 10)
      });
    }).then(anMatKhau);
  }

  function capNhatNguoiDung(id, thayDoi) {
    var td = saoChep(thayDoi) || {};
    delete td.id;
    delete td.matKhau;
    var buocKiemTra = Promise.resolve();
    if (td.email !== undefined) {
      var e = String(td.email).trim().toLowerCase();
      if (e.indexOf("@") < 0) return Promise.reject(loi("Email chưa hợp lệ."));
      buocKiemTra = kho().danhSach("users").then(function (ds) {
        if (ds.some(function (x) { return x.id !== id && String(x.email).toLowerCase() === e; })) {
          throw loi("Email này đã được dùng cho tài khoản khác.");
        }
      });
    }
    return buocKiemTra.then(function () { return kho().sua("users", id, td); }).then(function (u) {
      /* Cập nhật lại phiên nếu người đang đăng nhập bị sửa */
      var phien = docPhien();
      if (phien && phien.id === u.id) batDauPhien(u);
      return anMatKhau(u);
    });
  }

  /* ----- 6c. Chuyến đi ----- */
  function ghepChuyen(c, users) {
    var x = saoChep(c);
    x.taiXe = tomTatNguoi(timTheoId(users, c.taiXeId));
    return x;
  }

  /* loc: { taiXeId, trangThai } — đều không bắt buộc */
  function layChuyen(loc) {
    loc = loc || {};
    return Promise.all([kho().danhSach("trips"), kho().danhSach("users")]).then(function (kq) {
      return kq[0].filter(function (c) {
        if (loc.taiXeId && c.taiXeId !== loc.taiXeId) return false;
        if (loc.trangThai && c.trangThai !== loc.trangThai) return false;
        return true;
      }).map(function (c) { return ghepChuyen(c, kq[1]); }).sort(theoGioKhoiHanh);
    });
  }

  function layChuyenTheoId(id) {
    return Promise.all([kho().lay("trips", id), kho().danhSach("users")]).then(function (kq) {
      if (!kq[0]) throw loi("Không tìm thấy chuyến đi.");
      return ghepChuyen(kq[0], kq[1]);
    });
  }

  /* Điểm "AI phù hợp" (mô phỏng): khớp điểm đến/điểm đi, cùng ngày, giờ gần nhau */
  function tinhDiemPhuHop(c, tc) {
    var diem = 40;
    if (khopDiaDiem(c.diemDen, tc.diemDen)) diem += 30;
    if (khopDiaDiem(c.diemDi, tc.diemDi)) diem += 20;
    if (tc.ngay && c.ngayKhoiHanh === tc.ngay) diem += 5;
    if (tc.gio) diem += Math.max(0, 5 - Math.floor(Math.abs(soPhut(c.gioKhoiHanh) - soPhut(tc.gio)) / 15));
    return Math.min(99, diem);
  }

  /* tc: { diemDi, diemDen, ngay, gio, soCho } → chuyến sắp chạy, kèm diemPhuHop */
  function timChuyen(tc) {
    tc = tc || {};
    return layChuyen({ trangThai: "upcoming" }).then(function (ds) {
      return ds.map(function (c) {
        c.diemPhuHop = tinhDiemPhuHop(c, tc);
        c.conDuCho = c.soGheConLai >= (Number(tc.soCho) || 1);
        return c;
      }).filter(function (c) {
        /* Khớp ít nhất điểm đến hoặc điểm đi (nếu người dùng có nhập) */
        return (!tc.diemDi && !tc.diemDen) || c.diemPhuHop >= 60;
      }).sort(function (a, b) { return b.diemPhuHop - a.diemPhuHop; });
    });
  }


  function taoChuyen(duLieu) {
    var ghe = Number(duLieu.tongSoGhe);
    var gia = Number(duLieu.giaMoiGhe);
    var di = String(duLieu.diemDi || "").trim();
    var den = String(duLieu.diemDen || "").trim();
    if (!duLieu.taiXeId) return Promise.reject(loi("Thiếu thông tin tài xế."));
    if (!di || !den) return Promise.reject(loi("Vui lòng nhập điểm đi và điểm đến."));
    if (!duLieu.ngayKhoiHanh || !duLieu.gioKhoiHanh) return Promise.reject(loi("Vui lòng chọn ngày và giờ khởi hành."));
    if (!(ghe >= 1 && ghe <= 7)) return Promise.reject(loi("Số ghế phải từ 1 đến 7."));
    if (!(gia >= 5000)) return Promise.reject(loi("Giá mỗi ghế tối thiểu 5.000đ."));

    return kho().danhSach("trips").then(function (ds) {
      var soLonNhat = ds.reduce(function (m, c) {
        var so = Number(String(c.ma || "").replace(/\D/g, ""));
        return so > m ? so : m;
      }, 2400);
      return kho().tao("trips", {
        id: taoId("t"), ma: "CM-" + (soLonNhat + 1), taiXeId: duLieu.taiXeId,
        diemDi: di, diemDen: den, ngayKhoiHanh: duLieu.ngayKhoiHanh, gioKhoiHanh: duLieu.gioKhoiHanh,
        tongSoGhe: ghe, soGheConLai: ghe, giaMoiGhe: gia, trangThai: "upcoming", biGanCo: false,
        ghiChu: String(duLieu.ghiChu || "").trim(), diemDon: [di]
      });
    });
  }

  /* Dùng cho quản trị: lưu trữ, gỡ cờ... */
  function capNhatChuyen(id, thayDoi) {
    var td = saoChep(thayDoi) || {};
    delete td.id;
    return kho().sua("trips", id, td);
  }

  /* ----- 6d. Yêu cầu tham gia ----- */
  function ghepYeuCau(r, trips, users) {
    var x = saoChep(r);
    var c = timTheoId(trips, r.chuyenId);
    x.chuyen = c ? ghepChuyen(c, users) : null;
    x.hanhKhach = tomTatNguoi(timTheoId(users, r.hanhKhachId));
    return x;
  }

  /* loc: { taiXeId, hanhKhachId, chuyenId, trangThai } — đều không bắt buộc */
  function layYeuCau(loc) {
    loc = loc || {};
    return Promise.all([kho().danhSach("joinRequests"), kho().danhSach("trips"), kho().danhSach("users")]).then(function (kq) {
      return kq[0].map(function (r) { return ghepYeuCau(r, kq[1], kq[2]); }).filter(function (r) {
        if (!r.chuyen) return false;
        if (loc.taiXeId && r.chuyen.taiXeId !== loc.taiXeId) return false;
        if (loc.hanhKhachId && r.hanhKhachId !== loc.hanhKhachId) return false;
        if (loc.chuyenId && r.chuyenId !== loc.chuyenId) return false;
        if (loc.trangThai && r.trangThai !== loc.trangThai) return false;
        return true;
      }).sort(function (a, b) { return String(b.ngayGui).localeCompare(String(a.ngayGui)); });
    });
  }

  /* duLieu: { chuyenId, hanhKhachId, diemDon, loiNhan, soGhe, diemPhuHop } */
  function guiYeuCau(duLieu) {
    var soGhe = Number(duLieu.soGhe) || 1;
    return Promise.all([
      kho().lay("trips", duLieu.chuyenId),
      kho().danhSach("joinRequests"),
      kho().lay("users", duLieu.hanhKhachId)
    ]).then(function (kq) {
      var c = kq[0], ds = kq[1], hk = kq[2];
      if (!c) throw loi("Không tìm thấy chuyến đi.");
      if (!hk) throw loi("Không tìm thấy tài khoản hành khách.");
      if (c.trangThai !== "upcoming") throw loi("Chuyến này không còn nhận khách.");
      if (c.taiXeId === hk.id) throw loi("Bạn không thể tham gia chuyến do chính mình tạo.");
      if (c.soGheConLai < soGhe) throw loi("Chuyến đã hết chỗ trống.");
      var trung = ds.some(function (r) {
        return r.chuyenId === c.id && r.hanhKhachId === hk.id && (r.trangThai === "pending" || r.trangThai === "accepted");
      });
      if (trung) throw loi("Bạn đã gửi yêu cầu cho chuyến này rồi.");

      return kho().tao("joinRequests", {
        id: taoId("r"), chuyenId: c.id, hanhKhachId: hk.id, soGhe: soGhe,
        diemDon: duLieu.diemDon || (c.diemDon && c.diemDon[0]) || c.diemDi, lechTuyen: 3,
        loiNhan: String(duLieu.loiNhan || "").trim(), diemPhuHop: Number(duLieu.diemPhuHop) || 85,
        trangThai: "pending", ngayGui: bayGioISO()
      }).then(function (yc) {
        return taoThongBao(c.taiXeId, "Bạn có yêu cầu tham gia mới",
          hk.hoTen + " muốn tham gia chuyến " + c.ma + ".", "trip", "driver-join-requests", "YC", "amber")
          .then(function () { return yc; });
      });
    });
  }


  /* Đổi trạng thái yêu cầu + chỉnh số ghế + báo cho người liên quan */
  function doiTrangThaiYeuCau(id, trangThaiMoi) {
    return kho().lay("joinRequests", id).then(function (r) {
      if (!r) throw loi("Không tìm thấy yêu cầu.");
      return kho().lay("trips", r.chuyenId).then(function (c) {
        if (!c) throw loi("Chuyến của yêu cầu này không còn tồn tại.");
        var cu = r.trangThai;
        var doiGhe = 0;

        if (trangThaiMoi === "accepted" || trangThaiMoi === "rejected") {
          if (cu !== "pending") throw loi("Yêu cầu này đã được xử lý trước đó.");
          if (trangThaiMoi === "accepted") {
            if (c.soGheConLai < r.soGhe) throw loi("Chuyến không còn đủ ghế để duyệt yêu cầu này.");
            doiGhe = -r.soGhe;
          }
        } else if (trangThaiMoi === "cancelled") {
          if (cu !== "pending" && cu !== "accepted") throw loi("Không thể hủy yêu cầu ở trạng thái này.");
          if (c.trangThai !== "upcoming") throw loi("Chuyến đã diễn ra, không thể hủy.");
          if (cu === "accepted") doiGhe = r.soGhe;
        } else {
          throw loi("Trạng thái không hợp lệ: " + trangThaiMoi);
        }

        var buocGhe = doiGhe ? kho().sua("trips", c.id, { soGheConLai: c.soGheConLai + doiGhe }) : Promise.resolve();
        return buocGhe.then(function () {
          return kho().sua("joinRequests", id, { trangThai: trangThaiMoi, ngayXuLy: bayGioISO() });
        }).then(function (moi) {
          var tb;
          if (trangThaiMoi === "accepted") {
            tb = taoThongBao(r.hanhKhachId, "Yêu cầu đã được duyệt",
              "Bạn đã được xác nhận vào chuyến " + c.ma + " " + c.diemDi + " → " + c.diemDen + ".", "trip", "rider-my-trips", "OK", "lime");
          } else if (trangThaiMoi === "rejected") {
            tb = taoThongBao(r.hanhKhachId, "Yêu cầu bị từ chối",
              "Tài xế đã từ chối yêu cầu tham gia chuyến " + c.ma + ". Hãy thử chuyến khác nhé.", "trip", "rider-trip-search", "TC", "");
          } else {
            tb = taoThongBao(c.taiXeId, "Hành khách đã hủy",
              "Một hành khách đã hủy yêu cầu tham gia chuyến " + c.ma + ".", "trip", "driver-join-requests", "HU", "");
          }
          return tb.then(function () { return moi; });
        });
      });
    });
  }

  function duyetYeuCau(id) { return doiTrangThaiYeuCau(id, "accepted"); }
  function tuChoiYeuCau(id) { return doiTrangThaiYeuCau(id, "rejected"); }
  function huyYeuCau(id) { return doiTrangThaiYeuCau(id, "cancelled"); }

  function danhGiaChuyen(yeuCauId, soSao, nhanXet) {
    var sao = Math.max(1, Math.min(5, Number(soSao) || 5));
    return kho().sua("joinRequests", yeuCauId, { danhGia: sao, nhanXet: String(nhanXet || "").trim() });
  }

  /* ----- 6e. Thông báo ----- */
  function taoThongBao(nguoiNhanId, tieuDe, noiDung, loai, lienKet, kyHieu, mau) {
    return kho().tao("notifications", {
      id: taoId("n"), nguoiNhanId: nguoiNhanId, tieuDe: tieuDe, noiDung: noiDung,
      loai: loai || "system", kyHieu: kyHieu || "TB", mau: mau || "", lienKet: lienKet || "",
      daDoc: false, thoiGian: bayGioISO()
    });
  }

  function layThongBao(nguoiNhanId) {
    return kho().danhSach("notifications").then(function (ds) {
      return ds.filter(function (n) { return n.nguoiNhanId === nguoiNhanId; })
        .sort(function (a, b) { return String(b.thoiGian).localeCompare(String(a.thoiGian)); });
    });
  }

  function demThongBaoChuaDoc(nguoiNhanId) {
    return layThongBao(nguoiNhanId).then(function (ds) {
      return ds.filter(function (n) { return !n.daDoc; }).length;
    });
  }

  function danhDauDaDoc(id) { return kho().sua("notifications", id, { daDoc: true }); }

  function danhDauTatCaDaDoc(nguoiNhanId) {
    return layThongBao(nguoiNhanId).then(function (ds) {
      var chuaDoc = ds.filter(function (n) { return !n.daDoc; });
      /* Làm lần lượt để các lần ghi không đè lên nhau */
      return chuaDoc.reduce(function (p, n) {
        return p.then(function () { return danhDauDaDoc(n.id); });
      }, Promise.resolve()).then(function () { return chuaDoc.length; });
    });
  }

  function xoaThongBao(id) { return kho().xoa("notifications", id); }

  /* ----- 6f. Thống kê (tính từ dữ liệu thật trong kho) ----- */
  function layThongKe() {
    return Promise.all([kho().danhSach("users"), kho().danhSach("trips"), kho().danhSach("joinRequests")]).then(function (kq) {
      var users = kq[0], trips = kq[1], reqs = kq[2];
      var thangNay = bayGioISO().slice(0, 7);
      var hoatDong = users.filter(function (u) { return u.trangThai !== "locked"; }).length;

      /* Số người dùng lũy kế 6 tháng gần nhất */
      var nhan = [], giaTri = [];
      var d = new Date();
      for (var i = 5; i >= 0; i--) {
        var m = new Date(d.getFullYear(), d.getMonth() - i, 1);
        var khoaThang = m.getFullYear() + "-" + hai(m.getMonth() + 1);
        nhan.push("T" + (m.getMonth() + 1));
        giaTri.push(users.filter(function (u) { return String(u.ngayTao || "").slice(0, 7) <= khoaThang; }).length);
      }

      return {
        tongNguoiDung: users.length,
        nguoiDungMoiThangNay: users.filter(function (u) { return String(u.ngayTao || "").slice(0, 7) === thangNay; }).length,
        nguoiDungBiKhoa: users.length - hoatDong,
        tyLeHoatDong: users.length ? Math.round(hoatDong * 100 / users.length) : 0,
        tongChuyen: trips.length,
        chuyenSapToi: trips.filter(function (c) { return c.trangThai === "upcoming"; }).length,
        chuyenHoanThanh: trips.filter(function (c) { return c.trangThai === "completed"; }).length,
        chuyenGanCo: trips.filter(function (c) { return c.biGanCo && c.trangThai !== "archived"; }).length,
        yeuCauChoDuyet: reqs.filter(function (r) { return r.trangThai === "pending"; }).length,
        tangTruong: { nhan: nhan, giaTri: giaTri }
      };
    });
  }


  /* ================= 7. QUẢN LÝ CHẾ ĐỘ / DỮ LIỆU ================= */
  function dungMayChu(url) {
    ghiBoNho(KHOA.cheDo, "server");
    ghiBoNho(KHOA.url, url || URL_MAC_DINH);
    return "MockApi đang gọi json-server tại " + urlMayChu() + " — tải lại trang để áp dụng.";
  }

  function dungTrinhDuyet() {
    ghiBoNho(KHOA.cheDo, null);
    return "MockApi đang lưu dữ liệu trong trình duyệt (localStorage) — tải lại trang để áp dụng.";
  }

  function datLaiDuLieu() {
    if (cheDo() === "server") {
      return Promise.reject(loi('Đang dùng json-server: hãy chạy "npm run reset" trong tools/mock-api.'));
    }
    ghiBoNho(KHOA.db, null);
    dbTam = null;
    dangXuat();
    return Promise.resolve("Đã đặt lại dữ liệu mẫu.");
  }

  /* ================= 8. ĐẦU TRANG: số thông báo + chữ viết tắt ================= */
  /* Trang có tên bắt đầu bằng rider-/driver-/coordinator-/admin- thuộc về vai trò đó */
  function vaiTroCuaTrang() {
    var b = document.body;
    var ten = b ? (b.getAttribute("data-page") || b.getAttribute("data-trang") || "") : "";
    var m = ten.match(/^(rider|driver|coordinator|admin)-/);
    return m ? m[1] : null;
  }

  function capNhatDauTrang() {
    var phien = layPhien(vaiTroCuaTrang());
    document.querySelectorAll('a[title="Hồ sơ"]').forEach(function (el) {
      el.textContent = dinhDang.vietTat(phien.hoTen);
    });
    var nutThongBao = document.querySelectorAll('a[title="Thông báo"]');
    if (!nutThongBao.length) return Promise.resolve();
    return demThongBaoChuaDoc(phien.id).then(function (n) {
      nutThongBao.forEach(function (el) { el.textContent = n; });
    }, function () { /* lỗi kết nối: giữ nguyên số cũ */ });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", capNhatDauTrang);
  else capNhatDauTrang();

  /* ================= 9. XUẤT RA NGOÀI ================= */
  goc.MockApi = {
    /* chế độ & dữ liệu */
    cheDo: cheDo, dungMayChu: dungMayChu, dungTrinhDuyet: dungTrinhDuyet, datLaiDuLieu: datLaiDuLieu,
    /* phiên */
    xacThuc: xacThuc, batDauPhien: batDauPhien, dangXuat: dangXuat, layPhien: layPhien,
    taiKhoanDemo: taiKhoanDemo, vaiTroCuaTrang: vaiTroCuaTrang, capNhatDauTrang: capNhatDauTrang,
    /* người dùng */
    kiemTraEmail: kiemTraEmail, dangKy: dangKy, layNguoiDung: layNguoiDung, layNguoiDungTheoId: layNguoiDungTheoId,
    taoNguoiDung: taoNguoiDung, capNhatNguoiDung: capNhatNguoiDung,
    /* chuyến đi */
    layChuyen: layChuyen, layChuyenTheoId: layChuyenTheoId, timChuyen: timChuyen,
    taoChuyen: taoChuyen, capNhatChuyen: capNhatChuyen,
    /* yêu cầu tham gia */
    layYeuCau: layYeuCau, guiYeuCau: guiYeuCau, duyetYeuCau: duyetYeuCau, tuChoiYeuCau: tuChoiYeuCau,
    huyYeuCau: huyYeuCau, danhGiaChuyen: danhGiaChuyen,
    /* thông báo */
    layThongBao: layThongBao, demThongBaoChuaDoc: demThongBaoChuaDoc, danhDauDaDoc: danhDauDaDoc,
    danhDauTatCaDaDoc: danhDauTatCaDaDoc, xoaThongBao: xoaThongBao,
    /* thống kê */
    layThongKe: layThongKe,
    /* định dạng hiển thị */
    dinhDang: dinhDang
  };
})(typeof window !== "undefined" ? window : this);

