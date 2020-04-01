<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.phone"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入用户手机号"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['/admin/manager/add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="getUserInfo"
    >

      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form :model="userInfo" label-position="left" class="demo-table-expand">
            <el-form-item label="手机号">
              <span>{{ row.phone }}</span>
            </el-form-item>
            <el-form-item label="用户状态">
              <el-tag :type="row.state | enableStatusFilter">
                {{ row.state === 1 ? '正常' : '禁用' }}
              </el-tag>
            </el-form-item>
            <el-form-item label="用户角色">
              <el-tag v-for="item in userRoleNames" :key="item.name" style="margin-left: 10px;">{{ item.name }}</el-tag>
            </el-form-item>
            <!--            <el-form-item label="公司名称">-->
            <!--              <span>{{ userInfo.companyName }}</span>-->
            <!--            </el-form-item>-->

            <!--            <el-form-item label="公司地址">-->
            <!--              <span>{{ userInfo.companyAddr }}</span>-->
            <!--            </el-form-item>-->
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名称" prop="nickname" sortable />
      <el-table-column align="center" label="手机号" prop="phone" />

      <el-table-column align="center" label="用户状态" class-name="status-col">
        <template slot-scope="{row}">
          <el-tag :type="row.state | enableStatusFilter">
            {{ row.state === 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="ctime" />
      <el-table-column align="center" label="操作" min-width="160px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state === 1 " v-permission="['/admin/manager/disable']" type="warning" size="mini" @click="banUser(scope.row)">禁用
          </el-button>
          <el-button v-else v-permission="['/admin/manager/enable']" type="success" size="mini" @click="recover(scope.row)">启用</el-button>
          <el-button v-permission="['/admin/manager/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['/admin/manager/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="updateState">
      <el-form
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
        :rules="rule"
      >
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="dataForm.userName" style="width: 80%" />
        </el-form-item>
        <el-form-item label="角色名称" prop="userRole">

          <el-select v-model="rolesName" multiple placeholder="请选择" @change="getRole">
            <el-option
              v-for="item in allroles"
              :key="item.rid"
              :label="item.name"
              :value="item.name"
            />
          </el-select>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateState = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加 -->
    <el-dialog title="创建" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="dataForm.phone" maxlength="12" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="dataForm.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="dataForm.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item label="选择角色" prop="userRole">
          <el-select v-model="createRoleNames" multiple placeholder="请选择" style="width: 100%;" @change="getRole">
            <el-option
              v-for="item in allroles"
              :key="item.rid"
              :label="item.name"
              :value="item.name"
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
import { list, createUser, deleteUser, enableUser, disableUser, update, queryManagerInfo, queryRoleNames } from '@/api/manager'
import { queryAllRoles } from '@/api/role'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserManager',
  components: { Pagination },
  filters: {
    enableStatusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        phone: undefined
      },
      userStateOtions: [{ userState: '正常' }, { userState: '禁用' }],
      dataForm: {
        id: undefined,
        phone: undefined,
        password: undefined,
        userName: undefined,
        userRole: [],
        userState: undefined
      },
      dialogFormVisible: false,
      updateState: false,
      dialogStatus: '',
      rules: {
        phone: [{ required: true, message: '用户账号不能为空', trigger: 'blur', minlength: '6' }],
        userName: [{ required: true, message: '用户名称不能为空', tigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', tigger: 'blur' }]
        // userRole: [{ required: true, message: '角色不能为空', tigger: 'blur' }]
      },
      rule: {
        userName: [{ required: true, message: '用户名称不能为空', tigger: 'blur' }]
        // userRole: [{ required: true, message: '角色不能为空', tigger: 'blur' }]
      },
      permissionDialogFormVisible: false,
      systemPermissions: null,
      assignedPermissions: null,
      allroles: [],
      userInfo: {
        phone: '',
        companyAddr: '',
        companyName: '',
        userState: ''
      },
      userRoleNames: [],
      expands: [],
      rolesName: [],
      createRoleNames: [],
      userUpdate: {
        id: undefined,
        userName: undefined,
        userRole: []
      }
    }
  },
  created() {
    this.getList()
    this.getuserRoles()
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery)
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        phone: undefined,
        password: undefined,
        userName: undefined,
        userRole: undefined
      }
    },
    getRowKeys: function(row) {
      return row.id
    },
    getRole() {
      if (this.createRoleNames.length >= 2 && this.createRoleNames.indexOf('超级管理员') !== -1) {
        this.$notify.error({
          message: '超级管理员包含所有权限，不能选择其他角色'
        })
      } else if (this.rolesName.length >= 2 && this.rolesName.indexOf('超级管理员') !== -1) {
        this.$notify.error({
          message: '超级管理员包含所有权限，不能选择其他角色'
        })
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
    getuserRoles() {
      queryAllRoles().then(response => {
        this.allroles = response.data
      }).catch(response => {
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.createRoleNames.length >= 2 && this.createRoleNames.indexOf('超级管理员') !== -1) {
            this.$notify.error({
              message: '超级管理员包含所有权限，不能选择其他角色'
            })
            return
          }
          this.dataForm.userRole = []
          for (var i = 0; i < this.allroles.length; i++) {
            if (this.createRoleNames.indexOf(this.allroles[i].name) !== -1) {
              this.dataForm.userRole.push(this.allroles[i].rid)
            }
          }
          createUser(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.createRoleNames = []
              this.$notify.success({
                title: '成功',
                message: '添加用户成功'
              })
            })
            .catch(response => {
              this.dataForm.userRole = []
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    getUserInfo(row, expandedRows) {
      if (expandedRows.length) {
        this.expands = []
        if (row) {
          this.expands.push(row.id)
        }
      } else {
        this.expands = []
      }
      queryManagerInfo(row.id).then(response => {
        this.userInfo = response.data.info
        this.userRoleNames = response.data.roles
        console.log(response.data)
        console.log(this.userRoleNames)
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id)
          .then(response => {
            this.$notify.success({
              title: '成功',
              message: '删除成功'
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
          .catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
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
    handleUpdate(row) {
      queryRoleNames(row.id).then(response => {
        this.rolesName = []
        for (let i = 0; i < response.data.length; i++) {
          this.rolesName.push(response.data[i])
        }
      })
      this.dataForm.userName = row.nickname
      this.dataForm.id = row.id
      this.dialogStatus = 'update'
      this.updateState = true
    },
    banUser(row) {
      disableUser(row.id).then(response => {
        row.state = 2
        this.$notify.success({
          title: '成功',
          message: '禁用成功'
        })
      })
      row.userState = '禁用'
    },
    recover(row) {
      row.state = 1
      enableUser(row.id).then(response => {
        row.userState = '启用'
        this.$notify.success({
          title: '成功',
          message: '启用成功'
        })
      })
    },
    updateData() {
      this.userUpdate.id = this.dataForm.id
      this.userUpdate.userName = this.dataForm.userName
      this.userUpdate.userRole = []
      for (var i = 0; i < this.allroles.length; i++) {
        if (this.rolesName.indexOf(this.allroles[i].name) !== -1) {
          this.userUpdate.userRole.push(this.allroles[i].rid)
        }
      }
      if (this.rolesName.length >= 2 && this.rolesName.indexOf('超级管理员') !== -1) {
        this.$notify.error({
          message: '超级管理员包含所有权限，不能选择其他角色'
        })
        return
      }
      update(this.userUpdate).then(response => {
        this.updateState = false
        this.$notify.success({
          title: '成功',
          message: '修改成功'
        })
        this.getList()
      })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
    }
  }
}
</script>

