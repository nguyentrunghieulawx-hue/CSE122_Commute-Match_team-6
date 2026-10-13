# CommuteMatch – Thư mục thành viên DUC

Gồm các trang của điều phối viên (coordinator) và quản trị viên (admin).

## Cấu trúc

```
DUC/
├── <ten-trang>.html   ← các trang đặt trực tiếp ở gốc thư mục
├── css/
│   └── <ten-trang>.css
├── js/
│   ├── duong-dan.js   ← bảng đường dẫn dùng chung giữa 3 thư mục
│   └── <ten-trang>.js
├── assets/            ← tài nguyên tĩnh (ảnh, font…)
└── README.md
```

## Cách chạy

- Khuyến nghị: chạy server tĩnh từ **gốc thư mục này (gốc branch)** (Live Server của VS Code
  hoặc `npx http-server`) rồi mở `http://localhost:8080/admin-dashboard.html`.
- Hoặc mở trực tiếp `admin-dashboard.html` bằng trình duyệt. Liên kết chéo sang trang của
  thành viên khác là đường dẫn tuyệt đối tới bản GitHub Pages của nhánh `main`,
  nên cần repo đã bật Pages để nhảy chéo giữa các branch.

## Danh sách trang

| File | Chức năng |
|---|---|
| `coordinator-mobility-dashboard.html` | Tổng quan điều phối |
| `coordinator-demand-heatmap.html` | Bản đồ nhiệt nhu cầu |
| `coordinator-pickup-zone-management.html` | Quản lý điểm đón |
| `coordinator-report-center.html` | Trung tâm báo cáo (điều phối) |
| `coordinator-trip-detail.html` | Chi tiết chuyến (góc nhìn điều phối) |
| `admin-dashboard.html` | Tổng quan quản trị |
| `admin-user-management.html` | Quản lý người dùng |
| `admin-trip-management.html` | Quản lý chuyến đi |
| `admin-report-center.html` | Trung tâm báo cáo (quản trị) |
| `admin-platform-settings.html` | Cấu hình nền tảng |
