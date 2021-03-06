<template>
  <b-navbar
    id="collection-navbar"
    toggleable
    toggle-breakpoint="md"
    :type="type"
    :fixed="navType.fixed">
    <div class="container">

      <b-link class="navbar-brand"
        :to="{
          name: 'collection-home',
          params: {
            collectionName: collectionConfig.key
          }
        }"
        @click.native="scrollToTop">
        <span>{{ collectionConfig.name }}</span>
      </b-link>

      <button
        @click="toggleCollapsibleSidebar"
        ref="hamburger"
        class="
          hamburger
          hamburger--collapse
          navbar-toggler
          navbar-toggler-right"
        type="button"
        data-toggle="collapse"
        data-target="#main-nav-collapse"
        aria-controls="main-nav-collapse"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="hamburger-box">
          <span class="hamburger-inner"></span>
        </span>
      </button>

      <b-collapse is-nav id="main-nav-collapse" ref="sidebar">

        <!-- Main menu -->
        <b-nav is-nav-bar>
          <b-nav-item
            :to="{
              name: 'collection-about',
              params: {
                collectionname: collectionConfig.key
              }
            }"
            @click.native="toggleCollapsibleSidebar">
            About
          </b-nav-item>
          <b-nav-item
            :to="{
              name: 'collection-contribute',
              params: {
                collectionname: collectionConfig.key
              }
            }"
            @click.native="toggleCollapsibleSidebar">
            Contribute
          </b-nav-item>
          <b-nav-item
            :href="collectionConfig.forumUrl"
            v-if="collectionConfig.forumUrl">
            Discuss
          </b-nav-item>
          <b-nav-item
            v-if="collectionConfig.resultsComponent"
            :to="{
              name: 'collection-results',
              params: {
                collectionname: collectionConfig.key
              }
            }"
            @click.native="toggleCollapsibleSidebar">
            Results
          </b-nav-item>
          <b-nav-item
            :to="{
              name: 'collection-data',
              params: {
                collectionname: collectionConfig.key
              }
            }"
            @click.native="toggleCollapsibleSidebar">
            Data
          </b-nav-item>
        </b-nav>

        <b-nav is-nav-bar>

          <b-nav-item-dropdown
            right
            v-if="loggedIn"
            :text="currentUser.name">

            <!-- Profile/settings -->
            <b-dropdown-item
              :to="{
                name: 'profile',
                params: {
                  username: currentUser.name
                }
              }"
              @click.native="toggleCollapsibleSidebar">Profile
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
                name: 'account-settings',
                params: {
                  username: currentUser.name
                }
              }"
              @click.native="toggleCollapsibleSidebar">Settings
            </b-dropdown-item>

            <!-- Project management -->
            <span v-if="currentUser.admin">
              <div role="separator" class="dropdown-divider"></div>
              <b-dropdown-item
                :to="{
                  name: 'account-projects',
                  params: {
                    username: currentUser.name
                  }
                }">
                Open Project
              </b-dropdown-item>
            </span>

            <!-- Admin -->
            <span v-if="currentUser.admin">
              <div role="separator" class="dropdown-divider"></div>
              <b-dropdown-item
                :to="{
                  name: 'admin-dashboard'
                }"
                @click.native="toggleCollapsibleSidebar">
                Admin
              </b-dropdown-item>
            </span>

            <div role="separator" class="dropdown-divider"></div>
            <b-dropdown-item v-on:click="signout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>

          <!-- Sign in/sign up -->
          <b-nav is-nav-bar v-else>
            <b-nav-item
              :to="{
                name: 'signin',
                query: {
                  next: next
                }
              }">
              Sign in
            </b-nav-item>
            <b-nav-item
              class="nav-button"
              :to="{
                name: 'register'
              }">
              Sign up
            </b-nav-item>
          </b-nav>

        </b-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import jump from 'jump.js'
import throttle from 'lodash/throttle'

