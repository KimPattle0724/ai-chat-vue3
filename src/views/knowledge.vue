<template>
  <div>
    <PageHead title="知识文章列表">
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
      </template>
    </PageHead>
    <TableSearch 
    :formItem="formItem" 
    @search="handleSearch"
     />
     <el-table
      :data="tableData"
      style="width: 100%; margin-top: 25px"
    >
      <el-table-column prop="title" label="文章标题" width="200" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-icon><timer /></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-icon><timer /></el-icon>
            <span>{{ categoryMap[scope.row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="authorName" label="作者" width="150" />
      <el-table-column prop="readCount" label="阅读量" width="150" />
      <el-table-column prop="createdAt" label="发布时间" width="200" />

      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" text type="primary">编辑</el-button>
          <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0 || scope.row.status === 2" text type="success">发布</el-button>
          <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status === 1" text type="warning">下线</el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
        <el-pagination 
        margin-top="25px"
        :page-size="pagination.size"
        layout="prev, pager, next" 
        :total="pagination.total"
        @change="handleChange" />
  </div>
  <ArticleDailog 
  v-model:modelValue="dialogVisible"
  :categories="categories"
  @success="handleSuccess"
  :article="currentArticle"
  />
</template>
<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { getCategoryTree, articlePage, getArticleDetail, changeArticleStatus, deleteArticle } from '@/api/admin'
import { onMounted, reactive, ref } from 'vue'
import ArticleDailog from '@/components/ArticleDailog.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const formItem = [
  {
    comp: 'input',    
    prop: 'title',
    label: '文章标题',
    placeholder: '请输入知识文章标题'
  },{
    comp: 'select',    
    prop: 'categoryId',
    label: '分类',
    placeholder: '请选择分类' 
  },{
    comp: 'select',    
    prop: 'status',
    label: '状态',
    placeholder: '请选择状态' ,
    options: [
      {
        label: '草稿',
        value: 0
      },{
        label: '已发布',
        value: 1
      },{
        label: '已下线',
        value: 2
      }
    ]
  }
]

const pagination = reactive({//分页
  currentPage: 1,
  size: 10,
  total: 0,
})

const handleSearch = async (formData) => {
  const params = {
    ...pagination,
    ...formData
  }
  const { records,total } = await articlePage(params)//分页查询文章列表
  tableData.value = records
  pagination.total = total
}

const handleChange = (page) => {
  pagination.currentPage = page
  handleSearch()
}

const categoryMap = reactive({})//分类映射

const categories = ref([])//分类列表

const tableData = ref([])//文章列表数据

const dialogVisible = ref(false)//弹窗是否显示

const handleSuccess = () => {
  dialogVisible.value = false
  handleSearch()
}

const currentArticle = ref(null)//当前编辑文章

const handleEdit = async (row) => {
  if(!row.id){
    currentArticle.value = null
    dialogVisible.value = true
  }else{
  getArticleDetail(row.id).then(res => {
    currentArticle.value = res
    dialogVisible.value = true
        })
      }
    }

const handleUnpublish = async (row) => {
  ElMessageBox.confirm(`确定下线${row.title}吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    changeArticleStatus(row.id, { status: 2 }).then(res => {
      ElMessage.success('操作成功')
      handleSearch()
    })
  })
}

const handlePublish = async (row) => {
  ElMessageBox.confirm(`确定发布${row.title}吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
      changeArticleStatus(row.id, { status: 1 }).then(res => {
        ElMessage.success('操作成功')
        handleSearch()
    })
  })
}

const handleDelete = async (row) => {
  ElMessageBox.confirm(`确定删除${row.title}吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(() => {
    deleteArticle(row.id).then(res => {
      ElMessage.success('操作成功')
      handleSearch()
    })
  })
}

onMounted(async () => {
    const data = await getCategoryTree()
    categories.value = data.map(item =>{
      categoryMap[item.id] = item.categoryName
      return{
        label:item.categoryName,
        value:item.id
      }
    })
    console.log(categories.value)
    formItem[1].options = categories.value
})
</script>
