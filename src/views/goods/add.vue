<template>
  <div class="app-container">

    <el-card class="mx-auto" align="left">
      <h3>商品添加</h3><br><br>
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="center"
        label-width="100px"
        style="width: 606px; margin-left:40px;"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品编码" prop="coding">
          <el-input v-model="dataForm.coding" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="厂家" prop="distributor">
          <el-select v-model="dataForm.distributor" style="width: 100%" placeholder="请选择厂家信息">
            <el-option
              v-for="item in distributor"
              :key="item.id"
              :label="item.suppliername"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="dataForm.brand" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item label="分类" prop="type">
          <el-cascader
            v-model="dataForm.type"
            style="width: 100%"
            clearable
            :props="props"
            :show-all-levels="false"
          />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="dataForm.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="是否上架" prop="isNoPutaway">
          <el-radio v-model="dataForm.isNoPutaway" label="是">是</el-radio>
          <el-radio v-model="dataForm.isNoPutaway" label="否">否</el-radio>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="dataForm.description" type="textarea" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mx-auto item-margin" align="left">
      <h3>商品介绍</h3><br><br>
      <tinymce
        ref="tinymce"
        v-model="dataForm.richText"
        :height="500"
        :html="html"
        @input="getContent"
      />
    </el-card>

    <el-card class="mx-auto item-margin" align="left">
      <h3>商品规格</h3><br><br>
      <div class="filter-container">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="addSpec"
        >添加
        </el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="dataForm.specList"
        element-loading-text="正在查询中。。。"
        border
        fit
        highlight-current-row
      >
        <!--<el-table-column align="center" min-width="100px" label="图片" prop="img">-->
        <!--<template slot-scope="{row}">-->
        <!--<img width="40px" height="40px" :src="row.img" alt="">-->
        <!--</template>-->
        <!--</el-table-column>-->
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
            <el-button type="primary" size="mini" @click="editSpec(scope.row)">编辑</el-button>
            <el-button type="primary" size="mini" @click="deleteSpec(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 商品属性 -->
    <el-card class="mx-auto item-margin" align="left">
      <h3>商品属性</h3><br><br>
      <div class="filter-container">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="addProperty"
        >添加
        </el-button>
      </div>
      <el-table
        v-loading="false"
        :data="dataForm.attributeList"
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
            <el-button type="primary" size="mini" @click="editProperty(scope.row)">编辑</el-button>
            <el-button type="primary" size="mini" @click="deleteProperty(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--商品库存-->
    <el-card class="mx-auto item-margin" align="left">
      <h3>商品库存</h3><br><br>
      <div class="filter-container">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="addSku"
        >添加
        </el-button></div>
      <el-table
        v-loading="false"
        :data="dataForm.skuList"
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
            <el-button type="primary" size="mini" @click="editSku(scope.row)">编辑</el-button>
            <el-button type="primary" size="mini" @click="deleteSku(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑商品规格 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="specForm"
        :rules="specRules"
        :model="specForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="specForm.name" placeholder="请输入属性名称" />
        </el-form-item>
        <el-form-item label="属性值" prop="value">
          <el-input v-model="specForm.value" placeholder="请输入属性值" />
        </el-form-item>
        <!--        <el-form-item label="排序值" prop="sort">-->
        <!--          <el-input v-model="specForm.sort" placeholder="请输入属性值" oninput="value=value.replace(/[^\d]/g,'').replace(/^0(\d+)$/,'$1')" />-->
        <!--        </el-form-item>-->
        <!--<el-form-item label="图片" prop="img">-->
        <!--<img v-if="dialogStatus === 'editspec'" width="180px" height="180px" :src="specForm.img" alt="">-->
        <!--<el-upload-->
        <!--ref="upload"-->
        <!--v-model="specForm.img"-->
        <!--action=""-->
        <!--list-type="picture-card"-->
        <!--:on-change="change"-->
        <!--:on-preview="handlePictureCardPreview"-->
        <!--:auto-upload="false"-->
        <!--multiple-->
        <!--:limit="1"-->
        <!--&gt;-->
        <!--<i class="el-icon-plus" />-->
        <!--</el-upload>-->
        <!--<el-dialog :visible.sync="dialogVisible">-->
        <!--<img width="100%" :src="specForm.img" alt="">-->
        <!--</el-dialog>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus === 'spec'" type="primary" @click="createSpec">确定</el-button>
        <el-button v-else type="primary" @click="uppSpec">确定</el-button>
      </div>
    </el-dialog>

    <!-- 添加/编辑商品属性 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="attrVisible">
      <el-form
        ref="attrForm"
        :rules="attrRules"
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
        :rules="skuRules"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <!-- 动态生成 -->
        <div class="moreRules">
          <div v-for="(item,j) in map" :key="j" class="moreRulesIn">
            <el-form-item :label="j">
              <el-select v-model="names[j]" placeholder="点击选择规商品格值" clearable style="height: 40px;width: 301px;" @change="getvalue">
                <el-option
                  v-for="item in map[j]"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="金额" prop="price">
          <el-input v-model="skuForm.price" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="优惠金额" prop="discount">
          <el-input v-model="skuForm.discount" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入优惠金额" />
        </el-form-item>
        <el-form-item label="库存" prop="repertory">
          <el-input v-model="skuForm.repertory" placeholder="请输入库存" />
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <el-upload
            ref="upload"
            v-model="this.url"
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
        <el-button @click="cancel">取消</el-button>
        <el-button v-if="dialogStatus === 'repertory'" type="primary" @click="createSku">确定</el-button>
        <el-button v-else type="primary" @click="updateSku">确定</el-button>
      </div>
    </el-dialog>
    <el-card class="mx-auto item-margin" align="left">
      <div class="dialog-footer" align="right">
        <el-button @click="goback">返回</el-button>
        <el-button type="primary" @click="createCommodity">确定</el-button>
      </div>
    </el-card>

  </div>
