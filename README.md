Script duyệt cả 3 thư mục và báo: trang thiếu css/js, HTML thiếu nhúng file,
liên kết hỏng (kể cả liên kết chéo `../`), id mà JS cần nhưng HTML không có,
và trang đích của các lời gọi điều hướng.

## Các nhánh (branch) trên GitHub

| Branch | Nội dung |
|---|---|
| `main` | Bản tích hợp đầy đủ: 3 thư mục `HIEU/`, `DAI/`, `DUC/` + `tools/`. Đây là nhánh dùng để bật GitHub Pages. |
| `HIEU` | Project riêng của HIEU đặt tại gốc branch (html + `css/` + `js/` + `assets/` + `README.md`). |
| `DAI` | Project riêng của DAI, cấu trúc tương tự. |
| `DUC` | Project riêng của DUC, cấu trúc tương tự. |

Trên 3 branch thành viên, liên kết nội bộ giữ nguyên dạng tương đối nên chạy
được khi mở local; liên kết chéo sang trang của thành viên khác là đường dẫn
tuyệt đối tới bản triển khai GitHub Pages của nhánh `main`, nên vẫn nhảy đúng
trang đích khi xem từng branch riêng lẻ.

## GitHub Pages

1. Vào repo → **Settings → Pages**.
2. Mục *Build and deployment*: Source = **Deploy from a branch**, Branch = **`main`**, Folder = **`/ (root)`** → Save.
3. Link chạy toàn bộ website (tự chuyển hướng vào `HIEU/index.html`):
   `https://nguyentrunghieulawx-hue.github.io/CSE122_Commute-Match_team-6/`
