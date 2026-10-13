/* =====================================================
   Bang duong dan toi toan bo trang cua prototype CommuteMatch,
   phien ban branch DUC. Trang cua DUC dung duong dan tuong doi;
   trang cua thanh vien khac tro toi ban GitHub Pages cua nhanh main.
   ===================================================== */
var DUONG_DAN_TRANG = {
  "403": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/403.html",
  "404": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/404.html",
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
  "driver-join-requests": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/driver-join-requests.html",
  "driver-schedule": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/driver-schedule.html",
  "driver-trip-create": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/driver-trip-create.html",
  "driver-trip-detail": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/driver-trip-detail.html",
  "forgot-password": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/forgot-password.html",
  "index": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/index.html",
  "login": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/login.html",
  "notifications": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/notifications.html",
  "profile": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/profile.html",
  "register": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/register.html",
  "reset-password": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/HIEU/reset-password.html",
  "rider-match-results": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/rider-match-results.html",
  "rider-my-trips": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/rider-my-trips.html",
  "rider-trip-detail": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/rider-trip-detail.html",
  "rider-trip-search": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/rider-trip-search.html",
  "settings": "https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/DAI/settings.html",
};

function duongDanTrang(slug) {
  return DUONG_DAN_TRANG[slug] || (slug + ".html");
}
