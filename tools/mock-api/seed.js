/* =====================================================
   Tạo / đặt lại db.json cho json-server từ dữ liệu mẫu trong ../../js/mock-api.js
   → chế độ trình duyệt và chế độ json-server dùng CHUNG một bộ dữ liệu.
   Chạy:  node seed.js            (chỉ tạo khi chưa có db.json)
          node seed.js --reset    (ghi đè, đưa dữ liệu về như ban đầu)
   ===================================================== */

const fs = require("fs");
const path = require("path");

const FILE_DB = path.join(__dirname, "db.json");
const { DU_LIEU_MAU } = require("../../js/mock-api.js");

const datLai = process.argv.includes("--reset");

if (fs.existsSync(FILE_DB) && !datLai) {
  console.log("db.json đã có sẵn, giữ nguyên dữ liệu. (Dùng --reset để đặt lại.)");
} else {
  fs.writeFileSync(FILE_DB, JSON.stringify(DU_LIEU_MAU, null, 2) + "\n", "utf8");
  console.log((datLai ? "Đã đặt lại" : "Đã tạo") + " db.json: " +
    Object.keys(DU_LIEU_MAU).map((k) => DU_LIEU_MAU[k].length + " " + k).join(", "));
}
