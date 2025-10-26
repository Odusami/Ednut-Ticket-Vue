<template>
  <div class="ticket-management" data-testid="ticket-management">
    <div class="container">
      <div class="page-header">
        <div class="page-header__content">
          <h1 class="page-title" data-testid="ticket-management-title">
            Ticket Management
          </h1>
          <p class="page-subtitle">
            Manage and track all support tickets in one place
          </p>
        </div>
        <button
          @click="handleCreateTicket"
          class="btn btn--primary pad-btn"
          data-testid="create-ticket-btn"
        >
          Create New Ticket
        </button>
      </div>

      <div class="ticket-stats" data-testid="ticket-stats">
        <div class="stat-item">
          <span class="stat-number" data-testid="total-tickets">{{ tickets.length }}</span>
          <span class="stat-label">Total Tickets</span>
        </div>
        <div class="stat-item">
          <span class="stat-number" data-testid="open-tickets">
            {{ openTicketsCount }}
          </span>
          <span class="stat-label">Open</span>
        </div>
        <div class="stat-item">
          <span class="stat-number" data-testid="in-progress-tickets">
            {{ inProgressTicketsCount }}
          </span>
          <span class="stat-label">In Progress</span>
        </div>
        <div class="stat-item">
          <span class="stat-number" data-testid="closed-tickets">
            {{ closedTicketsCount }}
          </span>
          <span class="stat-label">Closed</span>
        </div>
      </div>

      <div v-if="tickets.length === 0" class="empty-state empty-t-ticket" data-testid="no-tickets-state">
        <div class="empty-state__icon">🎫</div>
        <h3>No tickets yet</h3>
        <p>Create your first ticket to get started with ticket management.</p>
        <button
          @click="handleCreateTicket"
          class="btn btn--primary margin-t pad-btn"
        >
          Create Your First Ticket
        </button>
      </div>
      
      <div v-else class="tickets-grid" data-testid="tickets-grid">
        <div 
          v-for="ticket in tickets" 
          :key="ticket.id" 
          class="ticket-card" 
          :data-testid="`ticket-card-${ticket.id}`"
        >
          <div class="ticket-card__header">
            <h3 class="ticket-card__title" data-testid="ticket-card-title">
              {{ ticket.title }}
            </h3>
            <div class="ticket-card__badges">
              <span 
                :class="`status-badge status-badge--${ticket.status}`"
                data-testid="ticket-card-status"
              >
                {{ ticket.status.replace('_', ' ') }}
              </span>
              <span 
                :class="`priority-badge priority-badge--${ticket.priority}`"
                data-testid="ticket-card-priority"
              >
                {{ ticket.priority }}
              </span>
            </div>
          </div>

          <p class="ticket-card__description" data-testid="ticket-card-description">
            {{ ticket.description || 'No description provided' }}
          </p>

          <div class="ticket-card__meta">
            <span data-testid="ticket-card-created">
              Created: {{ formatDate(ticket.createdAt) }}
            </span>
            <span v-if="ticket.updatedAt !== ticket.createdAt" data-testid="ticket-card-updated">
              Updated: {{ formatDate(ticket.updatedAt) }}
            </span>
          </div>

          <div class="ticket-card__actions">
            <button
              @click="handleEditTicket(ticket)"
              class="btn btn--secondary btn--small"
              :data-testid="`edit-ticket-${ticket.id}`"
            >
              Edit
            </button>
            <button
              @click="handleDeleteTicket(ticket.id)"
              class="btn btn--danger btn--small"
              :data-testid="`delete-ticket-${ticket.id}`"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <Modal
        :isOpen="showModal"
        :onClose="handleCloseModal"
        :title="editingTicket ? 'Edit Ticket' : 'Create New Ticket'"
      >
        <TicketForm
          :ticket="editingTicket"
          :onSuccess="handleFormSuccess"
          :onCancel="handleCloseModal"
        />
      </Modal>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useTicket } from './scripts/useTicket.js'
import Modal from './Modal.vue'
import TicketForm from './TicketForm.vue'

export default {
  name: 'TicketManagement',
  components: {
    Modal,
    TicketForm
  },
  setup() {
    const showModal = ref(false)
    const editingTicket = ref(null)
    const { tickets, deleteTicket } = useTicket()

    const openTicketsCount = computed(() => {
      return tickets.value.filter(t => t.status === 'open').length
    })

    const inProgressTicketsCount = computed(() => {
      return tickets.value.filter(t => t.status === 'in_progress').length
    })

    const closedTicketsCount = computed(() => {
      return tickets.value.filter(t => t.status === 'closed').length
    })

    const handleCreateTicket = () => {
      editingTicket.value = null
      showModal.value = true
    }

    const handleEditTicket = (ticket) => {
      editingTicket.value = ticket
      showModal.value = true
    }

    const handleDeleteTicket = async (ticketId) => {
      if (window.confirm('Are you sure you want to delete this ticket?')) {
        await deleteTicket(ticketId)
      }
    }

    const handleCloseModal = () => {
      showModal.value = false
      editingTicket.value = null
    }

    const handleFormSuccess = () => {
      showModal.value = false
      editingTicket.value = null
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    return {
      showModal,
      editingTicket,
      tickets,
      openTicketsCount,
      inProgressTicketsCount,
      closedTicketsCount,
      handleCreateTicket,
      handleEditTicket,
      handleDeleteTicket,
      handleCloseModal,
      handleFormSuccess,
      formatDate
    }
  }
}
</script>