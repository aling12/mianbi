<template>
  <div style="margin-bottom: 5px">
    <el-button @click="addTab">新增</el-button>
  </div>
  <el-tabs
    ref="tabs"
    type="card"
    closable
    v-model="tableTabsValue"
    @tab-remove="removeTab"
  >
    <el-tab-pane
      v-for="(item, index) in tableTabs"
      :key="item.id"
      :label="item.label"
      :name="item.id"
    >
      <canvas
        class="canvas"
        :style="{ cursor: `url(${icons[mode]}) 10 10, auto` }"
        ref="canvas"
        :width="canvasWidth"
        height="350"
      ></canvas>
      <!-- <div class="btns">
        <el-button @click="thickness(index)">画笔</el-button>
        <el-button @click="eraser(index)">橡皮擦</el-button>
        <el-button class="text">文字</el-button>
        <el-color-picker class="color" v-model="linecolor" />
        <el-button class="clear-screen" @click="clear(index)">清屏</el-button>
        <el-select
          class="select"
          v-model="lineWidth"
          style="width: 75px"
          placeholder="粗细"
          @change="thickness"
        >
          <el-option
            v-for="(lineWidth, index) in lineWidths"
            :label="lineWidth.label"
            :value="lineWidth.value"
            :key="index"
          ></el-option>
        </el-select>
        <el-button @click="dialogVisible = true">重命名画板</el-button>
      </div> -->
      <div class="btns">
        <!-- <div>
          <el-button @click="thickness(index)">画笔</el-button>
          <el-button @click="eraser(index)">橡皮擦</el-button>
        </div> -->

        <el-radio-group v-model="mode" @change="(val) => change(index, val)">
          <el-radio-button label="pen">画笔</el-radio-button>
          <el-radio-button label="eraser">橡皮擦</el-radio-button>
        </el-radio-group>

        <div>
          <template v-if="mode === 'pen'">
            <el-color-picker v-model="linecolor" />
            <el-select
              class="select"
              v-model="lineWidth"
              style="width: 75px"
              placeholder="粗细"
              @change="thickness(index)"
            >
              <el-option
                v-for="(lineWidth, index) in lineWidths"
                :label="lineWidth.label"
                :value="lineWidth.value"
                :key="index"
              ></el-option>
            </el-select>
          </template>
        </div>

        <div>
          <el-button @click="retreat">退一步</el-button>
          <el-button @click="clear(index)">清屏</el-button>
          <el-button @click="dialogVisible = true">重命名画板</el-button>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>

  <el-dialog
    @open-auto-focus="$refs.newTitle.focus()"
    width="340px"
    v-model="dialogVisible"
    title="重命名"
  >
    <el-form ref="amendForm" :model="form" label-width="auto">
      <el-form-item prop="filename" label="重命名">
        <el-input
          ref="newTitle"
          v-model="form.filename"
          placeholder="重命名画板"
        />
      </el-form-item>
      <div class="form-btn">
        <el-form-item>
          <el-button @click="amend" type="primary">修改</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import pen from "../assets/pen.png";
import eraser from "../assets/xpc.png";
import { ElMessage, ElMessageBox } from "element-plus";
import "element-plus/es/components/message-box/style/css";
import "element-plus/es/components/message/style/css";
import { fabric } from "fabric";
import "fabric/src/mixins/eraser_brush.mixin.js";

