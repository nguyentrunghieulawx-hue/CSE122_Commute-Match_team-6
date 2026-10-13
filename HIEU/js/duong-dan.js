/* =====================================================
   Bảng đường dẫn tới toàn bộ trang của prototype CommuteMatch.
   Prototype chia làm 3 thư mục thành viên: HIEU, DAI, DUC.
   duongDanTrang("slug") trả về đường dẫn tương đối từ thư mục
   HIEU tới trang tương ứng (kể cả trang của thành viên khác).
   ===================================================== */
var DUONG_DAN_TRANG = {
  "403": "../DAI/403.html",
  "404": "../DAI/404.html",
  "admin-dashboard": "../DUC/admin-dashboard.html",
  "admin-platform-settings": "../DUC/admin-platform-settings.html",
  "admin-report-center": "../DUC/admin-report-center.html",
  "admin-trip-management": "../DUC/admin-trip-management.html",
  "admin-user-management": "../DUC/admin-user-management.html",
  "coordinator-demand-heatmap": "../DUC/coordinator-demand-heatmap.html",
  "coordinator-mobility-dashboard": "../DUC/coordinator-mobility-dashboard.html",
  "coordinator-pickup-zone-management": "../DUC/coordinator-pickup-zone-management.html",
  "coordinator-report-center": "../DUC/coordinator-report-center.html",
  "coordinator-trip-detail": "../DUC/coordinator-trip-detail.html",
  "driver-join-requests": "driver-join-requests.html",
  "driver-schedule": "driver-schedule.html",
  "driver-trip-create": "driver-trip-create.html",
  "driver-trip-detail": "driver-trip-detail.html",
  "forgot-password": "forgot-password.html",
  "index": "index.html",
  "login": "login.html",
  "notifications": "../DAI/notifications.html",
  "profile": "../DAI/profile.html",
  "register": "register.html",
  "reset-password": "reset-password.html",
  "rider-match-results": "../DAI/rider-match-results.html",
  "rider-my-trips": "../DAI/rider-my-trips.html",
  "rider-trip-detail": "../DAI/rider-trip-detail.html",
  "rider-trip-search": "../DAI/rider-trip-search.html",
  "settings": "../DAI/settings.html",
};

function duongDanTrang(slug) {
  return DUONG_DAN_TRANG[slug] || (slug + ".html");
}
