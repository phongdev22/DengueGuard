````markdown
# 🚀 HƯỚNG DẪN CHẠY SERVER FASTAPI

## 1️⃣ Cài đặt môi trường

Trước khi chạy server, đảm bảo bạn đã:

-   Cài đặt **Python (>= 3.7)**
-   Cài đặt các thư viện cần thiết bằng lệnh:
    ```shell
    pip install -r requirements.txt
    ```
````

## 2️⃣ Chạy server bằng Uvicorn

Chạy FastAPI với lệnh sau:

```shell
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 🔹 Giải thích các tham số

| Tham số          | Giải thích                                                               |
| ---------------- | ------------------------------------------------------------------------ |
| `app:app`        | File `app.py` (tên file) và biến `app = FastAPI()` (đối tượng FastAPI)   |
| `--host 0.0.0.0` | Cho phép truy cập từ mọi IP (cần thiết khi deploy)                       |
| `--port 8000`    | Chạy server trên cổng 8000 (có thể thay đổi)                             |
| `--reload`       | Tự động tải lại server khi code thay đổi (_chỉ dùng cho môi trường dev_) |

📌 **Ví dụ:** Nếu file của bạn tên `main.py`:

```shell
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## 3️⃣ Truy cập API

Sau khi khởi chạy thành công, truy cập các địa chỉ sau:

-   Trang chủ API: [http://127.0.0.1:8000](http://127.0.0.1:8000)

```

🔔 **Tips:**
- Để dừng server: Nhấn `Ctrl + C` trong terminal
- Kiểm tra phiên bản Python: `python --version`
- Tạo file requirements.txt: `pip freeze > requirements.txt`
```
