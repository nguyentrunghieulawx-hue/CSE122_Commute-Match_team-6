/* =====================================================
   CommuteMatch — Trang "Yêu cầu tham gia" (phần JS của HIEU)
   Chức năng:
   1. Bấm dải lọc: chỉ một mục được sáng
   2. Duyệt / từ chối yêu cầu ngay trên thẻ
   3. Hiện thông báo nhanh (toast) sau mỗi thao tác
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Nhãn nhỏ gắn trên thẻ yêu cầu ---------- */
  function nhanTrangThai(chu, loai) {
    return '<span class="cm-badge ' + (loai || "") + '">' + chu + "</span>";
  }

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

  /* ---------- Bấm dải lọc ---------- */
  document.getElementById("nhomTab").addEventListener("click", function (e) {
    var tab = e.target.closest(".cm-tab");
    if (!tab) return;

    this.querySelectorAll(".cm-tab").forEach(function (t) {
      t.classList.remove("active");
    });
    tab.classList.add("active");
  });

  /* ---------- Duyệt / từ chối yêu cầu ---------- */
  document.addEventListener("click", function (e) {
    var nut = e.target.closest("[data-viec]");
    if (!nut) return;
    var viec = nut.dataset.viec;

    if (viec === "duyet" || viec === "tu-choi") {
      /* Thay cụm nút trên thẻ bằng nhãn "Đã duyệt" / "Đã từ chối" */
      var the = nut.closest(".cm-yeu-cau");
      the.querySelector(".cm-actions").innerHTML = viec === "duyet"
        ? nhanTrangThai("Đã duyệt")
        : nhanTrangThai("Đã từ chối", "cm-badge-red");

      hienThongBao(viec === "duyet" ? "Đã duyệt yêu cầu" : "Đã từ chối yêu cầu");
    }
  });
});
