<template>
  <b-card class="project-card" no-block>
    <div class="card-img-overlay-wrapper">
      <project-thumbnail :project="project"></project-thumbnail>
      <div class="card-img-overlay">
        <div :id="progressContinerId" class="h-100 w-100"></div>
      </div>
    </div>
    <div class="card-block p-0">
      <h4 class="card-title mb-2 px-2 pt-2">{{ project.name }}</h4>
      <p class="card-text mb-0 px-2 pb-2">{{ project.description }}</p>
      <div class="card-footer p-2">
        <span class="card-stat text-muted mb-1 mb-md-0">
          <icon name="users"></icon> {{ project.n_volunteers }} volunteers
        </span>
        <span class="card-stat text-muted mb-2 mb-md-0">
          <icon name="tasks"></icon> {{ project.n_tasks }} tasks
        </span>
        <div class="">
          <project-contrib-button
            :shortname="project.short_name"
            variant="success">
          </project-contrib-button>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
import ProgressBar from 'progressbar.js'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/tasks'
import ProjectThumbnail from '@/components/project/Thumbnail'
import ProjectContribButton from '@/components/buttons/ProjectContrib'

export default {
  data () {
    return {
      progressContinerId: `${this.project.short_name}-progress`
    }
  },

  props: {
    project: {
      type: Object,
      required: true
    }
  },

  components: {
    ProjectContribButton,
    ProjectThumbnail
  },

  mounted () {
    let bar = new ProgressBar.Circle(`#${this.progressContinerId}`, {
      strokeWidth: 5,
      easing: 'easeInOut',
      duration: 1400,
      color: '#FFFFFF',
      trailColor: '#B00000',
      trailWidth: 5,
      svgStyle: null,
      text: {
        value: `${this.project.overall_progress}%`
      }
    })
    bar.animate(this.project.overall_progress / 100)
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars';
@import '~bootstrap/scss/bootstrap';

.card.project-card {
  text-align: center;
  flex-direction: column;
  overflow-y: hidden;
  margin-bottom: $spacer-y;
  margin-left: auto;
  margin-right: auto;
  max-width: 300px;

  @include media-breakpoint-up(md) {
    max-width: 100%;
    text-align: left;
    flex-direction: row;
  }

  @include hover-focus {
    .card-img-overlay-wrapper {
      .card-img-overlay {
        transition: transform 450ms;
        transform: translateY(0);
      }
    }
  }

  .card-block {

    &:not(first-child) {
      border-top: $card-border-width solid $card-border-color;

      .card-footer {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        background-color: $white;
      }

      @include media-breakpoint-up(md) {
        display: flex;
        flex-direction: column;
        border-top: none;
        border-left: $card-border-width solid $card-border-color;

        .card-footer {
          flex-direction: row;
        }
      }
    }
  }

  .card-img-overlay-wrapper {
    position: relative;
    overflow: hidden;
    height: 100%;
    width: 100%;

    @include media-breakpoint-up(md) {
      width: 30%;
    }

    .card-img-overlay {
      background-color: $brand-primary;
      transform: translateY(100%);
    }
  }

  .card-stat {
    display: flex;
    align-items: center;

    svg {
      margin-right: 0.5em;
    }
  }
}

</style>