<template>
    <div>
        <div>标题：{{ note.title }}</div>
        <div class="content">
            内容：<div v-html="note.content"></div>
        </div>
        <div>类型：{{ note.visible === true ? '公开' : '私密' }}</div>
    </div>
</template>

<script>
import { getNote } from '../api/note'

export default {
    data() {
        return {
            note: {},
        }
    },
    methods: {
        async getNote() {
            const res = await getNote(this.$route.params.id)
            this.note = res.data
        }

    },
    created() {
        this.getNote();
    },
}
</script>

<style scoped>
.content {
    display: flex;
    align-items: center;
}
</style>