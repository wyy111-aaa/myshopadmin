import { reactive } from 'vue'

// 表单校验规则
export const rules = reactive({
    username: [
        {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
        },
        {
            pattern: /^[a-z0-9]{1,11}$/,
            message: '请输入账号必须1~11字母或者数字',
            trigger: 'blur'
        }
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
        },
        {
            pattern: /^[a-z0-9]{3,}$/,
            message: '请输入密码必须3位以上的字母或者数字',
            trigger: 'blur'
        }
    ]
})
