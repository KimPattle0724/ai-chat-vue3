<template>
    <el-form ref="ruleFormRef" :model="formdata">
      <el-row :gutter="24">
          <template v-for="item in formItemAttrs" :key="item.prop">
            <el-col v-bind="item.col">
              <el-form-item 
               :label="item.label" 
               :prop="item.prop"
                >
              <component 
                   v-model="formdata[item.prop]"
                   :is="isComp(item.comp)"
                   :placeholder="item.placeholder"
                >
                <template v-if="item.comp === 'select'">
                  <el-option 
                    v-for="option in item.options" 
                    :key="option.value" 
                    :label="option.label" 
                    :value="option.value"
                  />
                </template>
              </component>
            </el-form-item>
            </el-col>
          </template>
      </el-row>
      <el-row>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset(ruleFormRef)">重置</el-button>
      </el-row>
    </el-form>
</template>
<script setup>

import { ref, reactive, computed } from 'vue'

const props = defineProps({
  formItem: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['search'])

const formItemAttrs = computed(()=>{
  const { formItem } = props
  formItem.forEach((item)=>{
    item.col = {
      xs:24,
      sm:12,
      md:8,
      lg:6,
      xl:6
    }
  })
  return formItem
})

const isComp = (comp) => {
    return{
        input:'el-input',
        select:'el-select'
    }[comp]
}

const ruleFormRef = ref(null)

const formdata = reactive({})

const handleSearch = () => {
    emit('search', formdata)
}

const handleReset = (formEl) => {
     if(!formEl) return// 检查表单元素是否存在
     formEl.resetFields()// 重置表单  
     emit('search', formdata)// 触发查询事件
}

</script>
<style scoped lang="scss">  

</style>
