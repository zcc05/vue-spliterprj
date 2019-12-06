<template>
  <div>
    <el-tabs
      v-model="activeName"
      type="card"
      v-if="menuList.length"
      @tab-click='tabClick'
    >
      <el-tab-pane
        :key="item.name"
        v-for="(item) in menuList"
        :label="item.name"
        :name="item.route"
      >
        <span slot="label"><i :class="item.icon"></i>  {{$t(item.name)}}</span>
      </el-tab-pane>
      <!--<el-button type="primary">{{$t('btn.text')}}</el-button>-->
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'navTabs',
  data () {
    return {
      activeName: 'pixel',
      menuList: [
        {
          id: '0',
          name: 'frameResolution',
          icon: 'iconfont icon-fenbianshuai',
          route: 'pixel'
        },
        {
          id: '1',
          name: 'frameScreen',
          icon: 'iconfont icon-xianshiping',
          route: 'screen'
        },
        {
          id: '2',
          name: 'frameWindow',
          icon: 'iconfont icon-duochuangkou',
          route: 'window'
        },
        {
          id: '3',
          name: 'frameSave',
          icon: 'iconfont icon-baocun1',
          route: 'save'
        },
        {
          id: '4',
          name: 'frameScene',
          icon: 'iconfont icon-changjing',
          route: 'scene'
        },
        {
          id: '5',
          name: 'frameDevice',
          icon: 'iconfont icon-shebei1',
          route: 'equipment'
        },
        {
          id: '6',
          name: 'frameLicense',
          icon: 'iconfont icon-shouquan',
          route: 'accredit'
        }
      ]
    }
  },
  methods: {
    tabClick (tab) {
      console.log('tab', tab.name)
      this.$router.push(tab.name)
    }
  }
}
</script>

<style scoped>

</style>
