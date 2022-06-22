<template>
    <div class="nav-search">
        <el-button @click="noteCreate">添加</el-button>
        <el-button type="danger" :disabled="disable" @click="batchRemove">批量删除 </el-button>
        <el-input v-model="query.q" class="ipt"></el-input>
        <el-button type="primary" @click="inquire">查询</el-button>
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
    <el-pagination style="margin-top: 5px;" background layout="->,prev, pager, next" :total="total"
        v-model:current-page="query.page" :page-size="query.perPage" @current-change="handleChangePageInfo" />
</template>

<script>
import { getNotes, deleteNote, batchNote, } from '../api/note'
export default {
    data() {
        return {
            total: 0,
            items: [],
            minutes: [
            ],
            query: {
                page: 1,
                perPage: 10,
                q: '',
                title: '',
                content: '',
            },
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
                .then(async () => {
                    const ids = this.items.map(item => item.id).join()
                    await batchNote(ids)
                    this.getNotes();
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
                .then(async () => {
                    // const idx = this.minutes.findIndex((minute) => minute.id === id);
                    // deleteNote(idx)
                    await deleteNote(id)
                    this.getNotes()
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
        async getNotes() {
            const res = await getNotes(this.query)
            this.minutes = res.data.data
            this.total = res.data.total
        },
        handleChangePageInfo() {
            this.getUsers();
        },
        async inquire() {
            const res = await getNotes(this.query)
            this.minutes = res.data.data
        }
    },
    created() {
        this.getNotes();
    },
}
</script>


<style scoped>
.nav-search {
    display: flex;
}

.ipt {
    width: 300px;
    margin: 0px 10px;
}
</style>
