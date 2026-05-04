<template>
    <el-dialog
     :title="isEdit ? '编辑文章' : '新增文章'" 
     v-model="dialogVisible"
     width="50%"
     @close="handleClose"
     >
     <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类" >
          <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(最多1000个字符)" maxlength="1000" show-word-limit :rows="4" />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select v-model="formData.tagArray" placeholder="请选择标签" multiple filterable allow-create width="100%">
          <el-option v-for="item in commonTags" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <el-upload 
          class="avatar-uploader"
          action="#"
          :before-upload="beforeUpload"
          :http-request="handleUploadRequest"
          accept="image/*"
          showfilelist="false"
          >
            <div v-if="!imgUrl" class="cover-placeholder">
              <p>点击上传图片</p>
            </div>
            <img v-else :src="imgUrl" alt="封面图片" class="cover-image" />
          </el-upload>
          <div v-if="imgUrl" class="cover-remove">
            <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <rich-text-editor 
        v-model="formData.content"
        placeholder="请输入文章内容"
        :maxCharCount="5000"
        show-word-limit
        @change="handleContentChange"
        @created="handleEditorCreated"
        min-height="400px"
         />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <h3>预览效果</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button type="primary" @click="btnPreview = !btnPreview">{{ btnPreview ? '关闭预览' : '预览效果' }}</el-button>
      <el-button type="primary" @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit ? '更新' : '创建' }}</el-button>
    </template>
    </el-dialog>
</template>
<script setup>
import { computed, reactive, ref, nextTick, watch } from 'vue'
import { uploadFile, createArticle, updateArticle } from '@/api/admin'
import { fileBaseUrl } from '@/config/index'
import RichTextEditor from '@/components/RichTextEditor.vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  },
  article: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue','success'])

const dialogVisible = computed({
  get(){
    return props.modelValue
  },
  set(val){
    emit('update:modelValue', val)
  }
})

const isEdit = computed(() => !!props.article?.id)

const businessId = ref(null)

watch(()=>props.article,(newVal)=>{
  if(newVal){
    nextTick(()=>{
      Object.assign(formData,newVal)
      businessId.value = newVal.id
      imgUrl.value = fileBaseUrl + newVal.coverImage
    })
  }
})

const handleClose = () => {
  formRef.value.resetFields()
  businessId.value = null
  imgUrl.value = ''
  formData.tagArray = []
  handleRemove()
  emit('update:modelValue', false)
}

const formData = reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": "",
    "summary": "",
    "tags": "",
    "id": ""
})

const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 200, message: '文章标题长度必须在2到200之间', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ]
})

const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

const imgUrl = ref('')

const beforeUpload = (file) => {//上传前校验
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 <= 5
  if(!isImage){
    ElMessage.error('请上传图片文件')
    return false
  }
  if(!isLt5M){
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return true
}

const handleUploadRequest = async ({file}) => {//上传请求
  businessId.value = crypto.randomUUID() //生成随机业务ID
  const fileRes = await uploadFile(file, { businessId: businessId.value })
  imgUrl.value = fileBaseUrl + fileRes.filePath//拼接完整图片URL
  formData.coverImage = fileRes.filePath//更新表单数据
}

const handleRemove = () => {//移除封面
  imgUrl.value = ''
  formData.coverImage = ''
}

const handleContentChange = (data) => {//文章内容改变时触发
  formData.content = data.html
}

const editorInstance = ref(null)//编辑器实例引用

const handleEditorCreated = (editor) => {//编辑器创建时触发
  editorInstance.value = editor//保存编辑器实例
  if(formData.content && editor){
    nextTick(() => {
      editor.setHtml(formData.content)//设置编辑器内容
    })
  }
}

const btnPreview = ref(false)
const formRef = ref()
const loading = ref(false)
const handleSubmit = () => {
  formRef.value.validate((valid) => {//校验表单
    if (valid) {
      loading.value = true
      
      // 使用可选链或默认值，确保 join() 不会挂掉
      const submitData = {
        ...formData,
        tags: (formData.tagArray || []).join(',') 
      }
      
      // 按照文档要求，删掉多余的 tagArray 字段
      delete submitData.tagArray
      if(!isEdit.value){
        submitData.id = businessId.value
        createArticle(submitData).then(res => {
          loading.value = false
          emit('success')
        })
      }else{
        updateArticle(businessId.value, submitData).then(res => {
          loading.value = false
          emit('success')
        })
      }
    }
  })
}   
</script>

<style lang="scss" scoped>
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background: #f6f8fa;
}
.cover-image {
  width: 200px;
  height: 120px;
  display: block;
}
</style>
