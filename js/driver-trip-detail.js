/* =====================================================
   CommuteMatch — Trang "Chi tiết chuyến tài xế" (phần JS của HIEU)
   Hộp thoại đánh giá do Bootstrap mở/đóng (data-bs-toggle),
   ở đây chỉ còn:
   1. Hiện thông báo nhanh (toast) sau mỗi thao tác
   2. Các nút data-viec="luu": đóng hộp thoại và báo thành công
   ===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    /* ---------- Thông báo nhanh ở góc màn hình ---------- */
    var hopThongBao = document.getElementById("cmToast");

    function hienThongBao(noiDung) {
        if (!hopThongBao) return;
        hopThongBao.textContent = noiDung || "Đã cập nhật thành công";
        hopThongBao.classList.add("cm-toast-hien");
        setTimeout(function() {
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

    /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
    document.addEventListener("click", function(e) {
        var nut = e.target.closest('[data-viec="luu"]');
        if (!nut) return;

        dongHopThoai();
        hienThongBao();
    });
});