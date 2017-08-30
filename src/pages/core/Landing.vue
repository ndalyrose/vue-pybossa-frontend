<template>
  <div id="landing">
    <basic-layout>

      <transition appear>
        <div id="app-hero">
          <div class="container">
            <span class="hidden-sm-down"></span>
            <p id="site-tagline">{{ siteConfig.tagline }}</p>
            <div class="stat-row hidden-sm-down">
              <div class="stat-circle stat-success">
                <span class="stat">{{ stats.n_published_projects }}</span>
                <icon name="television"></icon>
                <p>Projects</p>
              </div>
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
            </div>
          </div>
        </div>
      </transition>

      <section id="contribute" class="bg-faded">
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
            <div class="col-lg-5 offset-lg-1 pt-2 text-center">
              <h3 class="text-uppercase font-weight-bold">
                Most Active Volunteers
              </h3>
              <hr class="my-2">
              <p class="text-uppercase lead pb-2">
                To date, our top {{ topUsers.length }} volunteers have made
                {{ topUsersTaskRuns }} contributions!
              </p>
              <span v-if="!currentUser">
                <b-button
                  class="mt-1"
                  variant="secondary"
                  :to="{
                    name: 'signin'
                  }">
                  Sign in
                </b-button>
                <b-button
                  class="mt-1"
                  variant="success"
                  :to="{
                    name: 'register'
                  }">
                  Sign up
                </b-button>
              </span>
            </div>
            <div class="col-lg-5 offset-lg-1 hidden-md-down">
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
            <div class="col-sm-12 col-lg-5 offset-lg-1 push-lg-6">
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
        class="bg-faded">
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

      <leaderboard-modal :modalId="leaderboardModalId"></leaderboard-modal>

    </basic-layout>
  </div>
</template>

<script>
import ScrollReveal from 'scrollreveal'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/star'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/television'
import 'vue-awesome/icons/list'
import siteConfig from '@/siteConfig'
import pybossaApi from '@/api/pybossa'
import BasicLayout from '@/components/layouts/Basic'
import CollectionCard from '@/components/collection/Card'
import LeaderboardModal from '@/components/modals/Leaderboard'
import UserAvatar from '@/components/user/Avatar'
import getNumberWithCommas from '@/utils/get-number-with-commas'
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

  components: {
    BasicLayout,
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
      return getNumberWithCommas(sum)
    },
    currentUser: function () {
      return this.$store.state.currentUser
    }
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.topUsers = data.top_users
      this.stats = mapValues(data.stats, (n) => getNumberWithCommas(n))
      this.publications = data.publications
    },

    /**
     * Init scroll reveal.
     */
    scrollReveal () {
      ScrollReveal().reveal('.sr', {
        duration: 600 },
      50)
    }
  },

  created () {
    let data = {}
    pybossaApi.get(`/`).then(r => {
      data = r.data
      return pybossaApi.get('stats/')
    }).then(r => {
      data.stats = r.data.stats
      return pybossaApi.get('/announcements/')
    }).then(r => {
      data.publications = r.data.announcements
      this.setData(data)
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
    top: 50px;
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
    color: $gray-dark;
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

    &:nth-child(1) {
      border-color: rgba($brand-success, 0.8);
      border-bottom-color: transparent;
    }

    &:nth-child(2) {
      border-color: rgba($brand-info, 0.8);
      border-bottom-color: transparent;
    }

    &:nth-child(3) {
      border-color: rgba($brand-warning, 0.8);
      border-bottom-color: transparent;
    }

    .stat {
      position: absolute;
      font-size: $font-size-lg;
      font-weight: 600;
    }

    svg {
      position: absolute;
      bottom: 0;
    }

    p {
      position: absolute;
      letter-spacing: 0.5px;
      font-size: $font-size-sm;
      text-transform: uppercase;
      margin: 0;
      bottom: -1.75rem;
    }
  }
}
</style>