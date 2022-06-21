<template>
    <div>
        <el-table empty-text="没有数据" table-layout="auto">
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column label="标题" />
            <el-table-column label="内容" />
            <el-table-column label="类型" />
        </el-table>
        <el-pagination style="margin-top: 5px;" background layout="->,prev, pager, next" :total="50" />
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
</style>