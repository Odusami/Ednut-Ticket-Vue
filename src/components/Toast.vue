<template>
  <div 
    v-if="toast"
    :class="['toast', `toast--${toast.type}`]"
    :data-testid="`toast-${toast.type}`"
  >
    <div class="toast__content">
      <span data-testid="toast-message">{{ toast.message }}</span>
    </div>
  </div>
</template>

<script>
import { useAuth } from './scripts/useAuth.js'

export default {
  name: 'Toast',
  setup() {
    const { toast } = useAuth()
    
    return {
      toast
    }
  }
}
</script>