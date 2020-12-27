const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token)
      return status(400).json({ msg: '로그인이나 회원가입이 필요합니다.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