export default {
  data() {
    return {
      canvasWidth: 0,
      icons: {
        pen,
        eraser,
      },
      dialogVisible: false,
      tableTabsValue: "1",
      tabIndex: 1,
      mode: "pen",
      tableTabs: [
        {
          label: "白板1",
          id: "1",
        },
      ],
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      ctx: "",
      canvas: "",
      linecolor: "#000000",
      restore: [],
      lineWidth: 10,
      lineWidths: [
        { value: 10, label: "细" },
        { value: 15, label: "中" },
        { value: 20, label: "粗" },
      ],
      form: {
        filename: "",
      },
      history: [],
    };
  },
  methods: {
    async addTab() {
      try {
        let length = this.tableTabs.length + 1;
        const newTabId = `${++this.tabIndex}`;
        const { value } = await ElMessageBox.prompt("请输入名称", "", {
          inputValue: `白板${length}`,
        });
        this.tableTabs.push({
          label: value,
          id: newTabId,
        });
        this.tableTabsValue = newTabId;
      } catch (err) {
        console.log(err);
      }
    },
    removeTab(id) {
      ElMessageBox.confirm("确认删除吗?", {
        type: "warning",
      })
        .then(() => {
          const index = this.tableTabs.findIndex((item) => item.id === id);
          this.tableTabs.splice(index, 1);
          if (id !== this.tableTabsValue) return;
          if (index) {
            this.tableTabsValue = this.tableTabs[index - 1].id;
          } else {
            this.tableTabsValue = this.tableTabs[0].id;
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
    change(idx, val) {
      const canvas = this.tableTabs[idx].canvas;
      if (val === "pen") {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = this.lineWidth;
      } else if (val === "eraser") {
        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 35;
      }
    },
    // handleDown(event) {
    //   const canvas = event.target;
    //   const startX = event.offsetX;
    //   const startY = event.offsetY;

    //   const ctx = canvas.getContext("2d");
    //   ctx.moveTo(startX, startY);
    //   ctx.beginPath();
    //   if (this.mode === "eraser") {
    //     ctx.lineWidth = 30;
    //     ctx.strokeStyle = "#ffffff";
    //   } else {
    //     ctx.lineWidth = this.lineWidth;
    //     ctx.strokeStyle = this.linecolor;
    //   }
    //   document.onmousemove = (event) => {
    //     const endX = event.offsetX;
    //     const endY = event.offsetY;
    //     ctx.lineTo(endX, endY);
    //     ctx.stroke();
    //   };
    //   document.onmouseup = () => {
    //     ctx.closePath();
    //     document.onmousemove = null;
    //     document.onmouseup = null;
    //   };
    // },

    clear(idx) {
      ElMessageBox.confirm("确认清屏吗?", {
        type: "warning",
      })
        .then(() => {
          const canvas = this.$refs.canvas[idx];
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ElMessage({
            type: "success",
            message: "清屏成功",
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "清屏取消",
          });
        });
    },
    // eraser(idx) {
    //   const canvas = this.$refs.canvas[idx];
    //   const ctx = canvas.getContext("2d");
    //   ctx.lineWidth = 80;
    //   this.linecolor = "#ffffff";
    //   this.mode = "eraser";
    // },
    thickness(idx) {
      const canvas = this.render(idx);
      canvas.freeDrawingBrush.width = this.lineWidth;
    },
    amend() {
      this.$refs.amendForm.validate((valid) => {
        if (valid) {
          // for (let item of this.tableTabs) {
          //   item.label = this.form.filename;
          // }
          const tab = this.tableTabs.find(
            (item) => item.id === this.tableTabsValue
          );
          tab.label = this.form.filename;
          this.form.filename = "";
        }
        this.dialogVisible = false;
      });
    },
    init() {
      this.canvasWidth = this.$refs.tabs.$el.getBoundingClientRect().width;
    },
    render(index) {
      const canvas = this.tableTabs[index].canvas;
      if (canvas) return canvas;
      const el = this.$refs.canvas[index];
      this.tableTabs[index].canvas = new fabric.Canvas(el);
      return this.tableTabs[index].canvas;
    },

    // retreat(idx) {
    //   const canvas = this.$refs.canvas[idx];
    //   const ctx = canvas.getContext("2d");
    //   if (this.history.length > 0) {
    //     ctx.putImageData(this.history[this.history.length - 1], 0, 0);
    //   }
    // },
  },
  mounted() {
    this.init();
    window.addEventListener("resize", () => this.init());

    this.$nextTick(() => {
      const canvas = this.render(0);
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = this.lineWidth;
    });
  },
};
</script>

<style scoped>
.btns {
  display: flex;
  justify-content: space-between;
}

.form-btn {
  display: flex;
  justify-content: flex-end;
}

.canvas {
  display: block;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
}

.select {
  margin-left: 10px;
}
</style>
