<template>
    <div>
        <el-form label-width="auto" :model="note" :rules="rules" ref="form">
            <el-form-item label="标题" prop="title">
                <el-input v-model="note.title"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <div>
                    <Toolbar :default-config="toolbarConfig" :editor="editor"></Toolbar>
                    <Editor :default-config="editorConfig" ref="editor" @on-created="handleEditorCreated"
                        v-model="note.content"></Editor>
                </div>
            </el-form-item>
            <el-form-item label="可见性" prop="visible">
                <el-radio-group v-model="note.visible">
                    <el-radio :label="true" size="large">公开</el-radio>
                    <el-radio :label="false" size="large">私密</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">创建</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { Toolbar, Editor } from "@wangeditor/editor-for-vue";
import '@wangeditor/editor/dist/css/style.css'
import { shallowRef } from "vue";

export default {
    components: {
        Toolbar,
        Editor
    },
    data() {
        return {
            editor: null,
            toolbarConfig: {},
            editorConfig: { autoFocus: false },
            note: { title: '', content: '', visible: null },
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { min: 2, message: '至少两个字符', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                    { min: 10, message: '至少10个字以上', trigger: 'blur' }
                ],
                visible: [
                    { required: true, message: '请选择是否可见', trigger: 'blur' },
                ],
            },
        }
    },
    methods: {
        handleEditorCreated(editor) {
            this.editor = shallowRef(editor)
        },
        submit() {
            this.$refs.form.validate((v) => {
                if (v) {
                    this.$router.push('/notes')
                }
            })
        },
    },
}
</script>

<style scoped>
</style>