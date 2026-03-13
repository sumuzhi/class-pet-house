const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const COS = require('cos-nodejs-sdk-v5');
const sanitize = require('./middleware/sanitize');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitize);

// 速率限制：认证接口
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: '请求过于频繁，请稍后再试' }
});
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/reset-password', authLimiter);

// 静态文件（宠物图片）- 从 COS 读取
const COS_SECRET_ID = (process.env.COS_SECRET_ID || '').trim();
const COS_SECRET_KEY = (process.env.COS_SECRET_KEY || '').trim();
const COS_BUCKET = (process.env.COS_BUCKET || '').trim();
const COS_REGION = (process.env.COS_REGION || '').trim();
const COS_KEY_PREFIX = (process.env.COS_KEY_PREFIX || '').replace(/^\/+|\/+$/g, '');
const COS_CACHE_MAX_AGE = Number(process.env.COS_CACHE_MAX_AGE || 60 * 60 * 24 * 7);

const cos = COS_SECRET_ID && COS_SECRET_KEY && COS_BUCKET && COS_REGION
  ? new COS({ SecretId: COS_SECRET_ID, SecretKey: COS_SECRET_KEY })
  : null;

function buildCosKey(requestPath) {
  const decoded = decodeURIComponent(requestPath || '/');
  const cleaned = path.posix.normalize(`/${decoded}`).replace(/^\/+/, '');
  if (!cleaned || cleaned.startsWith('..')) return null;
  return COS_KEY_PREFIX ? `${COS_KEY_PREFIX}/${cleaned}` : cleaned;
}

async function fetchCosObject(req, res) {
  
  if (!cos) {
    res.status(500).json({ error: 'COS 未配置' });
    return;
  }

  const key = buildCosKey(req.path);
  if (!key) {
    res.status(400).json({ error: '资源路径非法' });
    return;
  }

  const range = req.headers.range;

  cos.getObject(
    {
      Bucket: COS_BUCKET,
      Region: COS_REGION,
      Key: key,
      Range: range
    },
    (err, data) => {
      if (err) {
        const status = err.statusCode || (err.error && err.error.statusCode) || 500;
        if (status === 404) {
          res.status(404).json({ error: '资源不存在' });
          return;
        }
        res.status(status).json({ error: 'COS 读取失败' });
        return;
      }

      if (data && data.headers) {
        const headers = data.headers;
        if (headers['content-type']) res.set('Content-Type', headers['content-type']);
        if (headers['content-length']) res.set('Content-Length', headers['content-length']);
        if (headers['etag']) res.set('ETag', headers['etag']);
        if (headers['last-modified']) res.set('Last-Modified', headers['last-modified']);
      }

      res.set('Cache-Control', `public, max-age=${COS_CACHE_MAX_AGE}`);
      if (data && data.statusCode) res.status(data.statusCode);

      if (data && data.Body) {
        if (typeof data.Body.pipe === 'function') {
          data.Body.pipe(res);
        } else {
          res.end(data.Body);
        }
      } else {
        res.end();
      }
    }
  );
}

app.use('/pet-images', fetchCosObject);
app.use('/动物图片', fetchCosObject);

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
const aiRoutes = require('./routes/ai');
const publicRoutes = require('./routes/public');

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/score-rules', scoreRuleRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sync', syncRouter);
app.use('/api/ai', aiRoutes);
app.use('/api/public', publicRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 生产环境：serve前端静态文件
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
  // SPA fallback：所有非API请求返回index.html
  app.get(/(.*)/, (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    }
  });
}

module.exports = app;
