<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入角色名称" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['/admin/role/add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="角色名称" prop="name" sortable />

      <el-table-column align="center" label="操作" min-width="230px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.name==='超级管理员'" type="primary" size="mini" disabled="">编辑</el-button>
          <el-button v-else v-permission="['/admin/role/name/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.name==='超级管理员'" type="danger" disabled="" size="mini">删除</el-button>
          <el-button v-else v-permission="['/admin/role/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button v-if="scope.row.name==='超级管理员'" type="primary" disabled="" size="mini">授权</el-button>
          <el-button v-else v-permission="['/admin/permissions/add']" type="primary" size="mini" @click="handlePermission(scope.row)">授权</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog :visible.sync="permissionDialogFormVisible" title="权限配置">
      <el-tree
        ref="tree"
        :data="allPermissions"
        :default-checked-keys="rolePermissions"
        show-checkbox
        node-key="api"
        highlight-current
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ data.menu }}</span>
          <el-tag v-if="data.api" type="success" size="mini">{{ data.api }}</el-tag>
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updatePermission">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { list, update, createRole, deleteRole, updatePermission } from '@/api/role'
import { queryRolePermissions } from '@/api/permission'
import Pagination from '@/components/Pagination'

export default {
  name: 'RoleManager',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        name: undefined,
        rid: undefined
      },
      perms: new Map(),
      dataForm: {
        name: undefined,
        rid: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      permissionDialogFormVisible: false,
      allPermissions: null,
      rolePermissions: null,
      permissionForm: {
        rid: undefined,
        permissions: [],
        api: undefined,
        permission: undefined,
        apis: [],
        deletes: []
      }
    }
  },
  created() {
    this.getList()
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
        name: undefined
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
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createRole(this.dataForm.name)
            .then(response => {
              this.list.unshift(response.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加角色成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleUpdate(row) {
      console.log(row.name)
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          update(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.rid === this.dataForm.rid) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新管理员成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(row.rid)
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
    handlePermission(row) {
      this.permissionDialogFormVisible = true
      this.permissionForm.rid = row.rid
      queryRolePermissions(row.rid)
        .then(response => {
          this.allPermissions = response.data.all
          this.rolePermissions = response.data.apis
        })
    },
    updatePermission() {
      this.permissionForm.permissions = this.$refs.tree.getCheckedKeys(true)
      this.permissionForm.apis = this.permissionForm.permissions.slice()
      this.permissionForm.deletes = this.rolePermissions.slice()

      if (this.rolePermissions != null) {
        for (var i = 0; i < this.rolePermissions.length; i++) {
          // 判断原来的和现在选的是不是一样，要是不一样，可能是添加 也可能是删除
          if (this.permissionForm.permissions.indexOf(this.rolePermissions[i]) !== -1) {
            this.permissionForm.apis.splice(this.permissionForm.apis.indexOf(this.rolePermissions[i]), 1)
            this.permissionForm.deletes.splice(this.permissionForm.deletes.indexOf(this.rolePermissions[i]), 1)
          }
        }
      }
      updatePermission({ rid: this.permissionForm.rid, apis: this.permissionForm.apis, deletes: this.permissionForm.deletes })
        .then(response => {
          this.permissionDialogFormVisible = false
          this.perms = new Map()
          this.$notify.success({
            title: '成功',
            message: '授权成功'
          })
        })
        .catch(response => {
          this.perms = new Map()
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
    }
  }
}
</script>
