/* =====================================================
   CommuteMatch — Trang "Tìm chuyến"
   Script riêng của trang, chạy độc lập (không dùng engine chung).
   Chức năng:
   1. Nút ≡: bật / tắt menu trên màn hình nhỏ
   2. Tìm chuyến → lưu điều kiện tìm (sessionStorage) → sang trang kết quả,
      trang kết quả gọi MockApi.timChuyen với điều kiện này
   ===================================================== */

(function () {

  /* ---------- Đường dẫn tới các trang khác của prototype ---------- */
  function h(slug) {
    return duongDanTrang(slug);
  }

  /* ---------- Gom điều kiện tìm từ form ---------- */
  function layDieuKien() {
    function giaTri(id) { var o = document.getElementById(id); return o ? o.value.trim() : ""; }
    return {
      diemDi: giaTri("tsDiemDi"),
      diemDen: giaTri("tsDiemDen"),
      ngay: giaTri("tsNgayDi"),
      gio: giaTri("tsGio"),
      soCho: parseInt(giaTri("tsSoCho"), 10) || 1
    };
  }

  /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
  document.addEventListener("click", function (e) {

    /* Các nút thao tác, nhận biết qua thuộc tính data-action="..." */
    var actionBtn = e.target.closest("[data-action]");
    var action = actionBtn ? actionBtn.dataset.action : "";
    if (!action) return;
    if (action === "menu") {
      var nav = document.getElementById("mainNav");
      if (nav) nav.classList.toggle("open");
    } else if (action === "search") {
      var dk = layDieuKien();
      if (!dk.diemDi && !dk.diemDen) {
        var toast = document.getElementById("toast");
        if (toast) {
          toast.textContent = "Bạn hãy nhập điểm đi hoặc điểm đến";
          toast.classList.add("show");
          setTimeout(function () { toast.classList.remove("show"); }, 2300);
        }
        return;
      }
      try { sessionStorage.setItem("cm_tim_chuyen", JSON.stringify(dk)); } catch (err) { /* bỏ qua */ }
      location.href = h("rider-match-results");
    }
  });
})();
