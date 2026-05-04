<template>  
  <div>
    <PageHead title="咨询记录" />
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="会话ID" width="100">
        <template #default="scope">
          <el-avatar></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪标签" >
        <template #default="scope">
          <div class="session-title">
            {{ scope.row.sessionTitle }}
          </div>
          <div class="session-preview">
            {{ scope.row.lastMessageContent }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数" width="100"/>
      <el-table-column prop="lastMessageTime" label="创建时间" width="100"/>
      <el-table-column label="情绪标签" width="100">
        <template #default="scope">
          <el-button type="primary" text @click="viewSessionDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 25px;"
      :total="pagination.total"
      :page-size="pagination.size"
      @change="handleChange"
      layout="prev, pager, next"
    />
    <el-dialog
      v-model="showDetailDialog"
      title="会话详情"
      width="70%"
    >
    <div class="session-detail">
      <div class="session-detail-header">
        <div class="detail-row">
          <div class="detail-row">用户ID：</div>
          <div class="detail-value">{{ sessionDetail.userNickname }}</div>
          <div class="detail-value"></div>
        </div>
        <div class="detail-row">
          <div class="detail-row">创建时间：</div>
          <div class="detail-value">{{ sessionDetail.startedAt }}</div>
          <div class="detail-value"></div>
        </div>
        <div class="detail-row">
          <div class="detail-row">消息数：</div>
          <div class="detail-value">{{ sessionDetail.messageCount }}</div>
          <div class="detail-value"></div>
        </div>
      </div>
      <div class="messages-container">
        <div class="messages-header">
          <h4>消息列表</h4>
        </div>
        <div class="messages-list">
          <div v-for="message in sessionMessages" :key="message.id" class="message-item" :class="message.senderType ===1 ? 'user-message' : 'ai-message'">
            <div class="messages-header" >
              <span class="sender">{{ message.senderType ===1 ? '用户' : 'AI' }}</span>
              <span class="time">{{ message.createdAt }}</span>
            </div>
            <div class="messages-content">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="showDetailDialog = false">关闭</el-button>
    </template>
       </el-dialog>
  </div>
</template>
<script setup>
import PageHead from '@/components/PageHead.vue'
import { getConsultationPages, getConsultationDetail } from '@/api/admin'
import { ref, reactive, onMounted } from 'vue'

const tableData = ref([])

const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
})
// 会话详情
const sessionDetail = ref({})
const sessionMessages = ref([])
// 加载中
const loadingMessages = ref(false)
// 查看会话详情
const viewSessionDetail = (row) => {
  loadingMessages.value = true
  showDetailDialog.value = true
  getConsultationDetail(row.id).then(res => {
    loadingMessages.value = false
    sessionMessages.value = res
    sessionDetail.value = row
  })
}

// 分页
const handleChange = (data) => {
  pagination.currentPage = data
  handleSearch()
}

// 搜索咨询记录
const handleSearch = () => {
    getConsultationPages(pagination).then(res => {
    const { records, total } = res
    tableData.value = records
    pagination.total = total
   })
}

// 显示会话详情弹窗
const showDetailDialog = ref(false)

onMounted(() => {
  handleSearch()
})
</script>
<style scoped>
.session-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  .session-preview {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .session-detail {
    max-height: 70vh;
    overflow-y: auto;
    .detail-header {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }
 
    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      :last-child {
        margin-bottom: 0;
      }
      .detail-label {
        font-weight: 500;
        color: #495057;
        min-width: 80px;
        margin-right: 8px;
      }
 
      .detail-value {
        color: #333;
      }
    }
  }
  .messages-container {
    margin-top: 20px;
    .messages-header {
      margin-bottom: 16px;
      h4 {
        margin: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .messages-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
      .message-item {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        :last-child {
          margin-bottom: 0;
        }
        &.user-message {
          background: #e8f4fd;
        }
 
        &.ai-message {
          background: #f0f9f0;
        }
      }
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        .sender {
          font-weight: 500;
          color: #333;
          display: flex;
          align-items: center;
          gap: 4px;
        }
 
        .time {
          font-size: 12px;
          color: #999;
        }
 
        .message-content {
          color: #333;
          line-height: 1.6;
          white-space: pre-wrap;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }
</style>
