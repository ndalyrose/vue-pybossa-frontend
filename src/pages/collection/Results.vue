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
        :results="results"
        :favourites="favourites"
        :collectionConfig="collectionConfig"
        @getresults="onGetResult"
        @putresult="onPutResult"
        @postfavourite="onPostFavourite"
        @delfavourite="onDelFavourite">
      </component>
    </section>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      description: `Browse results of ${this.collectionConfig.name} projects`,
      navItems: [],
      results: [],
      favourites: Set()
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
    /**
     * Handle an error.
     * @param {Object} error
     *   The error.
     */
    handleError (error) {
      this.$store.dispatch('NOTIFY', {
        msg: err.exception_msg,
        type: 'danger'
      })
      throw new Error(err)
    },

    /**
     * Handle the getresults event.
     * @param {String} query
     *   The query.
     */
    onGetResults (query) {
      pybossaApi.post(`/api/results?${query}`).then(r => {
        this.results = r.data
      }).catch(err => handleError)
    },

    /**
     * Handle the putresult event.
     * @param {Object} data
     *   The data.
     */
    onPutResult (query) {
      pybossaApi.put(`/api/results`, data).then(r => {
        this.results = r.data
      }).catch(err => handleError)
    },

    /**
     * Handle the postfavourite event.
     * @param {String|Number} taskId
     *   The task ID.
     */
    onPostFavourite (taskId) {
      pybossaApi.post(`/api/favorites`, { task_id: taskId }).then(() => {
        favourites.add(taskId)
      }).catch(err => handleError)
    },

    /**
     * Handle the delfavourite event.
     * @param {String|Number} taskId
     *   The task ID.
     */
    onDelFavourite (taskId) {
      pybossaApi.delete(`/api/favorites/${taskId}`).then(() => {
        favourites.delete(taskId)
      }).catch(err => handleError)
    }
  },

  mounted () {
    this.$emit('navupdated', this.navItems)
  }
}
</script>
