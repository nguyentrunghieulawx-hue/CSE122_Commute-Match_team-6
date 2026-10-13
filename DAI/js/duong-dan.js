/* =====================================================
   Bảng đường dẫn tới toàn bộ trang của prototype CommuteMatch.
   Prototype chia làm 3 thư mục thành viên: HIEU, DAI, DUC.
   duongDanTrang("slug") trả về đường dẫn tương đối từ thư mục
   DAI tới trang tương ứng (kể cả trang của thành viên khác).
   ===================================================== */
var DUONG_DAN_TRANG = {
  "403": "403.html",
  "404": "404.html",
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
  "driver-join-requests": "../HIEU/driver-join-requests.html",
  "driver-schedule": "../HIEU/driver-schedule.html",
  "driver-trip-create": "../HIEU/driver-trip-create.html",
  "driver-trip-detail": "../HIEU/driver-trip-detail.html",
  "forgot-password": "../HIEU/forgot-password.html",
  "index": "../HIEU/index.html",
  "login": "../HIEU/login.html",
  "notifications": "notifications.html",
  "profile": "profile.html",
  "register": "../HIEU/register.html",
  "reset-password": "../HIEU/reset-password.html",
  "rider-match-results": "rider-match-results.html",
  "rider-my-trips": "rider-my-trips.html",
  "rider-trip-detail": "rider-trip-detail.html",
  "rider-trip-search": "rider-trip-search.html",
  "settings": "settings.html",
};

function duongDanTrang(slug) {
  return DUONG_DAN_TRANG[slug] || (slug + ".html");
}
