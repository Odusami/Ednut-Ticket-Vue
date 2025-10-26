import { ref, watch, computed } from 'vue'
import { useAuth } from './useAuth.js'

// Reactive state (equivalent to React useState)
const tickets = ref([])

export function useTicket() {
  const { showToast } = useAuth()

  // Load tickets from localStorage on initialization (equivalent to useEffect)
  if (typeof window !== 'undefined') {
    const savedTickets = localStorage.getItem('ticketapp_tickets')
    if (savedTickets) {
      try {
        tickets.value = JSON.parse(savedTickets)
      } catch (error) {
        console.error('Error loading tickets:', error)
        tickets.value = []
      }
    }
  }

  // Save tickets to localStorage whenever tickets change (equivalent to useEffect)
  watch(tickets, (newTickets) => {
    localStorage.setItem('ticketapp_tickets', JSON.stringify(newTickets))
  }, { deep: true })

  const createTicket = async (ticketData) => {
    return new Promise((resolve, reject) => {
      try {
        if (!ticketData.title || !ticketData.status) {
          throw new Error('Title and status are required')
        }

        const validStatuses = ['open', 'in_progress', 'closed']
        if (!validStatuses.includes(ticketData.status)) {
          throw new Error('Invalid status value')
        }

        const newTicket = {
          id: Date.now().toString(),
          ...ticketData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        tickets.value = [newTicket, ...tickets.value]
        showToast('Ticket created successfully!', 'success')
        resolve(newTicket)
      } catch (error) {
        showToast(error.message, 'error')
        reject(error)
      }
    })
  }

  const updateTicket = async (ticketId, updates) => {
    return new Promise((resolve, reject) => {
      try {
        if (updates.title !== undefined && !updates.title.trim()) {
          throw new Error('Title is required')
        }

        if (updates.status && !['open', 'in_progress', 'closed'].includes(updates.status)) {
          throw new Error('Invalid status value')
        }

        tickets.value = tickets.value.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
            : ticket
        )
        showToast('Ticket updated successfully!', 'success')
        resolve()
      } catch (error) {
        showToast(error.message, 'error')
        reject(error)
      }
    })
  }

  const deleteTicket = async (ticketId) => {
    return new Promise((resolve, reject) => {
      try {
        tickets.value = tickets.value.filter(ticket => ticket.id !== ticketId)
        showToast('Ticket deleted successfully', 'success')
        resolve()
      } catch (error) {
        showToast('Failed to delete ticket', 'error')
        reject(error)
      }
    })
  }

  const getTicket = (ticketId) => {
    return tickets.value.find(ticket => ticket.id === ticketId)
  }

  // Return reactive state and methods (equivalent to React context value)
  return {
    tickets: computed(() => tickets.value),
    createTicket,
    updateTicket,
    deleteTicket,
    getTicket
  }
}