</template>
<script>
import { typeQuery, createCommodity, getDistributor } from '@/api/commodityAdd'
import Tinymce from '../../components/Tinymce/index'
import { upload } from '@/api/storage'
export default {
  name: 'CommodityAdd',
  components: { Tinymce },
  data() {
    return {
      radio: '1',
      listLoading: false,
      distributor: undefined,
      url: undefined,
      dataForm: {
        name: undefined,
        coding: undefined,
        distributor: undefined,
        brand: undefined,
        type: undefined,
        unit: undefined,
        isNoPutaway: '是',
        description: undefined,
        richText: undefined,
        specList: [],
        attributeList: [],
        skuList: []
      },
      dialogImageUrl: '',
      dialogVisible: false,
      specForm: {
        name: undefined,
        value: undefined,
        sort: undefined,
        img: ''
      },
      names: {},
      attrForm: {
        name: undefined,
        value: undefined
      },
      skuForm: {
        price: undefined,
        discount: undefined,
        repertory: undefined,
        value: undefined,
        img: undefined,
        sort: undefined
      },
      attrName: [],
      updateRow: undefined,
      map: {},
      dialogStatus: '',
      dialogFormVisible: false,
      repertoryVisible: false,
      attrVisible: false,
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
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        coding: [
          { required: true, message: '商品编号不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '分类不能为空', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '单位不能为空', trigger: 'blur' }
        ],
        isNoPutaway: [
          { required: true, message: '是否上架不能为空', trigger: 'blur' }
        ],
        brand: [
          { required: true, message: '品牌不能为空', trigger: 'blur' }
        ],
        distributor: [
          { required: true, message: '厂家不能为空', trigger: 'blur' }
        ]
      },
      specRules: {
        name: [
          { required: true, message: '规格名称不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '规格值不能为空', trigger: 'blur' }
        ]
      },
      attrRules: {
        name: [
          { required: true, message: '属性名称不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '属性值不能为空', trigger: 'blur' }
        ]
      },
      skuRules: {
        price: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        discount: [
          { required: true, message: '优惠金额不能为空', trigger: 'blur' }
        ],
        repertory: [
          { required: true, message: '库存不能为空', trigger: 'blur' }
        ]
      },
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          setTimeout(() => {
            if (node.level === 0) {
              typeQuery(0).then(resp => {
                const cities = resp.data.map((value, i) => ({
                  value: value.id,
                  label: value.type
                  // leaf: node.level >= 1
                }))
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(cities)
              })
            } else {
              typeQuery(node.value).then(resp => {
                const cities = resp.data.map((value, i) => ({
                  value: value.id,
                  label: value.type
                  // leaf: node.level >= 1
                }))
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(cities)
              })
            }
          }, 1000)
        }
      }
    }
  },
  created() {
    this.getSelect()
  },
  methods: {
    createCommodity() {
      createCommodity(this.dataForm).then(resp => {
        if (resp.data) {
          this.$router.push({ path: '/goods/list' })
        }
      }).catch(resp => {
        this.$notify.error({
          title: '失败',
          message: resp.data.errmsg
        })
      })
    },
    getSelect() {
      getDistributor().then(resp => {
        this.distributor = resp.data
      }).catch(resp => {
        this.$notify.error({
          title: '失败',
          message: resp.data.errmsg
        })
      })
    },
    goback() {
      history.go(-1)
    },
    changeUpLoad(file) {
      const formData = new FormData()
      formData.append('file', file.raw)
      upload(formData).then(resp => {
        this.skuForm.img = resp.data
      })
    },
    addSpec() {
      this.specForm.name = undefined
      this.specForm.img = ''
      this.specForm.value = undefined
      this.specForm.sort = undefined
      this.dialogStatus = 'spec'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['specForm'].clearValidate()
      })
    },
    uppSpec() {
      this.updateRow.name = this.specForm.name
      this.updateRow.value = this.specForm.value
      this.updateRow.sort = this.specForm.sort
      this.$refs['specForm'].validate((valid) => {
        if (valid) {
          if (!this.updateRow.name) {
            this.$notify.error({
              title: '错误',
              message: '规格名称不能为空'
            })
            return
          }
          if (!this.updateRow.value) {
            this.$notify.error({
              title: '错误',
              message: '规格值不能为空'
            })
            return
          }
          this.dialogFormVisible = false
        } else {
          return
        }
      })
    },
    editSpec(row) {
      this.specForm = Object.assign({}, row)
      this.dialogStatus = 'editspec'
      this.dialogFormVisible = true
      this.updateRow = row
      this.$nextTick(() => {
        this.$refs['specForm'].clearValidate()
        this.dataForm.skuList = []
      })
    },
    createSpec() {
      this.$refs['specForm'].validate((valid) => {
        if (valid) {
          if (!this.specForm.name) {
            this.$notify.error({
              title: '错误',
              message: '规格名称不能为空'
            })
            return
          }
          if (!this.specForm.value) {
            this.$notify.error({
              title: '错误',
              message: '规格值不能位空'
            })
            return
          }
          var form = Object.assign({}, this.specForm)
          this.dataForm.specList.unshift(form)
          this.dialogFormVisible = false
          this.dataForm.skuList = []
        } else {
          return
        }
      })
    },
    // createSpec() {
    //   var form = Object.assign({}, this.specForm)
    //   this.dataForm.specList.unshift(form)
    //   this.dialogFormVisible = false
    //   this.$nextTick(() => {
    //     this.$refs.upload.clearFiles()
    //   })
    // },
    handlePictureCardPreview(file) {
      console.log(file)
      console.log(file.url)
      this.specForm.img = file.url
      this.dialogVisible = true
    },
    change(file) {
      this.specForm.img = file.url
    },
    deleteSpec(row) {
      const index = this.dataForm.specList.indexOf(row)
      if (index >= 0) {
        this.dataForm.specList.splice(index, 1)
        this.dataForm.skuList = []
      }
    },
    addProperty() {
      this.attrForm.name = undefined
      this.attrForm.value = undefined
      this.dialogStatus = 'property'
      this.attrVisible = true
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
    deleteProperty(row) {
      const index = this.dataForm.attributeList.indexOf(row)
      if (index >= 0) {
        this.dataForm.attributeList.splice(index, 1)
      }
    },
    createAttr() {
      this.$refs['attrForm'].validate((valid) => {
        if (valid) {
          if (isNaN(this.attrForm.name)) {
            this.$notify.error({
              title: '错误',
              message: '属性名称请输入文字'
            })
            return
          }
          if (isNaN(this.attrForm.value)) {
            this.$notify.error({
              title: '错误',
              message: '属性值请输入文字'
            })
            return
          }
          var form = Object.assign({}, this.attrForm)
          this.dataForm.attributeList.unshift(form)
          this.attrVisible = false
        } else {
          return
        }
      })
    },
    // createAttr() {
    //   var form = Object.assign({}, this.attrForm)
    //   this.dataForm.attributeList.unshift(form)
    //   this.attrVisible = false
    // },
    editAttr() {
      this.updateRow.name = this.attrForm.name
      this.updateRow.value = this.attrForm.value
      this.$refs['attrForm'].validate((valid) => {
        if (valid) {
          if (isNaN(this.updateRow.name)) {
            this.$notify.error({
              title: '错误',
              message: '属性名称请输入文字'
            })
            return
          }
          if (isNaN(this.updateRow.value)) {
            this.$notify.error({
              title: '错误',
              message: '属性值请输入文字'
            })
            return
          }
          this.attrVisible = false
        } else {
          return
        }
      })
    },
    addSku() {
      this.skuForm.value = undefined
      this.skuForm.price = undefined
      this.skuForm.discount = undefined
      this.skuForm.repertory = undefined
      this.names = {}
      this.map = {}
      for (var i = 0; i < this.dataForm.specList.length; i++) {
        if (this.map[this.dataForm.specList[i].name] === undefined) {
          this.names[this.dataForm.specList[i].name] = ''
          var val = []
          val.push(this.dataForm.specList[i].value)
          this.map[this.dataForm.specList[i].name] = val
        } else {
          this.map[this.dataForm.specList[i].name].push(this.dataForm.specList[i].value)
        }
      }
      this.dialogStatus = 'repertory'
      this.repertoryVisible = true
      this.$nextTick(() => {
        this.$refs['skuForm'].clearValidate()
        this.$refs.upload.clearFiles()
      })
    },
    editSku(row) {
      this.attrName = row.value.split(';')
      for (var i = 0; i < this.attrName.length; i++) {
        for (var attributeNameKey in this.map) {
          if (this.map[attributeNameKey].indexOf(this.attrName[i]) !== -1) {
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
    deleteSku(row) {
      const index = this.dataForm.skuList.indexOf(row)
      if (index >= 0) {
        this.dataForm.skuList.splice(index, 1)
      }
    },
    updateSku() {
      // this.getSkuValue()
      this.updateRow.price = this.skuForm.price
      this.updateRow.value = this.skuForm.value
      this.updateRow.discount = this.skuForm.discount
      this.updateRow.repertory = this.skuForm.repertory
      this.$refs['skuForm'].validate((valid) => {
        if (valid) {
          if (isNaN(this.updateRow.price)) {
            this.$notify.error({
              title: '错误',
              message: '金额请输入数字'
            })
            return
          }
          if (isNaN(this.updateRow.discount)) {
            this.$notify.error({
              title: '错误',
              message: '优惠金额请输入数字'
            })
            return
          }
          if (isNaN(this.updateRow.repertory)) {
            this.$notify.error({
              title: '错误',
              message: '库存请输入数字'
            })
            return
          }
          if (this.updateRow.price < this.updateRow.discount) {
            this.$notify.error({
              title: '错误',
              message: '优惠金额应该小于价格'
            })
            return
          }
          this.getSkuValue()
          this.repertoryVisible = false
          this.$refs.upload.clearFiles()
        } else {
          return
        }
      })
    },
    cancel() {
      this.repertoryVisible = false
      this.$refs.upload.clearFiles()
    },
    createSku() {
      this.$refs['skuForm'].validate((valid) => {
        if (valid) {
          if (isNaN(this.skuForm.price)) {
            this.$notify.error({
              title: '错误',
              message: '金额请输入数字'
            })
            return
          }
          if (isNaN(this.skuForm.discount)) {
            this.$notify.error({
              title: '错误',
              message: '优惠金额请输入数字'
            })
            return
          }
          if (isNaN(this.skuForm.repertory)) {
            this.$notify.error({
              title: '错误',
              message: '库存请输入数字'
            })
            return
          }
          if (parseFloat(this.skuForm.price) < parseFloat(this.skuForm.discount)) {
            this.$notify.error({
              title: '错误',
              message: '优惠金额应该小于价格'
            })
            this.skuForm.price = ''
            this.skuForm.discount = ''
            return
          }
          var r = this.getSkuValue()
          if (r) {
            var form = Object.assign({}, this.skuForm)
            this.dataForm.skuList.unshift(form)
            this.repertoryVisible = false
            this.$refs.upload.clearFiles()
          }
        } else {
          return
        }
      })
    },
    getvalue() {
      this.$forceUpdate()
    },
    getSkuValue() {
      var str = ''
      console.log(this.map)
      for (var i in this.map) {
        console.log(i)
      }
      for (var key in this.names) {
        if (this.names[key] === undefined || this.names[key] === '') {
          this.$notify.error({
            title: '失败',
            message: '规格' + key + '值不能为空'
          })
          return false
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
      return true
    }
  }

}
</script>

