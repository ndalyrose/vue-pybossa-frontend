import siteConfig from '@/siteConfig'

import CollectionBaseLayout from '@/layouts/CollectionBase'
import FloatingTabsLayout from '@/layouts/FloatingTabs'

import CollectionHome from '@/pages/collection/Home'
import CollectionAbout from '@/pages/collection/About'
import CollectionData from '@/pages/collection/Data'
import CollectionContribute from '@/pages/collection/Contribute'
import CollectionPresenter from '@/pages/collection/Presenter'
import CollectionResults from '@/pages/collection/Results'

const routes = [
  {
    path: '/collection/:collectionname',
    component: CollectionBaseLayout,
    beforeEnter: function (to, from, next) {
      if (to.params.collectionname in siteConfig.collections) {
        next()
      } else {
        next({ name: '404' })
      }
    },
    children: [
      {
        path: '/',
        name: 'collection-home',
        component: CollectionHome
      },
      {
        path: 'about',
        component: FloatingTabsLayout,
        children: [
          {
            path: '/',
            name: 'collection-about',
            component: CollectionAbout
          }
        ]
      },
      {
        path: 'data',
        component: FloatingTabsLayout,
        children: [
          {
            path: '/',
            name: 'collection-data',
            component: CollectionData
          }
        ]
      },
      {
        path: 'contribute',
        component: FloatingTabsLayout,
        children: [
          {
            path: '/',
            name: 'collection-contribute',
            component: CollectionContribute
          }
        ]
      },
      {
        path: 'results',
        component: FloatingTabsLayout,
        children: [
          {
            path: '/',
            name: 'collection-results',
            component: CollectionResults
          }
        ]
      },
      {
        path: 'project/:shortname/presenter',
        component: FloatingTabsLayout,
        children: [
          {
            path: '/',
            name: 'collection-presenter',
            component: CollectionPresenter
          }
        ]
      }
    ]
  }
]

export default routes
