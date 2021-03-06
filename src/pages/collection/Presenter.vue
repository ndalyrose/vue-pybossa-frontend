<template>
  <div id="presenter">
    <component
      :is="presenter"
      v-if="project && tasks.length"
      :project="project"
      :tasks="tasks"
      :currentUser="currentUser"
      :collectionConfig="collectionConfig"
      @submit="onSubmit"
      @taskLiked="onTaskLiked">
    </component>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import isEmpty from 'lodash/isEmpty'
import pybossaApi from '@/api/pybossa'
import LibcrowdsViewerPresenter from '@/components/presenters/LibcrowdsViewer'
import Z3950Presenter from '@/components/presenters/Z3950'
import DefaultPresenter from '@/components/presenters/Default'

export default {
  data: function () {
    return {
      project: null,
      tasks: [],
      title: '',
      description: '',
      navItems: [
        {
          id: 'back-to-contribute',
          text: 'Back',
          route: {
            name: 'collection-contribute',
            params: {
              collectionname: this.collectionConfig.key
            }
          }
        }
      ]
    }
  },

  metaInfo () {
    return {
      title: this.title,
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

  computed: {
    presenter: function () {
      const presenters = {
        'libcrowds-viewer': LibcrowdsViewerPresenter,
        'z3950': Z3950Presenter,
        default: DefaultPresenter
      }
      return this.collectionConfig.presenter
        ? presenters[this.collectionConfig.presenter]
        : presenters.default
    }
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.project = data.project
      this.title = this.project.name
      this.description = this.project.description
      this.loadTasks()
    },

    /**
     * Return the URL to load the next set of tasks
     */
    getLoadTasksUrl () {
      const endpoint = `/api/project/${this.project.id}/newtask`
      let q = 'limit=10'
      if (this.tasks.length) {
        const lastTask = this.tasks[this.tasks.length - 1]
        q += `&last_id=${lastTask.id}`
      }
      return `${endpoint}?${q}`
    },

    /**
     * Load the next set of tasks.
     */
    loadTasks () {
      const url = this.getLoadTasksUrl()
      pybossaApi.get(url).then(r => {
        if (isEmpty(r.data)) {
          this.handleCompletion()
        } else {
          const loadedTasks = Array.isArray(r.data) ? r.data : [r.data]
          this.tasks = this.tasks.concat(loadedTasks)
        }
      })
    },

    /**
     * Handle no tasks remaining.
     */
    handleCompletion () {
      const projectComplete = this.project.overall_progress === 100
      let html = `You have contributed to all available tasks for ` +
                 `<em>${this.project.name}</em>`
      if (projectComplete) {
        html = `<em>${this.project.name}</em> is now complete`
      }
      swal({
        title: 'Thank you!',
        html: html,
        type: 'success'
      })
      this.$router.push({
        name: 'collection-contribute',
        params: {
          collectionname: this.collectionConfig.key
        }
      })
    },

    /**
     * Handle the task liked event.
     * @param {String|Number} id
     *   The task ID.
     * @param {Boolean} liked
     *   True for task liked, false otherwise.
     */
    onTaskLiked (taskId, liked) {
      if (liked) {
        pybossaApi.post(`/api/favorites`, { task_id: taskId }).then(() => {
          // TODO: feedback
        })
      } else {
        pybossaApi.delete(`/api/favorites/${taskId}`).then(() => {
          // TODO: feedback
        })
      }
    },

    /**
     * Remove a task from the queue by ID.
     * @param {String|Number} taskId
     *   The task ID.
     */
    removeTask (taskId) {
      const idx = this.tasks.map((task) => { return task.id }).indexOf(taskId)
      if (idx > -1) {
        this.tasks.splice(idx, 1)
      }
    },

    /**
     * Handle the submit event.
     * @param {String|Number} projectId
     *   The project ID.
     * @param {String|Number} taskId
     *   The task ID.
     * @param {Object} answer
     *   The answer data.
     */
    onSubmit (projectId, taskId, answer) {
      const taskrun = JSON.stringify({
        'project_id': projectId,
        'task_id': taskId,
        'info': answer
      })
      pybossaApi.post(`/api/taskrun`, taskrun).then(r => {
        this.removeTask(taskId)
        this.loadTasks()
      })
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get(`/project/${to.params.shortname}/`).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    pybossaApi.get(`/project/${to.params.shortname}/`).then(r => {
      this.setData(r.data)
      next()
    })
  },

  mounted () {
    this.$emit('navupdated', this.navItems)
  }
}
</script>
