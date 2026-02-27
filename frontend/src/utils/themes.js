// 主题颜色映射
export const THEMES = [
  { id: 'pink', name: '粉红', colors: { accent: '#f472b6', bg: '#fdf2f8', text: '#9d174d' } },
  { id: 'blue', name: '天蓝', colors: { accent: '#60a5fa', bg: '#eff6ff', text: '#1e40af' } },
  { id: 'green', name: '草绿', colors: { accent: '#4ade80', bg: '#f0fdf4', text: '#166534' } },
  { id: 'purple', name: '紫色', colors: { accent: '#a78bfa', bg: '#f5f3ff', text: '#5b21b6' } },
  { id: 'orange', name: '橙色', colors: { accent: '#fb923c', bg: '#fff7ed', text: '#9a3412' } },
  { id: 'red', name: '红色', colors: { accent: '#f87171', bg: '#fef2f2', text: '#991b1b' } },
  { id: 'teal', name: '青色', colors: { accent: '#2dd4bf', bg: '#f0fdfa', text: '#115e59' } },
  { id: 'yellow', name: '金色', colors: { accent: '#facc15', bg: '#fefce8', text: '#854d0e' } },
]

export function getTheme(id) {
  return THEMES.find(t => t.id === id) || THEMES[0]
}
