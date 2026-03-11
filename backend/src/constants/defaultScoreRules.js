const DEFAULT_SCORE_RULES = [
  { name: '早读打卡', icon: '📖', value: 1 },
  { name: '作业优秀', icon: '⭐', value: 3 },
  { name: '课堂表现好', icon: '🙋', value: 2 },
  { name: '帮助同学', icon: '🤝', value: 2 },
  { name: '考试进步', icon: '📈', value: 5 },
  { name: '值日认真', icon: '🧹', value: 1 },
  { name: '运动达标', icon: '🏃', value: 2 },
  { name: '迟到', icon: '⏰', value: -1 },
  { name: '未交作业', icon: '📝', value: -2 },
  { name: '课堂违纪', icon: '🚫', value: -2 },
  { name: '打架', icon: '👊', value: -5 },
  { name: '说脏话', icon: '🤐', value: -1 },
  { name: '不守纪律', icon: '⚠️', value: -1 },
  { name: '损坏公物', icon: '💔', value: -3 }
];

module.exports = {
  DEFAULT_SCORE_RULES
};
