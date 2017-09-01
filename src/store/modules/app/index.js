import state from './state.js'
import * as mutations from './mutations.js'
import * as actions from './actions.js'
import * as getters from './getters.js'
import entity from './entity'
import nodesTable from './nodesTable'
import charts from './charts'

export default {
  state,
  mutations,
  actions,
  getters,
  modules: {
    entity,
    nodesTable,
    charts
  }
}
