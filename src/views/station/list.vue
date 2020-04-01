<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入服务站名称"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">查找</el-button>
      <el-button v-permission="['/admin/station/add']" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="addClick">添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="stationList"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="服务站编码" prop="id" sortable />
      <el-table-column align="center" label="所属社区名称" prop="communityName" sortable>
        <template slot-scope="{row}">
          <span class="link-type" @click="showCommunityProfile(row)">{{ row.communityName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="服务站名称" prop="name" sortable />
      <el-table-column align="center" label="服务站地址" prop="address" sortable />
      <el-table-column align="center" label="所属社区地址" prop="communityAddr" sortable />
      <el-table-column align="center" label="创建时间" prop="ctime" sortable />
      <el-table-column align="center" label="操作" sortable>
        <template slot-scope="scope">
          <el-button v-permission="['/admin/station/update']" v-waves type="primary" size="mini" @click="handleEditStation(scope.row)">编辑</el-button>
          <el-button v-permission="['/admin/station/delete']" v-waves type="danger" size="mini" @click="handleDeleteStation(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="stationList.length>0" :total="stationList.length" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="stationQuery" />

    <el-dialog :title="isEdit?'更新服务站':'添加服务站'" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px">
        <el-form-item label="账户" prop="name">
          <el-input v-model="ruleForm.adminPhone" placeholder="请输入服务站管理员登录手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="name">
          <el-input v-model="ruleForm.password" placeholder="请输入服务站管理员登录密码" />
        </el-form-item>
        <el-form-item label="地址选择" prop="region">
          <el-row>
            <el-col :span="6">
              <el-select v-model="queryRegion.province" filterable placeholder="请选择省份信息" @change="selectProvince">
                <el-option
                  v-for="item in provinces"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="queryRegion.city" filterable placeholder="请选择市信息" @change="selectCity">
                <el-option
                  v-for="item in citys"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="queryRegion.district" filterable placeholder="请选择区信息" @change="selectDistrict">
                <el-option
                  v-for="item in districts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="queryRegion.street" filterable placeholder="请选择街道信息" @change="selectStreet">
                <el-option
                  v-for="item in streets"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="社区选择" prop="region">
          <el-select v-model="ruleForm.communityId" filterable placeholder="请选择街道信息" @change="handleSelectCommunity">
            <el-option
              v-for="item in communityList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="服务站名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入服务站名称" />
        </el-form-item>
        <el-form-item label="服务站地址" prop="address">
          <el-input v-model="ruleForm.address" placeholder="请输入服务站地址:小区、楼栋号、单元号、门牌号等" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="ruleForm.phone" type="number" placeholder="请输入服务站联系电话" />
        </el-form-item>
        <el-form-item label="地图标记" prop="address">
          <baidu-map class="map" style="height: 200px" :center="center" :zoom="15" :scroll-wheel-zoom="true" @click="getLocationPoint">
            <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT" />
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
            <bm-marker :position="{ lng: ruleForm.lng, lat: ruleForm.lat }" :dragging="false" />
          </baidu-map>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves @click="handleCancle">取 消</el-button>
        <el-button v-waves type="primary" @click="handleEnter">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="社区详情" :visible.sync="dialogCommunityVisible">
      <el-form ref="ruleForm" :model="selectStation" label-width="80px">
        <el-form-item label="社区名称" prop="name">
          <el-input v-model="selectStation.communityName" disabled="true" />
        </el-form-item>
        <el-form-item label="社区地址">
          <el-input v-model="selectStation.communityAddr" :disabled="true" />
        </el-form-item>
        <el-form-item label="社区电话" prop="name">
          <el-input v-model="selectStation.communityPhone" disabled="true" />
        </el-form-item>
        <el-form-item label="地图标记" prop="address">
          <baidu-map class="map" style="height: 200px" :center="selectStation" :zoom="15" :scroll-wheel-zoom="true">
            <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT" />
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
            <bm-marker :position="selectStation" :dragging="false" />
          </baidu-map>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves @click="dialogCommunityVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { listProvince, listCity, listDistrict, listStreet, queryAddress } from '@/api/region'
import { addStation, updateStation, queryStations, deleteStation, queryStationProfile } from '@/api/serviceStation'
import { queryCommunitysByRegion } from '@/api/community'

export default {
  name: 'Station',
  directives: {
    waves
  },
  // eslint-disable-next-line vue/order-in-components
  components: {
    Pagination
  },
  // computed: {
  //   ...mapGetters([
  //     'name'
  //   ])
  // },
  // watch: {
  //   stationAddr(val) {
  //     // console.log(val)
  //     // var geoc = new global.BMap.Geocoder()
  //     // var root = this
  //     // console.log(this.selectCommunity)
  //     // geoc.getPoint(this.selectCommunity.provinceName + this.selectCommunity.cityName + this.selectCommunity.districtName + this.selectCommunity.streetName + val, function(point) {
  //     //   root.ruleForm.lng = point.lng
  //     //   root.ruleForm.lat = point.lat
  //     //   root.center.lng = point.lng
  //     //   root.center.lat = point.lat
  //     // })
  //   }
  // },
  data: function() {
    return {
      stationList: null,
      communityList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        name: undefined
      },
      provinces: [],
      citys: [],
      districts: [],
      streets: [],
      queryRegion: { province: undefined, city: undefined, district: undefined, street: undefined },
      selectRegion: { province: undefined, city: undefined, district: undefined, address: undefined },
      selectCommunity: undefined,
      selectStation: {},
      dialogFormVisible: false,
      dialogCommunityVisible: false,
      isEdit: false,
      center: { lng: undefined, lat: undefined },
      ruleForm: {
        id: undefined,
        adminPhone: undefined,
        password: undefined,
        communityId: undefined,
        name: '',
        address: '',
        phone: '',
        lng: '',
        lat: ''
      }
    }
  },
  created() {
    this.stationQuery()
    if (!this.provinces || this.provinces.length === 0) {
      listProvince().then(response => {
        this.provinces = response.data
      })
    }
  },
  methods: {
    selectProvince(node) {
      if (this.selectRegion.province !== undefined && this.selectRegion.province === node) {
        return
      }
      this.selectRegion.province = node
      this.queryRegion.city = undefined
      this.queryRegion.district = undefined
      this.queryRegion.street = undefined
      listCity(node).then(response => {
        this.citys = response.data
      })
    },
    selectCity(node) {
      if (this.selectRegion.city !== undefined && this.selectRegion.city === node) {
        return
      }
      this.selectRegion.city = node
      this.queryRegion.district = undefined
      this.queryRegion.street = undefined
      listDistrict(node).then(response => {
        this.districts = response.data
      })
    },
    selectDistrict(node) {
      if (this.selectRegion.district !== undefined && this.selectRegion.district === node) {
        return
      }
      this.selectRegion.district = node
      this.queryRegion.street = undefined
      listStreet(node).then(response => {
        this.streets = response.data
      })
    },
    selectStreet() {
      queryCommunitysByRegion(this.queryRegion).then(resp => {
        this.communityList = resp.data
        if (!this.communityList || this.communityList.length === 0) {
          this.ruleForm.communityId = undefined
          this.$message({
            message: '该区域暂未开放社区服务',
            type: 'error'
          })
        } else {
          this.selectCommunity = this.communityList[0]
          this.ruleForm.communityId = this.communityList[0].id
          this.ruleForm.lng = this.communityList[0].lng
          this.ruleForm.lat = this.communityList[0].lat
          this.center.lng = this.communityList[0].lng
          this.center.lat = this.communityList[0].lat
        }
      })
    },
    stationQuery() {
      this.listLoading = true
      queryStations(this.listQuery)
        .then(response => {
          this.stationList = response.data.data
          this.listLoading = false
        })
        .catch(() => {
          this.stationList = []
          this.listLoading = false
        })
    },
    handleSearch() {
      this.listQuery.page = 1
      this.stationQuery()
    },
    addClick() {
      this.dialogFormVisible = true
      this.isEdit = false
      this.center.lng = 117.18
      this.center.lat = 34.27
      this.resetForm()
    },
    resetForm() {
      // this.$refs['ruleForm'].resetFields()
      this.ruleForm.id = undefined
      this.ruleForm.adminPhone = undefined
      this.ruleForm.password = undefined
      this.ruleForm.communityId = undefined
      this.ruleForm.name = ''
      this.ruleForm.address = ''
      this.ruleForm.lng = ''
      this.ruleForm.lat = ''
      this.ruleForm.phone = ''
      this.citys = []
      this.districts = []
      this.streets = []
      this.queryRegion = { province: undefined, city: undefined, district: undefined, street: undefined }
      this.selectRegion = { province: undefined, city: undefined, district: undefined, address: undefined }
      // this.selectCommunity = undefined
      this.selectStation = {}
    },
    handleCancle() {
      this.dialogFormVisible = false
      this.resetForm()
    },
    handleEnter() {
      if (this.isEdit) {
        this.handleEditStation2()
      } else {
        this.handleAdd()
      }
    },
    handleAdd() {
      this.isEdit = false
      this.dialogFormVisible = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.id = undefined
          addStation(this.ruleForm).then(resp => {
            this.stationList.push(resp.data)
            this.dialogFormVisible = false
            this.resetForm()
            this.$notify({
              title: '成功',
              message: '添加成功！',
              type: 'success'
            })
          })
        }
      })
    },
    handleEditStation(row) {
      this.isEdit = true
      this.ruleForm.id = row.id
      this.ruleForm.name = row.name
      this.ruleForm.adminPhone = row.adminPhone
      this.ruleForm.password = undefined
      this.ruleForm.address = row.address
      this.ruleForm.lng = row.lng
      this.ruleForm.lat = row.lat
      this.ruleForm.phone = row.phone
      this.center.lng = row.lng
      this.center.lat = row.lat
      queryStationProfile(row.id).then(resp => {
        this.ruleForm.adminPhone = resp.data.adminPhone
        queryAddress({ province: resp.data.province, city: resp.data.city, district: resp.data.district, street: resp.data.street }).then(response => {
          this.queryRegion.province = resp.data.province
          this.queryRegion.city = resp.data.city
          this.queryRegion.district = resp.data.district
          this.queryRegion.street = resp.data.street
          this.citys = response.data.citys
          this.districts = response.data.districts
          this.streets = response.data.streets
          queryCommunitysByRegion(this.queryRegion).then(resp2 => {
            this.communityList = resp2.data
            this.ruleForm.communityId = row.communityId

            this.communityList.find((item) => {
              if (item.id === row.communityId) {
                this.selectCommunity = item
                return item
              }
            })
          })
        })
      })
      this.dialogFormVisible = true
      this.selectStation = row
    },
    handleEditStation2() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          updateStation(this.ruleForm).then(resp => {
            this.dialogFormVisible = false
            this.selectStation.communityName = this.selectCommunity.name
            this.selectStation.communityAddr = this.selectCommunity.provinceName + this.selectCommunity.cityName + this.selectCommunity.districtName + this.selectCommunity.streetName
            this.selectStation.name = this.ruleForm.name
            this.selectStation.address = this.ruleForm.address
            this.selectStation.phone = this.ruleForm.phone
            this.selectStation.communityId = this.ruleForm.communityId
            this.selectStation.lng = this.ruleForm.lng
            this.selectStation.lat = this.ruleForm.lat
            this.resetForm()
            this.$notify({
              title: '提示',
              message: '更新成功！',
              type: 'success'
            })
          })
        }
      })
    },
    handleDeleteStation(row) {
      this.$confirm('此操作将永久删除服务站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStation(row.id).then(resp => {
          const index = this.stationList.indexOf(row)
          if (index >= 0) {
            this.stationList.splice(index, 1)
          }
          this.$notify({
            title: '提示',
            message: '删除成功！',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$notify({
          title: '提示',
          message: '已取消！',
          type: 'warning'
        })
      })
    },
    handleSelectCommunity(node) {
      this.communityList.find((item) => {
        if (item.id === node) {
          this.selectCommunity = item
          this.center.lng = item.lng
          this.center.lat = item.lat
          this.ruleForm.lat = item.lat
          this.ruleForm.lng = item.lng
          return item
        }
      })
    },
    getLocationPoint(e) {
      this.ruleForm.lng = e.point.lng
      this.ruleForm.lat = e.point.lat
    },
    showCommunityProfile(row) {
      this.dialogCommunityVisible = true
      this.selectStation = row
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
