<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form>
          <el-form-item label="名族">
            <el-input v-model.trim="user.nationality" readonly />
          </el-form-item>
          <el-form-item label="政治面貌">
            <el-input v-model.trim="user.political" readonly />
          </el-form-item>
          <el-form-item label="学历">
            <el-input v-model.trim="user.education" readonly />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form>
          <el-form-item label="邮编">
            <el-input v-model.trim="user.postCode" readonly />
          </el-form-item>
          <el-form-item label="职业">
            <el-input v-model.trim="user.occupation" readonly />
          </el-form-item>
          <el-form-item label="健康状况">
            <el-input v-model.trim="user.health" readonly />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-form>
      <el-form-item label="工作单位">
        <el-input v-model.trim="user.workUnit" readonly />
      </el-form-item>
      <el-form-item label="单位性质">
        <el-input v-model.trim="user.unitProperty" readonly />
      </el-form-item>
      <el-form-item label="志愿意向">
        <el-input v-model.trim="user.vintention" readonly />
      </el-form-item>
      <el-form-item label="技能">
        <div>
          <el-row type="flex" justify="start">
            <el-tag v-for="(item,index) in skills" :key="index" style="margin-right: 20px">{{ item }}</el-tag>
          </el-row>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    skills: {
      type: Array,
      default: () => {
        return []
      }
    },
    user: {
      type: Object,
      default: () => {
        return {
          nationality: '',
          political: '',
          education: '',
          postCode: '',
          occupation: '',
          workUnit: '',
          unitProperty: '',
          health: '',
          vintention: ''
        }
      }
    }
  },
  methods: {
  }
}
</script>
