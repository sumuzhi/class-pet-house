const router = require('express').Router();
const { ScoreRule, Class } = require('../models');
const auth = require('../middleware/auth');
const { requireActivated } = require('../middleware/auth');
const { DEFAULT_SCORE_RULES } = require('../constants/defaultScoreRules');
const { ensureDefaultScoreRulesForClass } = require('../services/scoreRuleDefaults');

function isSystemDefaultRule(rule) {
  if (rule.is_system) return true;
  return DEFAULT_SCORE_RULES.some((d) =>
    d.name === rule.name &&
    d.icon === rule.icon &&
    Number(d.value) === Number(rule.value)
  );
}

// 获取班级积分规则
router.get('/class/:classId', auth, requireActivated, async (req, res) => {
  try {
    const cls = await Class.findOne({
      where: { id: req.params.classId, user_id: req.userId }
    });
    if (!cls) return res.status(404).json({ error: '班级不存在' });

    let rules = await ScoreRule.findAll({
      where: { class_id: cls.id },
      order: [['sort_order', 'ASC']]
    });

    if (!rules.length) {
      await ensureDefaultScoreRulesForClass(cls.id);
      rules = await ScoreRule.findAll({
        where: { class_id: cls.id },
        order: [['sort_order', 'ASC']]
      });
    }

    // 为历史数据自动补齐系统默认标记，避免误删
    const needMark = rules.filter(r => !r.is_system && isSystemDefaultRule(r));
    if (needMark.length) {
      await Promise.all(needMark.map(r => r.update({ is_system: true })));
    }

    res.json(rules.map(r => ({
      ...r.toJSON(),
      is_system: isSystemDefaultRule(r)
    })));
  } catch (err) {
    res.status(500).json({ error: '获取失败' });
  }
});

// 添加积分规则
router.post('/', auth, requireActivated, async (req, res) => {
  try {
    const { class_id, name, icon, value } = req.body;
    const cls = await Class.findOne({ where: { id: class_id, user_id: req.userId } });
    if (!cls) return res.status(404).json({ error: '班级不存在' });
    if (!name || typeof name !== 'string' || !name.trim() || value === undefined) {
      return res.status(400).json({ error: '名称和分值不能为空，分值不能为0' });
    }
    if (!Number.isInteger(Number(value)) || Number(value) === 0) {
      return res.status(400).json({ error: '名称和分值不能为空，分值不能为0' });
    }

    const count = await ScoreRule.count({ where: { class_id } });
    if (count >= 50) return res.status(400).json({ error: '最多创建50条规则' });
    const rule = await ScoreRule.create({
      class_id,
      name: name.trim(),
      icon: icon || '⭐',
      value: Number(value),
      is_system: false,
      sort_order: count
    });
    res.json(rule);
  } catch (err) {
    res.status(500).json({ error: '添加失败' });
  }
});

// 更新积分规则
router.put('/:id', auth, requireActivated, async (req, res) => {
  try {
    const rule = await ScoreRule.findByPk(req.params.id);
    if (!rule) return res.status(404).json({ error: '规则不存在' });

    const cls = await Class.findOne({ where: { id: rule.class_id, user_id: req.userId } });
    if (!cls) return res.status(403).json({ error: '无权限' });

    const { name, icon, value, sort_order } = req.body;
    if (name !== undefined && (!name || typeof name !== 'string' || !name.trim())) {
      return res.status(400).json({ error: '规则名称不能为空' });
    }
    if (value !== undefined && (!Number.isInteger(Number(value)) || Number(value) === 0)) {
      return res.status(400).json({ error: '分值必须是非0整数' });
    }
    await rule.update({
      ...(name !== undefined && { name: name.trim() }),
      ...(icon !== undefined && { icon }),
      ...(value !== undefined && { value: Number(value) }),
      ...(sort_order !== undefined && { sort_order })
    });
    res.json(rule);
  } catch (err) {
    res.status(500).json({ error: '更新失败' });
  }
});

// 删除积分规则
router.delete('/:id', auth, requireActivated, async (req, res) => {
  try {
    const rule = await ScoreRule.findByPk(req.params.id);
    if (!rule) return res.status(404).json({ error: '规则不存在' });

    const cls = await Class.findOne({ where: { id: rule.class_id, user_id: req.userId } });
    if (!cls) return res.status(403).json({ error: '无权限' });

    if (isSystemDefaultRule(rule)) {
      return res.status(400).json({ error: '系统默认规则不允许删除' });
    }

    await rule.destroy();
    res.json({ message: '删除成功' });
  } catch (err) {
    res.status(500).json({ error: '删除失败' });
  }
});

module.exports = router;
