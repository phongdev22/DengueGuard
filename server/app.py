from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import uvicorn
from pydantic import BaseModel
import os

# Khởi tạo FastAPI
app = FastAPI()
# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Chấp nhận tất cả nguồn gốc (có thể thay bằng ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],  # Chấp nhận tất cả phương thức (GET, POST, PUT, DELETE,...)
    allow_headers=["*"],  # Chấp nhận tất cả headers
)

# Thư mục chứa các model
MODEL_DIR = "models/"

# Tự động lấy danh sách model từ thư mục
MODEL_PATHS = {f.split(".")[0]: os.path.join(MODEL_DIR, f) for f in os.listdir(MODEL_DIR) if f.endswith(".pth")}

# Định nghĩa input cho API
class PredictRequest(BaseModel):
    code: str  # Mã tỉnh/thành (VD: "hanoi", "cantho", ...)
    totalRainfall: float
    nRainingDays: float
    averageTemperature: float
    minHumidity: float
    nHoursSunshine: float

@app.get("/")
def home():
    return {"message": "Hello, world!"}

@app.post("/predict")
def predict(data: PredictRequest):
    try:
        # Kiểm tra xem tỉnh thành có được hỗ trợ không
        if data.code not in MODEL_PATHS:
            raise HTTPException(status_code=400, detail="Chưa hỗ trợ tỉnh thành này")
        
        model_path = MODEL_PATHS[data.code]

        # Load model
        model = torch.load(model_path, map_location=torch.device('cpu'))
        model.eval()

        # Chuyển dữ liệu vào tensor
        input_tensor = torch.tensor([[data.totalRainfall, data.nRainingDays]], dtype=torch.float32)

        # Dự đoán
        with torch.no_grad():
            prediction = model(input_tensor).item()

        return {"code": 0 , "prediction": prediction}
    except Exception as e:
        return {"code": 1, "error": str(e)}
    

# Chạy server
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
