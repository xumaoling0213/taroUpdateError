<template>
  <view class="container">
    <editor id="editor" class="editor" :placeholder="placeholder" @ready="editorReady"></editor>
    <button type="warn" @tap="undo">撤销</button>
  </view>
</template>

<script>
  import Taro from '@tarojs/taro'
  export default {
    data() {
      return {
        placeholder: '来，输入隔壁的名字试试...'
      }
    },
    methods: {
      editorReady() {
        Taro.createSelectorQuery().select('#editor').context((res) => {
          this.editorCtx = res.context
        }).exec()
      },
      undo() {
        this.editorCtx.undo()
      }
    }
  }
</script>