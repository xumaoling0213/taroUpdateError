<template>
<view>
  <view class="container" :style="`height:${editorHeight}px;`">
    <editor id="editor" class="ql-container-edit" :placeholder="placeholder" @statuschange="onStatusChange" @ready="onEditorReady">
    </editor>
  </view>
  <view class="toolbar" catchtouchend="format" @tap="format" v-show="keyboardHeight> 0 ? true : false" :style="`bottom: ${isIOS ? (keyboardHeight-tabBarHeight) : 0}px`">
    <view class="iconfont icon-charutupian" catchtouchend="insertImage" @tap="insertImage"></view>
    <view class="iconfont icon-format-header-2 {{formats.header === 2 ? 'ql-active' : ''}}" data-name="header" data-value="{{2}}"></view>
    <view class="iconfont icon-format-header-3 {{formats.header === 3 ? 'ql-active' : ''}}" data-name="header" data-value="{{3}}"></view>
    <view class="iconfont icon-zitijiacu {{formats.bold ? 'ql-active' : ''}}" data-name="bold"></view>
    <view class="iconfont icon-zitixieti {{formats.italic ? 'ql-active' : ''}}" data-name="italic"></view>
    <view class="iconfont icon-zitixiahuaxian {{formats.underline ? 'ql-active' : ''}}" data-name="underline"></view>
    <view class="iconfont icon--checklist" data-name="list" data-value="check"></view>
    <view class="iconfont icon-youxupailie {{formats.list === 'ordered' ? 'ql-active' : ''}}" data-name="list" data-value="ordered"></view>
    <view class="iconfont icon-wuxupailie {{formats.list === 'bullet' ? 'ql-active' : ''}}" data-name="list" data-value="bullet"></view>
  </view>
</view>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import Taro from '@tarojs/taro'
// import { AtImagePicker, AtTextarea } from 'taro-ui-vue3'
import "taro-ui-vue3/dist/style/components/image-picker.scss";
import "taro-ui-vue3/dist/style/components/textarea.scss";

export default defineComponent ({
  name: 'Comment',
  components : {
  },
  setup() {
    let formats = ref({});
    let readOnly = ref(false);
    let placeholder = ref('开始输入...');
    let editorHeight = ref(300);
    let keyboardHeight = ref(0);
    let isIOS = ref(false);

    let tabBarHeight = ref(0);

    let editorCtx = ref('') as Taro.General.IAnyObject;

    // 方法
    const readOnlyChange = () => {
       readOnly.value = !readOnly.value
    }

    const updatePosition = (keyboardHeight_2) => {
      const toolbarHeight = 100
      // const { windowHeight, platform } = Taro.getSystemInfoSync()
      const { windowHeight } = Taro.getSystemInfoSync()
      let editorHeight_2 = keyboardHeight_2 > 0 ? (windowHeight - keyboardHeight_2 - toolbarHeight) : windowHeight
      // this.setData({ editorHeight, keyboardHeight })
      editorHeight.value = editorHeight_2
      keyboardHeight.value = keyboardHeight_2
      console.log("updatePosition",windowHeight,tabBarHeight.value,editorHeight.value,keyboardHeight.value,isIOS.value)
    };
    const calNavigationBarAndStatusBar = () =>  {
      const systemInfo = Taro.getSystemInfoSync()
      const { statusBarHeight, platform } = systemInfo
      const isIOS = platform === 'ios'
      const navigationBarHeight = isIOS ? 44 : 48
      return statusBarHeight + navigationBarHeight
    };
    const onEditorReady = () => {
      console.log('onEditorReady');
      // const that = this
      Taro.createSelectorQuery().select('#editor').context(function (res) {
        // that.editorCtx = res.context
        editorCtx.value = res.context
      }).exec()
    };
    const blur = () => {
      // this.editorCtx.blur()
      editorCtx.value.blur()
    };
    const format = (e) => {
      console.log("format",e.target.dataset)
      let { name, value } = e.target.dataset
      if (!name) return
      // console.log('format', name, value)
      // this.editorCtx.format(name, value)
      editorCtx.value.format(name, value)


    };
    const onStatusChange = (e) => {
      // const formats = e.detail
      // this.setData({ formats })
      formats.value = e.detail
    };
    const insertDivider = () => {
      // this.editorCtx.insertDivider({
      editorCtx.value.insertDivider({
        success: function () {
          console.log('insert divider success')
        }
      })
    };
    const clear = () => {
      // this.editorCtx.clear({
      editorCtx.value.clear({
        success: function (res) {
          console.log("clear success")
        }
      })
    };
    const removeFormat = () => {
      // this.editorCtx.removeFormat()
      editorCtx.value.removeFormat()
    };
    const insertDate = () => {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      // this.editorCtx.insertText({
      editorCtx.value.insertText({
        text: formatDate
      })
    };
    const insertImage = () => {
      // const that = this
      Taro.chooseImage({
        count: 1,
        success: function (res) {
          // that.editorCtx.insertImage({
          editorCtx.value.insertImage({
            src: res.tempFilePaths[0],
            data: {
              id: 'abcd',
              role: 'god'
            },
            width: '80%',
            success: function () {
              console.log('insert image success')
            }
          })
        }
      })
    };

    onMounted(() => {
      const sysInfo=Taro.getSystemInfoSync()
      const platform = sysInfo.platform
      isIOS.value = platform === 'ios'

      //计算tabBar栏高度
      tabBarHeight.value=sysInfo.screenHeight-sysInfo.windowHeight-sysInfo.screenTop
      console.log("tabBarHeight:", tabBarHeight.value)

      // const that = this
      updatePosition(0)
      let curKeyboardHeight = 0
      Taro.onKeyboardHeightChange(res => {
        console.log("onKeyboardHeightChange",res)
        if (res.height === keyboardHeight.value) return
        const duration = res.height > 0 ? res.duration * 1000 : 0
        curKeyboardHeight = res.height
        setTimeout(() => {
          Taro.pageScrollTo({
            scrollTop: 0,
            success() {
              updatePosition(curKeyboardHeight)
              // that.editorCtx.scrollIntoView()
              editorCtx.value.scrollIntoView()
            }
          })
        }, duration)
      })

      updatePosition(0);

    })

    return {
      formats,
      readOnly,
      placeholder,
      editorHeight,
      keyboardHeight,
      isIOS,
      tabBarHeight,
      editorCtx,

      readOnlyChange,
      updatePosition,
      calNavigationBarAndStatusBar,
      onEditorReady,
      blur,
      format,
      onStatusChange,
      insertDivider,
      clear,
      removeFormat,
      insertDate,

      insertImage,
    }
  }
})
</script>


<style lang="scss">
  @import './css/weui.scss';
  @import './css/iconfont.scss';
  //  @import './css/editor';
  .container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .ql-container-edit {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    font-size: 32px;
    line-height: 1.5;
    overflow: auto;
    padding: 20px 20px 40px 20px;
    border: 1px solid #ECECEC;
  }

  .ql-active {
    color: #22C704;
  }

  .iconfont {
    display: inline-block;
    width: 60px;
    height: 60px;
    cursor: pointer;
    font-size: 40px;
  }

  .toolbar {
    box-sizing: border-box;
    padding: 0 20px;
    height: 100px;
    width: 100%;
    position: fixed;
    left: 0;
    right: 100%;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #ECECEC;
    border-left: none;
    border-right: none;
  }
</style>
