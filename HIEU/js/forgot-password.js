/* =====================================================
   CommuteMatch — Trang "Quên mật khẩu" (phần JS của HIEU)
   Chức năng:
   1. Bấm "Gửi mã đặt lại": tạo mã OTP 6 chữ số và hiện bước nhập mã
      (chưa có backend nên mã được in thẳng lên màn hình)
   2. Nhập đúng mã: cất mã vào sessionStorage rồi sang trang đặt lại mật khẩu
      (trang sau đọc lại mã đó nên người dùng không phải nhớ mã)
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
    var buocLayMa = document.getElementById("buocLayMa");
    var khoiOtp = document.getElementById("khoiOtp");
    var oEmail = document.getElementById("oEmail");
    var oEmailNhanMa = document.getElementById("oEmailNhanMa");
    var oMaOtpHien = document.getElementById("oMaOtpHien");
    var oMaOtp = document.getElementById("oMaOtp");
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
        buocLayMa.classList.add("d-none");
        khoiOtp.classList.remove("d-none");
    }

    function hienBuocLayMa() {
        dungDemNguoc();
        anLoiOtp();
        khoiOtp.classList.add("d-none");
        buocLayMa.classList.remove("d-none");
    }

    /* ---------- Ô nhập mã: chỉ cho gõ chữ số, tối đa 6 ký tự ---------- */
    oMaOtp.addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, "").slice(0, 6);
        if (!oOtpLoi.classList.contains("d-none")) anLoiOtp();
    });

    /* ---------- Bấm nút "Gửi mã đặt lại": sang bước nhập mã OTP ---------- */
    document.querySelector('[data-viec="lay-ma"]').addEventListener("click", function() {
        if (oEmail.value.trim().indexOf("@") < 0) {
            hienThongBao("Email chưa đúng, bạn kiểm tra lại nhé");
            oEmail.focus();
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
        hienBuocLayMa();
    });

    /* ---------- Bấm nút "Xác nhận mã": sang trang đặt lại mật khẩu ---------- */
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
        /* Cất mã lại để trang "Đặt lại mật khẩu" hiện đúng mã này, khỏi phải nhớ */
        sessionStorage.setItem("cmOtpDatLai", maOtpHienTai);
        hienThongBao("Xác nhận mã thành công, đang chuyển trang...");
        setTimeout(function() {
            location.href = denTrang("reset-password");
        }, 900);
    });
});