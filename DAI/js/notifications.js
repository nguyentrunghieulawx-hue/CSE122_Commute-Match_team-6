/* =====================================================
   CommuteMatch — Trang "Thông báo"
   Script riêng của trang, chạy độc lập (không dùng engine chung).
   Chức năng:
   1. Dựng lại menu đầu trang theo vai trò đã lưu trong trình duyệt
   2. Lấy thông báo của người đang đăng nhập từ MockApi, lọc theo dải
   3. Đánh dấu đã đọc / đọc tất cả / xóa (lưu qua MockApi)
   4. Hiện thông báo nhanh (toast); nút ≡ bật / tắt menu trên màn hình nhỏ
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

  /* ---------- Dữ liệu từ MockApi ---------- */
  /* Người nhận = người đang đăng nhập (chưa đăng nhập thì dùng tài khoản demo theo vai trò) */
  var dd = MockApi.dinhDang;
  var nguoiNhan = MockApi.layPhien();
  var tatCa = [];
  var locHienTai = "all";
  var TEN_TAB = { all: "Tất cả", unread: "Chưa đọc", trip: "Chuyến đi", system: "Hệ thống" };

  function hopLoc(n, loc) {
    if (loc === "unread") return !n.daDoc;
    if (loc === "trip" || loc === "system") return n.loai === loc;
    return true;
  }

  function dongThongBao(n) {
    var lienKet = n.lienKet ? h(n.lienKet) : "";
    var than = '<span class="dai-face ' + (n.mau || "") + '">' + dd.html(n.kyHieu) + "</span>" +
      '<div class="dai-item-body"><strong>' + dd.html(n.tieuDe) + "</strong>" +
      "<p>" + dd.html(n.noiDung) + "</p><small>" + dd.tuongDoi(n.thoiGian) + "</small></div>";
    if (!n.daDoc) {
      /* Chưa đọc: bấm vào → đánh dấu đã đọc rồi mở trang liên quan */
      return '<a class="dai-item moi" href="' + (lienKet || "#") + '" data-id="' + n.id + '">' + than +
        '<span class="dai-tag">Mới</span></a>';
    }
    return '<div class="dai-item">' + than +
      '<div class="dai-item-act">' +
      (lienKet ? '<a class="dai-btn dai-btn-line dai-btn-sm" href="' + lienKet + '">Xem</a>' : "") +
      '<button class="dai-btn dai-btn-line dai-btn-sm" data-action="delete" data-id="' + n.id + '">Xóa</button>' +
      "</div></div>";
  }

  function veDanhSach() {
    document.querySelectorAll("#tbTabs [data-loc]").forEach(function (tab) {
      var loc = tab.dataset.loc;
      var so = tatCa.filter(function (n) { return hopLoc(n, loc); }).length;
      tab.textContent = TEN_TAB[loc] + (loc === "all" || loc === "unread" ? " " + so : "");
      tab.classList.toggle("active", loc === locHienTai);
    });
    var ds = tatCa.filter(function (n) { return hopLoc(n, locHienTai); });
    document.getElementById("tbDanhSach").innerHTML = ds.length ? ds.map(dongThongBao).join("") :
      '<p class="dai-note">Không có thông báo nào.</p>';
  }

  function taiDuLieu() {
    return MockApi.layThongBao(nguoiNhan.id)
      .then(function (ds) {
        tatCa = ds;
        veDanhSach();
        MockApi.capNhatDauTrang(); // số trên nút chuông
      })
      .catch(function (loi) { toast(loi.message); });
  }

  document.getElementById("tbTabs").addEventListener("click", function (e) {
    var tab = e.target.closest("[data-loc]");
    if (!tab) return;
    locHienTai = tab.dataset.loc;
    veDanhSach();
  });

  /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
  document.addEventListener("click", function (e) {

    /* Bấm thông báo chưa đọc: đánh dấu đã đọc qua MockApi rồi mới chuyển trang */
    var moi = e.target.closest(".dai-item.moi[data-id]");
    if (moi) {
      e.preventDefault();
      var den = moi.getAttribute("href");
      MockApi.danhDauDaDoc(moi.dataset.id).then(function () {
        if (den && den !== "#") location.href = den;
        else taiDuLieu();
      }, function (loi) { toast(loi.message); });
      return;
    }

    /* Các nút thao tác, nhận biết qua thuộc tính data-action="..." */
    var actionBtn = e.target.closest("[data-action]");
    var action = actionBtn ? actionBtn.dataset.action : "";
    if (!action) return;
    if (action === "menu") {
      var nav = document.getElementById("mainNav");
      if (nav) nav.classList.toggle("open");
    } else if (action === "read-all") {
      MockApi.danhDauTatCaDaDoc(nguoiNhan.id).then(function (so) {
        toast(so ? "Đã đánh dấu " + so + " thông báo là đã đọc" : "Không còn thông báo chưa đọc");
        return taiDuLieu();
      }, function (loi) { toast(loi.message); });
    } else if (action === "delete") {
      MockApi.xoaThongBao(actionBtn.dataset.id).then(function () {
        toast("Đã xóa thông báo");
        return taiDuLieu();
      }, function (loi) { toast(loi.message); });
    } else if (action === "save") {
      closeModals();
      toast();
    }
  });

  taiDuLieu();
})();
