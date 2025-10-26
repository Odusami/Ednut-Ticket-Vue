<template>
  <div class="auth-page" data-testid="auth-page">
    <div class="container">
      <div class="auth-card">
        <h1 class="auth-title" data-testid="auth-title">
          {{ isLogin ? 'Login to Your Account' : 'Create Your Account' }}
        </h1>
        
        <form @submit.prevent="handleSubmit" class="auth-form" data-testid="auth-form">
          <div v-if="!isLogin" class="form-group">
            <label for="name">Full Name</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              :class="{ error: errors.name }"
              data-testid="name-input"
            />
            <div v-if="errors.name" class="error-message" data-testid="name-error">
              {{ errors.name }}
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              :class="{ error: errors.email }"
              data-testid="email-input"
            />
            <div v-if="errors.email" class="error-message" data-testid="email-error">
              {{ errors.email }}
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              :class="{ error: errors.password }"
              data-testid="password-input"
            />
            <div v-if="errors.password" class="error-message" data-testid="password-error">
              {{ errors.password }}
            </div>
          </div>

          <div v-if="!isLogin" class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :class="{ error: errors.confirmPassword }"
              data-testid="confirm-password-input"
            />
            <div v-if="errors.confirmPassword" class="error-message" data-testid="confirm-password-error">
              {{ errors.confirmPassword }}
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn--primary btn--full-width"
            :disabled="loading"
            data-testid="auth-submit-btn"
          >
            {{ loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up') }}
          </button>
        </form>

        <p class="auth-switch">
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <button 
            type="button"
            @click="switchMode"
            class="link-button"
            data-testid="auth-switch-btn"
          >
            {{ isLogin ? 'Sign up here' : 'Login here' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './scripts/useAuth'

export default {
  name: 'AuthPage',
  setup() {
    const isLogin = ref(true)
    const formData = reactive({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    const errors = reactive({})
    const loading = ref(false)
    
    const { login, signup } = useAuth()
    const router = useRouter()

    const validateForm = () => {
      // Clear previous errors
      Object.keys(errors).forEach(key => delete errors[key])
      
      if (!isLogin.value && !formData.name.trim()) {
        errors.name = 'Name is required'
      }
      
      if (!formData.email) {
        errors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid'
      }
      
      if (!formData.password) {
        errors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      }
      
      if (!isLogin.value) {
        if (!formData.confirmPassword) {
          errors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match'
        }
      }
      
      return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
      if (!validateForm()) return
      
      loading.value = true
      
      try {
        if (isLogin.value) {
          await login(formData.email, formData.password)
        } else {
          await signup(formData.email, formData.password, formData.name)
        }
        router.push('/dashboard')
      } catch (error) {
        // Error handled in useAuth composable
      } finally {
        loading.value = false
      }
    }

    const switchMode = () => {
      isLogin.value = !isLogin.value
      Object.keys(errors).forEach(key => delete errors[key])
      Object.keys(formData).forEach(key => {
        formData[key] = ''
      })
    }

    return {
      isLogin,
      formData,
      errors,
      loading,
      handleSubmit,
      switchMode
    }
  }
}
</script>