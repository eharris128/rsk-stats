<template lang="pug">
  .watcher
      ul.node-data(:class='nodeClass')
        li(v-for='ent in ["latency","peers","pending","uncles","blockTrans","totalDiff","lastBlockTime","lastBlockDifference"]')
          entity-icon(:entity='entity[ent]' :value='fields[ent]' :fields='fields')
          entity-value.txt(:entity='entity[ent]' :value='fields[ent]' :fields='fields')

        li.double
          .label {{ entity.lastBlock.title }}
          .data
            entity-value(:entity='entity.lastBlock' :value='fields.lastBlock' :fields='fields')

        li.double
          .label {{ entity.bestBlock.title }}
          .data
            tool-tip(:value='fields.bestBlock' trim='8' :options='{ trimAt:"end" }')

        //- TOTAL Diff
        //-li.quad
          .label {{entity.totalDiff.title}}
          .data {{fields.totalDiff}}
            //-tool-tip(:value='node.stats.block.totalDifficulty' trim='8' trimend='true')

      //- CHART Node History
      node-chart.dark-chart(:data='node.history')

</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import NodeChart from './NodeChart.vue'
import ToolTip from './ToolTip.vue'
import EntityMixin from '../mixins/Entity'
import { nodeFilter } from '../filters/nodes.js'
export default {
  name: 'node-watcher',
  mixins: [
    EntityMixin
  ],
  components: {
    NodeChart,
    ToolTip
  },
  filters: {
    nodeFilter
  },
  props: ['dialog'],
  data () {
    return {
      width: 0,
      height: 0,
      wclass: 'fixed',
      offset: {
        x: 0,
        y: 0
      },
      left: 0,
      top: 0,
      drag: true
    }
  },
  created () {
    this.left = this.dialog.x
    this.top = this.dialog.y
  },
  mounted () {
    this.width = this.$el.clientWidth
    this.height = this.$el.clientHeight
  },
  watch: {
    dialog (newValue) {
      this.top = newValue.y
      this.left = newValue.x
    }
  },
  methods: {
    ...mapActions([
      'unSelectNode',
      'setNodeDialogPos'
    ]),
    ...mapGetters(['getNode']),
    ...mapGetters('app/entity', [
      'createNodeEntity'
    ])
  },
  computed: {
    node () {
      return this.getNode()(this.dialog.id)
    },
    fields () {
      return this.createNodeEntity()(this.dialog.id)
    },
    nodeClass () {
      let node = this.node
      node = nodeFilter(node)
      return node._cssClass
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/colors.styl'

  .watcher
    width auto
    max-width 20em

    .node-chart
      height 50px
      padding-top 1em
      border none

  .header
    display block
    position relative
    background $darkness

    .svg-icon
      margin-right 0.25em

  .svg-icon
    color $color
    display inline

  .node-title
    display inline-block
    color $darkness
    position relative

  $item-min = 7.25em
  $item-margin = 0.25em

  .node-data
    font-size 0.6em
    display flex
    flex-direction row
    flex-wrap wrap
    list-style none
    padding 0 0.125em
    background $darkness-even
    margin 0

    li
      flex 1 1 24%
      margin 0.5%
      text-align center
      // box-shadow: 1px 1px 0.5px alpha(black,.5)
      box-shadow 1px 1px 1px alpha($color, 0.2)
      box-sizing border-box
      min-width $item-min
      padding 1em 0.25em 0.25em 0.25em
      color-dark()
      color $color

      .label, .entity-icon .svg-icon
        color $dark

      .entity-icon .svg-icon
        width 2.5em
        height 2.5em
        display block

      .entity-icon .tip
        font-size 1.5em

      .txt
        display inline-block
        font-size 1.75em

    li.double
      // min-width: ($item-min * 2) + (4 * $item-margin)
      flex 2 0 49%

      .label
        font-size 1.5em

      .data
        font-size 2em

    li.quad
      flex 4 0 99%

      // min-width: ($item-min * 4) + (12 * $item-margin)
      .label
        font-size 1.5em

      .data
        font-size 2em
</style>
