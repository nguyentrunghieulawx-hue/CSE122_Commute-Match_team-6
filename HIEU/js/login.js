document.addEventListener("DOMContentLoaded", function() {

    /* ---------- Đường dẫn tới các trang khác ---------- */
    var denTrang = function(slug) {
        return duongDanTrang(slug);
    };

    /* ---------- Trang chính của mỗi vai trò ---------- */
    var TRANG_CHINH = {
        rider: "rider-trip-search",
        driver: "driver-schedule",
        coordinator: "coordinator-mobility-dashboard",
        admin: "admin-dashboard"
    };

    /* ---------- Người dùng đã qua bước kiểm tra email + mật khẩu (MockApi) ---------- */
    var nguoiDangNhap = null;

    /* ---------- Chọn vai trò đăng nhập: điền sẵn tài khoản demo của vai trò đó ---------- */
    document.getElementById("nhomVaiTro").addEventListener("click", function(e) {
        var nut = e.target.closest("[data-vai-tro]");
        if (!nut) return;

        this.querySelectorAll("[data-vai-tro]").forEach(function(o) {
            o.classList.remove("dang-chon");
        });
        nut.classList.add("dang-chon");

        var demo = window.MockApi && MockApi.taiKhoanDemo(nut.dataset.vaiTro);
        if (demo) {
            oEmail.value = demo.email;
            oMatKhau.value = demo.matKhau;
        }
    });

    /* ========== CÁC PHẦN TỬ TRÊN TRANG ========== */
    var buocDangNhap = document.getElementById("buocDangNhap");
    var khoiOtp = document.getElementById("khoiOtp");
    var oEmail = document.getElementById("oEmail");
    var oMatKhau = document.getElementById("oMatKhau");
    var oEmailNhanMa = document.getElementById("oEmailNhanMa");
    var oMaOtpHien = document.getElementById("oMaOtpHien");
    var oMaOtp = document.getElementById("oMaOtp");
    var oOtpLoi = document.getElementById("oOtpLoi");
    var oNutGuiLai = document.getElementById("oNutGuiLai");
    var oChuGuiLai = document.getElementById("oChuGuiLai");

    /* ---------- Hiện dòng thông báo nhỏ góc phải ---------- */
    var hopThongBao = document.getElementById("cmToast"); /* Thông báo nhỏ  */

    function hienThongBao(noiDung) {
        if (!hopThongBao) return;
        hopThongBao.textContent = noiDung;
        hopThongBao.classList.add("cm-toast-hien");
        setTimeout(function() {
            hopThongBao.classList.remove("cm-toast-hien");
        }, 1600);
    }

    /* ====== PHẦN MÃ OTP (chạy ngay trên trình duyệt, không cần máy chủ) ====== */
    var GIAY_CHO_GUI_LAI = 60; /* số giây phải chờ trước khi được gửi lại mã */
    var maOtpHienTai = ""; /* mã đang có hiệu lực */
    var giayConLai = 0; /* số giây còn lại trên đồng hồ đếm ngược */
    var dongHo = null; /* mã của setInterval, giữ lại để biết mà dừng */

    /* Tạo ngẫu nhiên một mã gồm đúng 6 chữ số */
    function taoMaOtp() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    /* Chữ trên nút "Gửi lại": còn chờ thì đếm giây, hết chờ thì bấm được */
    function capNhatNutGuiLai() {
        var duocGuiLai = giayConLai <= 0;
        oNutGuiLai.disabled = !duocGuiLai;
        oChuGuiLai.textContent = duocGuiLai ? "Gửi lại mã" : "Gửi lại (" + giayConLai + "s)";
    }

    function dungDemNguoc() {
        if (dongHo) {
            clearInterval(dongHo);
            dongHo = null;
        }
    }

    function batDauDemNguoc() {
        dungDemNguoc();
        giayConLai = GIAY_CHO_GUI_LAI;
        capNhatNutGuiLai();
        dongHo = setInterval(function() {
            giayConLai--;
            if (giayConLai <= 0) dungDemNguoc();
            capNhatNutGuiLai();
        }, 1000);
    }

    /* "Gửi" mã: bản demo in mã ra khung giả lập hộp thư ngay trên màn hình */
    function guiMaOtp() {
        maOtpHienTai = taoMaOtp();
        oMaOtpHien.textContent = maOtpHienTai;
        oMaOtp.value = "";
        anLoiOtp();
        batDauDemNguoc();
        oMaOtp.focus();
        hienThongBao("Đã gửi mã OTP tới " + oEmailNhanMa.textContent);
    }

    /* ---------- Dòng báo lỗi ngay dưới ô nhập mã ---------- */
    function hienLoiOtp(noiDung) {
        oOtpLoi.textContent = noiDung;
        oOtpLoi.classList.remove("d-none");
        khoiOtp.classList.remove("cm-otp-rung");
        void khoiOtp.offsetWidth; /* nạp lại phần tử để hiệu ứng rung chạy tiếp */
        khoiOtp.classList.add("cm-otp-rung");
    }

    function anLoiOtp() {
        oOtpLoi.textContent = "";
        oOtpLoi.classList.add("d-none");
        khoiOtp.classList.remove("cm-otp-rung");
    }

    /* ---------- Chuyển qua lại giữa bước 1 và bước 2 ---------- */
    function hienBuocOtp() {
        buocDangNhap.classList.add("d-none");
        khoiOtp.classList.remove("d-none");
    }

    function hienBuocDangNhap() {
        dungDemNguoc();
        anLoiOtp();
        khoiOtp.classList.add("d-none");
        buocDangNhap.classList.remove("d-none");
    }

    /* ---------- Ô nhập mã: chỉ cho gõ chữ số, tối đa 6 ký tự ---------- */
    oMaOtp.addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, "").slice(0, 6);
        if (!oOtpLoi.classList.contains("d-none")) anLoiOtp();
    });

    /* ---------- Bấm nút "Đăng nhập": kiểm tra với MockApi rồi sang bước nhập mã ---------- */
    var nutDangNhap = document.querySelector('[data-viec="dang-nhap"]');
    nutDangNhap.addEventListener("click", function() {
        if (!oEmail.value.trim()) {
            hienThongBao("Bạn chưa nhập email");
            oEmail.focus();
            return;
        }
        if (!oMatKhau.value.trim()) {
            hienThongBao("Bạn chưa nhập mật khẩu");
            oMatKhau.focus();
            return;
        }

        nutDangNhap.disabled = true;
        MockApi.xacThuc(oEmail.value.trim(), oMatKhau.value)
            .then(function(nguoiDung) {
                nguoiDangNhap = nguoiDung;
                oEmailNhanMa.textContent = nguoiDung.email;
                hienBuocOtp();
                guiMaOtp();
            })
            .catch(function(loi) {
                hienThongBao(loi.message);
                oMatKhau.focus();
            })
            .then(function() {
                nutDangNhap.disabled = false;
            });
    });

    /* ---------- Bấm nút "Gửi lại mã" ---------- */
    document.querySelector('[data-viec="gui-lai-otp"]').addEventListener("click", function() {
        guiMaOtp();
    });

    /* ---------- Bấm nút "Quay lại" ---------- */
    document.querySelector('[data-viec="huy-otp"]').addEventListener("click", function() {
        hienBuocDangNhap();
    });

    /* ---------- Bấm nút "Xác nhận & Đăng nhập" ---------- */
    document.querySelector('[data-viec="xac-nhan-otp"]').addEventListener("click", function() {
        var maNhap = oMaOtp.value.trim();

        if (maNhap.length < 6) {
            hienLoiOtp("Vui lòng nhập đủ 6 chữ số của mã OTP.");
            return;
        }
        if (maNhap !== maOtpHienTai) {
            hienLoiOtp("Mã OTP chưa đúng. Bạn xem lại mã ở khung thư màu xanh phía trên.");
            return;
        }

        dungDemNguoc();
        anLoiOtp();

        /* Lưu phiên đăng nhập; vai trò lấy theo tài khoản thật (không theo nút đang chọn) */
        var vaiTro = MockApi.batDauPhien(nguoiDangNhap).vaiTro;
        hienThongBao("Xin chào " + nguoiDangNhap.hoTen + ", đang đăng nhập...");
        setTimeout(function() {
            location.href = denTrang(TRANG_CHINH[vaiTro]);
        }, 700);
    });
});