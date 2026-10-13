# CommuteMatch – Thư mục thành viên DAI

Gồm các trang của hành khách (tìm chuyến, kết quả ghép, chuyến của tôi, chi tiết chuyến) và các trang hệ thống (403, 404, thông báo, hồ sơ, cài đặt).

## Cấu trúc

```
DAI/
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
  hoặc `npx http-server`) rồi mở `http://localhost:8080/rider-trip-search.html`.
- Hoặc mở trực tiếp `rider-trip-search.html` bằng trình duyệt. Liên kết chéo sang trang của
  thành viên khác là đường dẫn tuyệt đối tới bản GitHub Pages của nhánh `main`,
  nên cần repo đã bật Pages để nhảy chéo giữa các branch.

## Danh sách trang

| File | Chức năng |
|---|---|
| `rider-trip-search.html` | Tìm chuyến đi phù hợp |
| `rider-match-results.html` | Kết quả ghép chuyến |
| `rider-my-trips.html` | Danh sách chuyến của hành khách |
| `rider-trip-detail.html` | Chi tiết chuyến (góc nhìn hành khách) |
| `403.html` | Lỗi 403 – không có quyền truy cập |
| `404.html` | Lỗi 404 – không tìm thấy trang |
| `notifications.html` | Trung tâm thông báo |
| `profile.html` | Hồ sơ cá nhân, đổi vai trò |
| `settings.html` | Cài đặt tài khoản |
