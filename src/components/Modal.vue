<template>
  <div v-if="isOpen" class="modal-overlay" data-testid="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h2 data-testid="modal-title">{{ title }}</h2>
        <button
          @click="handleClose"
          class="modal-close"
          data-testid="modal-close"
        >
          ✕
        </button>
      </div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    onClose: {
      type: Function,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    handleClose() {
      this.onClose()
    }
  }
}
</script>