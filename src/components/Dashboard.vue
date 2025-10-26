<template>
  <div class="dashboard" data-testid="dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1 class="page-title" data-testid="dashboard-title">Dashboard</h1>
        <p class="page-subtitle">Welcome to your ticket management dashboard</p>
      </div>

      <div class="stats-grid" data-testid="stats-grid">
        <div class="stat-card" data-testid="stat-total">
          <div class="stat-card__content">
            <h3 class="stat-card__value">{{ stats.total }}</h3>
            <p class="stat-card__label">Total Tickets</p>
          </div>
          <div class="stat-card__icon">📋</div>
        </div>

        <div class="stat-card" data-testid="stat-open">
          <div class="stat-card__content">
            <h3 class="stat-card__value">{{ stats.open }}</h3>
            <p class="stat-card__label">Open Tickets</p>
          </div>
          <div class="stat-card__icon-size stat-card__icon-open"></div>
        </div>

        <div class="stat-card" data-testid="stat-in-progress">
          <div class="stat-card__content">
            <h3 class="stat-card__value">{{ stats.inProgress }}</h3>
            <p class="stat-card__label">In Progress</p>
          </div>
          <div class="stat-card__icon-size stat-card__icon-progress"></div>
        </div>

        <div class="stat-card" data-testid="stat-closed">
          <div class="stat-card__content">
            <h3 class="stat-card__value">{{ stats.closed }}</h3>
            <p class="stat-card__label">Closed Tickets</p>
          </div>
          <div class="stat-card__icon-size stat-card__icon-close"></div>
        </div>
      </div>

      <div class="quick-actions" data-testid="quick-actions">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
          <router-link to="/tickets" class="action-card" data-testid="action-manage-tickets">
            <div class="action-card__icon">🎫</div>
            <h3>Manage Tickets</h3>
            <p>View, create, and manage all tickets</p>
          </router-link>
          
          <router-link to="/tickets?create=new" class="action-card" data-testid="action-create-ticket">
            <div class="action-card__icon">➕</div>
            <h3>Create New Ticket</h3>
            <p>Create a new support ticket</p>
          </router-link>
        </div>
      </div>

      <div class="recent-tickets" data-testid="recent-tickets">
        <div class="section-header">
          <h2 class="section-title">Recent Tickets</h2>
          <router-link to="/tickets" class="btn btn--secondary" data-testid="view-all-tickets">
            View All
          </router-link>
        </div>
        
        <div v-if="tickets.length === 0" class="empty-state empty-d-ticket" data-testid="no-tickets-message">
          <p>No tickets yet. Create your first ticket to get started!</p>
          <router-link to="/tickets" class="btn btn--primary margin-t">
            Create Ticket
          </router-link>
        </div>
        
        <div v-else class="tickets-list">
          <div 
            v-for="ticket in recentTickets" 
            :key="ticket.id" 
            class="ticket-card" 
            :data-testid="`ticket-${ticket.id}`"
          >
            <div class="ticket-card__header">
              <h3 class="ticket-card__title" data-testid="ticket-title">{{ ticket.title }}</h3>
              <span 
                :class="`status-badge status-badge--${ticket.status}`"
                data-testid="ticket-status"
              >
                {{ ticket.status.replace('_', ' ') }}
              </span>
            </div>
            <p class="ticket-card__description" data-testid="ticket-description">
              {{ ticket.description || 'No description provided' }}
            </p>
            <div class="ticket-card__meta">
              <span data-testid="ticket-priority">Priority: {{ ticket.priority }}</span>
              <span data-testid="ticket-created">
                Created: {{ formatDate(ticket.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useTicket } from './scripts/useTicket.js'

export default {
  name: 'Dashboard',
  setup() {
    const { tickets } = useTicket()

    const stats = computed(() => {
      return {
        total: tickets.value.length,
        open: tickets.value.filter(ticket => ticket.status === 'open').length,
        inProgress: tickets.value.filter(ticket => ticket.status === 'in_progress').length,
        closed: tickets.value.filter(ticket => ticket.status === 'closed').length
      }
    })

    const recentTickets = computed(() => {
      return tickets.value.slice(0, 5)
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    return {
      tickets,
      stats,
      recentTickets,
      formatDate
    }
  }
}
</script>