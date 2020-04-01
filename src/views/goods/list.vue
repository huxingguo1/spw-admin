<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入商品名称"
      />
      <el-select v-model="listQuery.type" placeholder="分类" clearable style="width: 120px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in typeList" :key="item.id" :label="item.type" :value="item.id" />
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找
      </el-button>
      <el-button
        v-permission="['/admin/commodity/add']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="add"
      >添加
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" min-width="100px" label="商品名称" prop="name" sortable />
      <el-table-column align="center" min-width="100px" label="商品编码" prop="code" sortable />
      <el-table-column align="center" min-width="100px" label="厂家" prop="distributor" sortable>
        <template slot-scope="{row}">
          <el-tag>
            {{ row.distributor }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="品牌" prop="brand" sortable>
        <template slot-scope="{row}">
          <el-tag>
            {{ row.brand }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="分类" prop="typeName" sortable>
        <template slot-scope="{row}">
          <el-tag>
            {{ row.typeName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="单位" prop="unit" sortable>
        <template slot-scope="{row}">
          <el-tag>
            {{ row.unit }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="是否上架" prop="isNoPutaway" sortable>
        <template slot-scope="{row}">
          <el-tag :type="row.isNoPutaway | enableStatusFilter">
            {{ row.isNoPutaway }}
          </el-tag>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" min-width="100px" label="店铺id" prop="storeId" sortable />-->
      <el-table-column align="center" min-width="100px" label="描述" prop="description" sortable />
      <el-table-column align="center" min-width="100px" label="创建时间" prop="ctime" sortable />
      <el-table-column align="center" min-width="160px" label="操作" sortable>
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="getInfo(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.isNoPutaway === '否'" v-permission="['/admin/commodity/state']" type="primary" size="mini" @click="up(scope.row)">上架</el-button>
          <el-button v-else v-permission="['/admin/commodity/state']" type="danger" size="mini" @click="down(scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="commodityQuery"
    />

  </div>
</template>
<script>
import { commodityQuery, commodityState } from '@/api/commodity'
import { typeQuery } from '@/api/commodityAdd'
import Pagination from '@/components/Pagination'

export default {
  name: 'CommodityList',
  components: { Pagination },
  filters: {
    enableStatusFilter(status) {
      const statusMap = {
        '否': 'danger',
        '是': 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      typeList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        name: undefined,
        type: undefined
      },
      dataForm: {
        commodityId: undefined,
        name: undefined,
        value: undefined
      },
      dialogFormVisible: false,
      repertoryVisible: false,
      dialogStatus: '',
      textMap: {
        property: '添加属性',
        repertory: '添加库存'
      }
    }
  },
  created() {
    this.commodityQuery()
    this.typeQuery()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.commodityQuery()
    },
    typeQuery() {
      typeQuery(0).then(resp => {
        this.typeList = resp.data
      })
    },
    commodityQuery() {
      this.listLoading = true
      commodityQuery(this.listQuery)
        .then(response => {
          this.list = response.data.data
          this.total = Number(response.data.total)
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    add() {
      this.$router.push({ path: '/goods/add' })
    },
    getInfo(row) {
      this.$router.push({ path: '/goods/info', query: { id: row.id }})
    },
    up(row) {
      commodityState(row.id, '是').then(resp => {
        this.$notify.success({
          title: '成功',
          message: '上架成功'
        })
        row.isNoPutaway = '是'
      }).catch(resp => {
        this.$notify.error({
          title: '失败',
          message: resp.data.errmsg
        })
      })
    },
    down(row) {
      this.$confirm('下架商品将不再出售！', '商品下架', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        commodityState(row.id, '否').then(resp => {
          this.$notify.success({
            title: '成功',
            message: '下架成功'
          })
          row.isNoPutaway = '否'
        }).catch(resp => {
          this.$notify.error({
            title: '失败',
            message: resp.data.errmsg
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架'
        })
      })
    }
  }
}
</script>
