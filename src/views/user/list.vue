<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入姓名或昵称"
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
      :data="userList"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="用户编码" prop="id" sortable>
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
      <el-table-column align="center" label="是否启用" prop="state" sortable>
        <template slot-scope="{row}">
          <el-tag :type="row.state | enableStatusFilter">
            {{ row.state === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址" prop="address" sortable />
      <el-table-column align="center" label="创建时间" prop="ctime" sortable />
      <el-table-column align="center" label="操作" sortable>
        <template slot-scope="scope">
          <el-button v-permission="['/admin/user/enable']" v-waves type="success" size="mini" @click="handleEnable(scope.row)">启用</el-button>
          <el-button v-permission="['/admin/user/disable']" v-waves type="danger" size="mini" @click="handleDsiable(scope.row)">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="userQuery" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { queryList, enableUser, disableUser } from '@/api/user'
export default {
  name: 'UserList',
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
      userList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        phone: undefined,
        name: undefined
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
    userQuery() {
      this.listLoading = true
      queryList(this.listQuery)
        .then(response => {
          this.userList = response.data.data
          this.total = Number(response.data.total)
          this.listLoading = false
        })
        .catch(() => {
          this.userList = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleSearch() {
      this.listQuery.page = 1
      this.userQuery()
    },
    showProfile(row) {
      this.$router.push({ path: '/user/profile', query: { id: row.id }})
    },
    handleEnable(row) {
      this.$confirm('是否启用用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        enableUser(row.id).then(resp => {
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
      this.$confirm('是否禁用用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        disableUser(row.id).then(resp => {
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
