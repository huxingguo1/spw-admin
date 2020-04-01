<template>
  <div class="app-container">
    <el-card class="mx-auto" align="left">
      <h3>分类</h3><br><br>
      <div class="filter-container">
        <el-select v-model="listQuery.type" placeholder="分类" clearable style="width: 120px" class="filter-item" @focus="typeQuery" @change="commodityQuery">
          <el-option v-for="item in typeList" :key="item.id" :label="item.type" :value="item.type" />
        </el-select>
        <el-button
          v-permission="['/admin/smmCommodityType/add']"
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
        <el-table-column align="center" min-width="100px" label="分类名称" prop="type">
          <template slot-scope="scope">
            <span class="link-type" @click="handleProfile(scope.row)">{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="100px" label="描述" prop="description" />
        <el-table-column align="center" min-width="100px" label="创建时间" prop="ctime" sortable />
        <el-table-column align="center" min-width="100px" label="操作" sortable>
          <template slot-scope="scope">
            <el-button v-permission="['/admin/smmCommodityType/update']" type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button v-permission="['/admin/smmCommodityType/delete']" type="danger" size="mini" @click="deletetype(scope.row)">删除</el-button>

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
      <div align="right" style="padding: 20px">
        <el-button type="primary" plain @click="goback">返回</el-button>
      </div>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="typeVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="分类名" prop="type">
          <el-input v-model="dataForm.type" placeholder="请输入属性值" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="dataForm.description" type="textarea" placeholder="请输入属性值" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="typeVisible = false">取消</el-button>
        <el-button v-if="dialogStatus === 'add'" type="primary" @click="createType">确定</el-button>
        <el-button v-else type="primary" @click="editType">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryList, getParentId, typeQuery, addType, updateType, deleteType } from '@/api/category'
import Pagination from '@/components/Pagination'

export default {
  name: 'CommodityType',
  components: { Pagination },
  data() {
    return {
      list: null,
      typeList: null,
      total: 0,
      listLoading: true,
      typeVisible: false,
      dialogStatus: '',
      updateRow: undefined,
      textMap: {
        add: '添加分类',
        edit: '编辑分类'
      },
      listQuery: {
        page: 1,
        size: 20,
        parentId: undefined,
        type: undefined
      },
      rules: {
        type: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ]
      },
      dataForm: {
        id: undefined,
        type: undefined,
        parentId: undefined,
        description: undefined
      }
    }
  },
  created() {
    this.commodityQuery()
  },
  methods: {
    commodityQuery() {
      this.listLoading = true
      this.listQuery.parentId = this.$route.query.id
      queryList(this.listQuery)
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
    deletetype(row) {
      this.$confirm('此操作将永久删除商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteType(row.id).then(resp => {
          this.$notify({
            title: '成功',
            message: '分类删除成功！',
            type: 'success'
          })
          const index = this.list.indexOf(row)
          if (index >= 0) {
            this.list.splice(index, 1)
          }
        }).catch(resp => {
          this.$notify.error({
            title: '失败',
            message: resp.data.errmsg
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
    edit(row) {
      this.dataForm.type = row.type
      this.dataForm.parentId = row.parentId
      this.dataForm.id = row.id
      this.dataForm.description = row.description
      this.dialogStatus = 'edit'
      this.typeVisible = true
      this.updateRow = row
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    editType() {
      updateType(this.dataForm).then(resp => {
        this.$notify({
          title: '成功',
          message: '分类更新成功！',
          type: 'success'
        })
        this.typeVisible = false
        this.updateRow.type = this.dataForm.type
        this.updateRow.description = this.dataForm.description
      })
    },
    typeQuery() {
      typeQuery(this.listQuery.parentId).then(resp => {
        this.typeList = resp.data
      })
    },
    createType() {
      this.dataForm.parentId = this.listQuery.parentId
      addType(this.dataForm).then(resp => {
        this.list.unshift(resp.data)
        this.typeVisible = false
      }).catch(resp => {
        this.$notify.error({
          title: '失败',
          message: resp.data.errmsg
        })
      })
    },
    add() {
      this.dataForm.type = undefined
      this.dataForm.description = undefined
      this.typeVisible = true
      this.dialogStatus = 'add'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleProfile(row) {
      this.listLoading = true
      this.listQuery.parentId = row.id
      queryList(this.listQuery)
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
    goback() {
      getParentId(this.listQuery.parentId).then(resp => {
        this.listQuery.parentId = resp.data
        if (parseInt(this.listQuery.parentId) === 0) {
          history.go(-1)
        } else {
          queryList(this.listQuery)
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
        }
      })
    }
  }
}
</script>
