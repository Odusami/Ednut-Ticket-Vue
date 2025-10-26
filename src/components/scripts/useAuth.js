import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Reactive state (equivalent to React useState)
const isAuthenticated = ref(false)
const user = ref(null)
const toast = ref(null)

export function useAuth() {
  const router = useRouter()

  // Check for existing session on initialization (equivalent to useEffect)
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('ticketapp_session')
    if (session) {
      try {
        const userData = JSON.parse(session)
        // Ensure firstLetter is set
        if (userData.name && !userData.firstLetter) {
          userData.firstLetter = userData.name.charAt(0).toUpperCase()
        }
        user.value = userData
        isAuthenticated.value = true
      } catch (error) {
        localStorage.removeItem('ticketapp_session')
      }
    }
  }

  const showToast = (message, type = 'info') => {
    toast.value = { message, type }
    setTimeout(() => {
      toast.value = null
    }, 3000)
  }

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const userData = {
            id: 1,
            email,
            name: email.split('@')[0],
            firstLetter: email.charAt(0).toUpperCase()
          }
          localStorage.setItem('ticketapp_session', JSON.stringify(userData))
          user.value = userData
          isAuthenticated.value = true
          showToast('Login successful!', 'success')
          resolve(userData)
        } else {
          showToast('Invalid credentials', 'error')
          reject(new Error('Invalid credentials'))
        }
      }, 1000)
    })
  }

  const signup = async (email, password, name) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password && name) {
          const userData = {
            id: Date.now(),
            email,
            name,
            firstLetter: name.charAt(0).toUpperCase()
          }
          localStorage.setItem('ticketapp_session', JSON.stringify(userData))
          user.value = userData
          isAuthenticated.value = true
          showToast('Account created successfully!', 'success')
          resolve(userData)
        } else {
          showToast('Please fill all fields', 'error')
          reject(new Error('Please fill all fields'))
        }
      }, 1000)
    })
  }

  const logout = () => {
    localStorage.removeItem('ticketapp_session')
    user.value = null
    isAuthenticated.value = false
    showToast('Logged out successfully', 'info')
    router.push('/')
  }

  // Return reactive state and methods (equivalent to React context value)
  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    user: computed(() => user.value),
    toast: computed(() => toast.value),
    login,
    signup,
    logout,
    showToast
  }
}