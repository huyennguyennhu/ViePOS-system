# ☕ ViePOS - Hệ thống Quản lý Hoạt động Kinh doanh F&B
### Giải pháp quản lý bán hàng và kho nguyên liệu tối ưu cho mô hình F&B vừa và nhỏ

---

## 📌 Giới thiệu

ViePOS là hệ thống quản lý tích hợp được thiết kế chuyên biệt cho các quán cà phê và cơ sở F&B quy mô vừa và nhỏ. Dự án tập trung giải quyết các thách thức trong vận hành như: sai sót khi quản lý thủ công, thất thoát nguyên vật liệu và áp lực tuân thủ quy định về hóa đơn điện tử. Với triết lý "Vừa - Đủ - Tinh gọn", ViePOS cung cấp quy trình số hóa từ khâu Order đến quản lý kho đa tầng theo định mức (BOM).

> 📚 Đồ án môn học: Phân tích & Thiết kế Hệ thống Thông tin - 252BIM5022

## 👥 Nhóm thực hiện

| STT | Tên thành viên |
|---|---|
| 1 | Ma Thị Thu Hà |
| 2 | Nguyễn Như Huyền |
| 3 | Vũ Minh Nhật |
| 4 | Nguyễn Linh Yến Nhi |
| 5 | Trần Quang Vũ |

---

## 🎯 Mục tiêu

- **Số hóa quy trình bán hàng (POS):** Tiếp nhận Order, thanh toán và chuyển lệnh pha chế thời gian thực.
- **Quản lý kho chuyên sâu:** Theo dõi vòng đời nguyên vật liệu từ kho thô đến bán thành phẩm.
- **Tối ưu định mức (BOM):** Tự động trừ kho dựa trên công thức chế biến (Hybrid BOM) để kiểm soát hao hụt.
- **Hỗ trợ quản trị:** Cung cấp báo cáo doanh thu, tồn kho và cảnh báo ngưỡng an toàn/hạn sử dụng.

---

## 📁 Cấu trúc dự án
```
ViePOS-system/
│
├── data/                        # Dữ liệu (tải từ Kaggle)
│   ├── train.csv
│   ├── test.csv
│   ├── features.csv
│   └── stores.csv
│
├── code/
│   └── walmart_forecasting.ipynb   # Notebook chính (đầy đủ pipeline)
│
├── report/
│   └── walmart_forecasting_report.pdf   # Báo cáo đồ án
│
└── README.md
```

---

## 🔄 Pipeline
```
Thu thập dữ liệu (Kaggle)
        ↓
Khám phá dữ liệu (EDA)
        ↓
Tiền xử lý & Aggregate theo tuần
        ↓
Phân tích Time Series (STL, ACF/PACF, ADF/KPSS)
        ↓
Feature Engineering (25 đặc trưng)
        ↓
Huấn luyện & So sánh mô hình
  ├── Holt-Winters
  ├── ARIMA (Grid Search AIC)
  └── XGBoost
        ↓
Tinh chỉnh Hyperparameter
        ↓
Retrain + Recursive Forecast (39 tuần)
        ↓
Phân loại nhu cầu & Kế hoạch tồn kho
```

---

## 📊 Dữ liệu

**Nguồn:** [Walmart Sales Forecast – Kaggle](https://www.kaggle.com/datasets/aslanahmedov/walmart-sales-forecast)

| File | Mô tả | Kích thước |
|---|---|---|
| `train.csv` | Doanh thu lịch sử (2/2010 – 10/2012) | 421,570 dòng |
| `test.csv` | 39 tuần cần dự báo | 115,064 dòng |
| `features.csv` | Biến ngoại sinh (nhiệt độ, CPI, MarkDown...) | 8,190 dòng |
| `stores.csv` | Thông tin 45 cửa hàng | 45 dòng |

---

## 🧪 Kết quả mô hình

### So sánh sau tinh chỉnh Hyperparameter

| Department | Holt-Winters MAPE | ARIMA MAPE | XGBoost MAPE |
|---|---|---|---|
| Dept 92 | 2.71% | 4.85% | **2.89%** |
| Dept 95 | 2.71% | 4.06% | **1.71%** |
| Dept 38 | 5.63% | 6.50% | **3.61%** |

> ✅ **XGBoost được chọn** làm mô hình triển khai cho cả 3 Department dựa trên chỉ số RMSE.

### Tham số XGBoost tốt nhất

| Department | n_estimators | learning_rate | max_depth | RMSE |
|---|---|---|---|---|
| Dept 92 | 500 | 0.05 | 5 | 122,190 |
| Dept 95 | 500 | 0.05 | 5 | 90,132 |
| Dept 38 | 700 | 0.02 | 6 | 120,531 |

---

## 💡 Kết quả chính

- **Dept 92:** Nhu cầu cao tập trung tháng 11–2, đỉnh tuần 21/12 (+30% vs baseline)
- **Dept 95:** Nhu cầu cao vào mùa hè (tháng 6–7), thấp vào cuối năm
- **Dept 38:** Nhu cầu cao tháng 1–4, chỉ 2 tuần Low Demand (23/11 và 28/12)
- Phát hiện cơ hội **tái phân bổ vốn tồn kho nội bộ** từ Dept 92 sang Dept 95 từ tháng 3–5
