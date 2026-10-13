/* =====================================================
   Kiểm tra nhanh prototype CommuteMatch (3 thư mục thành viên):
   Với mỗi thư mục HIEU / DAI / DUC kiểm tra:
   1. Đủ README.md, assets/, js/duong-dan.js
   2. Mỗi .html có đủ css/<trang>.css, js/<trang>.js và HTML nhúng đúng
   3. Liên kết href/src nội bộ (kể cả liên kết chéo ../X/...) trỏ tới file có thật
   4. Các id mà JS gọi (getElementById) có tồn tại trong HTML không
   5. Trang mà JS điều hướng tới (h/denTrang/duongDanTrang("slug")) có tồn tại không
   Chạy:  node tools/check.js
   ===================================================== */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const THU_MUC = ["HIEU", "DAI", "DUC"];

let loi = 0;
let canhBao = 0;

function baoLoi(msg) { loi++; console.log("  [LỖI] " + msg); }
function baoCanhBao(msg) { canhBao++; console.log("  [Cảnh báo] " + msg); }

/* Bảng trang -> thư mục thành viên */
const thuMucCua = {};
for (const tv of THU_MUC) {
  const base = path.join(ROOT, tv);
  if (!fs.existsSync(base)) { baoLoi("thiếu thư mục " + tv); continue; }
  for (const f of fs.readdirSync(base)) {
    if (f.endsWith(".html")) thuMucCua[f.slice(0, -".html".length)] = tv;
  }
}
const tatCaTrang = Object.keys(thuMucCua);

for (const tv of THU_MUC) {
  const base = path.join(ROOT, tv);
  if (!fs.existsSync(base)) continue;

  console.log("\n=== " + tv + " ===");
  if (!fs.existsSync(path.join(base, "README.md"))) baoLoi(tv + ": thiếu README.md");
  if (!fs.existsSync(path.join(base, "assets"))) baoLoi(tv + ": thiếu thư mục assets/");
  if (!fs.existsSync(path.join(base, "js", "duong-dan.js"))) baoLoi(tv + ": thiếu js/duong-dan.js");

  const cacTrang = fs
    .readdirSync(base)
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.slice(0, -".html".length))
    .sort();

  for (const trang of cacTrang) {
    const fileHtml = path.join(base, trang + ".html");
    const fileCss = path.join(base, "css", trang + ".css");
    const fileJs = path.join(base, "js", trang + ".js");

    const html = fs.readFileSync(fileHtml, "utf8");
    console.log("- " + trang);

    if (!fs.existsSync(fileCss)) baoLoi("thiếu css/" + trang + ".css");
    if (!fs.existsSync(fileJs)) baoLoi("thiếu js/" + trang + ".js");

    /* HTML phải nhúng đúng css/js của trang và bảng đường dẫn chung */
    if (!html.includes('href="css/' + trang + '.css"')) baoLoi("HTML không liên kết css/" + trang + ".css");
    if (!html.includes('src="js/' + trang + '.js"')) baoLoi("HTML không nhúng js/" + trang + ".js");
    if (!html.includes('src="js/duong-dan.js"')) baoLoi("HTML không nhúng js/duong-dan.js");

    /* Kiểm tra mọi đường dẫn nội bộ trong href/src (tương đối theo thư mục thành viên) */
    const duongDan = html.match(/(?:href|src)="([^"]+)"/g) || [];
    for (const d of duongDan) {
      const giaTri = d.slice(d.indexOf('"') + 1, -1);
      if (/^(https?:|mailto:|#|javascript:)/.test(giaTri)) continue;
      if (!/\.(html|css|js)$/.test(giaTri)) continue;
      if (!fs.existsSync(path.resolve(base, giaTri))) baoLoi("liên kết hỏng: " + giaTri);
    }

    /* Các id mà JS cần phải có trong HTML */
    if (fs.existsSync(fileJs)) {
      const js = fs.readFileSync(fileJs, "utf8");
      const idCan = new Set();
      const reId = /getElementById\(\s*"([^"]+)"\s*\)/g;
      let khop;
      while ((khop = reId.exec(js)) !== null) idCan.add(khop[1]);
      for (const id of idCan) {
        if (!html.includes('id="' + id + '"')) baoLoi("JS cần id=\"" + id + "\" nhưng HTML không có");
      }

      /* Các mốc (hook) mà JS bám vào */
      if (/"#mainNav"|getElementById\("mainNav"\)/.test(js) && !html.includes("mainNav")) {
        baoLoi("JS cần phần tử id=\"mainNav\" nhưng HTML không có");
      }
      if (/getElementById\("toast"\)/.test(js) && !html.includes('id="toast"')) {
        baoLoi("JS cần phần tử id=\"toast\" nhưng HTML không có");
      }
      /* Có nút mở hộp thoại thì phải có hộp thoại tương ứng */
      const nutMo = html.match(/data-modal="([^"]+)"/g) || [];
      for (const n of nutMo) {
        const ten = n.slice(n.indexOf('"') + 1, -1);
        if (!html.includes('id="' + ten + '"')) baoLoi("nút mở hộp thoại \"" + ten + "\" nhưng không có hộp thoại đó");
      }
      if (nutMo.length && !html.includes("modal-backdrop")) baoLoi("có nút data-modal nhưng thiếu khung .modal-backdrop");
      if (!nutMo.length && html.includes("modal-backdrop")) baoCanhBao("có .modal-backdrop nhưng không có nút nào mở nó");

      /* Trang phải khai báo data-page để JS dựng đúng menu theo vai trò */
      if (/dataset\.page/.test(js) && !html.includes("data-page=")) {
        baoLoi("HTML thiếu thuộc tính data-page (JS dùng để dựng menu)");
      }

      /* Mốc thao tác: data-viec (HIEU) / data-action (DAI, DUC) */
      if (/data-viec/.test(js) && !html.includes("data-viec")) baoLoi("JS xử lý data-viec nhưng HTML không có nút nào");
      if (/data-action/.test(js) && !html.includes("data-action")) baoLoi("JS xử lý data-action nhưng HTML không có nút nào");
      if (/data-modal/.test(js) && !html.includes("data-modal")) baoLoi("JS xử lý data-modal nhưng HTML không có nút nào");

      /* Trang mà JS điều hướng tới phải tồn tại ở một trong 3 thư mục */
      const reDen = /(?:h|denTrang|duongDanTrang)\(\s*"([^"]+)"\s*\)/g;
      while ((khop = reDen.exec(js)) !== null) {
        if (!thuMucCua[khop[1]]) baoLoi("JS chuyển tới trang \"" + khop[1] + "\" nhưng không tồn tại trang đó");
      }
    }
  }
}

console.log("\n================ KẾT QUẢ ================");
console.log("Tổng số trang: " + tatCaTrang.length + "   Lỗi: " + loi + "   Cảnh báo: " + canhBao);
