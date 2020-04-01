<template>
  <div class="app-container">
    <!-- 商品详情 -->
    <el-card class="mx-auto" align="left">
      <h3>商品详情</h3><br><br>
      <el-form
        ref="dataForm"
        :model="commodityInfo"
        status-icon
        label-position="center"
        label-width="100px"
        style="width: 606px; margin-left:40px;"
      >
        <el-form-item label="商品名称">
          <el-input v-model="commodityInfo.name" />
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="commodityInfo.code" />
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="commodityInfo.brand" />
        </el-form-item>
        <el-form-item label="分类">
          <el-cascader
            v-model="commodityInfo.type"
            :options="cityList"
            style="width: 100%"
            :props="optionProps"
            :show-all-levels="false"
          />
        </el-form-item>
        <el-form-item label="是否上架">
          <!--<el-input v-model="commodityInfo.isNoPutaway" />-->
          <el-radio v-model="isNoPutaway" label="是">是</el-radio>
          <el-radio v-model="isNoPutaway" label="否">否</el-radio>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="commodityInfo.description" type="textarea" />
        </el-form-item>
      </el-form>
      <el-button v-permission="['/admin/commodity/details/update']" type="primary" style="margin-left: 50%" @click="commodityDetailsUpdate">确定</el-button>
    </el-card>

    <el-card class="mx-auto item-margin" align="left">
      <h3>商品介绍</h3><br><br>
      <tinymce
        ref="tinymce"
        v-model="commodityInfo.richText"
        :height="500"
        :html="html"
      />
      <br>
      <el-button v-permission="['/admin/commodity/richtext/update']" type="primary" style="margin-left: 50%" @click="updateTin">确定</el-button>
    </el-card>

    <!-- 商品规格 -->
    <el-card class="mx-auto item-margin" align="left">
      <h3>商品规格</h3><br><br>
      <div class="filter-container">
        <el-select v-model="listQuery.name" placeholder="属性" clearable style="width: 120px" class="filter-item" @change="handleFilter">
          <el-option v-for="(item,j) in attributeName" :key="j" :label="j" :value="j" />
        </el-select>
        <el-button
          v-permission="['/admin/spec/add']"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="addSpec"
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
        <!--<el-table-column align="center" min-width="100px" label="图片" prop="img" />-->
        <el-table-column align="center" min-width="100px" label="属性" prop="name">
          <template slot-scope="{row}">
            <el-tag>
              {{ row.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="100px" label="属性值" prop="value" />
        <!--        <el-table-column align="center" min-width="100px" label="排序值" prop="sort" />-->
        <el-table-column align="center" min-width="100px" label="操作" sortable>
          <template slot-scope="scope">
            <el-button v-permission="['/admin/spec/update']" type="primary" size="mini" @click="editSpec(scope.row)">编辑</el-button>
            <el-button v-permission="['/admin/spec/delete']" type="danger" size="mini" @click="deleteSpec(scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="getSpec"
      />
    </el-card>

    <!-- 商品属性 -->
    <el-card class="mx-auto item-margin" align="left">
      <h3>商品属性</h3><br><br>
      <div class="filter-container">
        <el-button
          v-permission="['/admin/attribute/add']"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="addProperty"
        >添加
        </el-button>
      </div>
      <el-table
        v-loading="attributeLoading"
        :data="attribute"
        element-loading-text="正在查询中。。。"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" min-width="100px" label="属性" prop="name">
          <template slot-scope="{row}">
            <el-tag>
              {{ row.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="100px" label="属性值" prop="value" />
        <el-table-column align="center" min-width="100px" label="操作">
          <template slot-scope="scope">
            <el-button v-permission="['/admin/attribute/edit']" type="primary" size="mini" @click="editProperty(scope.row)">编辑</el-button>
            <el-button v-permission="['/admin/attribute/delete']" type="danger" size="mini" @click="deleteProperty(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="atotal>0"
        :total="atotal"
        :page.sync="alistQuery.page"
        :limit.sync="alistQuery.size"
        @pagination="getAttribute"
      />
    </el-card>

    <!-- 商品库存 -->
    <el-card class="mx-auto item-margin" align="left">
      <h3>商品库存</h3><br><br>
      <div class="filter-container">
        <el-input
          v-model="slistQuery.value"
          clearable
          class="filter-item"
          style="width: 200px;"
          placeholder="请输入规格"
        />
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleSku"
        >查找</el-button>
        <el-button
          v-permission="['/admin/sku/add']"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="addSku"
        >添加
        </el-button></div>
      <el-table
        v-loading="skuLoading"
        :data="skuList"
        element-loading-text="正在查询中。。。"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" min-width="100px" label="图片" prop="img">
          <template slot-scope="{row}">
            <img width="40px" height="40px" :src="row.img" alt="">
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="100px" label="规格" prop="value" />
        <el-table-column align="center" min-width="100px" label="价格" prop="price" />
        <el-table-column align="center" min-width="100px" label="优惠金额" prop="discount" />
        <el-table-column align="center" min-width="100px" label="库存" prop="repertory" />
        <el-table-column align="center" min-width="100px" label="操作" sortable>
          <template slot-scope="scope">
            <el-button v-permission="['/admin/sku/edit']" type="primary" size="mini" @click="editSku(scope.row)">编辑</el-button>
            <el-button v-permission="['/admin/sku/delete']" type="danger" size="mini" @click="deleteSku(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="stotal>0"
        :total="stotal"
        :page.sync="slistQuery.page"
        :limit.sync="slistQuery.size"
        @pagination="getSku"
      />
    </el-card>
    <!-- 添加/编辑商品规格 -->
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
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入属性名称" />
        </el-form-item>
        <el-form-item label="属性值" prop="value">
          <el-input v-model="dataForm.value" placeholder="请输入属性值" />
        </el-form-item>
        <!--        <el-form-item label="排序值" prop="value">-->
        <!--          <el-input v-model="dataForm.sort" placeholder="请输入属性值" oninput="value=value.replace(/[^\d]/g,'').replace(/^0(\d+)$/,'$1')" />-->
        <!--        </el-form-item>-->
        <!--<el-form-item label="图片" prop="repertory">-->
        <!--<el-upload-->
        <!--action=""-->
        <!--list-type="picture-card"-->
        <!--:on-preview="handlePictureCardPreview"-->
        <!--:on-remove="handleRemove"-->
        <!--:auto-upload="false"-->
        <!--multiple-->
        <!--:limit="1"-->
        <!--&gt;-->
        <!--<i class="el-icon-plus" />-->
        <!--</el-upload>-->
        <!--<el-dialog :visible.sync="dialogVisible">-->
        <!--<img width="100%" :src="dialogImageUrl" alt="">-->
        <!--</el-dialog>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus === 'spec'" type="primary" @click="createSpec">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加/编辑商品属性 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="attrVisible">
      <el-form
        ref="attrForm"
        :rules="rules"
        :model="attrForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="attrForm.name" placeholder="请输入属性名称！例：颜色" />
        </el-form-item>
        <el-form-item label="属性值" prop="value">
          <el-input v-model="attrForm.value" placeholder="请输入属性值！例：黄色" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="attrVisible = false">取消</el-button>
        <el-button v-if="dialogStatus === 'property'" type="primary" @click="createAttr">确定</el-button>
        <el-button v-else type="primary" @click="editAttr">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加商品库存 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="repertoryVisible">
      <el-form
        ref="skuForm"
        :model="skuForm"
        :rules="repertorys"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <!-- 动态生成 -->
        <div class="moreRules">
          <div v-for="(it,j) in attributeName" :key="j" class="moreRulesIn">
            <el-form-item :label="j">
              <el-select v-model="names[j]" placeholder="点击选择商品规格值" clearable style="height: 40px;width: 301px;" @change="getvalue">
                <el-option
                  v-for="item in attributeName[j]"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="金额" prop="price">
          <el-input v-model="skuForm.price" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="优惠金额" prop="discount">
          <el-input v-model="skuForm.discount" placeholder="请输入优惠金额" />
        </el-form-item>
        <el-form-item label="库存" prop="repertory">
          <el-input v-model="skuForm.repertory" placeholder="请输入库存" />
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <el-upload
            ref="upload"
            v-model="skuForm.img"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="changeUpLoad"
            multiple
            :limit="1"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="repertoryVisible = false">取消</el-button>
        <el-button v-if="dialogStatus === 'repertory'" type="primary" @click="createSku">确定</el-button>
        <el-button v-else type="primary" @click="updateSku">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { queryAllList } from '@/api/commodityAdd'
import { commodityInfo, commodityDetailsUpdate, querySpec, createSpec, querySku, attributeName, queryAttribute, createArrt, createSku, update, deleteSpec, editAttr, deleteAttr, editSku, removeSku, updateTin } from '@/api/commodityInfo'
import Pagination from '@/components/Pagination'
import Tinymce from '../../components/Tinymce/index'
import { upload } from '@/api/storage'

export default {
  name: 'CommodityInfo',
  components: { Pagination, Tinymce },
  data() {
    return {
      list: null,
      attribute: null,
      skuList: null,
      url: undefined,
      total: 0,
      atotal: 0,
      stotal: 0,
      listLoading: true,
      attributeLoading: true,
      skuLoading: true,
      attributeName: {},
      dialogImageUrl: '',
      dialogVisible: false,
      rowbak: undefined,
      skuForm: {
        commodityId: undefined,
        price: undefined,
        discount: undefined,
        repertory: undefined,
        value: undefined,
        img: undefined
      },
      names: {},
      isNoPutaway: undefined,
      optionProps: {
        value: 'id',
        label: 'type',
        children: 'child'
      },
      cityList: [],
      commodityInfo: {
        commodityId: undefined,
        name: undefined,
        code: undefined,
        brand: undefined,
        type: [],
        isNoPutaway: undefined,
        description: undefined,
        richText: undefined
      },
      commodityId: undefined,
      listQuery: {
        page: 1,
        size: 20,
        commodityId: undefined,
        name: undefined
      },
      alistQuery: {
        page: 1,
        size: 20,
        commodityId: undefined,
        name: undefined
      },
      slistQuery: {
        page: 1,
        size: 20,
        commodityId: undefined,
        value: undefined
      },
      dataForm: {
        id: undefined,
        commodityId: undefined,
        name: undefined,
        value: undefined,
        sort: undefined
      },
      attrForm: {
        commodityId: undefined,
        name: undefined,
        value: undefined
      },
      dialogFormVisible: false,
      repertoryVisible: false,
      attrVisible: false,
      dialogStatus: '',
      textMap: {
        property: '添加属性',
        repertory: '添加库存',
        spec: '添加规格',
        editspec: '编辑规格',
        editProperty: '编辑属性',
        editSku: '编辑库存'
      },
      rules: {
        name: [
          { required: true, message: '属性不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '属性值不能为空', trigger: 'blur' }
        ]
      },
      repertorys: {
        price: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        repertory: [
          { required: true, message: '库存不能为空', trigger: 'blur' }
        ]
      },
      updateRow: undefined,
      attrName: []
    }
  },
  created() {
    console.log(this.$route.query.id)
    this.getCommodityInfo()
    this.getSpec()
    this.getSku()
    this.getAttribute()
    this.getattrName()
    this.getGoodType()
  },
  methods: {
    getGoodType() {
      queryAllList().then(resp => {
        this.cityList = resp.data
      })
    },
    getCommodityInfo() {
      this.commodityId = this.$route.query.id
      commodityInfo(this.commodityId)
        .then(response => {
          this.isNoPutaway = response.data.isNoPutaway
          this.commodityInfo.name = response.data.name
          this.commodityInfo.type = response.data.typeListId
          this.commodityInfo.code = response.data.code
          this.commodityInfo.brand = response.data.brand
          this.commodityInfo.isNoPutaway = response.data.isNoPutaway
          this.commodityInfo.description = response.data.description
          this.commodityInfo.richText = response.data.richText
          console.log(this.commodityInfo.richText)
        })
        .catch((response) => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getSpec()
    },
    handleSku() {
      this.slistQuery.page = 1
      this.getSku()
    },
    changeUpLoad(file) {
      const formData = new FormData()
      formData.append('file', file.raw)
      upload(formData).then(resp => {
        this.skuForm.img = resp.data
      })
    },
    getSpec() {
      this.listLoading = true
      this.listQuery.commodityId = this.$route.query.id
      querySpec(this.listQuery).then(resp => {
        this.list = resp.data.data
        this.total = Number(resp.data.total)
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    getAttribute() {
      this.attributeLoading = true
      this.listQuery.commodityId = this.$route.query.id
      queryAttribute(this.listQuery).then(resp => {
        this.attribute = resp.data.data
        this.atotal = Number(resp.data.total)
        this.attributeLoading = false
      }).catch(() => {
        this.attribute = []
        this.atotal = 0
        this.attributeLoading = false
      })
    },
    getSku() {
      this.slistQuery.commodityId = this.$route.query.id
      this.skuLoading = true
      querySku(this.slistQuery).then(resp => {
        this.skuList = resp.data.data
        this.stotal = Number(resp.data.total)
        this.skuLoading = false
      }).catch(() => {
        this.skuList = []
        this.stotal = 0
        this.skuLoading = false
      })
    },
    getvalue() {
      this.$forceUpdate()
    },
    addProperty() {
      this.resetForm()
      this.attrForm.commodityId = this.$route.query.id
      this.dialogStatus = 'property'
      this.attrVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    addSpec() {
      this.resetForm()
      this.dataForm.commodityId = this.$route.query.id
      this.dialogStatus = 'spec'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    editSpec(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'editspec'
      this.dialogFormVisible = true
      this.updateRow = row
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    editProperty(row) {
      this.attrForm = Object.assign({}, row)
      this.dialogStatus = 'editProperty'
      this.attrVisible = true
      this.updateRow = row
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    editSku(row) {
      this.rowbak = row
      console.log(this.rowbak)
      this.attrName = row.value.split(',')
      for (var i = 0; i < this.attrName.length; i++) {
        for (var attributeNameKey in this.attributeName) {
          if (this.attributeName[attributeNameKey].indexOf(this.attrName[i]) !== -1) {
            this.names[attributeNameKey] = this.attrName[i]
          }
        }
      }
      this.skuForm = Object.assign({}, row)
      this.dialogStatus = 'editSku'
      this.repertoryVisible = true
      this.updateRow = row
      this.$nextTick(() => {
        this.$refs['skuForm'].clearValidate()
      })
    },
    addSku() {
      this.skuForm.value = undefined
      this.skuForm.price = undefined
      this.skuForm.discount = undefined
      this.skuForm.repertory = undefined
      this.names = {}
      this.dialogStatus = 'repertory'
      this.repertoryVisible = true
      this.$nextTick(() => {
        this.$refs['skuForm'].clearValidate()
      })
    },
    getattrName() {
      this.skuForm.commodityId = this.$route.query.id
      attributeName(this.skuForm.commodityId).then(resp => {
        this.attributeName = resp.data
        for (var attributeNameKey in this.attributeName) {
          this.names[attributeNameKey] = ''
        }
      })
    },
    resetForm() {
      this.dataForm = {
        commodityId: undefined,
        name: undefined,
        value: undefined,
        sort: undefined
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    createSpec() {
      createSpec(this.dataForm).then(resp => {
        if (resp.data) {
          this.list.unshift(resp.data)
          this.dialogFormVisible = false
        }
      })
        .catch(resp => {
          this.$notify.error({
            title: '失败',
            message: resp.data.errmsg
          })
        })
    },
    updateData() {
      update(this.dataForm).then(resp => {
        this.$notify({
          title: '成功',
          message: '规格更新成功！',
          type: 'success'
        })
        this.updateRow.name = this.dataForm.name
        this.updateRow.value = this.dataForm.value
        this.updateRow.sort = this.dataForm.sort
        this.dialogFormVisible = false
      }).catch(resp => {
        this.$notify.error({
          title: '失败',
          message: resp.data.errmsg
        })
      })
    },
    commodityDetailsUpdate() {
      this.commodityInfo.commodityId = this.$route.query.id
      this.commodityInfo.isNoPutaway = this.isNoPutaway
      commodityDetailsUpdate(this.commodityInfo).then(resp => {
        this.$notify({
          title: '成功',
          message: '商品详情更新成功！',
          type: 'success'
        })
      }).catch(resp => {
        this.$notify.error({
          title: '失败',
          message: resp.data.errmsg
        })
      })
    },
    editAttr() {
      editAttr(this.attrForm).then(resp => {
        this.$notify({
          title: '成功',
          message: '属性更新成功！',
          type: 'success'
        })
        this.updateRow.name = this.attrForm.name
        this.updateRow.value = this.attrForm.value
        this.attrVisible = false
      }).catch(resp => {
        this.$notify.error({
          title: '失败',
          message: resp.data.errmsg
        })
      })
    },
    createAttr() {
      createArrt(this.attrForm).then(resp => {
        this.attribute.unshift(resp.data)
        this.attrVisible = false
      }).catch(resp => {
        this.$notify.error({
          title: '失败',
          message: resp.data.errmsg
        })
      })
    },
    deleteSpec(row) {
      this.$confirm('此操作将永久删除商品规格, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSpec(row.id, this.$route.query.id).then(resp => {
          this.$notify({
            title: '成功',
            message: '规格删除成功！',
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
    deleteSku(row) {
      this.$confirm('此操作将永久删除商品库存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeSku(row.id).then(resp => {
          this.$notify({
            title: '成功',
            message: '库存删除成功！',
            type: 'success'
          })
          const index = this.skuList.indexOf(row)
          if (index >= 0) {
            this.skuList.splice(index, 1)
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
    deleteProperty(row) {
      this.$confirm('此操作将永久删除商品属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAttr(row.id).then(resp => {
          this.$notify({
            title: '成功',
            message: '属性删除成功！',
            type: 'success'
          })
          const index = this.attribute.indexOf(row)
          if (index >= 0) {
            this.attribute.splice(index, 1)
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
    createSku() {
      console.log(11111111111111)
      this.getSkuValue()
      createSku(this.skuForm).then(resp => {
        this.skuList.unshift(resp.data)
        this.repertoryVisible = false
      }).catch(resp => {
        this.$notify.error({
          title: '失败',
          message: resp.data.errmsg
        })
      })
    },
    getSkuValue() {
      var str = ''
      for (var key in this.names) {
        if (this.names[key] === null || this.names[key] === '') {
          this.$notify.error({
            title: '失败',
            message: key + '值不能为空'
          })
          return
        } else {
          str += key + ',' + this.names[key] + ';'
        }
      }
      if (this.skuForm.price === undefined || this.skuForm.price === '') {
        this.$notify.error({
          title: '失败',
          message: '价格不能为空'
        })
        return
      }
      this.skuForm.value = str
    },
    updateSku() {
      this.getSkuValue()
      this.rowbak.img = this.skuForm.img
      editSku(this.skuForm).then(resp => {
        this.updateRow.price = this.skuForm.price
        this.updateRow.value = this.skuForm.value
        this.updateRow.discount = this.skuForm.discount
        this.updateRow.repertory = this.skuForm.repertory
        this.updateRow.img = this.skuForm.img
        this.repertoryVisible = false
      }).catch(resp => {
        this.$notify.error({
          title: '失败',
          message: resp.data.errmsg
        })
      })
    },
    updateTin() {
      updateTin(this.$route.query.id, this.commodityInfo.richText).then(resp => {
        this.$notify.success({
          title: '成功',
          message: '修改成功!'
        })
      }).catch(resp => {
        this.$notify.error({
          title: '失败',
          message: resp.data.errmsg
        })
      })
    }
  }
}
</script>
