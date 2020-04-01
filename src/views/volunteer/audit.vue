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
      <el-table-column align="center" label="志愿者编码" prop="id" sortable>
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
      <el-table-column align="center" label="创建时间" prop="ctime" sortable />
      <el-table-column align="center" label="操作" sortable>
        <template slot-scope="scope">
          <el-button v-permission="['/admin/user/v/audit/pass']" v-waves type="success" size="mini" @click="auditPass(scope.row)">通过</el-button>
          <el-button v-permission="['/admin/user/v/audit/refuse']" v-waves type="danger" size="mini" @click="auditRefuse(scope.row)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="volunteerList.length>0" :total="volunteerList.length" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="volunteerQuery" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { queryAuditList, auditPass, auditRefuse } from '@/api/volunteer'
export default {
  name: 'VolunteerAudit',
  directives: {
    waves
  },
  components: { Pagination },
  data: function() {
    return {
      volunteerList: null,
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
      queryAuditList(this.listQuery)
        .then(response => {
          this.volunteerList = response.data.data
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
    auditPass(row) {
      this.$confirm('是否确定审核通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        auditPass(row.id).then(resp => {
          const index = this.volunteerList.indexOf(row)
          if (index >= 0) {
            this.volunteerList.splice(index, 1)
          }
          this.$notify({
            title: '提示',
            message: '审核通过！',
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
    auditRefuse(row) {
      this.$confirm('是否确定审核通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        auditRefuse(row.id).then(resp => {
          const index = this.volunteerList.indexOf(row)
          if (index >= 0) {
            this.volunteerList.splice(index, 1)
          }
          this.$notify({
            title: '提示',
            message: '审核拒绝！',
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
