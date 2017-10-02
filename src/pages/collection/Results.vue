<template>
  <div id="collection-results">
    <section>
      <div v-if="!collectionConfig.results">
        <p class="lead text-center ">
          Sorry, no results component has been configured for this microsite.
        </p>
      </div>
      <component
        :is="collectionConfig.results"
        v-else
        :currentUser="currentUser"
        :collectionConfig="collectionConfig">
      </component>
    </section>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      description: `Browse results of ${this.collectionConfig.name} projects`,
      navItems: []
    }
  },

  metaInfo () {
    return {
      title: 'Browse Results',
      meta: [
        {
          name: 'description',
          content: this.description
        }
      ]
    }
  },

  props: {
    collectionConfig: {
      type: Object,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    }
  },

  methods: {
  },

  mounted () {
    this.$emit('navupdated', this.navItems)
  }
}
</script>
