<template>
  <el-row :gutter="40" class="panel-group">
    <el-col id="user" v-permission="['/admin/user/count']" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('user')">
        <div class="card-panel-icon-wrapper icon-device">
          <svg-icon icon-class="user2" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            用户
          </div>
          <count-to :start-val="0" :end-val="data.users" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col id="order" v-permission="['/admin/order/count/query']" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('order')">
        <div class="card-panel-icon-wrapper icon-ad">
          <svg-icon icon-class="order" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            订单
          </div>
          <count-to :start-val="0" :end-val="data.orders" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col id="audit" v-permission="['/admin/user/v/count']" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('audit')">
        <div class="card-panel-icon-wrapper icon-content">
          <svg-icon icon-class="audit" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            志愿者审核
          </div>
          <count-to :start-val="0" :end-val="data.audits" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col id="goods" v-permission="['/admin/commodity/count/query']" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('goods')">
        <div class="card-panel-icon-wrapper icon-user">
          <svg-icon icon-class="goods" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            商品
          </div>
          <count-to :start-val="0" :end-val="data.stations" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { userCount } from '@/api/user'
import { unauditVolunteerCount } from '@/api/volunteer'
import { getOrderCount } from '@/api/order'
import { queryAll } from '@/api/commodity'

export default {
  components: {
    CountTo
  },
  props: {
    data: {
      type: Object,
      default: function() {
        return {
          users: 0,
          orders: 0,
          audits: 0,
          stations: 0
        }
      }
    }
  },
  created() {
  },
  mounted() {
    if (document.getElementById('user')) {
      userCount().then(resp => {
        this.data.users = resp.data
      })
    }
    if (document.getElementById('audit')) {
      unauditVolunteerCount().then(resp => {
        this.data.audits = resp.data
      })
    }
    if (document.getElementById('order')) {
      getOrderCount().then(resp => {
        this.data.orders = resp.data
      })
    }
    if (document.getElementById('goods')) {
      queryAll().then(resp => {
        this.data.stations = resp.data
      })
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-device {
        background: #40c9c6;
      }

      .icon-ad {
        background: #36a3f7;
      }

      .icon-content {
        background: #f4516c;
      }

      .icon-user {
        background: #34bfa3
      }
    }

    .icon-device {
      color: #40c9c6;
    }

    .icon-ad {
      color: #36a3f7;
    }

    .icon-content {
      color: #f4516c;
    }

    .icon-user {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
