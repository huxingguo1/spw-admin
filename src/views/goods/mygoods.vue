<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" min-width="100px" label="商品ID" prop="commodityId">
        <template slot-scope="{row}">
          <span class="link-type" @click="showProfile(row)">{{ row.commodityId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="商品规格ID" prop="id" />
      <el-table-column align="center" min-width="100px" label="商品名称" prop="name" />
      <el-table-column align="center" min-width="100px" label="规格" prop="value" />
      <el-table-column align="center" min-width="100px" label="库存" prop="storage" />
      <el-table-column align="center" min-width="100px" label="价格" prop="price" />
      <el-table-column align="center" min-width="100px" label="商品编码" prop="code" />
      <el-table-column align="center" min-width="100px" label="厂家" prop="distributor" />
      <el-table-column align="center" min-width="100px" label="品牌" prop="brand" />
      <el-table-column align="center" min-width="100px" label="分类" prop="typeName" />
      <el-table-column align="center" min-width="100px" label="描述" prop="description" />
      <el-table-column align="center" min-width="200px" label="操作" sortable>
        <template slot-scope="scope">
          <el-button v-permission="['/admin/goods/updateStorage']" type="primary" size="mini" @click="setInfo(scope.row)">修改库存</el-button>
          <!--          <el-button v-permission="['/admin/goods/up']" type="success" size="mini" @click="setInfo(scope.row)">上架</el-button>-->
          <!--          <el-button v-permission="['/admin/goods/down']" type="danger" size="mini" @click="setInfo(scope.row)">下架</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="mygoodsQuery"
    />
    <el-dialog title="库存修改" :visible.sync="attrVisible">
      <el-input v-model="storage" oninput="value=value.replace(/[^\d]/g,'').replace(/^0(\d+)$/,'$1')" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="attrVisible = false">取消</el-button>
        <el-button v-permission="['/admin/goods/updateStorage']" type="primary" @click="updateStorgae">确定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { mygoodsQuery, updateStorgae, upGoods, downGoods } from '@/api/goodsstorage'
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
      attrVisible: false,
      total: 0,
      storage: 0,
      rowbak: undefined,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20
      },
      updatelist: {
        id: undefined,
        storage: undefined
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
    this.mygoodsQuery()
    this.typeQuery()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.mygoodsQuery()
    },
    typeQuery() {
      typeQuery(0).then(resp => {
        this.typeList = resp.data
      })
    },
    mygoodsQuery() {
      this.listLoading = true
      mygoodsQuery(this.listQuery)
        .then(response => {
          this.list = response.data.records
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
      this.$router.push({ path: '/goods/mygoodsadd' })
    },
    upGoodsHandle(row) {
      this.$confirm('是否确认上架商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        upGoods(row.id).then(resp => {
          row.status = 1
          this.$notify({
            title: '提示',
            message: '上架成功！',
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
    downGoodsHandle(row) {
      this.$confirm('是否确认下架商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        downGoods(row.id).then(resp => {
          row.status = 2
          this.$notify({
            title: '提示',
            message: '下架成功！',
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
    setInfo(row) {
      this.rowbak = row
      this.storage = row.storage
      this.attrVisible = true
    },
    updateStorgae() {
      this.updatelist.id = this.rowbak.stid
      this.updatelist.storage = this.storage
      updateStorgae(this.updatelist)
        .then(response => {
          this.rowbak.storage = this.storage
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        })
        .catch(response => {
          this.$notify.error({
            title: '修改失败',
            message: response.data.errmsg
          })
        })
      this.attrVisible = false
    },
    showProfile(row) {
      this.$router.push({ path: '/goods/info', query: { id: row.commodityId }})
    }
  }
}
</script>
