<template>
  <div id="app">
    <el-container>
      <el-header>
        <nav-bar></nav-bar>
      </el-header>
      <el-main>
        <nav-tabs></nav-tabs>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import NavBar from './components/header/navBar'
import NavTabs from './components/common/navTabs'

export default {
  name: 'App',
  components: {
    NavBar,
    NavTabs
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
    .el-header{
      padding: 0;
    }
    .el-tabs el-tabs--card el-tabs--top{
      height: 800px;
    }
}
</style>
