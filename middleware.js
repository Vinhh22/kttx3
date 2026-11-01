const jwt = require('jsonwebtoken');

// Secret key dùng để ký và giải mã JWT
const SECRET_KEY = 'my_super_secret_key_123';

// Middleware xác thực JWT
const xacThuc = (req, res, next) => {
  // 1. Lấy chuỗi Authorization từ headers
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Không có token xác thực, truy cập bị từ chối!'
    });
  }

  // 2. Tách định dạng "Bearer <token>" nếu có
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc bị trống!'
    });
  }

  // 3. Sử dụng jwt.verify() để kiểm tra tính hợp lệ của token
  jwt.verify(token, SECRET_KEY, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn!'
      });
    }

    // Gắn thông tin người dùng đã giải mã vào req để các route sau có thể dùng
    req.user = decodedUser;
    next();
  });
};

module.exports = {
  xacThuc,
  SECRET_KEY
};

