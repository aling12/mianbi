<template>
    <div>
        <el-button @click="noteCreate">添加</el-button>
        <el-button type="danger" :disabled="disable" @click="batchRemove">批量删除 </el-button>
    </div>
    <el-table empty-text="没有数据" @selection-change="handleSelectionChange" :data="minutes" table-layout="auto">
        <el-table-column type="selection" width="70"></el-table-column>
        <el-table-column prop="title" label="标题" />
        <el-table-column label="内容">
            <template #default="scope">
                {{ translation(scope.row.content) }}
            </template>
        </el-table-column>
        <el-table-column label="类型">
            <template #default="scope">
                {{ scope.row.visible === true ? '公开' : '私密' }}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
            <template #default="scope">
                <el-button type="primary" @click="noteView(scope.row.id)">查看</el-button>
                <el-button type="success" @click="noteEdit(scope.row.id)">编辑</el-button>
                <el-button type="danger" @click="noteDelete(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 5px;" background layout="->,prev, pager, next" :total="50" />
</template>

<script>
export default {
    data() {
        return {
            items: [],
            minutes: [
                { id: 1, title: 'Vue3', content: '<h2>你好，世界！</h2><p>哈哈哈!</p><p><br></p>', visible: false },
                { id: 2, title: 'Js', content: '<h2>今天学习了原型！</h2><p>哈哈哈!</p><p><br></p>', visible: true }
            ],
        }
    },
    computed: {
        disable() {
            return this.items.length === 0;
        },
    },
    methods: {
        handleSelectionChange(value) {
            this.items = value;
        },
        batchRemove() {
            ElMessageBox.confirm("确认删除吗?", {
                type: "warning",
            })
                .then(() => {
                    for (let item of this.items) {
                        const idx = this.minutes.findIndex((minutes) => minutes.id === item.id);
                        this.minutes.splice(idx, 1);
                    }
                    ElMessage({
                        type: "success",
                        message: "删除成功",
                    });
                })
                .catch(() => {
                    ElMessage({
                        type: "info",
                        message: "删除取消",
                    });
                });
        },
        noteCreate() {
            this.$router.push('/notes/create')
        },
        noteEdit(id) {
            this.$router.push(`/notes/${id}/edit`)
        },
        noteView(id) {
            this.$router.push(`/notes/${id}`)
        },
        noteDelete(id) {
            ElMessageBox.confirm("确认删除吗?", {
                type: "warning",
            })
                .then(() => {
                    const idx = this.minutes.findIndex((minute) => minute.id === id);
                    this.minutes.splice(idx, 1);
                    ElMessage({
                        type: "success",
                        message: "删除成功",
                    });
                })
                .catch(() => {
                    ElMessage({
                        type: "info",
                        message: "删除取消",
                    });
                });
        },
        translation(text) {
            let temp = document.createElement("div");
            temp.innerHTML = text;
            let output = temp.innerText || temp.textContent;
            temp = null;
            return output;
        },
    },
}
</script>

<style scoped>
</style>