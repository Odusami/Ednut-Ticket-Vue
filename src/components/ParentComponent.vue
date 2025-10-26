<template>
  <div>
    <button @click="showModal = true">Open Modal</button>
    
    <Modal
      :isOpen="showModal"
      :onClose="handleCloseModal"
      title="My Modal Title"
    >
      <p>This is the modal content passed as a slot</p>
      <button @click="handleAction">Action Button</button>
    </Modal>
  </div>
</template>

<script>
import Modal from './Modal.vue'

export default {
  name: 'ParentComponent',
  components: {
    Modal
  },
  data() {
    return {
      showModal: false
    }
  },
  methods: {
    handleCloseModal() {
      this.showModal = false
    },
    handleAction() {
      // Handle action
      this.handleCloseModal()
    }
  }
}
</script>