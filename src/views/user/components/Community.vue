<template>
  <el-form>
    <el-form-item label="编码">
      <el-input v-model.trim="staionInfo.communityId" readonly />
    </el-form-item>
    <el-form-item label="名称">
      <el-input v-model.trim="staionInfo.communityName" readonly />
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model.trim="staionInfo.communityAddr" readonly />
    </el-form-item>
    <el-form-item label="联系电话">
      <el-input v-model.trim="staionInfo.communityPhone" readonly />
    </el-form-item>
    <el-form-item label="创建时间">
      <el-input v-model.trim="staionInfo.communityCtime" readonly />
    </el-form-item>
    <el-form-item label="地图标记">
      <baidu-map class="map" style="height: 300px" :center="{lng:staionInfo.communityLng,lat:staionInfo.communityLat}" :zoom="15" :scroll-wheel-zoom="true">
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT" />
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
        <bm-marker :position="{lng:staionInfo.communityLng,lat:staionInfo.communityLat}" :dragging="false" />
      </baidu-map>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    staionInfo: {
      type: Object,
      default: () => {
        return {
          communityId: '',
          communityName: '',
          communityAddr: '',
          communityPhone: '',
          communityCtime: '',
          communityLng: '',
          communityLat: ''
        }
      }
    }
  },
  methods: {
  }
}
</script>
