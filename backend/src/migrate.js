const { sequelize } = require('./models');

async function migrate() {
    try {
        console.log('⏳ 正在连接数据库...');
        await sequelize.authenticate();
        console.log('✅ 数据库连接成功');

        console.log('⏳ 正在同步数据库架构 (alter: true)...');
        // 使用 alter: true 可以在不删除数据的情况下补齐缺失的字段（如 share_code）
        await sequelize.sync({ alter: true });

        console.log('✅ 数据库同步完成！所有字段已就绪。');
        process.exit(0);
    } catch (err) {
        console.error('❌ 同步失败:', err);
        process.exit(1);
    }
}

migrate();
