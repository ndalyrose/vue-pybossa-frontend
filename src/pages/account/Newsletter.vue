<template>
  <div id="newsletter">
    <div class="container my-5">
      <div class="col-lg-8 mx-auto">
        <b-card :header="title">
          <p class="lead">
            {{ lead }}
          </p>
          <template slot="footer">
            <div class="float-right">
              <b-btn
                variant="outline-secondary"
                @click="suscribe('False')">
                No thanks
              </b-btn>
              <b-btn
                variant="success"
                @click="suscribe('True')">
                Sure, sign me up!
              </b-btn>
            </div>
          </template>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import siteConfig from '@/siteConfig'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      title: 'Subscribe to our newsletter',
      lead: `Sign up to the ${siteConfig.brand} newsletter to receive
            occasional updates about new features, projects and developments.`
    }
  },

  metaInfo () {
    return {
      title: this.title,
      meta: [
        {
          name: 'description',
          content: this.lead
        }
      ]
    }
  },

  methods: {
    /**
     * Redirect the user on form submit success.
     * @param {String} subscribe
     *   Subscribe, or otherwise.
     */
    suscribe (subscribe) {
      pybossaApi.get('/account/newsletter', {
        params: {
          subscribe: subscribe
        }
      }).then(r => {
        console.log(r)
        this.$router.push({ path: r.data.next })
      })
    }
  }
}
</script>
