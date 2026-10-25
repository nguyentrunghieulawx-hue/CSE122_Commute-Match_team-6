document.addEventListener("DOMContentLoaded", function() {

    var MENU = {
        rider: [
            ["rider-trip-search", "Tìm chuyến"],
            ["rider-match-results", "Gợi ý phù hợp"],
            ["rider-my-trips", "Chuyến của tôi"]
        ],
        driver: [
            ["driver-schedule", "Lịch chuyến"],
            ["driver-trip-create", "Tạo chuyến"],
            ["driver-join-requests", "Yêu cầu"]
        ],
        coordinator: [
            ["coordinator-mobility-dashboard", "Tổng quan"],
            ["coordinator-demand-heatmap", "Nhu cầu AI"],
            ["coordinator-report-center", "Báo cáo"],
            ["coordinator-pickup-zone-management", "Điểm đón"]
        ],
        admin: [
            ["admin-dashboard", "Tổng quan"],
            ["admin-user-management", "Người dùng"],
            ["admin-trip-management", "Chuyến đi"],
            ["admin-report-center", "Báo cáo"],
            ["admin-platform-settings", "Cấu hình"]
        ]
    };

    var trangHienTai = document.body.dataset.trang || "";
    var trangCongKhai = ["index", "login", "register"];
    var h = document.getElementById("cmNav");
    var dS = MENU[localStorage.getItem("cmRole")] || MENU.rider;

    if (h && trangCongKhai.indexOf(trangHienTai) < 0) {
        h.innerHTML = dS.map(function(m) {
            return '<li class="nav-item"><a class="nav-link cm-nav-link' + (m[0] === trangHienTai ? " active" : "") + '" href="' + duongDanTrang(m[0]) + '">' + m[1] + "</a></li>";
        }).join("");
    }
});