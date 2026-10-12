/* =====================================================
   CommuteMatch — Trang "Quản lý người dùng"
   Script riêng của trang, chạy độc lập (không dùng engine chung).
   Chức năng:
   1. Mở / đóng các hộp thoại (modal)
   2. Hiện thông báo nhanh (toast) sau mỗi thao tác
   3. Nút ≡: bật / tắt menu trên màn hình nhỏ
   4. Các nút Lưu: đóng hộp thoại và báo thành công
   5. Giữ giao diện Tối nếu người dùng đã chọn từ trước
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

  /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
  document.addEventListener("click", function (e) {
    /* Nút có data-modal="..." → mở hộp thoại tương ứng */
    var modalBtn = e.target.closest("[data-modal]");
    if (modalBtn) {
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
    } else if (action === "save") {
      closeModals();
      toast();
    }
  });

  /* ---------- Giữ giao diện Tối nếu đã chọn từ trước ---------- */
  if (localStorage.getItem("cmTheme") === "dark") {
    document.body.classList.add("dark");
  }
})();
