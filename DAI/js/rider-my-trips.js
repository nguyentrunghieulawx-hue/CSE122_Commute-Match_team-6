/* =====================================================
   CommuteMatch — Trang "Chuyến của tôi"
   Script riêng của trang, chạy độc lập (không dùng engine chung).
   Chức năng:
   1. Lấy các chuyến đã gửi yêu cầu từ MockApi, lọc theo dải trạng thái
   2. Hủy yêu cầu / hủy chuyến, đánh giá chuyến (lưu qua MockApi)
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
  var hanhKhach = MockApi.layPhien("rider");
  var tatCa = [];              // yêu cầu tham gia của hành khách (kèm chuyến)
  var locHienTai = "accepted";
  var yeuCauDangDanhGia = null;
  var soSao = 5;
  var TEN_TAB = { accepted: "Đã duyệt", pending: "Đang chờ", completed: "Hoàn thành", rejected: "Bị từ chối", cancelled: "Đã hủy" };

  /* Chuyến đã chạy xong → nhóm "Hoàn thành", còn lại theo trạng thái yêu cầu */
  function nhomCua(r) {
    if (r.trangThai === "accepted" && r.chuyen.trangThai === "completed") return "completed";
    return r.trangThai;
  }

  function theChuyen(r) {
    var c = r.chuyen;
    var nhom = nhomCua(r);
    var nhan = { accepted: '<span class="dai-tag green">Đã duyệt</span>', pending: '<span class="dai-tag">Đang chờ duyệt</span>',
      completed: '<span class="dai-tag gray">Hoàn thành</span>', rejected: '<span class="dai-tag gray">Bị từ chối</span>',
      cancelled: '<span class="dai-tag gray">Đã hủy</span>' }[nhom];
    var thoiGian = dd.thu(c.ngayKhoiHanh) + ", " + dd.ngayNgan(c.ngayKhoiHanh) + " · " + c.gioKhoiHanh;
    var phanDuoi = "";

    if (nhom === "accepted" || nhom === "pending") {
      phanDuoi = '<div class="dai-item" style="margin-top:14px;border-top:1px dashed var(--line);padding-top:14px">' +
        '<span class="dai-face amber">' + dd.vietTat(c.taiXe.hoTen) + "</span>" +
        '<div class="dai-item-body"><strong>' + dd.html(c.taiXe.hoTen) + "</strong><p>Điểm đón: " + dd.html(r.diemDon) + "</p></div>" +
        '<div class="dai-item-act"><a class="dai-btn dai-btn-line dai-btn-sm" href="rider-trip-detail.html">Xem chi tiết</a>' +
        '<button class="dai-btn dai-btn-bad dai-btn-sm" data-action="cancel" data-id="' + r.id + '">' +
        (nhom === "pending" ? "Hủy yêu cầu" : "Hủy chuyến") + "</button></div></div>";
    } else if (nhom === "completed") {
      phanDuoi = '<div class="dai-btn-row">' +
        (r.danhGia ? '<span class="dai-note">Bạn đã đánh giá ' + r.danhGia + "★</span>"
          : '<button class="dai-btn dai-btn-line" data-modal="ratingModal" data-id="' + r.id + '">Đánh giá chuyến</button>') +
        '<button class="dai-btn dai-btn-soft" data-modal="reportModal">Báo cáo</button></div>';
    }

    return '<article class="dai-trip' + (nhom === "accepted" || nhom === "pending" ? "" : " xong") + '">' +
      '<div class="dai-col-main">' + nhan +
      '<div class="dai-route"><span>' + dd.html(c.diemDi) + '</span><span class="dai-mui-ten">→</span><span>' + dd.html(c.diemDen) + "</span></div>" +
      '<div class="dai-meta"><span>' + thoiGian + "</span><span>Mã " + c.ma + "</span></div>" +
      phanDuoi + "</div>" +
      '<div class="dai-side"><span class="dai-price">' + dd.tien(c.giaMoiGhe * r.soGhe) + "</span></div>" +
      "</article>";
  }

  function veDanhSach() {
    document.querySelectorAll("#mtTabs [data-loc]").forEach(function (tab) {
      var loc = tab.dataset.loc;
      var so = tatCa.filter(function (r) { return nhomCua(r) === loc; }).length;
      tab.innerHTML = TEN_TAB[loc] + (so ? ' <span class="dai-tag">' + so + "</span>" : "");
      tab.classList.toggle("active", loc === locHienTai);
    });
    var ds = tatCa.filter(function (r) { return nhomCua(r) === locHienTai; });
    document.getElementById("mtDanhSach").innerHTML = ds.length ? ds.map(theChuyen).join("") :
      '<p class="dai-note">Không có chuyến nào ở mục "' + TEN_TAB[locHienTai] + '".</p>';
  }

  function taiDuLieu() {
    return MockApi.layYeuCau({ hanhKhachId: hanhKhach.id })
      .then(function (ds) { tatCa = ds; veDanhSach(); })
      .catch(function (loi) { toast(loi.message); });
  }

  function veSao() {
    var o = document.getElementById("mtSao");
    if (o) o.textContent = "★★★★★".slice(0, soSao) + "☆☆☆☆☆".slice(0, 5 - soSao);
  }

  document.getElementById("mtTabs").addEventListener("click", function (e) {
    var tab = e.target.closest("[data-loc]");
    if (!tab) return;
    locHienTai = tab.dataset.loc;
    veDanhSach();
  });

  /* Bấm vào dải sao: chọn số sao theo vị trí bấm */
  document.getElementById("mtSao").addEventListener("click", function (e) {
    var rect = this.getBoundingClientRect();
    soSao = Math.min(5, Math.max(1, Math.ceil((e.clientX - rect.left) / (rect.width / 5))));
    veSao();
  });

  /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
  document.addEventListener("click", function (e) {
    /* Nút có data-modal="..." → mở hộp thoại tương ứng */
    var modalBtn = e.target.closest("[data-modal]");
    if (modalBtn) {
      if (modalBtn.dataset.modal === "ratingModal") {
        yeuCauDangDanhGia = modalBtn.dataset.id || null;
        soSao = 5;
        veSao();
        document.getElementById("mtNhanXet").value = "";
      }
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
    } else if (action === "cancel") {
      if (!confirm("Bạn chắc chắn muốn hủy chuyến này?")) return;
      actionBtn.disabled = true;
      MockApi.huyYeuCau(actionBtn.dataset.id)
        .then(function () { toast("Đã hủy, tài xế sẽ nhận được thông báo"); return taiDuLieu(); })
        .catch(function (loi) { actionBtn.disabled = false; toast(loi.message); });
    } else if (action === "rate") {
      if (!yeuCauDangDanhGia) { closeModals(); return; }
      MockApi.danhGiaChuyen(yeuCauDangDanhGia, soSao, document.getElementById("mtNhanXet").value)
        .then(function () { closeModals(); toast("Cảm ơn bạn đã đánh giá " + soSao + "★"); return taiDuLieu(); })
        .catch(function (loi) { toast(loi.message); });
    } else if (action === "save") {
      closeModals();
      toast();
    }
  });

  taiDuLieu();
})();
