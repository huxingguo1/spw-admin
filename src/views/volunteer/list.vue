<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.realName"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入姓名"
      />
      <el-input
        v-model="listQuery.phone"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入手机号"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">查找</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="volunteerList"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="编码" prop="id" sortable>
        <template slot-scope="{row}">
          <span class="link-type" @click="showProfile(row)">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属服务站编码" prop="id" sortable>
        <template slot-scope="{row}">
          <span class="link-type" @click="showProfile(row)">{{ row.stationId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" prop="realName" sortable />
      <el-table-column align="center" label="手机号" prop="phone" sortable />
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <viewer>
            <img :src="scope.row.avatar" width="40px" height="40px">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" prop="sex" sortable>
        <template slot-scope="{row}">
          <el-tag>
            {{ row.sex === 1 ? '男' : '女' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址" prop="address" sortable />
      <el-table-column align="center" label="是否启用" prop="state" sortable>
        <template slot-scope="{row}">
          <el-tag :type="row.state | enableStatusFilter">
            {{ row.state === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="ctime" sortable />
      <el-table-column align="center" label="操作" sortable>
        <template slot-scope="scope">
          <el-button v-permission="['/admin/user/v/enable']" v-waves type="success" size="mini" @click="handleEnable(scope.row)">启用</el-button>
          <el-button v-permission="['/admin/user/v/disable']" v-waves type="danger" size="mini" @click="handleDsiable(scope.row)">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="volunteerQuery" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { queryAll, enableVolunteer, disableVolunteer } from '@/api/volunteer'
export default {
  name: 'VolunteerList',
  directives: {
    waves
  },
  components: { Pagination },
  filters: {
    enableStatusFilter(status) {
      const statusMap = {
        2: 'danger',
        1: 'success'
      }
      return statusMap[status]
    }
  },
  data: function() {
    return {
      volunteerList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        phone: undefined,
        realName: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.handleSearch()
  },
  methods: {
    volunteerQuery() {
      this.listLoading = true
      queryAll(this.listQuery)
        .then(response => {
          this.volunteerList = response.data.data
          this.total = Number(response.data.total)
          this.listLoading = false
        })
        .catch(() => {
          this.volunteerList = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleSearch() {
      this.listQuery.page = 1
      this.volunteerQuery()
    },
    showProfile(row) {
      this.$router.push({ path: '/volunteer/profile', query: { id: row.id }})
    },
    handleEnable(row) {
      this.$confirm('是否启用志愿者?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        enableVolunteer(row.id).then(resp => {
          row.state = 1
          this.$notify({
            title: '提示',
            message: '启用成功！',
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
    handleDsiable(row) {
      this.$confirm('是否禁用志愿者?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        disableVolunteer(row.id).then(resp => {
          row.state = 2
          this.$notify({
            title: '提示',
            message: '禁用成功！',
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
