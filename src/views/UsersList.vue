<template>
  <div>
    <div class="nav">
      <el-select v-model="value" class="m-2" placeholder="Select">
        <el-option value="" label="全部"></el-option>
        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <div class="block">
        <el-form-item label="开始时间">
          <el-date-picker v-model="valueDate" type="datetime" placeholder="请选择查询时间" clearable />
        </el-form-item>
      </div>
      <el-button class="primary-btn" type="primary">查询</el-button>
    </div>
    <div class="addDel">
      <el-button @click="add">添加</el-button>
      <el-button type="danger" :disabled="disable" @click="batchRemove">批量删除</el-button>
    </div>
    <el-table empty-text="没有数据" table-layout="auto" :data="users" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="70"></el-table-column>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="面壁者" width="190">
        <template #default="scope">
          <div class="userinfo">
            <el-image close-on-press-escape hide-on-click-modal class="img-avatar" :src="scope.row.url" fit="cover"
              style="width: 30px; height: 30px" :preview-src-list="[scope.row.url]" preview-teleported></el-image>
            <span class="usernick">{{ scope.row.nick }}</span>
            <span>({{ scope.row.name }})</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template #default="{ row }">
          {{ typeText(row) }}
        </template>
      </el-table-column>
      <el-table-column label="开始日期" w>
        <template #default="scope">
          {{ formatDate(scope.row.StartDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="grade" label="等级" />
      <el-table-column prop="value" label="成长值" />
      <el-table-column label="成就勋章">
        <template #default>
          🚀✈️😭
          <!-- <span><img src="00FD9888.png" /></span> -->
        </template>
      </el-table-column>
      <el-table-column width="190" label="操作">
        <template #default="scope">
          <el-button type="success" @click="compile(scope.row)" class="operation">编辑</el-button>
          <el-button type="danger" @click="remove(scope.row.id)" class="operation">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination v-model="users" background layout="prev, pager, next" :total="50" />
    </div>

    <el-dialog width="340px" v-model="dialogVisible" title="添加面壁者">
      <el-form ref="addForm" :rules="rules" :model="addition" label-width="auto">
        <el-form-item prop="nick" label="昵称">
          <el-input v-model="addition.nick" placeholder="添加昵称" />
        </el-form-item>
        <el-form-item prop="name" label="面壁者">
          <el-input v-model="addition.name" placeholder="添加面壁者" />
        </el-form-item>
        <!-- <el-form-item prop="type" label="类型">
          <el-cascader
            class="example-cascader"
            placeholder="请添加类型"
            v-model="addition.type"
            :options="DialogOptions"
            @change="handleChange"
          />
        </el-form-item> -->
        <!-- <el-form-item prop="grade" label="等级">
          <el-input v-model="addition.grade" placeholder="添加等级" />
        </el-form-item>
        <el-form-item prop="value" label="成长值">
          <el-input v-model="addition.value" placeholder="添加成长值" />
        </el-form-item> -->
        <el-form-item prop="StartDate" label="开始时间">
          <el-date-picker v-model="addition.StartDate" type="datetime" placeholder="请选择添加时间" clearable
            format="YYYY/MM/DD hh:mm:ss" />
        </el-form-item>
        <div class="form-btn">
          <el-form-item>
            <el-button type="primary" @click="addonSubmit">添加</el-button>
            <el-button @click="addonCancel">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog width="340px" v-model="dialogTableVisible" title="修改面壁者">
      <el-form ref="editForm" :rules="rules" :model="amend" label-width="auto">
        <el-form-item prop="nick" label="昵称">
          <el-input v-model="amend.nick" placeholder="添加昵称" />
        </el-form-item>
        <el-form-item prop="name" label="面壁者">
          <el-input v-model="amend.name" placeholder="修改面壁者" />
        </el-form-item>
        <el-form-item prop="StartDate" label="开始时间">
          <el-date-picker v-model="amend.StartDate" type="datetime" placeholder="请选择查询时间" clearable
            format="YYYY/MM/DD hh:mm:ss" />
        </el-form-item>
        <!-- <el-form-item prop="type" label="类型">
          <el-cascader
            class="example-cascader"
            placeholder="请修改类型"
            v-model="amend.type"
            :options="DialogOptions"
            @change="handleChange"
          />
        </el-form-item> -->
        <!-- <el-form-item prop="grade" label="等级">
          <el-input v-model="amend.grade" placeholder="修改等级" />
        </el-form-item>
        <el-form-item prop="value" label="成长值">
          <el-input v-model="amend.value" placeholder="修改成长值" />
        </el-form-item>
        <el-form-item label="成就勋章">
          <el-input v-model="amend.value" placeholder="修改成就勋章" />
        </el-form-item> -->
        <div class="form-btn">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">修改</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import "element-plus/es/components/message-box/style/css";
import "element-plus/es/components/message/style/css";
import { getUsers, deleteUser, createUser, updateUser, batchUser } from "../api/user";

export default {
  data() {
    return {
      items: [],
      dialogTableVisible: false,
      dialogVisible: false,
      value: "",
      DialogValue: "",
      valueDate: "",
      checked: 1,
      users: [
      ],
      types: [
        {
          value: "线上",
          label: "线上",
        },
        {
          value: "线下",
          label: "线下",
        },
      ],
      DialogOptions: [
        {
          value: "全部",
          label: "全部",
        },
        {
          value: "线上",
          label: "线上",
        },
        {
          value: "线下",
          label: "线下",
        },
      ],
      amend: {
        id: null,
        name: "",
        type: "",
        StartDate: "",
        grade: "",
        value: "",
      },
      addition: {
        nick: "",
        name: "",
        type: "",
        StartDate: "",
        grade: "",
        value: "",
      },
      rules: {
        nick: [{ required: true, message: "昵称不可为空", trigger: "blur" }],
        name: [{ required: true, message: "名字不可为空", trigger: "blur" }],
        StartDate: [
          { required: true, message: "时间不可为空", trigger: "blur" },
        ],
        grade: [{ required: true, message: "等级不可为空", trigger: "blur" }],
        value: [{ required: true, message: "成长值不可为空", trigger: "blur" }],
        type: [{ required: true, message: "类型不可为空", trigger: "blur" }],
      },
      query: {
        page: 1,
        perPage: 10,
        type: '',
        StartDate: '',
        q: '',
        sex: '',
      },
    };
  },
  methods: {
    flush() {
      this.$router.go(0);
    },
    compile(row) {
      this.amend = row;
      this.dialogTableVisible = true;
    },
    onSubmit() {
      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          await updateUser(this.amend.id, this.amend)
          this.getUsers();
          this.dialogVisible = false;
        }
      });
      this.dialogTableVisible = false;
    },
    onCancel() {
      this.dialogTableVisible = false;
    },
    async remove(id) {
      try {
        ElMessageBox.confirm("确认删除吗?", {
          type: "warning",
        })
          .then(async () => {
            // const idx = this.users.findIndex((user) => user.id === id);
            // this.users.splice(idx, 1);
            await deleteUser(id)
            this.getUsers();
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
      } catch { }
    },
    addonSubmit() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          await createUser(this.addition)
          this.getUsers();
          this.dialogVisible = false;
        }
      });
    },
    addonCancel() {
      this.dialogVisible = false;
    },
    formatDate(val) {
      const day = new Date(val);
      let year = day.getFullYear();
      let month = day.getMonth() + 1;
      let date = day.getDate();
      val = `${year}-${month}-${date}`;
      return val;
    },
    add() {
      this.dialogVisible = true;
    },
    handleSelectionChange(value) {
      this.items = value;
    },
    batchRemove() {
      ElMessageBox.confirm("确认删除吗?", {
        type: "warning",
      })
        .then(async () => {
          const ids = this.items.map(item => item.id).join()
          await batchUser(ids)
            this.getUsers();
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
    login() {
      this.$router.push({ path: "/login" });
    },
    typeText(item) {
      return item.type === 1 ? "线上" : "线下";
    },
    async getUsers() {
      const res = await getUsers()
      this.users = res.data
    }
  },
  computed: {
    disable() {
      return this.items.length === 0;
    },
  },
  created() {
    this.getUsers();
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.aside {
  height: calc(100vh - 60px) !important;
}

.menu {
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
}

.backstage {
  cursor: pointer;
  padding: 0 30px;
}

.userPhoto {
  width: 25px;
  height: 25px;
}

.operation {
  cursor: pointer;
  /* padding: 0 3px; */
}

.nav {
  display: flex;
}

/* .demonstration {
  margin-right: 10px;
} */

.primary-btn {
  margin: 0 20px;
}

.m-2 {
  margin: 0 20px 0 0;
}

/* .startTime {
  font-size: 14px;
  margin-right: 10px;
  text-align: center;
} */

.addDel {
  margin-bottom: 5px;
}

.form-btn {
  display: flex;
  justify-content: flex-end;
}

.example-demonstration {
  margin-right: 10px;
}

.example-cascader {
  width: 500px;
}

.img-avatar {
  border-radius: 50%;
  margin-right: 6px;
}

.userinfo {
  display: flex;
  align-items: center;
}

.usernick {
  margin-right: 4px;
}
</style>
