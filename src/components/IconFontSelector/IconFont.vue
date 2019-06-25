<template>
  <icon-font type="icon-nongmin" style="size: 36px" />
</template>
<script>
import { Icon } from 'ant-design-vue'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1261188_wxtb4sptzsa.js' // 在 iconfont.cn 上生成
})

export default {
  components: {
    IconFont
  },
  data () {
    return {
    }
  }
}
</script>
