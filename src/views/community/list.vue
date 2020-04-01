<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入社区名称"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">查找</el-button>
      <el-button v-permission="['/admin/community/add']" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="addClick">添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="communityList"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="社区编码" prop="id" sortable />
      <el-table-column align="center" label="社区名称" prop="name" sortable>
        <template slot-scope="{row}">
          <span class="link-type" @click="showCommunityProfile(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="省" prop="provinceName" sortable />
      <el-table-column align="center" label="市" prop="cityName" sortable />
      <el-table-column align="center" label="区" prop="districtName" sortable />
      <el-table-column align="center" label="街道" prop="streetName" sortable />
      <el-table-column align="center" label="创建时间" prop="ctime" sortable />
      <el-table-column align="center" label="操作" sortable>
        <template slot-scope="scope">
          <el-button v-permission="['/admin/community/update']" v-waves type="primary" size="mini" @click="handleEditCommunity(scope.row)">编辑</el-button>
          <el-button v-permission="['/admin/community/delete']" v-waves type="danger" size="mini" @click="handleDeleteCommunity(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="communityList.length>0" :total="communityList.length" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="communityQuery" />

    <el-dialog :title="isEdit?'更新社区':'添加社区'" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="ruleForm" :model="ruleForm" label-width="80px">
        <el-form-item label="地址选择" prop="region">
          <el-select v-model="province" filterable placeholder="请选择省份信息" @change="selectProvince">
            <el-option
              v-for="item in provinces"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-select v-model="city" filterable placeholder="请选择市信息" @change="selectCity">
            <el-option
              v-for="item in citys"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-select v-model="district" filterable placeholder="请选择区信息" @change="selectDistrict">
            <el-option
              v-for="item in districts"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-select v-model="street" filterable placeholder="请选择街道信息" @change="selectStreet">
            <el-option
              v-for="item in streets"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="社区名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请填写社区名称" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="ruleForm.phone" type="number" placeholder="请填写社区联系电话" />
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
          <el-input v-model="selectStation.name" disabled="true" />
        </el-form-item>
        <el-form-item label="社区地址">
          <el-input v-model="selectStation.streetName" :disabled="true" />
        </el-form-item>
        <el-form-item label="社区电话" prop="name">
          <el-input v-model="selectStation.phone" disabled="true" />
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
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { listProvince, listCity, listDistrict, listStreet, queryAddress } from '@/api/region'
import { addCommunity, updateCommunity, queryCommunitys, deleteCommunity } from '@/api/community'

