# 📁 Cấu trúc thư mục dự án ViePOS (Angular)

## 🚀 Hướng dấn thiết lập nhanh (Dành cho thành viên mới)

Nếu bạn vừa nhận project này và chưa có `node_modules` hay cơ sở dữ liệu, hãy làm theo các bước sau.

> [!IMPORTANT]
> **Yêu cầu:** Đã cài đặt **Docker Desktop** trên máy.

### 1. Thiết lập Backend & Cơ sở dữ liệu
Mở terminal tại thư mục gốc của dự án:
```powershell
cd backend
npm install
npm run import  # Lệnh này sẽ tự khởi động Docker & Import dữ liệu SQL Server
```

### 2. Thiết lập Frontend
Mở một terminal khác (tại thư mục gốc):
```powershell
npm install
```

---
Khi đã có CSDL rồi thì chỉ cần chạy lệnh sau, còn nếu có chỉnh sửa dữ liệu trong các file csv cần chạy lại npm run import


## 🛠️ Cách chạy ứng dụng

### Bước 1: Chạy Backend (Bắt buộc để có dữ liệu)
```powershell
cd backend
npm start
```

### Bước 2: Chạy Frontend (Chọn một trong các cách sau)

*   **Phân hệ Bán hàng (User):** 
`npm run start:user` (Mở tại `http://localhost:4200`)
*   **Phân hệ Quản trị (Admin):** 
`npm run start:admin` (Mở tại `http://localhost:4201`)

---

## 🏗️ Tổng quan cấp cao nhất

```
ViePOS/
└── src/
    └── app/
        ├── admin/
        ├── user/
        ├── core/
        ├── shared/
        ├── app-routing.module.ts
        ├── app.module.ts
        └── app.component.*
```

### 🔹 Giải thích

* **admin/**: Phân hệ quản trị (Admin)
* **user/**: Phân hệ người dùng/POS bán hàng
* **core/**: Logic & service dùng chung toàn hệ thống
* **shared/**: Thành phần giao diện dùng lại
* **app-routing.module.ts**: Điều hướng cấp ứng dụng (`/admin`, `/user`)

---

## 🛠️ Phân hệ Admin (Quản trị hệ thống)

```
admin/
├── admin.module.ts
├── admin-routing.module.ts
│
├── layout/
│   ├── admin-layout/
│   ├── header/
│   └── sidebar/
│
├── dashboard/
├── report/
├── invoice/
├── product/
├── staff/
├── category/
├── inventory/
└── settings/
```

### 📌 Chức năng tổng quát

> Quản lý toàn bộ hoạt động của quán: doanh thu, sản phẩm, nhân viên, kho, cấu hình

---

### 🧱 layout/ – Khung giao diện Admin

```
layout/
├── admin-layout/
├── header/
└── sidebar/
```

* **admin-layout/**: Component bọc toàn bộ giao diện admin
* **header/**: Thanh tiêu đề (tên hệ thống, tài khoản, logout)
* **sidebar/**: Menu điều hướng các trang admin

👉 Layout được dùng chung cho tất cả trang admin

---

### 📊 dashboard/ – Trang Tổng quan

```
dashboard/
├── dashboard.module.ts
├── dashboard-routing.module.ts
└── pages/
    └── dashboard/
```

* Hiển thị số liệu tổng quan: doanh thu hôm nay, số đơn, tồn kho thấp…
* Là **trang mặc định** khi vào `/admin`

---

### 📈 report/ – Trang Báo cáo

```
report/
├── report.module.ts
├── report-routing.module.ts
└── pages/
    └── report-list/
```

* Báo cáo doanh thu theo ngày/tháng
* Thống kê sản phẩm bán chạy

---

### 🧾 invoice/ – Trang Hóa đơn

```
invoice/
├── invoice.module.ts
├── invoice-routing.module.ts
└── pages/
    ├── invoice-list/
    └── invoice-detail/
```

* Xem danh sách hóa đơn
* Xem chi tiết từng hóa đơn

---

### 🛍️ product/ – Trang Sản phẩm

```
product/
├── product.module.ts
├── product-routing.module.ts
└── pages/
    ├── product-list/
    └── product-form/
```

* Quản lý sản phẩm (thêm/sửa/xóa)
* Gán giá, hình ảnh, danh mục

---

### 👥 staff/ – Trang Nhân viên

```
staff/
├── staff.module.ts
├── staff-routing.module.ts
└── pages/
    ├── staff-list/
    └── staff-form/
```

* Quản lý nhân viên
* Phân quyền (admin, thu ngân…)

---

### 🗂️ category/ – Trang Mặt hàng / Danh mục

```
category/
├── category.module.ts
├── category-routing.module.ts
└── pages/
    ├── category-list/
    └── category-form/
```

* Quản lý danh mục sản phẩm (Cafe, Trà, Topping…)

---

### 📦 inventory/ – Trang Kho hàng

```
inventory/
├── inventory.module.ts
├── inventory-routing.module.ts
└── pages/
    ├── inventory-list/
    └── stock-adjust/
```

* Theo dõi tồn kho
* Điều chỉnh nhập/xuất kho

---

### ⚙️ settings/ – Trang Thiết lập

```
settings/
├── settings.module.ts
├── settings-routing.module.ts
└── pages/
    └── settings/
```

* Cấu hình hệ thống
* Thông tin cửa hàng, thuế, đơn vị tiền

---

## 👤 Phân hệ User (POS bán hàng)

```
user/
├── user.module.ts
├── user-routing.module.ts
└── order/
    ├── order.module.ts
    ├── order-routing.module.ts
    └── pages/
        └── order-page/
```

### 🔹 Chức năng

* Giao diện bán hàng tại quầy
* Tạo đơn, chọn sản phẩm, thanh toán

---

## 🔧 core/ – Dùng chung toàn hệ thống

```
core/
└── services/
    ├── auth.service.ts
    ├── order.service.ts
    ├── product.service.ts
    └── report.service.ts
```

* Xử lý logic nghiệp vụ
* Giao tiếp backend / API
* Admin và User **cùng dùng chung**

---

## ♻️ shared/ – Thành phần dùng lại

```
shared/
├── components/
├── pipes/
└── directives/
```

* Button, modal, table dùng chung
* Pipe format tiền, ngày tháng

---
