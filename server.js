const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { xacThuc, SECRET_KEY } = require('./middleware');

const app = express();
const PORT = 3000;

// Cấu hình CORS: Cho phép Client React (chạy ở cổng 5173) truy cập API
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Đọc body dạng JSON
app.use(express.json());

// 1. API Đăng nhập (POST /login)
app.post('/login', (req, res) => {
  const { email, matKhau } = req.body;

  // Kiểm tra tài khoản hardcode theo yêu cầu đề bài
  if (email === 'admin@gmail.com' && matKhau === '123456') {
    // Tạo token JWT có thời hạn 1 giờ
    const token = jwt.sign(
      { email, role: 'admin' },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      token
    });
  }

  // Nếu thông tin đăng nhập sai
  return res.status(401).json({
    success: false,
    message: 'Email hoặc mật khẩu không chính xác!'
  });
});

// 2. API Sản phẩm bảo mật (GET /api/products)
// Route này được bảo vệ bởi middleware xacThuc
app.get('/api/products', xacThuc, (req, res) => {
  // Danh sách sản phẩm mẫu theo đề bài
  const products = [
    { id: 1, name: 'Bút bi Thiên Long', price: 5000, category: 'Văn phòng phẩm' },
    { id: 2, name: 'Vở kẻ ngang 200 trang', price: 15000, category: 'Tập vở' },
    { id: 3, name: 'Thước kẻ 20cm Deli', price: 8000, category: 'Dụng cụ học tập' },
    { id: 4, name: 'Compa học sinh', price: 25000, category: 'Dụng cụ học tập' },
    { id: 5, name: 'Hộp bút vải đa năng', price: 45000, category: 'Phụ kiện' }
  ];

  return res.status(200).json({
    success: true,
    data: products
  });
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});

