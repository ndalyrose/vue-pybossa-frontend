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
        @getresults="onGetResults"
        @putresult="onPutResult"
        @postfavourite="onPostFavourite"
        @delfavourite="onDelFavourite">
      </component>
    </section>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'

export default {
  data: function () {
    return {
      description: `Browse results of ${this.collectionConfig.name} projects`,
      navItems: [],
      results: [],
      favourites: []
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
        msg: error.exception_msg || error,
        type: 'danger'
      })
      throw new Error(error)
    },

    /**
     * Handle the getresults event.
     * @param {String} query
     *   The query.
     */
    onGetResults (query) {
      pybossaApi.post(`/api/results?${query}`).then(r => {
        this.results = r.data
      }).catch(err => {
        this.handleError(err)
      })
    },

    /**
     * Handle the putresult event.
     * @param {Object} data
     *   The data.
     */
    onPutResult (data) {
      pybossaApi.put(`/api/results`, data).then(r => {
        this.results = r.data
      }).catch(err => {
        this.handleError(err)
      })
    },

    /**
     * Handle the postfavourite event.
     * @param {String|Number} taskId
     *   The task ID.
     */
    onPostFavourite (taskId) {
      pybossaApi.post(`/api/favorites`, { task_id: taskId }).then(() => {
        this.favourites.add(taskId)
      }).catch(err => {
        this.handleError(err)
      })
    },

    /**
     * Handle the delfavourite event.
     * @param {String|Number} taskId
     *   The task ID.
     */
    onDelFavourite (taskId) {
      pybossaApi.delete(`/api/favorites/${taskId}`).then(() => {
        this.favourites.delete(taskId)
      }).catch(err => {
        this.handleError(err)
      })
    }
  },

  mounted () {
    this.$emit('navupdated', this.navItems)
  }
}
</script>
