<template>
  <div style="margin-bottom: 5px">
    <el-button @click="addTab">新增</el-button>
  </div>
  <el-tabs ref="tabs" type="card" closable v-model="tableTabsValue" @tab-remove="removeTab">
    <el-tab-pane v-for="(item, index) in tableTabs" :key="item.id" :label="item.label" :name="item.id">
      <canvas class="canvas" :style="{ cursor: `url(${icons[mode]}) 10 10, auto` }" ref="canvas" :width="canvasWidth"
        height="550"></canvas>

      <div class="btns">

        <el-radio-group v-model="mode" @change="(val) => change(index, val)">
          <el-radio-button label="pen">画笔</el-radio-button>
          <el-radio-button label="eraser">橡皮擦</el-radio-button>
          <el-radio-button label="select">选择</el-radio-button>
          <el-radio-button label="rect">矩形</el-radio-button>
          <el-radio-button label="text">文字</el-radio-button>
        </el-radio-group>

        <div>
          <el-color-picker v-if="['pen', 'rect', 'text'].includes(this.mode)" v-model="linecolor"
            @change="handleColorChange(index)" />
          <el-select v-if="mode === 'pen'" class="select" v-model="lineWidth" style="width: 75px" placeholder="粗细"
            @change="thickness(index)">
            <el-option v-for="(lineWidth, index) in lineWidths" :label="lineWidth.label" :value="lineWidth.value"
              :key="index"></el-option>
          </el-select>
        </div>

        <div>
          <el-button @click="back(index)">撤销</el-button>
          <el-button @click="removeEl(index)">删除</el-button>
          <el-button @click="clear(index)">清屏</el-button>
          <el-button @click="dialogVisible = true">重命名画板</el-button>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>

  <el-dialog @open-auto-focus="$refs.newTitle.focus()" width="340px" v-model="dialogVisible" title="重命名">
    <el-form ref="amendForm" :model="form" label-width="auto">
      <el-form-item prop="filename" label="重命名">
        <el-input ref="newTitle" v-model="form.filename" placeholder="重命名画板" />
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
import 'fabric-history'
import { markRaw } from "vue";

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

        this.$nextTick(() => {
          const index = newTabId - 1
          const canvas = this.render(index)
          canvas.isDrawingMode = true
          canvas.freeDrawingBrush.width = this.lineWidth;
          canvas.freeDrawingBrush.color = linecolor
        })
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
    change(index, val) {
      const canvas = this.render(index)
      if (val === "pen") {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = this.lineWidth;
        canvas.freeDrawingBrush.color = this.linecolor
      } else if (val === "eraser") {
        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 35;
      } else if (val === "select") {
        canvas.isDrawingMode = false;
        fabric.Object.prototype.selectable = true
      } else if (val === "rect") {
        canvas.isDrawingMode = false;
        fabric.Object.prototype.selectable = false
      } else if (val === "text") {
        canvas.isDrawingMode = false;
        canvas.skipTargetFind = false
      } else {
        const Textboxes = canvas.getObjects('textbox')
        Textboxes.forEach(box => box.exitEditing())
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
          const canvas = this.render(idx)
          canvas.clear()
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
    thickness(idx) {
      const canvas = this.render(idx);
      canvas.freeDrawingBrush.width = this.lineWidth;
    },
    handleColorChange(index) {
      const canvas = this.render(index)
      canvas.freeDrawingBrush.color = this.linecolor
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
      this.canvasWidth = this.$refs.tabs.$el.getBoundingClientRect().width - 2;
      this.$nextTick(() => {
        this.tableTabs.forEach((item, index) => {
          const canvas = this.render(index)
          canvas.setWidth(this.canvasWidth)
        })
      })
    },
    render(index) {
      let canvas = this.tableTabs[index].canvas;
      const val = this.tableTabs[index]
      if (!canvas) {
        const el = this.$refs.canvas[index]
        canvas = new fabric.Canvas(el)
        canvas = markRaw(canvas)
        this.tableTabs[index].canvas = canvas
        let startX, startY
        canvas.on('mouse:down', e => {
          if (this.mode === 'rect') {
            canvas.selectionColor = 'transparent'
            canvas.selectionBorderColor = this.linecolor
            startX = e.pointer.x
            startY = e.pointer.y
          }
          if (this.mode === 'text') {
            if (!e.target || !e.target.text) {
              canvas.isDrawingMode = false
              const { x, y } = e.absolutePointer
              const text = new fabric.Textbox('', {
                width: 300,
                editable: true,
                fill: this.linecolor,
                top: y - 20,
                left: x,
                height: 100,
              })
              canvas.add(text)
              text.enterEditing()
              canvas.setActiveObject(text)
            }
          }
        })

        canvas.on('mouse:up', e => {
          if (this.mode === 'rect') {
            const { x: endX, y: endY } = e.pointer
            const tempW = Math.abs(endX - startX)
            const tempH = Math.abs(endY - startY)
            if (tempW > 3 && tempH > 3) {
              const rect = new fabric.Rect({
                left: Math.min(startX, endX),
                top: Math.min(startY, endY),
                width: tempW - 3,
                height: tempH - 3,
                strokeWidth: 3,
                stroke: this.linecolor,
                fill: 'transparent',
              })
              canvas.add(rect)
            }
          }
        })
      }
      return this.tableTabs[index].canvas;
    },
    //
    removeEl(index) {
      ElMessageBox.confirm("确认删除吗?", {
        type: "warning",
      })
        .then(() => {
          const canvas = this.render(index)
          const selected = canvas.getActiveObjects()
          canvas.remove(...selected)
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
    back(i) {
      this.render(i).undo()
    }
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
  margin-top: 5px;
  flex-shrink: 0;
}

.form-btn {
  display: flex;
  justify-content: flex-end;
}

.canvas {
  display: block;
  border: 1px solid black;
}

.select {
  margin-left: 10px;
}
</style>
