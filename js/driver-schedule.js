/* =====================================================
   CommuteMatch — Trang "Lịch chuyến" (phần JS của HIEU)
   Menu thu gọn đã có Bootstrap lo, ở đây còn:
   1. Lấy chuyến của tài xế từ MockApi, dựng 4 ô số liệu + danh sách
   2. Hiện thông báo nhanh (toast) sau mỗi thao tác
   3. Nút "Lưu trữ" chuyến đã xong: ẩn khỏi lịch (lưu qua MockApi)
   4. Các nút có data-viec="luu": báo đã cập nhật
   ===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    /* ---------- Thông báo nhanh ở góc màn hình ---------- */
    var hopThongBao = document.getElementById("cmToast");

    function hienThongBao(noiDung) {
        if (!hopThongBao) return;
        hopThongBao.textContent = noiDung || "Đã cập nhật thành công";
        hopThongBao.classList.add("cm-toast-hien");
        setTimeout(function() {
            hopThongBao.classList.remove("cm-toast-hien");
        }, 2300);
    }

    /* ---------- Dữ liệu từ MockApi ---------- */
    var dd = MockApi.dinhDang;
    var taiXe = MockApi.layPhien("driver");
    var dsChuyen = document.getElementById("dsChuyen");

    /* Một dòng chuyến trong danh sách */
    function dongChuyen(c, soYeuCauMoi) {
        var sapToi = c.trangThai === "upcoming";
        var daDat = c.tongSoGhe - c.soGheConLai;
        var moTa = dd.ngayNgan(c.ngayKhoiHanh) + " · " + c.gioKhoiHanh + " · ";
        moTa += sapToi
            ? daDat + "/" + c.tongSoGhe + " chỗ đã đặt" + (soYeuCauMoi ? " · " + soYeuCauMoi + " yêu cầu mới" : "")
            : daDat + " hành khách";

        var nut = sapToi
            ? '<a class="btn cm-btn cm-btn-outline btn-sm" href="driver-trip-detail.html">Chi tiết</a>' +
              '<a class="btn cm-btn cm-btn-gradient btn-sm" href="driver-join-requests.html">Duyệt yêu cầu</a>'
            : '<a class="btn cm-btn cm-btn-outline btn-sm" href="driver-trip-detail.html">Xem lại</a>' +
              '<button class="btn cm-btn cm-btn-soft btn-sm" data-viec="luu-tru" data-id="' + c.id + '">Lưu trữ</button>';

        return '<div class="cm-row">' +
            '<div class="cm-row-main">' +
            (sapToi ? '<span class="cm-badge">Sắp khởi hành</span>' : '<span class="cm-badge cm-badge-gray">Hoàn thành</span>') +
            '<h3 class="mt-2 mb-1">' + dd.html(c.diemDi) + " → " + dd.html(c.diemDen) +
            ' <small class="text-muted fw-normal">' + c.ma + "</small></h3>" +
            "<p>" + moTa + "</p>" +
            "</div>" +
            '<div class="cm-actions">' + nut + "</div>" +
            "</div>";
    }

    function taiDuLieu() {
        return Promise.all([
            MockApi.layChuyen({ taiXeId: taiXe.id }),
            MockApi.layYeuCau({ taiXeId: taiXe.id, trangThai: "pending" }),
            MockApi.layNguoiDungTheoId(taiXe.id)
        ]).then(function(kq) {
            var chuyen = kq[0].filter(function(c) { return c.trangThai !== "archived"; });
            var choDuyet = kq[1];
            var hoSo = kq[2];

            var sapToi = chuyen.filter(function(c) { return c.trangThai === "upcoming"; });
            var daXong = chuyen.filter(function(c) { return c.trangThai === "completed"; }).reverse();
            var thangNay = new Date().toISOString().slice(0, 7);
            var homNay = new Date().toISOString().slice(0, 10);

            /* 4 ô số liệu */
            document.getElementById("soSapToi").textContent = sapToi.length;
            document.getElementById("soChoDuyet").textContent = choDuyet.length;
            document.getElementById("ghiChuChoDuyet").textContent =
                choDuyet.filter(function(r) { return String(r.ngayGui).slice(0, 10) === homNay; }).length + " yêu cầu mới hôm nay";
            document.getElementById("soThangNay").textContent =
                chuyen.filter(function(c) { return c.ngayKhoiHanh.slice(0, 7) === thangNay; }).length;
            document.getElementById("soDanhGia").textContent = hoSo ? dd.diem(hoSo.danhGia) : "—";

            /* Danh sách: sắp tới trước, đã xong sau */
            var demYeuCau = {};
            choDuyet.forEach(function(r) { demYeuCau[r.chuyenId] = (demYeuCau[r.chuyenId] || 0) + 1; });

            var html = sapToi.concat(daXong).map(function(c) { return dongChuyen(c, demYeuCau[c.id]); }).join("");
            dsChuyen.innerHTML = html ||
                '<p class="cm-subtitle mb-0">Bạn chưa đăng chuyến nào. Bấm "Tạo chuyến mới" để bắt đầu.</p>';
        }).catch(function(loi) {
            hienThongBao(loi.message);
        });
    }

    /* ---------- Một đầu xử lý click chung cho cả trang ---------- */
    /* Mọi nút thao tác đều gắn thuộc tính data-viec="..." */
    document.addEventListener("click", function(e) {
        var nut = e.target.closest("[data-viec]");
        if (!nut) return;

        if (nut.dataset.viec === "luu-tru") {
            nut.disabled = true;
            MockApi.capNhatChuyen(nut.dataset.id, { trangThai: "archived" })
                .then(function() {
                    hienThongBao("Đã lưu trữ chuyến");
                    return taiDuLieu();
                })
                .catch(function(loi) {
                    nut.disabled = false;
                    hienThongBao(loi.message);
                });
        } else if (nut.dataset.viec === "luu") {
            hienThongBao();
        }
    });

    taiDuLieu();
});
