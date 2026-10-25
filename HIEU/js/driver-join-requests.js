/* =====================================================
   CommuteMatch — Trang "Yêu cầu tham gia" (phần JS của HIEU)
   Chức năng:
   1. Lấy yêu cầu vào các chuyến của tài xế từ MockApi
   2. Bấm dải lọc: chỉ một mục được sáng, lọc theo trạng thái
   3. Duyệt / từ chối yêu cầu (lưu qua MockApi, tự trừ ghế + báo hành khách)
   4. Hiện thông báo nhanh (toast) sau mỗi thao tác
   ===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    /* ---------- Nhãn nhỏ gắn trên thẻ yêu cầu ---------- */
    function nhanTrangThai(chu, loai) {
        return '<span class="cm-badge ' + (loai || "") + '">' + chu + "</span>";
    }

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
    var nhomTab = document.getElementById("nhomTab");
    var dsYeuCau = document.getElementById("dsYeuCau");
    var tatCa = []; // mọi yêu cầu vào chuyến của tài xế
    var locHienTai = "pending";
    var TEN_TAB = { pending: "Đang chờ", accepted: "Đã duyệt", rejected: "Đã từ chối" };

    /* Hành khách hủy được tính chung vào nhóm "Đã từ chối" */
    function thuocNhom(r, loc) {
        return r.trangThai === loc || (loc === "rejected" && r.trangThai === "cancelled");
    }

    /* Một thẻ yêu cầu */
    function theYeuCau(r, viTri) {
        var hk = r.hanhKhach;
        var hanhDong;
        if (r.trangThai === "pending") {
            hanhDong =
                '<button class="btn cm-btn cm-btn-danger btn-sm" data-viec="tu-choi" data-id="' + r.id + '">Từ chối</button>' +
                '<button class="btn cm-btn cm-btn-gradient btn-sm" data-viec="duyet" data-id="' + r.id + '">Duyệt yêu cầu</button>';
        } else if (r.trangThai === "accepted") {
            hanhDong = nhanTrangThai("Đã duyệt");
        } else if (r.trangThai === "cancelled") {
            hanhDong = nhanTrangThai("Hành khách đã hủy", "cm-badge-red");
        } else {
            hanhDong = nhanTrangThai("Đã từ chối", "cm-badge-red");
        }

        return '<div class="col-12"><article class="cm-card cm-yeu-cau">' +
            '<div class="cm-card-head"><div class="cm-person">' +
            '<span class="cm-person-avatar' + (viTri % 2 ? " cm-vang" : "") + '">' + dd.vietTat(hk.hoTen) + "</span>" +
            "<div><strong>" + dd.html(hk.hoTen) + "</strong>" +
            '<p class="mb-0 cm-subtitle small">' + dd.diem(hk.danhGia) + "/5 · " + hk.soChuyen + " chuyến · " +
            r.chuyen.ma + " " + dd.html(r.chuyen.diemDi) + " → " + dd.html(r.chuyen.diemDen) + "</p></div>" +
            "</div>" +
            '<span class="cm-ai"><i class="bi bi-stars"></i> Phù hợp ' + r.diemPhuHop + "%</span></div>" +
            '<p class="mb-1"><strong>Điểm đón:</strong> ' + dd.html(r.diemDon) + " · lệch tuyến " + r.lechTuyen + " phút</p>" +
            (r.loiNhan ? '<p class="cm-subtitle fst-italic">“' + dd.html(r.loiNhan) + "”</p>"
                : '<p class="cm-subtitle">Không có lời nhắn.</p>') +
            '<div class="cm-actions">' + hanhDong + "</div>" +
            "</article></div>";
    }

    function veDanhSach() {
        nhomTab.querySelectorAll("[data-loc]").forEach(function(tab) {
            var loc = tab.dataset.loc;
            tab.textContent = TEN_TAB[loc] + " " + tatCa.filter(function(r) { return thuocNhom(r, loc); }).length;
            tab.classList.toggle("active", loc === locHienTai);
        });

        var ds = tatCa.filter(function(r) { return thuocNhom(r, locHienTai); });
        dsYeuCau.innerHTML = ds.length ? ds.map(theYeuCau).join("") :
            '<div class="col-12"><p class="cm-subtitle">Không có yêu cầu nào ở mục "' + TEN_TAB[locHienTai] + '".</p></div>';
    }

    function taiDuLieu() {
        return MockApi.layYeuCau({ taiXeId: taiXe.id })
            .then(function(ds) {
                tatCa = ds;
                var maChuyen = [];
                ds.forEach(function(r) {
                    if (r.trangThai === "pending" && maChuyen.indexOf(r.chuyen.ma) < 0) maChuyen.push(r.chuyen.ma);
                });
                document.getElementById("phuDe").textContent = maChuyen.length ?
                    "Duyệt hành khách vào chuyến " + maChuyen.join(", ") + "." :
                    "Hiện không có yêu cầu nào đang chờ duyệt.";
                veDanhSach();
            })
            .catch(function(loi) {
                hienThongBao(loi.message);
            });
    }

    /* ---------- Bấm dải lọc ---------- */
    nhomTab.addEventListener("click", function(e) {
        var tab = e.target.closest(".cm-tab");
        if (!tab) return;
        locHienTai = tab.dataset.loc || "pending";
        veDanhSach();
    });

    /* ---------- Duyệt / từ chối yêu cầu ---------- */
    document.addEventListener("click", function(e) {
        var nut = e.target.closest("[data-viec]");
        if (!nut) return;
        var viec = nut.dataset.viec;

        if (viec === "duyet" || viec === "tu-choi") {
            /* Khóa nút trong lúc chờ MockApi, xong thì tải lại danh sách */
            var the = nut.closest(".cm-yeu-cau");
            the.querySelectorAll("button").forEach(function(b) { b.disabled = true; });

            var goi = viec === "duyet" ? MockApi.duyetYeuCau(nut.dataset.id) : MockApi.tuChoiYeuCau(nut.dataset.id);
            goi.then(function() {
                    hienThongBao(viec === "duyet" ? "Đã duyệt yêu cầu" : "Đã từ chối yêu cầu");
                    return taiDuLieu();
                })
                .catch(function(loi) {
                    the.querySelectorAll("button").forEach(function(b) { b.disabled = false; });
                    hienThongBao(loi.message);
                });
        }
    });

    taiDuLieu();
});