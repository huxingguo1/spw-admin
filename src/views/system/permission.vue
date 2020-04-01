<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.account" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户账号" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="权限名称" prop="menu" sortable />
      <el-table-column align="center" label="接口地址" prop="api" />

      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.userState === '正常' " type="primary" size="mini" @click="banUser(scope.row)">封禁
          </el-button>
          <el-button v-else type="primary" size="mini" @click="recover(scope.row)">正常</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户账号" prop="account">
          <el-input id="account" v-model="dataForm.account" maxlength="12" placeholder="请输入6到12位账号" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="dataForm.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="dataForm.password" placeholder="请输入密码" type="password" />
        </el-form-item>

        <el-form-item label="用户身份" prop="userRole">
          <el-select v-model="dataForm.userRole" placeholder="请选择用户身份" style="height: 40px;width: 300px;">
            <el-option
              v-for="item in userRoleOptions"
              :key="item.userRole"
              :label="item.userRole"
              :value="item.userRole"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="用户状态" prop="userState">
          <el-select v-model="dataForm.userState" placeholder="请选择用户状态" style="height: 40px;width: 300px;">
            <el-option
              v-for="item in userStateOtions"
              :key="item.userState"
              :label="item.userState"
              :value="item.userState"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { list } from '@/api/permission'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserManager',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20
      },
      dataForm: {
        id: undefined,
        account: undefined,
        password: undefined,
        userName: undefined,
        userRole: undefined,
        userState: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      // rules: {
      //   account: [{ required: true, message: '用户账号不能为空', trigger: 'blur', minlength: '6' }],
      //   userName: [{ required: true, message: '用户名称不能为空', tigger: 'blur' }],
      //   password: [{ required: true, message: '密码不能为空', tigger: 'blur' }],
      //   userRole: [{ required: true, message: '用户身份不能为空', tigger: 'blur' }],
      //   userState: [{ required: true, message: '用户状态不能为空', tigger: 'blur' }]
      // },
      permissionDialogFormVisible: false,
      systemPermissions: null,
      assignedPermissions: null,
      permissionForm: {
        rid: undefined,
        permission: undefined,
        api: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      list()
        .then(response => {
          this.list = response.data
          this.total = Number(response.data.total)
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        account: undefined,
        password: undefined,
        userName: undefined,
        userRole: undefined
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // createData() {
    //   this.$refs['dataForm'].validate(valid => {
    //     if (valid) {
    //       createUser(this.dataForm)
    //         .then(response => {
    //           this.list.unshift(response.data)
    //           this.dialogFormVisible = false
    //           this.$notify.success({
    //             title: '成功',
    //             message: '添加角色成功'
    //           })
    //         })
    //         .catch(response => {
    //           this.$notify.error({
    //             title: '失败',
    //             message: response.data.errmsg
    //           })
    //         })
    //     }
    //   })
    // },
    // handleDelete(row) {
    //   deleteUser(row.id)
    //     .then(response => {
    //       this.$notify.success({
    //         title: '成功',
    //         message: '删除用户成功'
    //       })
    //       const index = this.list.indexOf(row)
    //       this.list.splice(index, 1)
    //     })
    //     .catch(response => {
    //       this.$notify.error({
    //         title: '失败',
    //         message: response.data.errmsg
    //       })
    //     })
    // },
    // banUser(row) {
    //   banUser(row.id).then(response => {
    //     this.$notify.success({
    //       title: '成功',
    //       message: '封禁成功'
    //     })
    //     this.getList()
    //   })
    // },
    // recover(row) {
    //   recover(row.id).then(response => {
    //     this.$notify.success({
    //       title: '成功',
    //       message: '解除成功'
    //     })
    //     this.getList()
    //   })
    // },
    updateData() {

    }

  }
}

</script>

