<template>
  <div id="landing">
    <transition appear>
      <div id="app-hero">
        <div class="container">
          <span class="d-none d-md-flex"></span>
          <p id="site-tagline">{{ siteConfig.tagline }}</p>
          <div class="stat-row d-none d-md-flex">
            <div class="stat-circle">
              <span class="stat">{{ stats.n_total_users }}</span>
              <icon name="users"></icon>
              <p>Volunteers</p>
            </div>
            <div class="stat-circle">
              <span class="stat">{{ stats.n_task_runs }}</span>
              <icon name="list"></icon>
              <p>Contributions</p>
            </div>
            <div class="stat-circle">
              <span class="stat">{{ stats.n_published_projects }}</span>
              <icon name="television"></icon>
              <p>Projects</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <section id="contribute" class="bg-light">
      <div class="container py-4">
        <h2 class="mt-4">Contribute</h2>
        <p class="lead">
          {{ siteConfig.description }}
        </p>
        <div class="card-deck">
          <collection-card
            v-for="(config, key) in siteConfig.collections"
            :key="key"
            :collection-config="config"
            :collection-name="key">
          </collection-card>
        </div>
      </div>
    </section>

    <section
      id="top-users"
      class="bg-white">
      <div class="container py-4">
        <div class="row">
          <div class="col-lg-5 mx-auto pt-2 text-center">
            <h3 class="text-uppercase font-weight-bold">
              Most Active Volunteers
            </h3>
            <hr class="my-2">
            <p class="text-uppercase lead pb-lg-2">
              To date, our top {{ topUsers.length }} volunteers have made
              {{ topUsersTaskRuns }} contributions!
            </p>
            <b-btn
              variant="success"
              size="lg"
              @click="scrollToCollections">
              Get Started
            </b-btn>
          </div>
          <div class="col-lg-5 mx-auto d-none d-lg-block">
            <img src="../../assets/img/wreath.png" alt="Wreath" class="img-fluid">
            <span id="wreath"></span>
          </div>
        </div>
        <div class="row text-center mt-2">
          <div class="col-lg-12 pt-1">
            <ul class="list-unstyled">
              <li
                :key="user.id"
                class="text-center d-inline-block mx-1"
                v-for="user in topUsers">
                <router-link :to="{
                    name: 'profile',
                    params: {
                      username: user.name
                    }
                  }"
                  class="my-1">
                  <div class="my-1">
                    <user-avatar
                      :user="user"
                      tooltipTriggers="hover">
                    </user-avatar>
                  </div>
                </router-link>
                <p class="badge badge-info">{{ user.score }}</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="row text-center mt-2">
          <div class="col-sm-12 col-lg-6 ml-lg-auto">
            <b-btn
              variant="black-underline"
              v-b-modal="leaderboardModalId">
              <icon name="eye"></icon> View the leaderboard
            </b-btn>
          </div>
        </div>
      </div>
    </section>

    <section
      id="publications"
      v-if="publications.length"
      class="bg-light">
      <div class="container pt-4 pb-5">
        <h2 class="my-1">Publications</h2>
        <p class="lead mb-2">
          Articles, papers and blog posts about {{ siteConfig.brand }}.
        </p>
        <b-card-group columns>
          <publication-card
            v-for="publication in publications"
            :key="publication.id"
            :publication="publication">
          </publication-card>
        </b-card-group>
      </div>
    </section>

    <leaderboard-modal
      :modal-id="leaderboardModalId"
      :current-user="currentUser">
    </leaderboard-modal>
  </div>
</template>

<script>
import jump from 'jump.js'
import ScrollReveal from 'scrollreveal'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/star'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/television'
import 'vue-awesome/icons/list'
import siteConfig from '@/siteConfig'
import pybossaApi from '@/api/pybossa'
import CollectionCard from '@/components/collection/Card'
import LeaderboardModal from '@/components/modals/Leaderboard'
import UserAvatar from '@/components/user/Avatar'
import intComma from '@/utils/intComma'
import mapValues from 'lodash/mapValues'
import PublicationCard from '@/components/publications/PublicationCard'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      stats: {},
      topUsers: [],
      publications: [],
      leaderboardModalId: 'leaderboard-modal'
    }
  },

  metaInfo () {
    return {
      title: this.siteConfig.tagline,
      meta: [
        { name: 'description', content: this.siteConfig.description },

        // Facebook Open Graph Markup
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: this.siteConfig.brand },
        { property: 'og:description', content: this.siteConfig.tagline }
      ]
    }
  },

  components: {
    LeaderboardModal,
    UserAvatar,
    CollectionCard,
    PublicationCard
  },

  computed: {
    topUsersTaskRuns: function () {
      const scores = this.topUsers.map((user) => user.score)
      const sum = scores.reduce(function (acc, val) {
        return acc + val
      }, 0)
      return intComma(sum)
    },
    currentUser: function () {
      return this.$store.state.currentUser
    }
  },

  methods: {
    /**
     * Init scroll reveal.
     */
    scrollReveal () {
      ScrollReveal().reveal('.sr', {
        duration: 600 },
      50)
    },

    /**
     * Scroll to the contribute section.
     */
    scrollToCollections () {
      jump('#contribute')
    }
  },

  created () {
    pybossaApi.get('stats/').then(r => {
      this.stats = mapValues(r.data.stats, (n) => intComma(n))
    })
    pybossaApi.get('/announcements/').then(r => {
      this.publications = r.data.announcements
    })
    pybossaApi.get('/').then(r => {
      this.topUsers = r.data.top_users
    })
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

#landing {

  #site-tagline {
    font-weight: 600px;
    font-size: 1.75rem;
    letter-spacing: 0.5px;
    margin: 0;
  }

  #app-hero {
    height: 500px;
    top: $app-navbar-height;
    width: auto;
    overflow: hidden;
    position: relative;
    background-position: top center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('../../assets/img/app-background.jpg');

    .container {
      color: $white;
      text-align: center;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
    }
  }

  .bg-white {
    background-color: $white;
  }

  .btn-black-underline  {
    color: $black;
    background: none;
    border-bottom: 3px solid rgba($black, 0);
    display: inline-block;
    transition: border-bottom 500ms;

    @include hover-focus {
      border-bottom: 3px solid rgba($black, 1);
    }
  }

  #top-users {
    color: $gray-1000;
  }

  .stat-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .stat-circle {
    position: relative;
    margin: 2em 4em;
    width: 6em;
    height: 6em;
    border-radius: 50%;
    border: 4px solid rgba($white, 0.8);
    border-bottom-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;

    &:nth-child(1) {
      border-color: rgba($green, 0.8);
      border-bottom-color: transparent;
    }

    &:nth-child(2) {
      border-color: rgba($blue, 0.8);
      border-bottom-color: transparent;
    }

    &:nth-child(3) {
      border-color: rgba($orange, 0.8);
      border-bottom-color: transparent;
    }

    .stat {
      font-size: $font-size-lg;
      font-weight: 600;
    }

    svg {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }

    p {
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      text-align: center;
      letter-spacing: 0.5px;
      font-size: $font-size-sm;
      text-transform: uppercase;
      bottom: -1.75rem;

      // Fix for centering overflowing text
      &:before {
        content: "";
        margin-left: -100px;
      }

      &:after {
        content: "";
        margin-right: -100px;
      }
    }
  }
}
</style>
