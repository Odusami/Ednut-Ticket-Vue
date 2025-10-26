<template>
  <div class="app" data-testid="app">
    <Header v-if="showLayout" />
    <main class="main-content">
      <router-view />
    </main>
    <Footer v-if="showLayout" />
    <Toast />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Toast from './components/Toast.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Toast
  },
  setup() {
    const route = useRoute()
    
    // Show layout for all routes except landing and auth pages
    const showLayout = computed(() => {
      return route.path !== '/' && route.path !== '/auth'
    })

    return {
      showLayout
    }
  }
}
</script>