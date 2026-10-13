/* =====================================================
   CommuteMatch — Trang "Đặt lại mật khẩu" (phần JS của HIEU)
   Chức năng:
   1. Mở trang: hiện lại mã OTP — lấy mã do trang "Quên mật khẩu" chuyển
      qua sessionStorage, còn mở thẳng trang này thì tự tạo mã mới
      (chưa có backend nên mã được in thẳng lên màn hình)
   2. Bấm "Đặt lại mật khẩu": kiểm tra mã OTP và 2 ô mật khẩu,
      xong báo thành công rồi về trang đăng nhập
   3. Có đếm ngược 60 giây mới được bấm "Gửi lại mã"
   ===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    /* ---------- Đường dẫn tới các trang khác ---------- */
    var denTrang = function(slug) {
        return duongDanTrang(slug);
    };

    /* ---------- Hiện dòng thông báo nhỏ góc phải ---------- */
    var hopThongBao = document.getElementById("cmToast");

    function hienThongBao(noiDung) {
        if (!hopThongBao) return;
        hopThongBao.textContent = noiDung;
        hopThongBao.classList.add("cm-toast-hien");
        setTimeout(function() {
            hopThongBao.classList.remove("cm-toast-hien");
        }, 1600);
    }

    /* ---------- Các phần tử trên trang ---------- */
    var khoiOtp = document.getElementById("khoiOtp");
    var oMa = document.getElementById("oMa");
    var oMatKhauMoi = document.getElementById("oMatKhauMoi");
    var oNhapLai = document.getElementById("oNhapLai");
    var oMaOtpHien = document.getElementById("oMaOtpHien");
    var oOtpLoi = document.getElementById("oOtpLoi");
    var oNutGuiLai = document.getElementById("oNutGuiLai");
    var oChuGuiLai = document.getElementById("oChuGuiLai");

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

    /* ---------- Bấm nút "Gửi lại mã": tạo mã mới, in ra màn hình ---------- */
    function guiMaOtp() {
        maOtpHienTai = taoMaOtp();
        oMaOtpHien.textContent = maOtpHienTai;
        oMa.value = "";
        anLoiOtp();
        batDauDemNguoc();
        oMa.focus();
        hienThongBao("Đã gửi lại mã OTP (xem ngay trên màn hình)");
    }

    document.querySelector('[data-viec="gui-lai-otp"]').addEventListener("click", function() {
        guiMaOtp();
    });

    /* ---------- Ô nhập mã: chỉ cho gõ chữ số, tối đa 6 ký tự ---------- */
    oMa.addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, "").slice(0, 6);
        if (!oOtpLoi.classList.contains("d-none")) anLoiOtp();
    });

    /* ---------- Mở trang: dùng mã của bước trước, không có thì tạo mã mới ---------- */
    var maTuBuocTruoc = sessionStorage.getItem("cmOtpDatLai");
    sessionStorage.removeItem("cmOtpDatLai");
    maOtpHienTai = /^\d{6}$/.test(maTuBuocTruoc || "") ? maTuBuocTruoc : taoMaOtp();
    oMaOtpHien.textContent = maOtpHienTai;
    batDauDemNguoc();

    /* ---------- Bấm nút "Đặt lại mật khẩu" ---------- */
    document.querySelector('[data-viec="dat-lai"]').addEventListener("click", function() {
        var maNhap = oMa.value.trim();
        var matKhauMoi = oMatKhauMoi.value;

        if (maNhap.length < 6) {
            hienLoiOtp("Vui lòng nhập đủ 6 chữ số của mã OTP.");
            return;
        }
        if (maNhap !== maOtpHienTai) {
            hienLoiOtp("Mã OTP chưa đúng. Bạn xem lại mã ở khung thư màu xanh phía trên.");
            return;
        }
        anLoiOtp();

        if (matKhauMoi.trim().length < 8) {
            hienThongBao("Mật khẩu mới cần ít nhất 8 ký tự");
            oMatKhauMoi.focus();
            return;
        }
        if (matKhauMoi !== oNhapLai.value) {
            hienThongBao("Hai ô mật khẩu chưa giống nhau");
            oNhapLai.focus();
            return;
        }

        dungDemNguoc();
        hienThongBao("Đổi mật khẩu thành công, đang về trang đăng nhập...");
        setTimeout(function() {
            location.href = denTrang("login");
        }, 900);
    });
});
