/* =====================================================
   CommuteMatch — Trang "Lịch chuyến" (phần JS của HIEU)
   Menu thu gọn đã có Bootstrap lo, ở đây chỉ còn:
   1. Hiện thông báo nhanh (toast) sau mỗi thao tác
   2. Các nút có data-viec="luu": báo đã cập nhật
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

    /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
    /* Mọi nút thao tác đều gắn thuộc tính data-viec="..." */
    document.addEventListener("click", function(e) {
        var nut = e.target.closest("[data-viec]");
        if (!nut) return;

        if (nut.dataset.viec === "luu") {
            hienThongBao();
        }
    });
});