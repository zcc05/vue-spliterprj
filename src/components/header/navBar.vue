<template>
  <el-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#313a46"
    text-color="#ced4da"
    active-text-color="#ffd04b">
    <el-submenu index="1">
      <template slot="title">{{$t("menuFile")}}</template>
      <el-menu-item index="1-1">{{$t("menuOpen")}}</el-menu-item>
      <el-menu-item index="1-2">{{$t("menuSave")}}</el-menu-item>
      <el-menu-item index="1-3">{{$t("WindowSaveTodev")}}</el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">{{$t("Language")}}</template>
      <el-menu-item index="2-1" @click.native="toggleLang('zh')">中文</el-menu-item>
      <el-menu-item index="2-2" @click.native="toggleLang('en')">English</el-menu-item>
    </el-submenu>
    <el-menu-item index="3"><a href="https://www.ele.me" target="_blank">{{$t("frameDownload")}}</a></el-menu-item>
    <div class="right-menu">
      <div class="lang">
        <el-tooltip class="item" effect="dark" :content="$t('fullScreen')" placement="bottom">
          <i class="el-icon-full-screen"></i>
        </el-tooltip>
      </div>
    </div>
  </el-menu>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  methods: {
    toggleLang (lang) {
      if (lang === 'zh') {
        localStorage.setItem('locale', 'zh')
        this.$i18n.locale = localStorage.getItem('locale')
        this.$message({
          message: '切换为中文！',
          type: 'success'
        })
      } else if (lang === 'en') {
        localStorage.setItem('locale', 'en')
        this.$i18n.locale = localStorage.getItem('locale')
        this.$message({
          message: 'Switch to English!',
          type: 'success'
        })
      }
    },
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="scss" scoped>
  .lang{
    h1{
      color: red;
      font-size: 20px;
    }
  }
  .right-menu{
    float: right;
    height: 100%;
    outline: none;
    .theme-picker{
      vertical-align: middle;
    }
  }
  .errLog-container {
    display: inline-block;
    position: absolute;
    right: 150px;
  }
  .lang {
    display: inline-block;
    height: 60px;
    line-height: 60px;
    margin-right: 20px;
    cursor: pointer;
    color: #fff;
    font-size: 20px;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
</style>
