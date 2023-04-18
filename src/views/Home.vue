<template>
  <LiveScoreApp/>
</template>


<script>
import LiveScoreApp from '@/components/LiveScoreApp.vue'

export default {
  name: 'App',
  components: {
    LiveScoreApp
  },
  methods: {
    reloadPage() {
      location.reload();
    }
  }
}

</script>