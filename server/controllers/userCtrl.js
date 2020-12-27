const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const user = await User.findOne({ email });
      if (user)
        return res.status(400).json({
          msg: '이메일이 사용중입니다.',
        });
      if (password.length < 6)
        return res.status(400).json({
          msg: '비밀번호는 6자리 이상입니다.',
        });
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: passwordHash,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      const rfToken = jwt.sign({ id: newUser._id }, process.env.RFJWT_SECRET, {
        expiresIn: '7d',
      });
      res.cookie('rfToken', rfToken, {
        httpOnly: true,
        path: '/api/user/rftoken',
      });

      res.json({ token });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).exec();
      if (!user) return res.status(400).json({ msg: '유저 정보가 없습니다.' });

      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: '비밀 번호가 틀렸습니다.' });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      const rfToken = jwt.sign({ id: user._id }, process.env.RFJWT_SECRET, {
        expiresIn: '7d',
      });
      res.cookie('rfToken', rfToken, {
        httpOnly: true,
        path: '/api/user/rftoken',
      });

      res.json({ token });
    } catch (error) {
      next(error);
    }
  },
  logout: (req, res, next) => {
    try {
      res.clearCookie('rfToken', { path: '/api/user/rftoken' });
      return res.json({ msg: 'logout success' });
    } catch (error) {
      next(error);
    }
  },
  rfToken: (req, res, next) => {
    try {
      const rfToken = req.cookies.rfToken;
      if (!rfToken)
        return res.status(400).json({
          msg: '로그인이나 회원가입이 필요합니다.',
        });
      const decoded = jwt.verify(rfToken, process.env.RFJWT_SECRET);
      const token = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      res.json({ token });
    } catch (error) {
      next(error);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select('-password').exec();
      if (!user) return res.status(400).json({ msg: '유저정보가 없습니다.' });

      res.json(user);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userCtrl;
