<template>
  <form @submit.prevent="handleSubmit" class="ticket-form" data-testid="ticket-form">
    <div class="form-group">
      <label for="title">Title *</label>
      <input
        type="text"
        id="title"
        v-model="formData.title"
        :class="{ error: errors.title }"
        placeholder="Enter ticket title"
        data-testid="title-input"
      />
      <div v-if="errors.title" class="error-message" data-testid="title-error">
        {{ errors.title }}
      </div>
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="formData.description"
        rows="4"
        placeholder="Enter ticket description"
        data-testid="description-input"
      ></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="status">Status *</label>
        <select
          id="status"
          v-model="formData.status"
          :class="{ error: errors.status }"
          data-testid="status-select"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <div v-if="errors.status" class="error-message" data-testid="status-error">
          {{ errors.status }}
        </div>
      </div>

      <div class="form-group">
        <label for="priority">Priority</label>
        <select
          id="priority"
          v-model="formData.priority"
          data-testid="priority-select"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
    </div>

    <div class="form-actions">
      <button
        type="button"
        @click="onCancel"
        class="btn btn--secondary"
        data-testid="cancel-btn"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="btn btn--primary"
        :disabled="loading"
        data-testid="submit-btn"
      >
        {{ loading ? 'Saving...' : (ticket ? 'Update Ticket' : 'Create Ticket') }}
      </button>
    </div>
  </form>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { useTicket } from './scripts/useTicket.js'

export default {
  name: 'TicketForm',
  props: {
    ticket: {
      type: Object,
      default: null
    },
    onSuccess: {
      type: Function,
      required: true
    },
    onCancel: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const formData = reactive({
      title: '',
      description: '',
      status: 'open',
      priority: 'medium'
    })
    const errors = reactive({})
    const loading = ref(false)
    
    const { createTicket, updateTicket } = useTicket()

    // Watch for ticket prop changes to populate form
    watch(() => props.ticket, (newTicket) => {
      if (newTicket) {
        Object.assign(formData, {
          title: newTicket.title || '',
          description: newTicket.description || '',
          status: newTicket.status || 'open',
          priority: newTicket.priority || 'medium'
        })
      } else {
        // Reset form when no ticket (creating new)
        Object.assign(formData, {
          title: '',
          description: '',
          status: 'open',
          priority: 'medium'
        })
      }
      // Clear errors when ticket changes
      Object.keys(errors).forEach(key => delete errors[key])
    }, { immediate: true })

    const validateForm = () => {
      // Clear previous errors
      Object.keys(errors).forEach(key => delete errors[key])
      
      if (!formData.title.trim()) {
        errors.title = 'Title is required'
      }
      
      if (!formData.status) {
        errors.status = 'Status is required'
      } else if (!['open', 'in_progress', 'closed'].includes(formData.status)) {
        errors.status = 'Invalid status value'
      }
      
      return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
      if (!validateForm()) return
      
      loading.value = true
      
      try {
        if (props.ticket) {
          await updateTicket(props.ticket.id, { ...formData })
        } else {
          await createTicket({ ...formData })
        }
        props.onSuccess()
      } catch (error) {
        // Error handled in useTicket composable
      } finally {
        loading.value = false
      }
    }

    // Watch form data changes to clear field-specific errors
    watch(formData, (newData, oldData) => {
      for (const key in newData) {
        if (newData[key] !== oldData[key] && errors[key]) {
          delete errors[key]
        }
      }
    })

    return {
      formData,
      errors,
      loading,
      handleSubmit
    }
  }
}
</script>