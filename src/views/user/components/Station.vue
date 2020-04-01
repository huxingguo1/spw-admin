<template>
  <el-form>
    <el-form-item label="编码">
      <el-input v-model.trim="staionInfo.id" readonly />
    </el-form-item>
    <el-form-item label="名称">
      <el-input v-model.trim="staionInfo.name" readonly />
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model.trim="detailAddr" readonly />
    </el-form-item>
    <el-form-item label="联系电话">
      <el-input v-model.trim="staionInfo.phone" readonly />
    </el-form-item>
    <el-form-item label="创建时间">
      <el-input v-model.trim="staionInfo.ctime" readonly />
    </el-form-item>
    <el-form-item label="地图标记">
      <baidu-map class="map" style="height: 300px" :center="staionInfo" :zoom="15" :scroll-wheel-zoom="true">
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT" />
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
        <bm-marker :position="staionInfo" :dragging="false" />
      </baidu-map>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    detailAddr: {
      type: String,
      default: () => {
        return ''
      }
    },
    staionInfo: {
      type: Object,
      default: () => {
        return {
          id: '',
          name: '',
          phone: '',
          ctime: '',
          lng: '',
          lat: ''
        }
      }
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
