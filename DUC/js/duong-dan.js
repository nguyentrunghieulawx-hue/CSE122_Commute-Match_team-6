/* =====================================================
   Bảng đường dẫn tới toàn bộ trang của prototype CommuteMatch.
   Prototype chia làm 3 thư mục thành viên: HIEU, DAI, DUC.
   duongDanTrang("slug") trả về đường dẫn tương đối từ thư mục
   DUC tới trang tương ứng (kể cả trang của thành viên khác).
   ===================================================== */
var DUONG_DAN_TRANG = {
  "403": "../DAI/403.html",
  "404": "../DAI/404.html",
  "admin-dashboard": "admin-dashboard.html",
  "admin-platform-settings": "admin-platform-settings.html",
  "admin-report-center": "admin-report-center.html",
  "admin-trip-management": "admin-trip-management.html",
  "admin-user-management": "admin-user-management.html",
  "coordinator-demand-heatmap": "coordinator-demand-heatmap.html",
  "coordinator-mobility-dashboard": "coordinator-mobility-dashboard.html",
  "coordinator-pickup-zone-management": "coordinator-pickup-zone-management.html",
  "coordinator-report-center": "coordinator-report-center.html",
  "coordinator-trip-detail": "coordinator-trip-detail.html",
  "driver-join-requests": "../HIEU/driver-join-requests.html",
  "driver-schedule": "../HIEU/driver-schedule.html",
  "driver-trip-create": "../HIEU/driver-trip-create.html",
  "driver-trip-detail": "../HIEU/driver-trip-detail.html",
  "forgot-password": "../HIEU/forgot-password.html",
  "index": "../HIEU/index.html",
  "login": "../HIEU/login.html",
  "notifications": "../DAI/notifications.html",
  "profile": "../DAI/profile.html",
  "register": "../HIEU/register.html",
  "reset-password": "../HIEU/reset-password.html",
  "rider-match-results": "../DAI/rider-match-results.html",
  "rider-my-trips": "../DAI/rider-my-trips.html",
  "rider-trip-detail": "../DAI/rider-trip-detail.html",
  "rider-trip-search": "../DAI/rider-trip-search.html",
  "settings": "../DAI/settings.html",
};

function duongDanTrang(slug) {
  return DUONG_DAN_TRANG[slug] || (slug + ".html");
}
