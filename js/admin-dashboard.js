/* =====================================================
   CommuteMatch — Trang "Tổng quan quản trị"
   Script riêng của trang, chạy độc lập (không dùng engine chung).
   Chức năng:
   1. Nút ≡: bật / tắt menu trên màn hình nhỏ
   2. Lấy số liệu tổng quan + biểu đồ tăng trưởng từ MockApi
   ===================================================== */

(function () {

  /* ---------- Số liệu từ MockApi (tính trên dữ liệu đang có) ---------- */
  function datChu(id, chu) {
    var o = document.getElementById(id);
    if (o) o.textContent = chu;
  }

  MockApi.layThongKe().then(function (tk) {
    datChu("adSoNguoiDung", tk.tongNguoiDung.toLocaleString("vi-VN"));
    datChu("adNguoiDungMoi", "+" + tk.nguoiDungMoiThangNay + " tháng này");
    datChu("adSoChuyen", tk.tongChuyen.toLocaleString("vi-VN"));
    datChu("adChuyenSapToi", tk.chuyenSapToi + " chuyến sắp chạy");
    datChu("adTyLe", tk.tyLeHoatDong + "%");
    datChu("adBiKhoa", tk.nguoiDungBiKhoa ? tk.nguoiDungBiKhoa + " tài khoản bị khóa" : "Ổn định");
    datChu("adCanhBao", tk.chuyenGanCo);
    datChu("adCanhBaoMoTa", tk.chuyenGanCo ? "Chuyến bị gắn cờ cần xem" : "Không có cảnh báo");

    /* Biểu đồ cột: chiều cao theo % so với tháng cao nhất */
    var lon = Math.max.apply(null, tk.tangTruong.giaTri.concat([1]));
    var bieuDo = document.getElementById("adBieuDo");
    var nhan = document.getElementById("adNhanBieuDo");
    if (bieuDo) {
      bieuDo.innerHTML = tk.tangTruong.giaTri.map(function (v) {
        return '<span class="chart-bar" style="height:' + Math.max(6, Math.round(v * 100 / lon)) + '%" title="' + v + ' người dùng"></span>';
      }).join("");
    }
    if (nhan) {
      nhan.innerHTML = tk.tangTruong.nhan.map(function (t) { return "<span>" + t + "</span>"; }).join("");
    }
  }).catch(function (loi) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = loi.message;
    el.classList.add("show");
    setTimeout(function () { el.classList.remove("show"); }, 2300);
  });

  /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
  document.addEventListener("click", function (e) {

    /* Các nút thao tác, nhận biết qua thuộc tính data-action="..." */
    var actionBtn = e.target.closest("[data-action]");
    var action = actionBtn ? actionBtn.dataset.action : "";
    if (!action) return;
    if (action === "menu") {
      var nav = document.getElementById("mainNav");
      if (nav) nav.classList.toggle("open");
    }
  });
})();
