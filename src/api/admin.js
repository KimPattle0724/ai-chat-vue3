import request from '@/utils/request'

// 登录
export const login = (data) => {
  return request.post('/user/login', data)
}

// 获取分类树
export const getCategoryTree = () => {
  return request.get('/knowledge/category/tree')
}

// 文章分页
export const articlePage = (params) => {
  return request.get('/knowledge/article/page', { params })
}

// 上传文件
export function uploadFile(file, businessInfo) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessField', 'cover')

  return request.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
 // 创建文章
export const createArticle = (data) => {
  return request.post('/knowledge/article', data)
}
// 获取文章详情
export function getArticleDetail(id) {
  return request.get(`/knowledge/article/${id}`)
}

export function updateArticle(id, data) {
  return request.put(`/knowledge/article/${id}`, data)
}

// 更新文章状态
export function changeArticleStatus(id, data) {
  return request.put(`/knowledge/article/${id}/status`, data)
}

// 删除文章
export function deleteArticle(id) {
  return request.delete(`/knowledge/article/${id}`)
}
// 获取咨询记录
export function getConsultationPages(params) {
  return request.get('/psychological-chat/sessions', { params })
}
// 获取咨询记录详情
export function getConsultationDetail(sessionId) {
  return request.get(`/psychological-chat/sessions/${sessionId}/messages`)}

  // 情感分析分页
export function getEmotionalPages(params) {
  return request.get('/emotion-diary/admin/page', { params })
}
// 删除情感分析
export function deleteEmotional(id) {
  return request.delete(`/emotion-diary/admin/${id}`)
}
// 获取情感分析统计
export function getEmotionalOverview() {
  return request.get('/data-analytics/overview')
}
// 退出登录
export function logout() {
  return request.post('/user/logout')
}
