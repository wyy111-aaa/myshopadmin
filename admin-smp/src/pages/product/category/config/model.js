export const rules = {
    typename: [
        { required: true, message: '请输入类型名称', trigger: 'blur' },
        { min: 1, max: 15, message: '长度为1-15个字符', trigger: 'blur' },
    ],
}

export let itemStyle = { padding: '5px 30px' }

export let itemWidthStyle = { width: '260px' }
