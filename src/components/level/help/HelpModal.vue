<template>
<modal class="help-modal"
  ref="modal"
  type="info"
  :cancelable="false"
  :confirmValue="confirmValue"
  v-bind="$props"
  internalScroll
  @close="$emit('close')"
  @confirm="$emit('confirm', $event)"
  @cancel="$emit('cancel', $event)">

  <h3>{{$text('level_help_modal_title')}}</h3>

  <div class="scroll">
    <div class="tab-view">
      <ul class="tabs">

        <li v-for="(tab, index) in tabs"
          :class="{
						'selected': index === selectedTab
					}"
          @click="selectTab(index)">
          <palette-statement v-if="tab.type === 'statement-tab'"
            :statement="tab.statement" />

          <div v-else>{{
						tab.title
					}}</div>
        </li>

      </ul>

      <component class="tab"
        :is="currentTab.component"
        v-bind="currentTab.props"
        v-on="currentTab.handlers" />

    </div>
  </div>
</modal>
</template>

<script>
import Modal from '../../modal/Modal'
import GeneralTab from './GeneralTab'

import PaletteStatement from '../grapheditor/PaletteStatement'
import {
  assignStatementType,
  actionStatementType,
  branchingStatementType,
  speachStatementType
}
from '../grapheditor/PaletteStatementType'

import IfStatement from '../../../world/ai/compile/statements/IfStatement'
import JumpStatement from '../../../world/ai/compile/statements/JumpStatement'
import CloneStatement from '../../../world/ai/compile/statements/CloneStatement'

import StepFunction from '../../../world/ai/compile/statements/functions/StepFunction'
import StepOnceFunction from '../../../world/ai/compile/statements/functions/StepOnceFunction'
import FireBallFunction from '../../../world/ai/compile/statements/functions/FireBallFunction'
import TakeFunction from '../../../world/ai/compile/statements/functions/TakeFunction'
import DropFunction from '../../../world/ai/compile/statements/functions/DropFunction'
import WriteFunction from '../../../world/ai/compile/statements/functions/WriteFunction'

import SetFunction from '../../../world/ai/compile/statements/functions/SetFunction'
import CalcFunction from '../../../world/ai/compile/statements/functions/CalcFunction'
import NearestFunction from '../../../world/ai/compile/statements/functions/NearestFunction'

import TellFunction from '../../../world/ai/compile/statements/functions/TellFunction'
import ListenFunction from '../../../world/ai/compile/statements/functions/ListenFunction'

import ActionFunctions from '../../../world/ai/compile/statements/functions/ActionFunctions'
import ValueFunctions from '../../../world/ai/compile/statements/functions/ValueFunctions'

const branchingStatements = [
  IfStatement,
  JumpStatement,
  CloneStatement,
]
const actionFunctions = Object.values(ActionFunctions)
const valueFunctions = Object.values(ValueFunctions)
const paletteStatements = [
  ...branchingStatements,
  ...valueFunctions,
  ...actionFunctions
]


import IfStatementTab from './IfStatementTab'
import JumpStatementTab from './JumpStatementTab'
import CloneStatementTab from './CloneStatementTab'

import StepFunctionTab from './StepFunctionTab'
import StepOnceFunctionTab from './StepOnceFunctionTab'
import FireBallFunctionTab from './FireBallFunctionTab'
import TakeFunctionTab from './TakeFunctionTab'
import DropFunctionTab from './DropFunctionTab'
import WriteFunctionTab from './WriteFunctionTab'

import SetFunctionTab from './SetFunctionTab'
import CalcFunctionTab from './CalcFunctionTab'
import NearestFunctionTab from './NearestFunctionTab'

import TellFunctionTab from './TellFunctionTab'
import ListenFunctionTab from './ListenFunctionTab'

const statementTabs = new Map([
  [IfStatement, {
    component: IfStatementTab,
    props: {}
  }],
  [JumpStatement, {
    component: JumpStatementTab,
    props: {}
  }],
  [CloneStatement, {
    component: CloneStatementTab,
    props: {}
  }],
  [StepFunction, {
    component: StepFunctionTab,
    props: {}
  }],
  [StepOnceFunction, {
    component: StepOnceFunctionTab,
    props: {}
  }],
  [FireBallFunction, {
    component: FireBallFunctionTab,
    props: {}
  }],
  [TakeFunction, {
    component: TakeFunctionTab,
    props: {}
  }],
  [DropFunction, {
    component: DropFunctionTab,
    props: {}
  }],
  [WriteFunction, {
    component: WriteFunctionTab,
    props: {}
  }],
  [SetFunction, {
    component: SetFunctionTab,
    props: {}
  }],
  [CalcFunction, {
    component: CalcFunctionTab,
    props: {}
  }],
  [NearestFunction, {
    component: NearestFunctionTab,
    props: {}
  }],
  [TellFunction, {
    component: TellFunctionTab,
    props: {}
  }],
  [ListenFunction, {
    component: ListenFunctionTab,
    props: {}
  }],
])

