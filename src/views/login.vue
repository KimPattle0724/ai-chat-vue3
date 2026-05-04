<template>
    <div class="container">
        <div class="title">
            <div class="back-home">
                <el-icon><back /></el-icon>
                <span>返回首页</span>
            </div>
            <div class="title-text">
                <h2>登陆您的账户</h2>
                <p>请输入您的账号和密码</p>
            </div>
        </div>
        <div class="form-container">
            <el-form 
            ref="ruleFormRef"
            :model="formData"
            :rules="rules"
            label-position="top"
            >
                <el-form-item label="用户名或邮箱" prop="username" >
                    <el-input v-model="formData.username" size="large" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" >
                    <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" show-password></el-input>
                </el-form-item>
                    <el-button class="btn" type="primary" size="large" @click="submitForm(ruleFormRef)">登陆</el-button>
            </el-form>
            <div class="footer">
                <p>还没有账号？<router-link to="/auth/register">去注册</router-link></p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { login } from '@/api/admin'
import router from '@/router'

const ruleFormRef = ref()

const formData = reactive({
    username: '',
    password: ''
})

const rules = ref({
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})

const submitForm = async (formEl) =>{
    if(!formEl) return
    await formEl.validate((valid,fields)=>{
        if(valid){
            login(formData).then((data) => {
                if(!data.token){
                    return console.error('登陆失败，请检查账号密码')
                }
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
                //根据用户角色跳转不同的页面
                if(data.userInfo.userType === 2){
                    router.push('/back/dashboard')
                }else{
                    router.push('/')
                }
            })
        }
        }
    )
}
</script>
<style scoped lang="scss">
.container{
    .title{
        .back-home{
            margin-bottom: 60px;
        }
        .title-text{
            text-align: center;
            h2{
                font-size: 36px;
                margin-bottom: 10px;
            }
            p{
                font-size: 18px;
                color: #6b7280;
            }
        }
    }
    .form-container{
        margin-top: 30px;
        .btn{
            width: 100%;
            margin-top: 40px;
        }
        .footer{
            text-align: center;
            padding: 30px;
        }
    }
   }
</style>

