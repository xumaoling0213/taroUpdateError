<template>
  <view class="no_data">
    <view class="flex-wrp flex-wrp-column my_bottom_data">
      <image
        class="my_bottom_no_data"
        :style="`margin-top: ${marginTop};`"
        src="https://ad-static.boomegg.cn/luntanImg/my/no-data.png"
      ></image>
      <text class="my_bottom_text">{{ text }}</text>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Taro from "@tarojs/taro";

export default defineComponent({
  name: "NoData",
  props: {
    text: {
      type: String as PropType<string>,
      default: "哎呀，这里啥都没有",
    },
    top: {
      type: Number as PropType<number>,
      default: 190,
    },
  },
  setup(props) {
    let marginTop = Taro.pxTransform(props.top);
    return {
      marginTop,
    };
  },
});
</script>

<style lang="scss">
.no_data {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  .my_bottom_sort {
    flex: 1;
    font-size: 26px;
    align-items: flex-end;
    text-align: right;
  }
  .my_bottom_no_data {
    width: 271px;
    height: 266px;
    margin-bottom: 24px;
  }
  .my_bottom_data {
    justify-content: center;
    align-items: center;
  }
  .my_bottom_text {
    color: #7b7b7b;
  }
  .flex-wrp {
    display: flex;
  }
  .flex-wrp-column {
    flex-direction: column;
  }
}
</style>
