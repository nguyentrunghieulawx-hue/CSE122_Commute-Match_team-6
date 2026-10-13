/* =====================================================
   Bang duong dan toi toan bo trang cua prototype CommuteMatch,
   phien ban branch DAI. Trang cua DAI dung duong dan tuong doi;
   trang cua thanh vien khac tro toi ban GitHub Pages cua nhanh main.
   ===================================================== */
var DUONG_DAN_TRANG = {
  "403": "403.html",
  "404": "404.html",
  "admin-dashboard": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DUC/admin-dashboard.html",
  "admin-platform-settings": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DUC/admin-platform-settings.html",
  "admin-report-center": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DUC/admin-report-center.html",
  "admin-trip-management": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DUC/admin-trip-management.html",
  "admin-user-management": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DUC/admin-user-management.html",
  "coordinator-demand-heatmap": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DUC/coordinator-demand-heatmap.html",
  "coordinator-mobility-dashboard": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DUC/coordinator-mobility-dashboard.html",
  "coordinator-pickup-zone-management": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DUC/coordinator-pickup-zone-management.html",
  "coordinator-report-center": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DUC/coordinator-report-center.html",
  "coordinator-trip-detail": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DUC/coordinator-trip-detail.html",
  "driver-join-requests": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/driver-join-requests.html",
  "driver-schedule": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/driver-schedule.html",
  "driver-trip-create": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/driver-trip-create.html",
  "driver-trip-detail": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/driver-trip-detail.html",
  "forgot-password": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/forgot-password.html",
  "index": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/index.html",
  "login": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/login.html",
  "notifications": "notifications.html",
  "profile": "profile.html",
  "register": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/register.html",
  "reset-password": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/reset-password.html",
  "rider-match-results": "rider-match-results.html",
  "rider-my-trips": "rider-my-trips.html",
  "rider-trip-detail": "rider-trip-detail.html",
  "rider-trip-search": "rider-trip-search.html",
  "settings": "settings.html",
};

function duongDanTrang(slug) {
  return DUONG_DAN_TRANG[slug] || (slug + ".html");
}
