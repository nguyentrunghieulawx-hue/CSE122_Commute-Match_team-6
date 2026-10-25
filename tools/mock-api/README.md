# CommuteMatch – Mock API

Prototype dùng **một MockApi chung** cho cả 3 thư mục HIEU / DAI / DUC:

```
js/mock-api.js            ← MockApi + dữ liệu mẫu (nguồn duy nhất)
tools/mock-api/           ← (tuỳ chọn) json-server dùng cùng bộ dữ liệu đó
tools/test-mock-api.js    ← kiểm thử MockApi bằng Node
```

## 1. Chế độ mặc định: lưu trong trình duyệt (không cần cài gì)

- Mọi trang đã nhúng `<script src="../js/mock-api.js"></script>` (trước JS riêng của trang).
- Dữ liệu được lưu vào `localStorage` (khoá `cm_mockdb_v1`), giữ nguyên khi tải lại trang
  hoặc chuyển trang. Cách này chạy được khi mở file trực tiếp, với Live Server và trên **GitHub Pages**.
- Đặt lại dữ liệu mẫu: mở Console (F12) rồi gõ `MockApi.datLaiDuLieu()`, sau đó tải lại trang.

### Tài khoản demo (mật khẩu chung `12345678`)

| Vai trò | Email |
|---|---|
| Hành khách | hanhkhach@example.com |
| Người chia sẻ xe | taixe@example.com |
| Điều phối viên | dieuphoi@example.com |
| Quản trị viên | admin@example.com |
| (bị khoá – để thử lỗi) | hoangnam@example.com |

Ở trang đăng nhập, bấm nút vai trò sẽ tự điền tài khoản demo của vai trò đó.
Nếu mở thẳng một trang mà chưa đăng nhập, trang sẽ dùng tài khoản demo theo vai trò của trang
(ví dụ trang `driver-*` dùng tài khoản tài xế).

## 2. Chế độ json-server (tuỳ chọn, chỉ chạy trên máy)

```bash
cd tools/mock-api
npm install
npm start          # tự tạo db.json từ dữ liệu mẫu nếu chưa có, chạy ở http://localhost:3000
npm run reset      # đưa db.json về dữ liệu mẫu ban đầu
```

Bật chế độ này cho trang web: mở Console rồi gõ `MockApi.dungMayChu("http://localhost:3000")`
và tải lại trang. Gõ `MockApi.dungTrinhDuyet()` để quay về chế độ mặc định.

- Ở chế độ này dữ liệu **được ghi vào `db.json`**, kể cả khi thêm, sửa hay xoá.
- **GitHub Pages không chạy được json-server.** Trên web public, hãy dùng chế độ mặc định.
- Các endpoint json-server cung cấp sẵn: `/users`, `/trips`, `/joinRequests`, `/notifications`,
  hỗ trợ `GET`, `POST`, `PATCH`, `DELETE` và lọc kiểu `?taiXeId=u002`.
  Thống kê không có endpoint riêng, mà được tính trong `MockApi.layThongKe()` từ dữ liệu thật.

## 3. Các hàm MockApi (đều trả về Promise)

| Nhóm | Hàm |
|---|---|
| Phiên | `xacThuc(email, matKhau)`, `batDauPhien(user)`, `layPhien(vaiTro?)`, `dangXuat()`, `taiKhoanDemo(vaiTro)` |
| Người dùng | `dangKy({...})`, `kiemTraEmail(email)`, `layNguoiDung()`, `layNguoiDungTheoId(id)`, `taoNguoiDung({...})`, `capNhatNguoiDung(id, thayDoi)` |
| Chuyến | `layChuyen({taiXeId, trangThai})`, `layChuyenTheoId(id)`, `timChuyen({diemDi, diemDen, ngay, gio, soCho})`, `taoChuyen({...})`, `capNhatChuyen(id, thayDoi)` |
| Yêu cầu tham gia | `layYeuCau({taiXeId, hanhKhachId, chuyenId, trangThai})`, `guiYeuCau({...})`, `duyetYeuCau(id)`, `tuChoiYeuCau(id)`, `huyYeuCau(id)`, `danhGiaChuyen(id, sao, nhanXet)` |
| Thông báo | `layThongBao(nguoiNhanId)`, `demThongBaoChuaDoc(id)`, `danhDauDaDoc(id)`, `danhDauTatCaDaDoc(nguoiNhanId)`, `xoaThongBao(id)` |
| Thống kê | `layThongKe()` |
| Định dạng | `MockApi.dinhDang.tien / ngayNgan / thu / diem / vietTat / tuongDoi / vaiTro / html` |

Lỗi nghiệp vụ, chẳng hạn sai mật khẩu, hết chỗ hay email trùng, trả về `reject(Error)` kèm thông điệp tiếng Việt.
Trang chỉ cần `.catch(function (loi) { toast(loi.message); })`.

Ví dụ:

```js
MockApi.layChuyen({ taiXeId: MockApi.layPhien("driver").id })
  .then(function (ds) { console.log(ds); })
  .catch(function (loi) { alert(loi.message); });
```

## 4. Trang đã nối MockApi

| Thư mục | Trang | Dùng MockApi để |
|---|---|---|
| HIEU | login | Kiểm tra email, mật khẩu và tài khoản bị khoá, rồi lưu phiên theo vai trò thật |
| HIEU | register | Kiểm tra email trùng, rồi tạo tài khoản sau bước OTP |
| HIEU | driver-trip-create | Lưu chuyến mới (sinh mã CM-xxxx) |
| HIEU | driver-schedule | Hiện số liệu và danh sách chuyến của tài xế, lưu trữ chuyến đã xong |
| HIEU | driver-join-requests | Lọc theo trạng thái, duyệt hoặc từ chối (tự trừ ghế và báo cho hành khách) |
| DAI | rider-trip-search → rider-match-results | Tìm chuyến theo điểm đi/đến, lọc giá, sắp xếp, gửi yêu cầu tham gia |
| DAI | rider-my-trips | Xem yêu cầu theo trạng thái, huỷ chuyến (trả lại ghế), đánh giá |
| DAI | notifications | Xem thông báo của người đang đăng nhập, đánh dấu đã đọc, xoá |
| DUC | admin-dashboard | Số liệu và biểu đồ tính từ dữ liệu |
| DUC | admin-user-management | Tìm, lọc, thêm, sửa, khoá hoặc mở khoá người dùng |
| DUC | admin-trip-management | Tìm, lọc, xem chi tiết, gỡ cờ, lưu trữ chuyến |

Mọi trang có nút chuông và avatar trên thanh đầu trang đều tự hiện số thông báo chưa đọc và chữ viết tắt
của người dùng hiện tại. Các trang còn lại vẫn giữ nội dung tĩnh như trước.

## 5. Kiểm thử

```bash
node tools/test-mock-api.js   # kiểm thử nghiệp vụ MockApi (không cần trình duyệt)
node tools/check.js           # kiểm tra liên kết và id của các trang
```
