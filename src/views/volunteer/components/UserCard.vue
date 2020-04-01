<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>基本信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div style="color: #36a3f7"><b>信易</b></div>
          <div style="color: #36a3f7"><b>公益</b></div>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.nickname }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="real-info" /><span>实名信息</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            <div class="progress-item">
              <span><b>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</b></span><span>{{ user.realName }}</span>
              <el-divider />
            </div>
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="contact-info" /><span>联系方式</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span><b>手&nbsp;机&nbsp;号&nbsp;&nbsp;：</b></span><span>{{ user.phone }}</span>
            <el-divider />
          </div>
          <div class="progress-item">
            <span><b>邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱：</b></span><span>{{ user.email }}</span>
            <el-divider />
          </div>
          <div class="progress-item">
            <span><b>区域地址：</b></span><span> {{ region }} </span>
            <el-divider />
          </div>
          <div class="progress-item">
            <span><b>详细地址：</b></span><span>{{ user.address }}</span>
            <el-divider />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb },
  props: {
    region: {
      type: String,
      default: () => ''
    },
    user: {
      type: Object,
      default: () => {
        return {
          realName: '',
          nickname: '',
          email: '',
          avatar: '',
          phone: ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .box-center {
   margin: 0 auto;
   display: table;
 }

 .text-muted {
   color: #777;
 }

 .user-profile {
   .user-name {
     font-weight: bold;
   }

   .box-center {
     padding-top: 10px;
   }

   .user-role {
     padding-top: 10px;
     font-weight: 400;
     font-size: 14px;
   }

   .box-social {
     padding-top: 30px;

     .el-table {
       border-top: 1px solid #dfe6ec;
     }
   }

   .user-follow {
     padding-top: 20px;
   }
 }

 .user-bio {
   margin-top: 20px;
   color: #606266;

   span {
     padding-left: 4px;
   }

   .user-bio-section {
     font-size: 14px;
     padding: 15px 0;

     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       padding-bottom: 10px;
       margin-bottom: 10px;
       font-weight: bold;
     }
   }
 }
</style>
