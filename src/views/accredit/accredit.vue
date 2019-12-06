<template>
  <div>
    <el-row>
      <el-form ref="form" :model="form">
        <el-form-item>
          <el-col :span="11">
            <el-button type="primary" size="medium" class="w-100">{{$t('LicenseSN')}}</el-button>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-button type="primary" size="medium" class="w-100">{{$t('LicenseCheck')}}</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" :rows="10" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-button type="primary" size="medium" class="w-100">{{$t('LicenseOpen')}}</el-button>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-button type="primary" size="medium" class="w-100">{{$t('SceneApply')}}</el-button>
          </el-col>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item>
          <el-col :span="18">
            <el-input v-model="input1">
              <template slot="prepend">{{$t('InfoPassword')}}</template>
            </el-input>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-button type="success" plain class="w-100">{{$t('InfoLogin')}}</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'accredit',
  data () {
    return {
      input1: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
