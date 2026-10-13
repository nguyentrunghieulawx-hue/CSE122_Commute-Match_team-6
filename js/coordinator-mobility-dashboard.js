/* =====================================================
   CommuteMatch — Trang "Tổng quan điều phối"
   Script riêng của trang, chạy độc lập (không dùng engine chung).
   Chức năng:
   1. Nút ≡: bật / tắt menu trên màn hình nhỏ
   ===================================================== */

(function () {

  /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
  document.addEventListener("click", function (e) {

    /* Các nút thao tác, nhận biết qua thuộc tính data-action="..." */
    var actionBtn = e.target.closest("[data-action]");
    var action = actionBtn ? actionBtn.dataset.action : "";
    if (!action) return;
    if (action === "menu") {
      var nav = document.getElementById("mainNav");
      if (nav) nav.classList.toggle("open");
    }
  });
})();
