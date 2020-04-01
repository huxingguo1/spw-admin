<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" :region="region" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="服务站" name="station">
                <station :staion-info="staionInfo" :detail-addr="stationDetailAddr" />
              </el-tab-pane>
              <el-tab-pane label="社区" name="community">
                <community :staion-info="staionInfo" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryUserProfile } from '@/api/user'
import { queryAddressInfo } from '@/api/region'
import { queryStationProfile } from '@/api/serviceStation'
import UserCard from './components/UserCard'
import Station from './components/Station'
import Community from './components/Community'
export default {
  name: 'UserProfile',
  components: { UserCard, Station, Community },
  data: function() {
    return {
      user: {},
      stationDetailAddr: undefined,
      staionInfo: undefined,
      region: undefined,
      activeTab: 'station'
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    if (!this.$route.query.id) {
      this.$router.back(-1)
    }
    queryUserProfile(this.$route.query.id).then(resp => {
      this.user = resp.data
      queryAddressInfo({ province: this.user.provinceId, city: this.user.cityId, district: this.user.districtId, street: this.user.streetId }).then(resp2 => {
        this.region = resp2.data.provinceName + resp2.data.cityName + resp2.data.districyName + resp2.data.streetName
      })
      queryStationProfile(this.user.stationId).then(resp3 => {
        this.staionInfo = resp3.data
        this.stationDetailAddr = this.staionInfo.communityAddr + this.staionInfo.address
      })
    })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>