export default {
  name: 'Community',
  directives: {
    waves
  },
  components: {
    Pagination
  },
  data: function() {
    return {
      communityList: [],
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
      province: undefined,
      provinceName: '',
      city: undefined,
      cityName: '',
      district: undefined,
      districtName: '',
      street: undefined,
      streetName: '',
      regionAddress: '',
      dialogFormVisible: false,
      isEdit: false,
      placeHolder: '',
      selectRow: undefined,
      selectStation: {},
      dialogCommunityVisible: false,
      ruleForm: {
        id: '',
        province: '',
        city: '',
        district: '',
        street: '',
        name: '',
        lng: '',
        lat: ''
      },
      center: { lng: undefined, lat: undefined },
      region: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.communityQuery()
    if (!this.provinces || this.provinces.length === 0) {
      listProvince().then(response => {
        this.provinces = response.data
      })
    }
  },
  methods: {
    selectProvince(node) {
      if (this.ruleForm.province !== undefined && this.ruleForm.province === node) {
        return
      }
      this.province = node
      this.ruleForm.province = node
      this.city = undefined
      this.district = undefined
      this.street = undefined
      this.citys = undefined
      this.districts = undefined
      this.streets = undefined
      this.ruleForm.city = undefined
      this.ruleForm.district = undefined
      this.ruleForm.street = undefined
      this.provinces.find((item) => {
        if (item.id === node) {
          this.provinceName = item.name
          return item
        }
      })
      listCity(node).then(response => {
        this.citys = response.data
      })
    },
    selectCity(node) {
      if (this.ruleForm.city !== undefined && this.ruleForm.city === node) {
        return
      }
      this.city = node
      this.ruleForm.city = node
      this.districts = undefined
      this.streets = undefined
      this.district = undefined
      this.street = undefined
      this.ruleForm.district = undefined
      this.ruleForm.street = undefined
      this.citys.find((item) => {
        if (item.id === node) {
          this.cityName = item.name
          return item
        }
      })
      listDistrict(node).then(response => {
        this.districts = response.data
      })
    },
    selectDistrict(node) {
      if (this.ruleForm.district !== undefined && this.ruleForm.district === node) {
        return
      }
      this.district = node
      this.ruleForm.district = node
      this.streets = undefined
      this.street = undefined
      this.ruleForm.street = undefined
      this.districts.find((item) => {
        if (item.id === node) {
          this.districtName = item.name
          return item
        }
      })
      listStreet(node).then(response => {
        this.streets = response.data
      })
    },
    selectStreet(node) {
      this.ruleForm.street = node
      this.streets.find((item) => {
        if (item.id === node) {
          this.streetName = item.name
          return item
        }
      })
      this.regionAddress = this.provinceName + this.cityName + this.districtName + node.streetName
      var geoc = new global.BMap.Geocoder()
      var root = this
      geoc.getPoint(this.regionAddress, function(point) {
        root.ruleForm.lng = point.lng
        root.ruleForm.lat = point.lat
        root.center.lng = point.lng
        root.center.lat = point.lat
      })
    },
    communityQuery() {
      this.listLoading = true
      queryCommunitys(this.listQuery)
        .then(response => {
          this.communityList = response.data.data
          this.listLoading = false
        })
        .catch(() => {
          this.communityList = []
          this.listLoading = false
        })
    },
    handleSearch() {
      this.listQuery.page = 1
      this.communityQuery()
    },
    addClick() {
      this.dialogFormVisible = true
      this.isEdit = false
      this.center.lng = 117.18
      this.center.lat = 34.27
      this.resetForm()
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
      this.region = []
      this.province = undefined
      this.city = undefined
      this.district = undefined
      this.street = undefined
      this.citys = undefined
      this.districts = undefined
      this.streets = undefined
      this.provinceName = ''
      this.cityName = ''
      this.districtName = ''
      this.streetName = ''
      this.regionAddress = ''
      this.selectRow = undefined
      this.ruleForm = { id: undefined, province: undefined, city: undefined, district: undefined, phone: undefined,
        street: undefined, name: undefined, lng: undefined, lat: undefined }
    },
    handleCancle() {
      this.dialogFormVisible = false
      this.resetForm()
    },
    handleAdd() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ruleForm.id = undefined
          addCommunity(this.ruleForm).then(resp => {
            this.communityList.push(resp.data)
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
    handleEditCommunity(row) {
      this.isEdit = true
      this.dialogFormVisible = true
      this.selectRow = row
      this.ruleForm.id = row.id
      this.ruleForm.province = row.province
      this.center.lng = row.lng
      this.center.lat = row.lat
      this.ruleForm.lng = row.lng
      this.ruleForm.lat = row.lat
      this.ruleForm.name = row.name
      this.ruleForm.phone = row.phone

      this.provinceName = row.provinceName
      this.cityName = row.cityName
      this.districtName = row.districtName
      this.streetName = row.streetName
      queryAddress({ province: row.province, city: row.city, district: row.district, street: row.street }).then(response => {
        this.citys = response.data.citys
        this.districts = response.data.districts
        this.streets = response.data.streets
        this.ruleForm.city = row.city
        this.ruleForm.district = row.district
        this.ruleForm.street = row.street

        this.province = row.province
        this.city = row.city
        this.district = row.district
        this.street = row.street
      })
    },
    handleEnter() {
      if (this.isEdit) {
        this.handleEditCommunity2()
      } else {
        this.handleAdd()
      }
    },
    handleEditCommunity2() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          updateCommunity(this.ruleForm).then(resp => {
            this.dialogFormVisible = false
            this.selectRow.province = this.ruleForm.province
            this.selectRow.city = this.ruleForm.city
            this.selectRow.district = this.ruleForm.district
            this.selectRow.street = this.ruleForm.street
            this.selectRow.name = this.ruleForm.name
            this.selectRow.lng = this.ruleForm.lng
            this.selectRow.lat = this.ruleForm.lat
            this.selectRow.phone = this.ruleForm.phone
            this.selectRow.provinceName = this.provinceName
            this.selectRow.cityName = this.cityName
            this.selectRow.districtName = this.districtName
            this.selectRow.streetName = this.streetName
            this.resetForm()
            this.resetForm()
            this.$notify({
              title: '成功',
              message: '更新成功！',
              type: 'success'
            })
          })
        }
      })
    },
    handleDeleteCommunity(row) {
      this.$confirm('此操作将永久删除社区, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCommunity(row.id).then(resp => {
          const index = this.communityList.indexOf(row)
          if (index >= 0) {
            this.communityList.splice(index, 1)
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
    getLocationPoint(e) {
      this.ruleForm.lng = e.point.lng
      this.ruleForm.lat = e.point.lat
      // const geoCoder = new global.BMap.Geocoder()
      // /* 获取位置对应的坐标 */
      // var root = this
      // geoCoder.getPoint(this.regionAddress, point => {
      //   root.ruleForm.lng = point.lng
      //   root.ruleForm.lat = point.lat
      // })
    },
    showCommunityProfile(row) {
      this.dialogCommunityVisible = true
      this.selectStation = row
      this.selectStation.streetName = this.selectStation.cityName + this.selectStation.districtName + this.selectStation.streetName
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
