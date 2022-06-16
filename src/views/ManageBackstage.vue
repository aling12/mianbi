<template>
  <div>
    <el-container>
      <el-header class="header">
        <h1 @click="flush()" class="backstage">面壁后台</h1>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-badge value="10">
            <el-menu-item class="menu-item" index="/messages"
              ><el-icon><BellFilled /></el-icon>消息</el-menu-item
            >
          </el-badge>
          <el-sub-menu index="2">
            <template #title>
              <el-avatar
                class="avatar-photo"
                :size="33"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              张三</template
            >
            <el-menu-item index="/personal">个人资料</el-menu-item>
            <el-menu-item index="/set">设置</el-menu-item>
            <el-menu-item>退出</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside class="aside" width="200px">
          <el-menu
            collapse-transition
            unique-opened
            :default-active="defaultOption"
            class="menu"
            router
          >
            <el-menu-item index="/home">
              <template #title>
                <el-icon><House /></el-icon>首页
              </template>
            </el-menu-item>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><Avatar /></el-icon>面壁者
              </template>
              <el-menu-item index="/users">面壁者列表</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon><DocumentCopy /></el-icon>题库
              </template>
              <el-menu-item index="/bank">题库列表</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="4">
              <template #title>
                <el-icon><Setting /></el-icon>教学工具
              </template>
              <el-menu-item index="/board">白板</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    flush() {
      this.$router.go(0);
    },
  },
  computed: {
    defaultOption() {
      return this.$route.path;
    },
  },
};
</script>

<style scoped>
.aside {
  height: calc(100vh - 60px) !important;
}

.menu {
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-item {
  height: calc(var(--el-header-height) - 1px);
}

.backstage {
  cursor: pointer;
  padding: 0 30px;
}

.avatar-photo {
  margin-right: 5px;
}

.el-menu-demo {
  width: calc(100vw - 200px);
  display: flex;
  justify-content: flex-end;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active),
:deep(.el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title),
:deep(.el-menu--horizontal > .el-sub-menu .el-sub-menu__title) {
  border-bottom: 0;
}

.header :deep(.el-badge__content.is-fixed) {
  transform: translate(calc(100% - 16px), calc(-50% + 20px));
}
</style>

<style>
.el-header {
  padding-right: 0;
}
</style>