export default {
  data: function () {
    return {
      currentPath: this.$store.state.route.path,
      fixedNavbarRoutes: [
        'collection-home'
      ]
    }
  },

  props: {
    currentUser: {
      type: Object,
      required: true
    },
    collectionConfig: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'dark'
    },
    invertable: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    navType: function () {
      if (this.fixedNavbarRoutes.indexOf(this.$route.name) > -1) {
        return {
          fixed: 'top'
        }
      }
      return {
        fixed: null
      }
    },
    loggedIn: function () {
      return !isEmpty(this.currentUser)
    },
    next: function () {
      return this.$route.path
    }
  },

  methods: {

    /**
     * Sign the user out.
     */
    signout () {
      this.$store.dispatch('LOGOUT')
    },

    /**
     * Style the navbar, switching colors if over an invert-navbar element.
     */
    styleNavbar: throttle(
      function () {
        if (!this.invertable) {
          return
        }

        let ieScrollTop = document.documentElement.scrollTop
        let scrollTop = document.body.scrollTop === 0
                          ? ieScrollTop
                          : document.body.scrollTop

        let bounds = []
        let nodes = document.getElementsByClassName('invert-navbar')
        for (let i = 0; i < nodes.length; i++) {
          bounds.push({
            top: nodes[i].offsetTop,
            bottom: nodes[i].offsetTop + nodes[i].offsetHeight
          })
        }

        for (let b of bounds) {
          if (scrollTop >= b.top - 25 && scrollTop <= b.bottom) {
            document.querySelector('.navbar').classList.add('navbar-light')
            document.querySelector('.navbar').classList.remove('navbar-dark')
            return
          }
        }
        document.querySelector('.navbar').classList.remove('navbar-light')
        document.querySelector('.navbar').classList.add('navbar-dark')
      },
      10
    ),

    /**
     * Scroll to the top smoothly if target is the same as the current URI.
     */
    scrollToTop (evt) {
      if (evt.target.baseURI === window.location.href) {
        jump('body')
      }
    },

    /**
     * Style the hamburger so that it always turns white over the sidebar.
     */
    styleHamburger () {
      const hamburger = this.$refs.hamburger
      const isActive = hamburger.classList.contains('is-active')
      const colorTimeout = isActive ? 50 : 300
      setTimeout(function () {
        hamburger.classList.toggle('white')
      }, colorTimeout)
    },

    /**
     * Handle window scroll.
     */
    onWindowScroll () {
      this.styleNavbar()
    },

    /**
     * Toggle the collapsible sidebar.
     */
    toggleCollapsibleSidebar () {
      if (window.innerWidth < 992) {
        const hamburger = this.$refs.hamburger
        const sidebar = this.$refs.sidebar

        this.styleHamburger()
        hamburger.blur()

        sidebar.$el.classList.toggle('show')
        hamburger.classList.toggle('is-active')

        // Restrict body and scroll to top after collapse if new location
        if (sidebar.$el.classList.contains('show')) {
          setTimeout(() => {
            this.restrictBody(true)
          }, 450)
        } else {
          this.restrictBody(false)
          if (this.currentPath !== window.location.pathname) {
            jump('body', {
              duration: 0
            })
          }
        }

        this.currentPath = window.location.pathname
        this.styleNavbar()
      }
    },

    /**
     * Show a modal and toggle the sidebar.
     * @param {String} name
     *   The modal name.
     */
    showModal (name) {
      this.toggleCollapsibleSidebar()
      this.$root.$emit('show::modal', name)
    },

    /**
     * Restrict body content to avoid scroll bar while sidebar is open.
     */
    restrictBody (restrict = true) {
      if (restrict) {
        document.querySelector('body').style.height = '100vh'
        document.querySelector('body').style.overflow = 'hidden'
      } else {
        document.querySelector('body').style.height = '100%'
        document.querySelector('body').style.overflow = 'initial'
      }
    },

    /**
     * Handle window resize
     */
    onWindowResize () {
      const sidebar = this.$refs.sidebar
      if (window.innerWidth >= 992) {
        this.restrictBody(false)
      } else if (sidebar.$el.classList.contains('show')) {
        this.restrictBody(true)
      }
    }
  },

  mounted () {
    window.addEventListener('scroll', this.onWindowScroll)
    window.addEventListener('resize', this.onWindowResize)
  },

  destroyed () {
    window.removeEventListener('scroll', this.onWindowScroll)
    window.removeEventListener('resize', this.onWindowResize)
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';
@import '~hamburgers/_sass/hamburgers/hamburgers';

#collection-navbar {
  z-index: 200;
  font-family: $font-family-base;
  font-weight: 500;
  letter-spacing: 0.8px;
  justify-content: center;
  align-items: baseline;
  transition: background-color 200ms;
  padding: .75rem 1.5rem;
  display: flex;
  flex-direction: row;

  .container {
    margin: 0;

    @include media-breakpoint-down(xs) {
      margin: 0;
      flex: 1 1 auto;
    }
  }

  .navbar-brand {
    font-family: $headings-font-family;
    font-weight: 300;
    transition: color 200ms;
    margin-right: 1rem;

    @include media-breakpoint-up(sm) {
      font-size: $h3-font-size;
    }
  }

  .hamburger {
    display: none;
    right: 0;  // Otherwise it floats left
  }

  .navbar-toggler {
    border: none;
    align-self: center;

    &.white {
      .hamburger-inner,
      .hamburger-inner:before,
      .hamburger-inner:after {
        background-color: $white;
      }
    }
  }

  .navbar-nav {
    &:first-child {
      margin-right: auto;
    }

    .nav-item {
      font-size: $font-size-sm;
      margin-left: 2rem;
      margin-right: 0;
      position: relative;

      &:not(.dropdown):not(.nav-button) .nav-link:after {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        content: '';
        background-color: $red;
        opacity: 0;
      }

      &.nav-button {
        padding: 0 0.5rem;
        transition: background-color 250ms;
        margin-left: 1rem;

        .nav-link {
          transition: color 250ms;

          &:after {
            content: none;
          }

          &:focus,
          &:hover,
          &.active {
            color: $red;
          }
        }

        @include media-breakpoint-up(lg) {
          border: 1px solid $white;
          border-radius: 2.5rem;
        }
      }

      .nav-link {
        transition: color 200ms;
        padding: .35rem 0;

        &:not(.dropdown-toggle) {
          &:after {
            transition: opacity 200ms, transform 200ms;
            transform: translateY(10px);
          }

          &.active:after,
          &:hover:after,
          &:focus:after {
            opacity: 1;
            transform: none;
          }
        }
      }

      .dropdown-menu {
        background-color: rgba($black, 0.75);
        font-size: $font-size-sm;
        right: 0;

        .dropdown-divider {
          width: 100%;
          margin: 0.75em 0;
          background-color: rgba($white, 0.5);
        }

        .dropdown-item {
          color: $white;

          @include hover-focus {
            color: $link-hover-color;
          }
        }
      }
    }
  }

  .dropdown-item:focus,
  .dropdown-item:hover,
  .dropdown-item.active,
  .nav-item:not(.nav-button) .nav-link:focus,
  .nav-item:not(.nav-button) .nav-link:hover,
  .nav-item:not(.nav-button) .nav-link.active {
    color: $red !important;
    background-color: transparent;
  }

  .hamburger {
    z-index: 20;
    padding: 0;
    display: flex;
    flex-direction:column;
    height: 100%;

    @include media-breakpoint-up(lg) {
      display: none;
    }
  }

  &.navbar-dark {
    @extend .navbar-dark;
    background-color: transparent;

    .hamburger-inner,
    .hamburger-inner:before,
    .hamburger-inner:after {
      background-color: $white;
    }
  }

  &.navbar-light {
    background: $white;
    border-bottom: 1px solid $gray-300;

    .nav-item.nav-button {
      transition: border-color 400ms;
      border-color: $gray-600;
    }
  }

  // Collapsible sidebar
  @include media-breakpoint-down(md) {
    .navbar-collapse {
      display: flex !important;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      width: 100%;
      position: fixed;
      z-index: 10;
      top: 0;
      left: 0;
      background-color: $gray-1100;
      overflow-x: hidden;
      overflow-y: auto;
      text-align: center;
      transition: all 450ms !important;
      transform: translateX(-100%);

      &.show {
        transform: translateX(0);
      }

      .navbar-nav {
        margin-right: 0;
        display: block;

        .nav-item {
          margin-left: 0;

          .nav-link.active:after,
          .nav-link:hover:after,
          .nav-link:focus:after {
            opacity: 0;
            transform: none;
          }
        }

        .nav-link,
        .dropdown-item {
          padding: $list-group-item-padding-y;
          color: $white;

          @include hover-focus {
            color: $red;
          }
        }

        .dropdown-toggle,
        .dropdown-divider {
          display: none;
        }

        .dropdown-menu {
          position: relative;
          display: block;
          background: transparent;
          text-align: center;
          padding: 0;
          margin-left: auto;
          margin-left: auto;
          min-width: auto;
          border: none;

          .dropdown-item {
            @include hover-focus {
              outline: 0;
              background: transparent;
            }
          }
        }
      }
    }
  }
}
</style>
