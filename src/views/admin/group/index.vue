<template>
  <a-card :bordered="false">
    <a-tabs style="margin-top:15px;" v-model="activeName">
      <a-tab-pane v-for="item in tabMapOptions" :tab="item.name" :key="item.id" :name="item.code">
        <keep-alive>
          <tab-pane v-if="activeName==item.code" :type="item.id"></tab-pane>
        </keep-alive>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import tabPane from './components/groupDetail'
import {
  getAllGroupTypes
} from '@/api/admin/group/index'
export default {
  name: 'Group',
  components: {
    tabPane
  },
  data () {
    return {
      tabMapOptions: [
      ],
      activeName: 'role'
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      getAllGroupTypes().then(data => {
        this.tabMapOptions = data
      })
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
