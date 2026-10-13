/* =====================================================
   CommuteMatch — Trang "Tìm chuyến"
   Script riêng của trang, chạy độc lập (không dùng engine chung).
   Chức năng:
   1. Nút ≡: bật / tắt menu trên màn hình nhỏ
   2. Tìm chuyến → chuyển sang trang kết quả phù hợp
   ===================================================== */

(function () {

  /* ---------- Đường dẫn tới các trang khác của prototype ---------- */
  function h(slug) {
    return duongDanTrang(slug);
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
      location.href = h("rider-match-results");
    }
  });
})();
