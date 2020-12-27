const User = require('../models/userModel');

const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).exec();
    if (user.role === 0) {
      return res.status(400).json({
        msg: '권한이 없습니다.',
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authAdmin;
