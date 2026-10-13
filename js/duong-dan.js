/* =====================================================
   Bang duong dan toi toan bo trang cua prototype CommuteMatch,
   phien ban branch HIEU. Trang cua HIEU dung duong dan tuong doi;
   trang cua thanh vien khac tro toi ban GitHub Pages cua nhanh main.
   ===================================================== */
var DUONG_DAN_TRANG = {
  "403": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/403.html",
  "404": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/404.html",
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
  "driver-join-requests": "driver-join-requests.html",
  "driver-schedule": "driver-schedule.html",
  "driver-trip-create": "driver-trip-create.html",
  "driver-trip-detail": "driver-trip-detail.html",
  "forgot-password": "forgot-password.html",
  "index": "index.html",
  "login": "login.html",
  "notifications": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/notifications.html",
  "profile": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/profile.html",
  "register": "register.html",
  "reset-password": "reset-password.html",
  "rider-match-results": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/rider-match-results.html",
  "rider-my-trips": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/rider-my-trips.html",
  "rider-trip-detail": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/rider-trip-detail.html",
  "rider-trip-search": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/rider-trip-search.html",
  "settings": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/settings.html",
};

function duongDanTrang(slug) {
  return DUONG_DAN_TRANG[slug] || (slug + ".html");
}
