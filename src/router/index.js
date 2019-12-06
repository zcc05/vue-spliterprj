import Vue from 'vue'
import Router from 'vue-router'
import Accredit from '@/views/accredit/accredit'
import Equipment from '@/views/equipment/equipment'
import Pixel from '@/views/pixel/pixel'
import Scene from '@/views/scene/scene'
import Screen from '@/views/screen/screen'
import Window from '@/views/window/window'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Pixel',
      component: Pixel
    },
    {
      path: '/pixel',
      name: 'Pixel',
      component: Pixel
    },
    {
      path: '/screen',
      name: 'Screen',
      component: Screen
    },
    {
      path: '/window',
      name: 'Window',
      component: Window
    },
    {
      path: '/scene',
      name: 'Scene',
      component: Scene
    },
    {
      path: '/equipment',
      name: 'Equipment',
      component: Equipment
    },
    {
      path: '/accredit',
      name: 'Accredit',
      component: Accredit
    }
  ]
})
