/* =====================================================
   CommuteMatch — Trang "Quản lý chuyến"
   Script riêng của trang, chạy độc lập (không dùng engine chung).
   Chức năng:
   1. Lấy toàn bộ chuyến từ MockApi, tìm kiếm + lọc trạng thái
   2. Xem chi tiết chuyến, lưu trữ / ẩn chuyến, gỡ cờ (lưu qua MockApi)
   3. Mở / đóng các hộp thoại (modal), thông báo nhanh (toast)
   4. Nút ≡: bật / tắt menu trên màn hình nhỏ
   ===================================================== */

(function () {

  /* ---------- Thông báo nhanh ở góc màn hình ---------- */
  function toast(message) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message || "Đã cập nhật thành công";
    el.classList.add("show");
    setTimeout(function () { el.classList.remove("show"); }, 2300);
  }

  /* ---------- Đóng mọi hộp thoại đang mở ---------- */
  function closeModals() {
    document.querySelectorAll(".modal-backdrop.open").forEach(function (x) {
      x.classList.remove("open");
    });
  }

  /* ---------- Dữ liệu từ MockApi ---------- */
  var dd = MockApi.dinhDang;
  var chuyen = [];
  var LOC = ["", "open", "completed", "flagged", "archived"]; // theo thứ tự option của ô lọc

  /* Trạng thái hiển thị: lưu trữ > gắn cờ > đang mở / hoàn thành */
  function trangThaiHienThi(c) {
    if (c.trangThai === "archived") return { ma: "archived", chu: "Đã lưu trữ", lop: "yellow" };
    if (c.biGanCo) return { ma: "flagged", chu: "Gắn cờ", lop: "yellow" };
    if (c.trangThai === "completed") return { ma: "completed", chu: "Hoàn thành", lop: "" };
    return { ma: "open", chu: "Đang mở", lop: "" };
  }

  function dongChuyen(c) {
    var tt = trangThaiHienThi(c);
    return "<tr><td><strong>" + c.ma + "</strong></td>" +
      "<td>" + dd.html(c.diemDi) + " → " + dd.html(c.diemDen) + "</td>" +
      "<td>" + dd.html(c.taiXe.hoTen) + "</td>" +
      "<td>" + c.gioKhoiHanh + ", " + dd.thu(c.ngayKhoiHanh) + " " + dd.ngayNgan(c.ngayKhoiHanh) + "</td>" +
      '<td><span class="badge ' + tt.lop + '">' + tt.chu + "</span></td>" +
      '<td><button class="btn btn-outline btn-sm" data-modal="tripAdminModal" data-id="' + c.id + '">Chi tiết</button> ' +
      (c.trangThai === "archived" ? ""
        : '<button class="btn btn-danger btn-sm" data-action="archive" data-id="' + c.id + '">Lưu trữ</button>') +
      "</td></tr>";
  }

  function veBang() {
    var tuKhoa = document.getElementById("tmTim").value.trim().toLowerCase();
    var loc = LOC[document.getElementById("tmLoc").selectedIndex] || "";
    var ds = chuyen.filter(function (c) {
      if (loc && trangThaiHienThi(c).ma !== loc) return false;
      return !tuKhoa || (c.ma + " " + c.taiXe.hoTen + " " + c.diemDi + " " + c.diemDen).toLowerCase().indexOf(tuKhoa) >= 0;
    });
    document.getElementById("tmBang").innerHTML = ds.length ? ds.map(dongChuyen).join("") :
      '<tr><td colspan="6" class="muted">Không có chuyến nào phù hợp.</td></tr>';
  }

  function taiDuLieu() {
    return MockApi.layChuyen()
      .then(function (ds) { chuyen = ds; veBang(); })
      .catch(function (loi) { toast(loi.message); });
  }

  /* Dựng nội dung hộp thoại chi tiết theo chuyến được chọn */
  function chuanBiChiTiet(id) {
    var c = chuyen.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    var anDuoc = c.trangThai !== "archived";
    document.getElementById("tmChiTiet").innerHTML =
      '<div class="modal-head"><h2>Chi tiết chuyến ' + c.ma + '</h2><button class="modal-close" data-close aria-label="Đóng">×</button></div>' +
      '<div class="trip-route"><span>' + dd.html(c.diemDi) + "</span><span>→</span><span>" + dd.html(c.diemDen) + "</span></div>" +
      '<p class="muted">' + dd.html(c.taiXe.hoTen) + " · " + dd.ngayNgan(c.ngayKhoiHanh) + " · " + c.gioKhoiHanh + " · " +
      (c.tongSoGhe - c.soGheConLai) + "/" + c.tongSoGhe + " chỗ · " + dd.tien(c.giaMoiGhe) + "/ghế</p>" +
      (c.biGanCo
        ? '<div class="callout warning" style="margin-top:15px"><strong>Chuyến đang bị gắn cờ</strong><p class="small">Có báo cáo liên quan cần xem xét.</p></div>'
        : '<div class="callout" style="margin-top:15px"><strong>Không có báo cáo</strong><p class="small">Chuyến chưa bị gắn cờ.</p></div>') +
      '<div class="list-actions" style="margin-top:20px">' +
      '<a class="btn btn-outline" href="admin-report-center.html">Xem báo cáo</a>' +
      (c.biGanCo ? '<button class="btn btn-outline" data-action="unflag" data-id="' + c.id + '">Gỡ cờ</button>' : "") +
      (anDuoc ? '<button class="btn btn-danger" data-action="archive" data-id="' + c.id + '">Ẩn chuyến</button>' : "") +
      "</div>";
  }

  document.getElementById("tmTim").addEventListener("input", veBang);
  document.getElementById("tmLoc").addEventListener("change", veBang);

  /* Gọi MockApi cập nhật chuyến rồi tải lại bảng */
  function capNhat(id, thayDoi, thongBao) {
    MockApi.capNhatChuyen(id, thayDoi).then(function () {
      closeModals();
      toast(thongBao);
      return taiDuLieu();
    }).catch(function (loi) { toast(loi.message); });
  }

  /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
  document.addEventListener("click", function (e) {
    /* Nút có data-modal="..." → mở hộp thoại tương ứng */
    var modalBtn = e.target.closest("[data-modal]");
    if (modalBtn) {
      if (modalBtn.dataset.id) chuanBiChiTiet(modalBtn.dataset.id);
      var box = document.getElementById(modalBtn.dataset.modal);
      if (box) box.classList.add("open");
    }
    /* Nút × hoặc vùng nền tối ngoài hộp thoại → đóng lại */
    if (e.target.closest("[data-close]") || e.target.classList.contains("modal-backdrop")) {
      closeModals();
    }

    /* Các nút thao tác, nhận biết qua thuộc tính data-action="..." */
    var actionBtn = e.target.closest("[data-action]");
    var action = actionBtn ? actionBtn.dataset.action : "";
    if (!action) return;
    if (action === "menu") {
      var nav = document.getElementById("mainNav");
      if (nav) nav.classList.toggle("open");
    } else if (action === "archive") {
      capNhat(actionBtn.dataset.id, { trangThai: "archived" }, "Đã lưu trữ / ẩn chuyến");
    } else if (action === "unflag") {
      capNhat(actionBtn.dataset.id, { biGanCo: false }, "Đã gỡ cờ cho chuyến");
    } else if (action === "save") {
      closeModals();
      toast();
    }
  });

  taiDuLieu();
})();
