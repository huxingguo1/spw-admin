<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 160px;" placeholder="请输入订单ID" />
      <el-input v-model="listQuery.userid" clearable class="filter-item" style="width: 160px;" placeholder="请输入用户ID" />
      <el-select v-model="listQuery.orderStatus" placeholder="订单状态" clearable style="width: 120px" class="filter-item" @change="getList">
        <el-option label="未付款" value="0" />
        <el-option label="已付款" value="1" />
        <el-option label="已分配" value="2" />
        <el-option label="配送中" value="3" />
        <el-option label="已送达" value="4" />
        <el-option label="已完成" value="5" />
        <el-option label="超时取消" value="6" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">查找</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="订单ID" prop="id" sortable>
        <template slot-scope="{row}">
          <span class="link-type" @click="showOrderDetails(row)">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户ID" prop="id" sortable>
        <template slot-scope="{row}">
          <span class="link-type" @click="showProfile(row)">{{ row.userId }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" label="订单编号" prop="orderSn" sortable>-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span class="link-type" @click="showOrderDetails(row)">{{ row.orderSn }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" label="订单状态">
        <template slot-scope="{row}">
          <el-tag :type="row.orderStatus | orderStatusStatusColor" class-name="status-col">
            <span>{{ row.orderStatus | orderStatusStatusFilter }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单金额" prop="goodsPrice" />
      <el-table-column align="center" label="收货人名称" prop="consignee" />
      <el-table-column align="center" label="收货人手机号" prop="mobile" />
      <el-table-column align="center" label="收货具体地址" prop="address" />
      <el-table-column align="center" label="发货人" prop="shipOper" />
      <el-table-column align="center" label="发货人电话" prop="shipPhone" />
      <el-table-column align="center" label="创建时间" prop="addTime" sortable />
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>-->
          <el-button v-permission="['/admin/order/distribution']" :type="scope.row.orderStatus | deliverGoodsColor" size="mini" :disabled="scope.row.orderStatus | deliverGoodsFilter " @click="getVol(scope.row)">发货</el-button>
          <!--<el-button type="primary" size="mini" @click="handleRefund(scope.row)">退款</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="分配配送员" :visible.sync="dialogVisible" width="50%">
      <el-table v-loading="dialogLoading" :data="handleForm" height="300px" border fit highlight-current-row style="width: 100%">
        <el-table-column label="配送人ID" min-width="120px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配送人名称" min-width="120px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.realName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配送人手机" min-width="120px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-permission="['/admin/order/distribution']" type="primary" size="mini" @click="setVol(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <pagination v-show="querytotal>0" :total="querytotal" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
    <!-- 订单详情对话框 -->
    <el-dialog :title="isEdit?'更新订单':'订单详情'" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="ruleForm" :model="ruleForm" label-width="80px">
        <el-form-item label="用户ID" prop="id">
          <el-input v-model="ruleForm.id" readonly="" />
        </el-form-item>
        <el-form-item label="订单编号" prop="phone">
          <el-input v-model="ruleForm.orderSn" readonly="" />
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-input v-model="ruleForm.orderStatus" readonly="" />
        </el-form-item>
        <el-form-item label="订单金额" prop="goodsPrice">
          <el-input v-model="ruleForm.goodsPrice" readonly="" />
        </el-form-item>
        <el-form-item label="收货人名称" prop="consignee">
          <el-input v-model="ruleForm.consignee" readonly="" />
        </el-form-item>
        <el-form-item label="收货人手机号" prop="mobile">
          <el-input v-model="ruleForm.mobile" readonly="" />
        </el-form-item>
        <el-form-item label="收货具体地址" prop="address">
          <el-input v-model="ruleForm.address" readonly="" />
        </el-form-item>
        <el-form-item label="发货人" prop="shipOper">
          <el-input v-model="ruleForm.shipOper" readonly="" />
        </el-form-item>
        <el-form-item label="发货人电话" prop="shipPhone">
          <el-input v-model="ruleForm.shipPhone" readonly="" />
        </el-form-item>
        <el-form-item label="创建时间" prop="addTime">
          <el-input v-model="ruleForm.addTime" readonly="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves @click="handleCancle">取 消</el-button>
        <!--<el-button v-waves type="primary" @click="handleEnter">确 定</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { listOrder, handleShip, getVolunteer } from '@/api/order'
export default {
  name: 'Order',
  components: { Pagination },
  filters: {
    orderStatusStatusColor(status) {
      const statusMap = {
        0: 'danger',
        1: 'primary',
        2: 'primary',
        3: 'primary',
        4: 'danger',
        5: 'success',
        6: 'info'
      }
      return statusMap[status]
    },
    orderStatusStatusFilter(status) {
      const statusMap = {
        0: '未付款',
        1: '已付款',
        2: '已分配',
        3: '配送中',
        4: '已送达',
        5: '已完成',
        6: '超时取消'
      }
      return statusMap[status]
    },
    deliverGoodsColor(status) {
      const statusMap = {
        0: 'info',
        1: 'primary',
        2: 'info',
        3: 'info',
        4: 'info',
        5: 'info',
        6: 'info'
      }
      return statusMap[status]
    },
    deliverGoodsFilter(status) {
      const statusMap = {
        0: true,
        1: false,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true
      }
      return statusMap[status]
    }
  },
  data: function() {
    return {
      querytotal: 0,
      listLoading: true,
      dialogLoading: false,
      dialogVisible: false,
      handleForm: undefined,
      handleShiplist: undefined,
      volunteer: undefined,
      row: undefined,
      orderid: undefined,
      list: null,
      listQuery: {
        page: 1,
        size: 20,
        userId: undefined,
        id: undefined,
        orderStatus: undefined
      },
      volunteerList: {
        page: 1,
        size: 20,
        realName: undefined,
        phone: undefined,
        stationId: undefined,
        auditState: 1
      },
      insertvol: {
        id: undefined,
        ship_id: undefined,
        ship_oper: undefined,
        phone: undefined
      },
      dialogFormVisible: false,
      isEdit: false,
      ruleForm: {
        id: '',
        orderSn: '',
        orderStatus: '',
        goodsPrice: '',
        consignee: '',
        mobile: '',
        address: '',
        shipOper: '',
        shipPhone: '',
        addTime: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getList()
    this.$nextTick(() => {
      setInterval(this.getList, 1000 * 60 * 5)
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      // if(this.listQuery.orderSn === '') {
      //   this.listQuery.orderSn = undefined
      // }
      listOrder(this.listQuery).then(response => {
        this.list = response.data.records
        this.querytotal = Number(response.data.total)
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    showOrderDetails(row) {
      this.dialogFormVisible = true
      this.ruleForm.id = row.id
      this.ruleForm.orderStatus = row.orderStatus
      this.ruleForm.orderStatus = this.orderStatusStatus(row.orderStatus)
      this.ruleForm.orderSn = row.orderSn
      this.ruleForm.goodsPrice = row.goodsPrice
      this.ruleForm.consignee = row.consignee
      this.ruleForm.mobile = row.mobile
      this.ruleForm.address = row.address
      this.ruleForm.shipOper = row.shipOper
      this.ruleForm.shipPhone = row.shipPhone
      this.ruleForm.addTime = row.addTime
    },
    handleCancle() {
      this.dialogFormVisible = false
    },
    handleShip() {
      this.listLoading = true
      handleShip(this.insertvol).then(response => {
        this.handleShiplist = response.data.data
        this.total = response.data.total
        this.listLoading = false
        this.getList()
      }).catch(() => {
        this.handleShiplist = []
        this.total = 0
        this.listLoading = false
      })
    },
    getVolunteer() {
      this.listLoading = true
      getVolunteer(this.volunteerList).then(response => {
        this.handleForm = response.data.data
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.handleForm = []
        this.total = 0
        this.listLoading = false
      })
    },
    getVol(row) {
      this.orderid = row.id
      this.row = row
      this.dialogLoading = true
      this.dialogVisible = true
      this.volunteerList.stationId = row.shopId
      this.getVolunteer()
      this.dialogLoading = false
    },
    setVol(row) {
      this.insertvol.id = this.orderid
      this.insertvol.ship_id = row.id
      this.insertvol.ship_oper = row.realName
      this.insertvol.phone = row.phone
      this.handleShip()
      this.dialogVisible = false
      this.row.shipOper = row.realName
      this.row.shipPhone = row.phone
    },
    orderStatusStatus(status) {
      const statusMap = {
        0: '未付款',
        1: '已付款',
        2: '已分配',
        3: '配送中',
        4: '已送达',
        5: '已完成',
        6: '超时取消'
      }

      return statusMap[status]
    },
    showProfile(row) {
      this.$router.push({ path: '/user/profile', query: { id: row.userId }})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
