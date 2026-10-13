# CommuteMatch – Thư mục thành viên HIEU

Gồm các trang xác thực (trang chủ, đăng nhập, đăng ký, quên mật khẩu, đặt lại mật khẩu) và các trang của tài xế – người chia sẻ xe.

## Cấu trúc

```
HIEU/
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
  hoặc `npx http-server`) rồi mở `http://localhost:8080/index.html`.
- Hoặc mở trực tiếp `index.html` bằng trình duyệt. Liên kết chéo sang trang của
  thành viên khác là đường dẫn tuyệt đối tới bản GitHub Pages của nhánh `main`,
  nên cần repo đã bật Pages để nhảy chéo giữa các branch.

## Danh sách trang

| File | Chức năng |
|---|---|
| `index.html` | Trang chủ, điểm vào prototype |
| `login.html` | Đăng nhập theo vai trò |
| `register.html` | Đăng ký tài khoản |
| `forgot-password.html` | Quên mật khẩu |
| `reset-password.html` | Đặt lại mật khẩu |
| `driver-schedule.html` | Lịch chuyến của tài xế |
| `driver-trip-create.html` | Tạo chuyến đi mới |
| `driver-join-requests.html` | Duyệt yêu cầu tham gia chuyến |
| `driver-trip-detail.html` | Chi tiết chuyến (góc nhìn tài xế) |
