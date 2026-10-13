/* =====================================================
   CommuteMatch — Trang "Tài xế tạo chuyến đi" (phần JS của HIEU)
   Chức năng:
   1. Đặt sẵn ngày hôm nay + giờ kế tiếp
   2. Tóm tắt chuyến đi và gợi ý AI cập nhật ngay khi gõ
   3. Kiểm tra form, lưu nháp, đăng chuyến (báo bằng toast)
   4. Các nút data-viec: "luu" báo thành công, "nhap" lưu nháp
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Lấy các phần tử cần dùng ---------- */
  var form = document.getElementById("formChuyen");
  var trangThai = document.getElementById("trangThai");
  var hopThanhCong = document.getElementById("hopThanhCong");
  var noiDungThanhCong = document.getElementById("noiDungThanhCong");

  var diemDi = document.getElementById("diemDi");
  var diemDen = document.getElementById("diemDen");
  var ngayDi = document.getElementById("ngayDi");
  var gioDi = document.getElementById("gioDi");
  var soGhe = document.getElementById("soGhe");
  var giaMoiGhe = document.getElementById("giaMoiGhe");
  var ghiChu = document.getElementById("ghiChu");

  /* ---------- Thông báo nhanh ở góc màn hình ---------- */
  var hopThongBao = document.getElementById("cmToast");
  function hienThongBao(noiDung) {
    if (!hopThongBao) return;
    hopThongBao.textContent = noiDung || "Đã cập nhật thành công";
    hopThongBao.classList.add("cm-toast-hien");
    setTimeout(function () {
      hopThongBao.classList.remove("cm-toast-hien");
    }, 2300);
  }

  /* ---------- Đóng hộp thoại đang mở ---------- */
  function dongHopThoai() {
    var hop = document.querySelector(".modal.show");
    if (hop && window.bootstrap) {
      bootstrap.Modal.getInstance(hop).hide();
    }
  }

  /* ---------- Hàm tiện ích ---------- */

  // 50000 -> "50.000đ"
  function formatTien(n) {
    return n.toLocaleString("vi-VN") + "đ";
  }

  // Dòng trạng thái dưới form (loi = true thì màu cam)
  function datTrangThai(text, loi) {
    trangThai.textContent = text || "";
    trangThai.classList.toggle("loi", !!loi);
  }

  // Ngày -> chuỗi "YYYY-MM-DD" để điền vào input date
  function ngayISO(d) {
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  // "2026-10-05" -> "Thứ Hai, 05/10/2026"
  function ngayDep(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    var ten = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    return ten[d.getDay()] + ", " + p[2] + "/" + p[1] + "/" + p[0];
  }

  // Băm chuỗi thành số: cùng điểm đi/đến thì gợi ý AI luôn giống nhau
  function bamChuoi(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  // Chặn mã HTML lạ khi chèn nội dung người dùng nhập vào trang
  function locHTML(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- 1. Mặc định: hôm nay + giờ kế tiếp ---------- */
  function datMacDinh() {
    var now = new Date();
    ngayDi.min = ngayISO(now);      // không cho chọn ngày quá khứ
    ngayDi.value = ngayISO(now);

    now.setHours(now.getHours() + 1, 0, 0, 0);
    gioDi.value = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
  }

  /* ---------- 2. Tóm tắt chuyến đi (cập nhật liên tục) ---------- */
  function capNhatTomTat() {
    document.getElementById("tomDiemDi").textContent = diemDi.value.trim() || "—";
    document.getElementById("tomDiemDen").textContent = diemDen.value.trim() || "—";

    if (ngayDi.value && gioDi.value) {
      document.getElementById("tomThoiGian").textContent = ngayDep(ngayDi.value) + " lúc " + gioDi.value;
    } else if (ngayDi.value) {
      document.getElementById("tomThoiGian").textContent = ngayDep(ngayDi.value);
    } else {
      document.getElementById("tomThoiGian").textContent = "—";
    }

    var ghe = Number(soGhe.value) || 0;
    var gia = Number(giaMoiGhe.value) || 0;
    document.getElementById("tomSoGhe").textContent = ghe ? ghe + " ghế" : "—";
    document.getElementById("tomGia").textContent = gia ? formatTien(gia) : "—";
    document.getElementById("tomTongThu").textContent = formatTien(ghe * gia);
  }
  /* ---------- 3. Gợi ý từ AI (mô phỏng phía trình duyệt) ---------- */
  var henGio = null;

  function capNhatGoiY() {
    var di = diemDi.value.trim();
    var den = diemDen.value.trim();
    var goiY = document.getElementById("goiYAi");

    if (!di || !den) {
      goiY.innerHTML =
        "Nhập <b>điểm đi</b> và <b>điểm đến</b> để nhận gợi ý hành khách và mức giá " +
        "phù hợp cho tuyến đường này.";
      return;
    }

    var h = bamChuoi(di.toLowerCase() + "->" + den.toLowerCase());
    var khach = 2 + (h % 7);              // 2–8 người đang tìm chuyến
    var thap = 30000 + (h % 5) * 10000;   // giá gợi ý 30k–70k
    var cao = thap + 20000;
    var caoDiem = ((h >> 3) % 2) === 0;   // tuyến giờ cao điểm hay không

    goiY.innerHTML =
      "Tuyến <b>" + locHTML(di) + " → " + locHTML(den) + "</b> hiện có khoảng " +
      "<b>" + khach + " người</b> đang tìm chuyến. Mức giá phổ biến " +
      "<b>" + formatTien(thap) + " – " + formatTien(cao) + "</b>/ghế." +
      (caoDiem ? " Đây là tuyến giờ cao điểm, bạn có thể đặt giá cao hơn khoảng 10%." : "");
  }

  // Gợi ý đợi người dùng ngừng gõ 400ms mới chạy, tránh bị giật
  function khiGoTuyen() {
    capNhatTomTat();
    clearTimeout(henGio);
    henGio = setTimeout(capNhatGoiY, 400);
  }

  diemDi.addEventListener("input", khiGoTuyen);
  diemDen.addEventListener("input", khiGoTuyen);
  [ngayDi, gioDi, soGhe, giaMoiGhe].forEach(function (o) {
    o.addEventListener("input", capNhatTomTat);
    o.addEventListener("change", capNhatTomTat);
  });

  /* ---------- Nút đảo chiều điểm đi / điểm đến ---------- */
  document.getElementById("nutDoiChieu").addEventListener("click", function () {
    var tam = diemDi.value;
    diemDi.value = diemDen.value;
    diemDen.value = tam;
    khiGoTuyen();
  });

  /* ---------- 4. Kiểm tra form ---------- */
  var dieuKien = [
    { o: diemDi,    dung: function () { return diemDi.value.trim().length > 0; } },
    { o: diemDen,   dung: function () { return diemDen.value.trim().length > 0; } },
    { o: ngayDi,    dung: function () { return ngayDi.value !== "" && ngayDi.value >= ngayDi.min; } },
    { o: gioDi,     dung: function () { return gioDi.value !== ""; } },
    { o: soGhe,     dung: function () { return Number(soGhe.value) >= 1 && Number(soGhe.value) <= 7; } },
    { o: giaMoiGhe, dung: function () { return Number(giaMoiGhe.value) >= 5000; } }
  ];

  // Đánh dấu ô sai bằng viền đỏ của Bootstrap, trả về ô sai đầu tiên
  function kiemTra() {
    var oiSai = null;
    dieuKien.forEach(function (dk) {
      var hopLe = dk.dung();
      dk.o.classList.toggle("is-invalid", !hopLe);
      if (!hopLe && !oiSai) oiSai = dk.o;
    });
    return oiSai;
  }

  // Vừa gõ lại vào ô bị lỗi là xoá viền đỏ ngay
  dieuKien.forEach(function (dk) {
    dk.o.addEventListener("input", function () {
      dk.o.classList.remove("is-invalid");
    });
  });

  /* ---------- Nút "Nhập lại" ---------- */
  document.getElementById("nutNhapLai").addEventListener("click", function () {
    form.reset();
    datMacDinh();
    hopThanhCong.classList.add("d-none");
    dieuKien.forEach(function (dk) { dk.o.classList.remove("is-invalid"); });
    datTrangThai("Đã xoá toàn bộ thông tin trên form.");
    capNhatTomTat();
    capNhatGoiY();
    hienThongBao("Đã nhập lại form");
  });

  /* ---------- Nút "Lưu nháp" (lưu vào localStorage của trình duyệt) ---------- */
  function luuNhap() {
    var oiSai = kiemTra();
    if (oiSai) {
      oiSai.focus();
      datTrangThai("Vui lòng điền đúng các ô bắt buộc trước khi lưu nháp.", true);
      hienThongBao("Chưa lưu được nháp vì còn ô chưa hợp lệ");
      return;
    }
    localStorage.setItem("cm_draft_trip", JSON.stringify({
      origin: diemDi.value,
      destination: diemDen.value,
      date: ngayDi.value,
      time: gioDi.value,
      seats: soGhe.value,
      price: giaMoiGhe.value,
      notes: ghiChu.value
    }));
    datTrangThai("Đã lưu nháp chuyến đi trên máy của bạn.");
    hienThongBao("Đã lưu nháp chuyến đi");
  }

  /* ---------- Nút "Đăng chuyến" ---------- */
  var nutDangChuyen = document.getElementById("nutDangChuyen");
  form.addEventListener("submit", function (e) {
    e.preventDefault();                    // chặn trình duyệt tải lại trang

    var oiSai = kiemTra();
    if (oiSai) {
      oiSai.focus();
      datTrangThai("Có thông tin chưa hợp lệ, bạn kiểm tra lại các ô viền đỏ nhé.", true);
      hopThanhCong.classList.add("d-none");
      hienThongBao("Còn thông tin chưa hợp lệ");
      return;
    }

    nutDangChuyen.disabled = true;
    datTrangThai("Đang đăng chuyến...");

    // Giả lập gửi dữ liệu lên máy chủ trong 800ms
    setTimeout(function () {
      var ghe = Number(soGhe.value);
      var gia = Number(giaMoiGhe.value);

      noiDungThanhCong.textContent =
        "Chuyến " + diemDi.value.trim() + " → " + diemDen.value.trim() +
        " khởi hành " + ngayDep(ngayDi.value) + " lúc " + gioDi.value +
        " đã được đăng. Dự kiến thu về " + formatTien(ghe * gia) + " cho " + ghe + " ghế.";

      hopThanhCong.classList.remove("d-none");
      datTrangThai("");
      nutDangChuyen.disabled = false;
      hienThongBao("Đã đăng chuyến thành công");

      // Đưa form về trạng thái ban đầu sau khi đăng thành công
      form.reset();
      datMacDinh();
      capNhatTomTat();
      capNhatGoiY();
      hopThanhCong.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 800);
  });

  /* ---------- Đóng thông báo thành công ---------- */
  document.getElementById("nutDongThanhCong").addEventListener("click", function () {
    hopThanhCong.classList.add("d-none");
  });

  /* ---------- Banner cuối trang: bấm thì cuộn lên form ---------- */
  document.getElementById("nutCta").addEventListener("click", function () {
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    diemDi.focus({ preventScroll: true });
  });

  /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
  document.addEventListener("click", function (e) {
    var nut = e.target.closest("[data-viec]");
    if (!nut) return;
    var viec = nut.dataset.viec;

    if (viec === "nhap") {
      luuNhap();                            // lưu nháp vào máy người dùng
    } else if (viec === "luu") {
      dongHopThoai();
      hienThongBao();
    }
  });

  /* ---------- Chạy lần đầu khi mở trang ---------- */
  datMacDinh();
  capNhatTomTat();
  capNhatGoiY();
});

