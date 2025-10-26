<template>
  <header class="header" data-testid="header">
    <div class="container">
      <div class="header-content">
        <h2 to="/" class="logo" data-testid="logo">
          Ednut Ticket
        </h2>

        <nav
          ref="navRef"
          :class="['nav', { 'nav--open': isMobileMenuOpen }]"
        >
          <template v-if="isAuthenticated">
            <router-link
              to="/dashboard"
              @click="handleNavLinkClick"
              :class="['nav-link', { active: isActive('/dashboard') }]"
              data-testid="nav-dashboard"
            >
              Dashboard
            </router-link>
            <router-link
              to="/tickets"
              @click="handleNavLinkClick"
              :class="['nav-link', { active: isActive('/tickets') }]"
              data-testid="nav-tickets"
            >
              Tickets
            </router-link>
            <div class="user-menu">
              <span :title="user?.name" data-testid="user-greeting">{{ userFirstLetter }}</span>
              <button
                @click="handleLogout"
                class="btn btn--secondary"
                data-testid="logout-btn"
              >
                Logout
              </button>
            </div>
          </template>
          <template v-else>
            <router-link to="/auth" class="nav-link" data-testid="nav-auth">
              Login
            </router-link>
            <router-link
              to="/auth"
              class="btn btn--primary"
              data-testid="nav-get-started"
            >
              Get Started
            </router-link>
          </template>
        </nav>

        <button
          ref="toggleRef"
          class="mobile-menu-toggle"
          @click="toggleMobileMenu"
          data-testid="mobile-menu-toggle"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from './scripts/useAuth.js'

export default {
  name: 'Header',
  setup() {
    const isMobileMenuOpen = ref(false)
    const navRef = ref(null)
    const toggleRef = ref(null)
    
    const { isAuthenticated, user, logout } = useAuth()
    const route = useRoute()
    const router = useRouter()

    const userFirstLetter = computed(() => {
      return user.value?.name ? user.value.name.charAt(0).toUpperCase() : ''
    })

    const handleLogout = () => {
      logout()
      isMobileMenuOpen.value = false
    }

    const isActive = (path) => route.path === path

    const handleNavLinkClick = () => {
      isMobileMenuOpen.value = false
    }

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (
        navRef.value &&
        !navRef.value.contains(event.target) &&
        toggleRef.value &&
        !toggleRef.value.contains(event.target)
      ) {
        isMobileMenuOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('mousedown', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('mousedown', handleClickOutside)
    })

    return {
      isMobileMenuOpen,
      navRef,
      toggleRef,
      isAuthenticated,
      user,
      userFirstLetter,
      handleLogout,
      isActive,
      handleNavLinkClick,
      toggleMobileMenu
    }
  }
}
</script>