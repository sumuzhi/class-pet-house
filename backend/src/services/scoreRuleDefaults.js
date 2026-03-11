const { Class, ScoreRule } = require('../models');
const { DEFAULT_SCORE_RULES } = require('../constants/defaultScoreRules');

async function ensureDefaultScoreRulesForClass(classId, options = {}) {
  const { transaction } = options;
  const count = await ScoreRule.count({
    where: { class_id: classId },
    transaction
  });

  if (count > 0) return 0;

  const rows = DEFAULT_SCORE_RULES.map((rule, index) => ({
    class_id: classId,
    ...rule,
    is_system: true,
    sort_order: index
  }));

  await ScoreRule.bulkCreate(rows, { transaction });
  return rows.length;
}

async function backfillDefaultScoreRulesForAllClasses(options = {}) {
  const { transaction } = options;
  const classes = await Class.findAll({
    attributes: ['id'],
    transaction
  });

  let classCount = 0;
  let ruleCount = 0;

  for (const cls of classes) {
    const inserted = await ensureDefaultScoreRulesForClass(cls.id, { transaction });
    if (inserted > 0) {
      classCount += 1;
      ruleCount += inserted;
    }
  }

  return { classCount, ruleCount };
}

module.exports = {
  ensureDefaultScoreRulesForClass,
  backfillDefaultScoreRulesForAllClasses
};
