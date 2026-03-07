const router = require('express').Router();
const { Class, Student, Group, ScoreRule } = require('../models');

// 获取基于分享码的班级公共信息
router.get('/:share_code/class', async (req, res) => {
    try {
        const { share_code } = req.params;
        if (!share_code) return res.status(400).json({ error: '无效的分享码' });

        const cls = await Class.findOne({
            where: { share_code },
            attributes: ['id', 'name', 'theme', 'growth_stages', 'system_name']
        });

        if (!cls) return res.status(404).json({ error: '班级不存在或分享链接已失效' });

        // 获取学生和分组信息 (不返回敏感信息)
        const students = await Student.findAll({
            where: { class_id: cls.id },
            attributes: ['id', 'name', 'food_count', 'group_id', 'pet_type', 'pet_name', 'badges'],
            order: [['id', 'ASC']]
        });

        const groups = await Group.findAll({
            where: { class_id: cls.id },
            order: [['sort_order', 'ASC']]
        });

        res.json({
            classInfo: cls,
            students,
            groups
        });
    } catch (err) {
        console.error('获取公共班级信息失败:', err);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取排行榜数据
router.get('/:share_code/leaderboard', async (req, res) => {
    try {
        const { share_code } = req.params;
        if (!share_code) return res.status(400).json({ error: '无效的分享码' });

        const cls = await Class.findOne({ where: { share_code } });
        if (!cls) return res.status(404).json({ error: '班级不存在或分享链接已失效' });

        const students = await Student.findAll({
            where: { class_id: cls.id },
            attributes: ['id', 'name', 'food_count', 'pet_type', 'pet_name', 'badges']
        });

        // 排序逻辑：先比食物，再比名字
        students.sort((a, b) => {
            if (b.food_count !== a.food_count) {
                return b.food_count - a.food_count;
            }
            return a.name.localeCompare(b.name, 'zh-Hans-CN');
        });

        res.json(students);
    } catch (err) {
        res.status(500).json({ error: '获取排行榜失败' });
    }
});

module.exports = router;
