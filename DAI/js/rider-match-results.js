/* =====================================================
   CommuteMatch — Trang "Kết quả phù hợp"
   Script riêng của trang, chạy độc lập (không dùng engine chung).
   Chức năng:
   1. Lấy chuyến phù hợp từ MockApi theo điều kiện ở trang Tìm chuyến
   2. Bộ lọc nhanh (mức giá, sắp xếp) lọc lại ngay trên danh sách
   3. Mở / đóng các hộp thoại (modal), thông báo nhanh (toast)
   4. Nút ≡: bật / tắt menu trên màn hình nhỏ
   5. Gửi yêu cầu tham gia qua MockApi → mở trang Chuyến của tôi
   ===================================================== */

(function () {

  /* ---------- Đường dẫn tới các trang khác của prototype ---------- */
  function h(slug) {
    return duongDanTrang(slug);
  }

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
  var hanhKhach = MockApi.layPhien("rider");
  var MAU_MAT = ["amber", "", "lime"];
  var ketQua = [];          // chuyến MockApi trả về
  var chuyenDangChon = null;

  /* Điều kiện tìm do trang Tìm chuyến để lại (mặc định giống form mẫu) */
  var dieuKien = { diemDi: "Cầu Giấy", diemDen: "Hòa Lạc", ngay: "", gio: "07:15", soCho: 1 };
  try {
    var daLuu = JSON.parse(sessionStorage.getItem("cm_tim_chuyen"));
    if (daLuu) dieuKien = daLuu;
  } catch (err) { /* dùng mặc định */ }

  function theChuyen(c, viTri) {
    var conCho = c.soGheConLai >= (dieuKien.soCho || 1);
    return '<article class="dai-trip"><div class="dai-col-main">' +
      '<div class="dai-person"><span class="dai-face ' + MAU_MAT[viTri % 3] + '">' + dd.vietTat(c.taiXe.hoTen) + "</span>" +
      '<div class="dai-item-body"><strong>' + dd.html(c.taiXe.hoTen) + "</strong><p>Đánh giá " + c.taiXe.danhGia + "/5</p></div></div>" +
      '<div class="dai-route"><span>' + dd.html(c.diemDi) + '</span><span class="dai-mui-ten">→</span><span>' + dd.html(c.diemDen) + "</span></div>" +
      '<div class="dai-meta"><span>' + c.gioKhoiHanh + ", " + dd.thu(c.ngayKhoiHanh) + " " + dd.ngayNgan(c.ngayKhoiHanh) + "</span>" +
      "<span>" + c.soGheConLai + " chỗ trống</span><span>Mã " + c.ma + "</span></div>" +
      '</div><div class="dai-side">' +
      '<span class="dai-score">AI phù hợp ' + c.diemPhuHop + "%</span>" +
      '<span class="dai-price">' + dd.tien(c.giaMoiGhe) + "</span>" +
      '<div class="dai-item-act"><a class="dai-btn dai-btn-line dai-btn-sm" href="rider-trip-detail.html">Chi tiết</a>' +
      '<button class="dai-btn dai-btn-main dai-btn-sm" data-modal="joinModal" data-id="' + c.id + '"' + (conCho ? "" : " disabled") + ">" +
      (conCho ? "Tham gia" : "Đã đầy") + "</button></div>" +
      "</div></article>";
  }

  /* Áp bộ lọc giá + sắp xếp rồi vẽ lại danh sách */
  function veDanhSach() {
    var gia = document.getElementById("mrGia").selectedIndex;       // 0 tất cả, 1 < 35k, 2 < 50k
    var sapXep = document.getElementById("mrSapXep").selectedIndex; // 0 phù hợp, 1 giá, 2 sớm nhất
    var ds = ketQua.filter(function (c) {
      return gia === 0 || c.giaMoiGhe < (gia === 1 ? 35000 : 50000);
    });
    if (sapXep === 1) ds.sort(function (a, b) { return a.giaMoiGhe - b.giaMoiGhe; });
    if (sapXep === 2) ds.sort(function (a, b) { return (a.ngayKhoiHanh + a.gioKhoiHanh).localeCompare(b.ngayKhoiHanh + b.gioKhoiHanh); });

    document.getElementById("mrTieuDe").textContent = ds.length + " chuyến phù hợp";
    document.getElementById("mrDanhSach").innerHTML = ds.length ? ds.map(theChuyen).join("") :
      '<section class="dai-panel"><p class="dai-note">Chưa có chuyến nào phù hợp. Bạn thử đổi điểm đến, giờ đi hoặc bộ lọc giá nhé.</p></section>';
  }

  function taiKetQua() {
    var moTa = [dieuKien.diemDi, dieuKien.diemDen].filter(Boolean)
      .map(function (s) { return s.split(",")[0]; }).join(" → ");
    if (dieuKien.ngay) moTa += " · " + dd.thu(dieuKien.ngay) + ", " + dd.ngayNgan(dieuKien.ngay);
    document.getElementById("mrMoTa").textContent = moTa;

    return MockApi.timChuyen(dieuKien)
      .then(function (ds) { ketQua = ds; veDanhSach(); })
      .catch(function (loi) { toast(loi.message); });
  }

  /* Điền hộp thoại theo chuyến được bấm "Tham gia" */
  function chuanBiHopThoai(id) {
    chuyenDangChon = ketQua.filter(function (c) { return c.id === id; })[0] || null;
    if (!chuyenDangChon) return;
    document.getElementById("mrTenChuyen").textContent = "Tham gia chuyến " + chuyenDangChon.ma;
    document.getElementById("mrDon").innerHTML = (chuyenDangChon.diemDon || [chuyenDangChon.diemDi])
      .map(function (d) { return "<option>" + dd.html(d) + "</option>"; }).join("");
  }

  ["mrGia", "mrSapXep"].forEach(function (id) {
    document.getElementById(id).addEventListener("change", veDanhSach);
  });

  /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
  document.addEventListener("click", function (e) {
    /* Nút có data-modal="..." → mở hộp thoại tương ứng */
    var modalBtn = e.target.closest("[data-modal]");
    if (modalBtn) {
      if (modalBtn.dataset.id) chuanBiHopThoai(modalBtn.dataset.id);
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
    } else if (action === "confirm-join") {
      if (!chuyenDangChon) { closeModals(); return; }
      var chuyen = chuyenDangChon;
      actionBtn.disabled = true;
      MockApi.guiYeuCau({
        chuyenId: chuyen.id,
        hanhKhachId: hanhKhach.id,
        diemDon: document.getElementById("mrDon").value,
        loiNhan: document.getElementById("mrLoiNhan").value,
        soGhe: dieuKien.soCho || 1,
        diemPhuHop: chuyen.diemPhuHop
      }).then(function () {
        closeModals();
        toast("Đã gửi yêu cầu tham gia " + chuyen.ma);
        setTimeout(function () { location.href = h("rider-my-trips"); }, 800);
      }).catch(function (loi) {
        toast(loi.message);
      }).then(function () {
        actionBtn.disabled = false;
      });
    }
  });

  taiKetQua();
})();
