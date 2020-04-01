<template>
  <div class="app-container">
    <!--商品库存-->
    <el-card class="mx-auto" align="left">
      <h3>可添加商品</h3><br><br>
      <el-table
        v-loading="false"
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
        <el-table-column align="center" min-width="100px" label="库存" prop="repertory" />
        <el-table-column align="center" min-width="100px" label="价格" prop="price" />
        <el-table-column align="center" min-width="100px" label="优惠金额" prop="discount" />
        <el-table-column align="center" min-width="100px" label="商品编码" prop="code" />
        <el-table-column align="center" min-width="100px" label="厂家" prop="distributor" />
        <el-table-column align="center" min-width="100px" label="品牌" prop="brand" />
        <el-table-column align="center" min-width="100px" label="分类" prop="typeName" />
        <el-table-column align="center" min-width="100px" label="描述" prop="description" />
        <el-table-column align="center" min-width="100px" label="操作" sortable>
          <template slot-scope="scope">
            <el-button v-permission="['/admin/goods/save']" type="primary" size="mini" @click="addGoods(scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { getaddList, save } from '@/api/goodsstorage'
import Pagination from '@/components/Pagination'
export default {
  name: 'CommodityAdd',
  components: { Pagination },
  data() {
    return {
      radio: '1',
      list: undefined,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        size: 20
      },
      addlist: {
        skuid: undefined,
        goodsid: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getaddList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = Number(response.data.total)
        this.listLoading = false
      }).catch(resp => {
        this.$notify.error({
          title: '失败',
          message: resp.data.errmsg
        })
      })
    },
    addGoods: function(row) {
      this.$confirm('确认添加至自有货物吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addlist.skuid = row.id
        this.addlist.goodsid = row.commodityId
        save(this.addlist).then(response => {
          this.$router.push({ path: '/goods/mygoods' })
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
        }).catch(resp => {
          this.$notify.error({
            title: '失败',
            message: resp.data.errmsg
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消添加'
        })
      })
    },
    showProfile(row) {
      this.$router.push({ path: '/goods/info', query: { id: row.commodityId }})
    }
  }
}
</script>

