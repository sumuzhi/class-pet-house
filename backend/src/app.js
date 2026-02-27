const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件（宠物图片）
app.use('/动物图片', express.static(path.join(__dirname, '../../assets/pets')));

// API 路由
const authRoutes = require('./routes/auth');
const classRoutes = require('./routes/classes');
const studentRoutes = require('./routes/students');
const groupRoutes = require('./routes/groups');
const historyRoutes = require('./routes/history');
const shopRoutes = require('./routes/shop');
const scoreRuleRoutes = require('./routes/scoreRules');
const exportRoutes = require('./routes/export');
const adminRoutes = require('./routes/admin');
const { router: syncRouter } = require('./routes/sync');
const { requireActivated } = require('./middleware/auth');

app.use('/api/auth', authRoutes);
app.use('/api/classes', requireActivated, classRoutes);
app.use('/api/students', requireActivated, studentRoutes);
app.use('/api/groups', requireActivated, groupRoutes);
app.use('/api/history', requireActivated, historyRoutes);
app.use('/api/shop', requireActivated, shopRoutes);
app.use('/api/score-rules', requireActivated, scoreRuleRoutes);
app.use('/api/export', requireActivated, exportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sync', requireActivated, syncRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

module.exports = app;
