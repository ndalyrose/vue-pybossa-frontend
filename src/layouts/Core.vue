<template>
  <div id="core-layout">
    <div id="app-background" :style="appBgStyle"></div>
    <app-navbar
      :currentUser="currentUser">
    </app-navbar>
    <main>
      <router-view
        :currentUser="currentUser">
      </router-view>
    </main>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppFooter from '@/components/footers/AppFooter'
import AppNavbar from '@/components/navs/AppNavbar'
import appBackground from '@/assets/img/app-background.jpg'

export default {
  components: {
    AppNavbar,
    AppFooter
  },

  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },

  computed: {
    appBgStyle: function () {
      return {
        background: `url(${appBackground}) no-repeat center left /cover fixed`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#core-layout {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;

  #app-background {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    min-height: 100%;
    height: auto;
    width: 100%;
    min-width: 1024px;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }

  main {
    flex: 1 1 auto;
  }
}
</style>
