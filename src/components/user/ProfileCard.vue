<template>
  <b-card class="user-card" no-body>

    <div class="avatar-background">
      <user-avatar
        :user="user"
        :size="200">
      </user-avatar>
    </div>

    <div id="user-details" class="card-body">
      <div class="card-title">
        <h2>{{ user.name }}</h2>
      </div>
      <div class="card-text">
        <ul>
          <li>
            <icon name="trophy"></icon>Rank {{ user.rank }}
          </li>
          <li>
            <icon name="tasks"></icon>Contributions: {{ user.n_answers }}
          </li>
        </ul>
      </div>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>

  </b-card>
</template>

<script>
import 'vue-awesome/icons/trophy'
import 'vue-awesome/icons/tasks'
import 'vue-awesome/icons/clock-o'
import UserAvatar from '@/components/user/Avatar'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },

  components: {
    UserAvatar
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

.card.user-card {
  .avatar-background {
    text-align: center;
    padding-top: $spacer * 2;
    padding-left: $spacer * 2;
    padding-right: $spacer * 2;
    background:
      linear-gradient(to bottom, rgba($blue, 0) 0%,
      rgba($blue, 0) calc(50% + (#{$spacer} * 1)),
      $white calc(50% + (#{$spacer} * 1)), $white 100% ),
      url('../../assets/img/app-background.jpg');
    background-size: cover;
    background-position: center center;
  }

  #user-details {
    text-align: center;

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;

      svg {
        margin-right: 5px;
      }
    }
  }
}
</style>
