<template>
  <div class="app-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'
export default {
  name: 'Dashboard',
  components: {
    PanelGroup
  },
  data: function() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
  },
  methods: {
    handleSetLineChartData(type) {
      if (type === 'order') {
        this.$router.push({ path: '/order/list' })
      } else if (type === 'user') {
        this.$router.push({ path: '/user/list' })
      } else if (type === 'audit') {
        this.$router.push({ path: '/volunteer/audit' })
      } else if (type === 'goods') {
        this.$router.push({ path: '/goods/list' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
