<template>
<li class="node branching-node condition-node">

  <div :class="{
		'if-label': true,
		'hidden': !isFirst
	}">{{
		$text('graph_node_if')
	}}</div>

  <value-select ref="leftExpression"
    class="bright"
    parentType="branching"
    :value="expression.leftExpression"
    :types="leftExpressionTypes"
    :compilerConfig="compilerConfig"
    @select="handleSelectLeftExpression"
    @start-edit="$emit('start-edit')" />

  <value-select ref="comparisonOperator"
    class="comparison-operator bright"
    parentType="branching"
    :value="expression.operator"
    :types="comparisonOperatorTypes"
    :labelFunc="comparisonOperatorLabelFunc"
    :compilerConfig="compilerConfig"
    @select="handleSelectComparisonOperator"
    @start-edit="$emit('start-edit')" />

  <value-select ref="rightExpression"
    class="bright"
    parentType="branching"
    :value="expression.rightExpression"
    :types="rightExpressionTypes"
    :compilerConfig="compilerConfig"
    @select="handleSelectRightExpression"
    @start-edit="$emit('start-edit')" />

  <div class="spacer" />

  <div class="operator-container">
    <value-select v-if="isLast && isFirst"
      class="add-button dark"
      parentType="branching"
      :value="operator"
      :types="newBooleanOperatorTypes"
      :labelFunc="newBooleanOperatorLabelFunc"
      :compilerConfig="compilerConfig"
      @select="$emit('add-condition', $event)"
      @start-edit="$emit('start-edit')" />

    <value-select v-else-if="isLast && !isFirst"
      class="add-button dark"
      parentType="branching"
      :value="operator"
      :types="booleanOperatorTypes"
      :labelFunc="newBooleanOperatorLabelFunc"
      :compilerConfig="compilerConfig"
      @select="handleAddOrDeleteBooleanOperator"
      @start-edit="$emit('start-edit')" />

    <value-select v-else="operator !== null"
      class="boolean-operator dark"
      parentType="branching"
      :value="operator"
      :types="booleanOperatorTypes"
      :labelFunc="booleanOperatorLabelFunc"
      :compilerConfig="compilerConfig"
      @select="handleSelectOrDeleteBooleanOperator"
      @start-edit="$emit('start-edit')" />
  </div>

</li>
</template>

<script>
import ValueSelect from './ValueSelect'
import {
  comparisonOperators,
  booleanOperators
}
from './operators'

export default {
  components: {
    ValueSelect
  },
  props: {
    'expression': {
      type: Object
    },
    'operator': {
      type: String,
      default: null
    },
    'isFirst': {
      type: Boolean,
      default: false
    },
    'isLast': {
      type: Boolean,
      default: false
    },
    'compilerConfig': {
      type: Object
    }
  },
  data: function() {
    return {}
  },
  computed: {
    leftExpressionTypes: function() {
      return this.compilerConfig.leftComparisonExpressions.map(type => {
        return {
          type: type,
          multiple: false
        }
      })
    },
    rightExpressionTypes: function() {
      return this.compilerConfig.rightComparisonExpressions.map(type => {
        return {
          type: type,
          multiple: false
        }
      })
    },
    comparisonOperatorTypes: function() {
      return [{
        type: 'comparisonOperator',
        multiple: false
      }]
    },
    booleanOperatorTypes: function() {
      return [{
        type: 'booleanOperator',
        multiple: false
      }]
    },
    newBooleanOperatorTypes: function() {
      return [{
        type: 'newBooleanOperator',
        multiple: false
      }]
    }
  },

  methods: {

    handleSelectLeftExpression(value) {
      this.expression.leftExpression = value
      this.$emit('change')
    },
    handleSelectRightExpression(value) {
      this.expression.rightExpression = value
      this.$emit('change')
    },
    handleSelectComparisonOperator(value) {
      this.expression.operator = value
      this.$emit('change')
    },
    handleSelectOrDeleteBooleanOperator(value) {
      if (value === 'delete') {
        this.$emit('delete')
      }
      else if (value !== this.operator) {
        this.$emit('operator-change', value)
      }
    },
    handleAddOrDeleteBooleanOperator(value) {
      if (value === 'delete') {
        this.$emit('delete')
      }
      else {
        this.$emit('add-condition', value)
      }
    },

    comparisonOperatorLabelFunc(operator) {
      return this.$text(comparisonOperators[operator])
    },
    booleanOperatorLabelFunc(operator) {
      return this.$text(booleanOperators[operator])
    },
    newBooleanOperatorLabelFunc(operator) {
      return '+'
    },

    startEditLeftExpression() {
      this.$refs.leftExpression.startEdit()
    }
  }
}
</script>

<style lang="scss">
@import '../../mixins';

.condition-node {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0;

    .if-label {
        margin: 0 3px 0 9px;
        pointer-events: none;

        &.hidden {
            visibility: hidden;
        }
    }

    & > .value-select {
        margin-left: 7px;
        flex-grow: 0;
        &:first-child {
            margin-left: $node-line-height;
        }

        &.comparison-operator {
            font-size: 24px;
            font-weight: 500;
        }
    }

    .spacer {
        flex-grow: 1;
        visibility: hidden;
    }

    .operator-container {
        margin-left: 8px;
        display: flex;
        justify-content: flex-end;
        padding-right: 4px;

        .boolean-operator {
            font-weight: 500;
        }

        .value-select.boolean-operator .label-container {
            padding: 0 4px;
        }

        .add-button {
            font-size: 26px;
            line-height: 26px;
            text-align: center;
            margin-left: 2px;

            .label-container {
                .label {
                    width: 26px;
                }
            }
        }
    }
}
</style>