export default {
  components: {
    Modal,
    PaletteStatement,
    GeneralTab
  },
  props: {
    'compilerConfig': {
      type: Object
    },
    'frameWidth': {
      type: Number,
      default: window.innerWidth
    },
    'frameHeight': {
      type: Number,
      default: window.innerHeight
    }
  },

  data: function() {
    let tabs = []
    tabs.push({
      type: 'text-tab',
      title: this.$text('level_help_modal_tab_general_title'),
      component: GeneralTab,
      props: {},
      handlers: {
        'start-tutorial': this.handleStartTutorial
      }
    })

    for (let statement of this.getStatements()) {
      let tab = statementTabs.get(statement.clazz)
      if (!tab) {
        tab = {
          component: 'div',
          props: {}
        }
      }

      Object.assign(tab, {
        type: 'statement-tab',
        handlers: {},
        statement: statement
      })
      tab.props.compilerConfig = this.compilerConfig
      tabs.push(tab)
    }

    return {
      tabs: tabs,
      selectedTab: 0,
      currentTab: tabs[0],
      confirmValue: {
        action: null
      }
    }
  },

  methods: {
    confirm() {
      this.$refs.modal.confirm()
    },

    cancel() {
      this.$refs.modal.cancel()
    },

    selectTab(tabIndex) {
      this.selectedTab = tabIndex
      this.currentTab = this.tabs[tabIndex]
    },

    handleStartTutorial(config) {
      this.$refs.modal.confirm({
        action: 'start-tutorial',
        tutorialConfig: config
      })
    },

    getStatements() {
      if (!this.compilerConfig) {
        return []
      }

      let primaryStatements = [...this.compilerConfig.getAllowedPrimaryStatements(), ...this.compilerConfig.actionFunctions, ...this.compilerConfig.valueFunctions]
      let statementClasses = primaryStatements.filter(statementClass => paletteStatements.includes(statementClass))
      let statements = statementClasses.map(statementClass => {
        return {
          clazz: statementClass
        }
      })
      let branching = statementClasses.filter(statementClass => branchingStatements.includes(statementClass) && !statementClass.isSpeachType)
      let actions = statementClasses.filter(statementClass => actionFunctions.includes(statementClass) && !statementClass.isSpeachType)
      let assign = statementClasses.filter(statementClass => valueFunctions.includes(statementClass) && !statementClass.isSpeachType)
      let speach = statementClasses.filter(statementClass => statementClass.isSpeachType)
      branching = branching.map(statementClass => {
        return {
          statementType: branchingStatementType,
          clazz: statementClass
        }
      })
      actions = actions.map(statementClass => {
        return {
          statementType: actionStatementType,
          clazz: statementClass
        }
      })
      assign = assign.map(statementClass => {
        return {
          statementType: assignStatementType,
          clazz: statementClass
        }
      })
      speach = speach.map(statementClass => {
        return {
          statementType: speachStatementType,
          clazz: statementClass
        }
      })

      return [
        ...branching,
        ...actions,
        ...assign,
        ...speach
      ]
    }
  }
}
</script>

<style lang="scss">
@import '../mixins';
$selected-color: #535866;

.help-modal {
    padding: 20px 50px 30px;
    min-width: 485px;

    .modal-content {
        display: flex;
        flex-direction: column;

        h3 {
            font-weight: bold;
            font-size: 36px;
            margin: 0 0 20px;
        }

        .scroll {
            overflow-x: hidden;
            overflow-y: auto;

            .tab-view {
                display: flex;
                flex-direction: row;
                padding-left: 10px;
                border-radius: 10px;
                background: #32363E;

                .tabs {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    width: min-content;
                    font-size: 21px;
                    padding-bottom: 30px;
                    padding-top: 20px;

                    & > li {
                        padding: 3px 7px 4px;
                        border-radius: 6px 0 0 6px;
                        text-align: left;
                        width: 100%;
                        box-sizing: border-box;
                        cursor: pointer;

                        &.selected {
                            background: $selected-color;
                        }
                    }

                    .palette-statement {
                        box-shadow: none;
                    }
                }

                .tab {
                    border-left: solid 5px $selected-color;
                    background: #282C34;
                    min-height: 100%;
                    min-width: 300px;
                    box-sizing: content-box;
                    flex-grow: 1;
                    margin-left: -1px;
                    color: transparentize(white, 0.2);
                    font-size: 18px;
                    padding: 23px 15px 20px 23px;
                    text-align: left;
                    white-space: normal;
                    border-radius: 0 10px 10px 0;

                    .simple-graph-code {
                        margin: 15px;
                        position: relative;
                    }

                    p {
                        margin-top: 0;
                    }

                    .statement {
                        border-radius: 4px;
                        font-weight: 500;
                        padding: 0 10px 0 5px;
                    }

                    h5 {
                        font-size: 16px;
                        margin: 6px 0;
                        font-weight: 500;
                    }

                    .code {
                        font-family: Consolas, 'DejaVu Sans Mono', monospace;
                        white-space: pre;
                        font-size: 18px;
                        line-height: 24px;
                        color: #abb2bf;
                        background-color: #1F2229;
                        padding: 2px 4px;
                        border-radius: 5px;
                        padding: 7px 13px;
                    }

                    .text-segment {
                        white-space: pre-wrap;
                    }

                    .action-statement {
                        @include node-color($action-color);
                    }
                    .branching-statement {
                        @include node-color($branching-color);
                    }
                    .assign-statement {
                        @include node-color($assign-color);
                    }
                    .speach-statement {
                        @include node-color($speach-color);
                    }

                    .icon {
                        width: 24px;
                        height: 24px;
                        display: inline-block;
                        background-size: cover;
                        vertical-align: bottom;
                    }
                }
            }
        }
    }

    .button-container {
        margin-top: 17px;
    }
}
</style>
