/* =====================================================
   CommuteMatch — Trang "Đăng ký" (phần JS của HIEU)
   Chức năng:
   1. Bấm "Tạo tài khoản": kiểm tra thông tin rồi "gửi" mã OTP 6 chữ số
      (chưa có backend nên mã được in thẳng lên màn hình)
   2. Nhập đúng mã OTP: báo thành công rồi quay về trang đăng nhập
   3. Có đếm ngược 60 giây mới được bấm "Gửi lại mã"
   ===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    /* ---------- Đường dẫn tới các trang khác ---------- */
    var denTrang = function(slug) {
        return slug + ".html";
    };

    /* ---------- Các phần tử trên trang ---------- */
    var buocDangKy = document.getElementById("buocDangKy");
    var khoiOtp = document.getElementById("khoiOtp");
    var oHoTen = document.getElementById("oHoTen");
    var oEmail = document.getElementById("oEmail");
    var oMatKhau = document.getElementById("oMatKhau");
    var oDongY = document.getElementById("oDongY");
    var oEmailNhanMa = document.getElementById("oEmailNhanMa");
    var oMaOtpHien = document.getElementById("oMaOtpHien");
    var oMaOtp = document.getElementById("oMaOtp");
    var oOtpLoi = document.getElementById("oOtpLoi");
    var oNutGuiLai = document.getElementById("oNutGuiLai");
    var oChuGuiLai = document.getElementById("oChuGuiLai");

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
        buocDangKy.classList.add("d-none");
        khoiOtp.classList.remove("d-none");
    }

    function hienBuocDangKy() {
        dungDemNguoc();
        anLoiOtp();
        khoiOtp.classList.add("d-none");
        buocDangKy.classList.remove("d-none");
    }

    /* ---------- Ô nhập mã: chỉ cho gõ chữ số, tối đa 6 ký tự ---------- */
    oMaOtp.addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, "").slice(0, 6);
        if (!oOtpLoi.classList.contains("d-none")) anLoiOtp();
    });

    /* ---------- Bấm nút "Tạo tài khoản": kiểm tra rồi sang bước nhập mã ---------- */
    document.querySelector('[data-viec="dang-ky"]').addEventListener("click", function() {
        if (!oHoTen.value.trim()) {
            hienThongBao("Bạn chưa nhập họ và tên");
            oHoTen.focus();
            return;
        }
        if (oEmail.value.trim().indexOf("@") < 0) {
            hienThongBao("Email chưa đúng, bạn kiểm tra lại nhé");
            oEmail.focus();
            return;
        }
        if (oMatKhau.value.trim().length < 8) {
            hienThongBao("Mật khẩu cần ít nhất 8 ký tự");
            oMatKhau.focus();
            return;
        }
        if (!oDongY.checked) {
            hienThongBao("Bạn cần đồng ý với điều khoản sử dụng");
            return;
        }

        oEmailNhanMa.textContent = oEmail.value.trim();
        hienBuocOtp();
        guiMaOtp();
    });

    /* ---------- Bấm nút "Gửi lại mã" ---------- */
    document.querySelector('[data-viec="gui-lai-otp"]').addEventListener("click", function() {
        guiMaOtp();
    });

    /* ---------- Bấm nút "Quay lại" ---------- */
    document.querySelector('[data-viec="huy-otp"]').addEventListener("click", function() {
        hienBuocDangKy();
    });

    /* ---------- Bấm nút "Xác nhận & Tạo tài khoản" ---------- */
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
        hienThongBao("Tạo tài khoản thành công, đang về trang đăng nhập...");
        setTimeout(function() {
            location.href = denTrang("login");
        }, 900);
    });
});
