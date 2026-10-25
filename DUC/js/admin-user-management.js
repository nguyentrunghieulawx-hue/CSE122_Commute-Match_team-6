/* =====================================================
   CommuteMatch — Trang "Quản lý người dùng"
   Script riêng của trang, chạy độc lập (không dùng engine chung).
   Chức năng:
   1. Lấy danh sách người dùng từ MockApi, tìm kiếm + lọc vai trò
   2. Thêm / sửa người dùng trong hộp thoại, vô hiệu / kích hoạt (lưu qua MockApi)
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
  var nguoiDung = [];
  var dangSuaId = null; // null = đang thêm mới
  var VAI_TRO_LOC = ["", "rider", "driver", "coordinator"]; // theo thứ tự option của ô lọc

  function maHienThi(u) {
    var so = String(u.id).replace(/\D/g, "");
    return so.length <= 4 ? "CM" + so : String(u.id).toUpperCase();
  }

  function dongNguoiDung(u) {
    var khoa = u.trangThai === "locked";
    return "<tr><td>" + maHienThi(u) + "</td>" +
      "<td><strong>" + dd.html(u.hoTen) + '</strong><div class="muted small">' + dd.html(u.email) + "</div></td>" +
      "<td>" + dd.vaiTro(u.vaiTro) + "</td>" +
      '<td><span class="badge ' + (khoa ? "red" : "") + '">' + (khoa ? "Tạm khóa" : "Hoạt động") + "</span></td>" +
      '<td><button class="btn btn-outline btn-sm" data-modal="userModal" data-id="' + u.id + '">Sửa</button> ' +
      (khoa ? '<button class="btn btn-primary btn-sm" data-action="toggle-lock" data-id="' + u.id + '">Kích hoạt</button>'
        : '<button class="btn btn-danger btn-sm" data-action="toggle-lock" data-id="' + u.id + '">Vô hiệu</button>') +
      "</td></tr>";
  }

  function veBang() {
    var tuKhoa = document.getElementById("umTim").value.trim().toLowerCase();
    var vaiTro = VAI_TRO_LOC[document.getElementById("umLocVaiTro").selectedIndex] || "";
    var ds = nguoiDung.filter(function (u) {
      if (vaiTro && u.vaiTro !== vaiTro) return false;
      return !tuKhoa || (u.hoTen + " " + u.email + " " + maHienThi(u)).toLowerCase().indexOf(tuKhoa) >= 0;
    });
    document.getElementById("umBang").innerHTML = ds.length ? ds.map(dongNguoiDung).join("") :
      '<tr><td colspan="5" class="muted">Không tìm thấy người dùng phù hợp.</td></tr>';
  }

  function taiDuLieu() {
    return MockApi.layNguoiDung()
      .then(function (ds) { nguoiDung = ds; veBang(); })
      .catch(function (loi) { toast(loi.message); });
  }

  /* Điền hộp thoại: có id → sửa, không có → thêm mới */
  function chuanBiHopThoai(id) {
    var u = nguoiDung.filter(function (x) { return x.id === id; })[0];
    dangSuaId = u ? u.id : null;
    document.getElementById("umTieuDe").textContent = u ? "Sửa người dùng " + maHienThi(u) : "Thêm người dùng mới";
    document.getElementById("umHoTen").value = u ? u.hoTen : "";
    document.getElementById("umEmail").value = u ? u.email : "";
    document.getElementById("umVaiTro").value = u ? u.vaiTro : "rider";
    document.getElementById("umTrangThai").value = u ? u.trangThai : "active";
  }

  document.getElementById("umTim").addEventListener("input", veBang);
  document.getElementById("umLocVaiTro").addEventListener("change", veBang);

  /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
  document.addEventListener("click", function (e) {
    /* Nút có data-modal="..." → mở hộp thoại tương ứng */
    var modalBtn = e.target.closest("[data-modal]");
    if (modalBtn) {
      if (modalBtn.dataset.modal === "userModal") chuanBiHopThoai(modalBtn.dataset.id);
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
    } else if (action === "save-user") {
      var duLieu = {
        hoTen: document.getElementById("umHoTen").value.trim(),
        email: document.getElementById("umEmail").value.trim(),
        vaiTro: document.getElementById("umVaiTro").value,
        trangThai: document.getElementById("umTrangThai").value
      };
      if (!duLieu.hoTen) { toast("Bạn chưa nhập họ và tên"); return; }
      var laSua = !!dangSuaId;
      var goi = laSua ? MockApi.capNhatNguoiDung(dangSuaId, duLieu) : MockApi.taoNguoiDung(duLieu);
      goi.then(function () {
        closeModals();
        toast(laSua ? "Đã lưu thay đổi" : "Đã thêm người dùng (mật khẩu mặc định 12345678)");
        return taiDuLieu();
      }).catch(function (loi) { toast(loi.message); });
    } else if (action === "toggle-lock") {
      var u = nguoiDung.filter(function (x) { return x.id === actionBtn.dataset.id; })[0];
      if (!u) return;
      var moi = u.trangThai === "locked" ? "active" : "locked";
      actionBtn.disabled = true;
      MockApi.capNhatNguoiDung(u.id, { trangThai: moi }).then(function () {
        toast(moi === "locked" ? "Đã vô hiệu hóa " + u.hoTen : "Đã kích hoạt lại " + u.hoTen);
        return taiDuLieu();
      }).catch(function (loi) { actionBtn.disabled = false; toast(loi.message); });
    } else if (action === "save") {
      closeModals();
      toast();
    }
  });

  taiDuLieu();
})();
