/* =====================================================
   CommuteMatch — Trang "Hồ sơ"
   Script riêng của trang, chạy độc lập (không dùng engine chung).
   Chức năng:
   1. Dựng lại menu đầu trang theo vai trò đã lưu trong trình duyệt
   2. Hiện thông báo nhanh (toast) sau mỗi thao tác
   3. Nút ≡: bật / tắt menu trên màn hình nhỏ
   4. Các nút Lưu: đóng hộp thoại và báo thành công
   5. Đổi vai trò Hành khách ⇄ Người chia sẻ xe
   ===================================================== */

(function () {

  /* ---------- Đường dẫn tới các trang khác của prototype ---------- */
  function h(slug) {
    return duongDanTrang(slug);
  }

  /* ---------- Tên hiển thị của vai trò ---------- */
  function roleName(r) {
    return ({ rider: "Hành khách", driver: "Người chia sẻ xe", coordinator: "Điều phối viên", admin: "Quản trị viên" })[r] || "Hành khách";
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

  /* ---------- Menu đầu trang theo vai trò đang đăng nhập ---------- */
  /* Vai trò được lưu ở localStorage.cmRole, mặc định là rider  */
  var NAV = {
    rider: [["rider-trip-search", "Tìm chuyến"], ["rider-match-results", "Gợi ý phù hợp"], ["rider-my-trips", "Chuyến của tôi"]],
    driver: [["driver-schedule", "Lịch chuyến"], ["driver-trip-create", "Tạo chuyến"], ["driver-join-requests", "Yêu cầu"]],
    coordinator: [["coordinator-mobility-dashboard", "Tổng quan"], ["coordinator-demand-heatmap", "Nhu cầu AI"], ["coordinator-report-center", "Báo cáo"], ["coordinator-pickup-zone-management", "Điểm đón"]],
    admin: [["admin-dashboard", "Tổng quan"], ["admin-user-management", "Người dùng"], ["admin-trip-management", "Chuyến đi"], ["admin-report-center", "Báo cáo"], ["admin-platform-settings", "Cấu hình"]]
  };
  var PAGE = document.body.dataset.page || "";

  function renderNav() {
    var nav = document.getElementById("mainNav");
    if (!nav) return;
    var role = localStorage.getItem("cmRole") || "rider";
    var links = NAV[role] || NAV.rider;
    nav.innerHTML = links.map(function (item) {
      var cls = "nav-link" + (PAGE === item[0] ? " active" : "");
      return '<a class="' + cls + '" href="' + h(item[0]) + '">' + item[1] + "</a>";
    }).join("");
  }
  renderNav();

  /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
  document.addEventListener("click", function (e) {
    /* Nút đổi vai trò (data-switch): lưu vai trò mới rồi chuyển trang */
    var switchBtn = e.target.closest("[data-switch]");
    if (switchBtn) {
      localStorage.setItem("cmRole", switchBtn.dataset.switch);
      toast("Đã đổi sang vai trò " + roleName(switchBtn.dataset.switch));
      setTimeout(function () {
        location.href = h(switchBtn.dataset.switch === "rider" ? "rider-trip-search" : "driver-schedule");
      }, 700);
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
})();
