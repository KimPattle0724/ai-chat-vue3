import service from '@/utils/request'
// 注册
export function register(data) {
  return service.post('/user/add', data)
}
// 新建会话
export function startSession(data) {
  return service.post('/psychological-chat/session/start', data)
}
// 获取会话列表
export function getSessionList(params) {
  return service.get('/psychological-chat/sessions', {params})
}
// 获取会话详情
export function deleteSessionDetail(sessionId) {
  return service.delete(`/psychological-chat/sessions/${sessionId}`)
}
// 获取会话消息
export function getSessionMessages(sessionId) {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
// 发送消息
export function sendMessage(data) {
  return service.post('/psychological-chat/stream', data)
}
// 获取会话情感分析
export function getSessionEmotion(sessionId) {
  return service.get(`/psychological-chat/session/${sessionId}/emotion`)
}
// 提交情感日记
export function submitEmotionDiary(data) {
  return service.post('/emotion-diary', data)
}
// 获取知识文章列表
export function getKnowledgeArticleList(params) {
  return service.get('/knowledge/article/page', {params})
}
// 获取知识文章详情
export function getKnowledgeArticleDetail(id) {
  return service.get(`/knowledge/article/${id}`)
}
