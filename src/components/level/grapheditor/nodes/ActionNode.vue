<template>
<li :class="{
		'node': true,
		'action-node': true,
		'speach': func.constructor.isSpeachType
	}"
  @mousedown="handleDragStart"
  @touchstart="handleDragStart">

  <div class="function-label">
    {{$text(`graph_node_function_${statement.function.constructor.keyword}`)}}
  </div>

  <template v-for="(param, index) in params">
    <value-select ref="valueSelects"
      class="bright"
      :key="index"
      :types="param.types"
      :value="param.value"
      :compilerConfig="compilerConfig"
      :parentType="func.constructor.isSpeachType ? 'speach' : 'action'"
      @select="handleSelectParam(index, $event)"
      @start-edit="$emit('start-edit')" />

    <div v-if="param.afterWord"
      class="after-word">
      {{$text(param.afterWord)}}
    </div>
  </template>

</li>
</template>

<script>
import DirectionLiteral from '../../../../world/ai/compile/statements/literals/DirectionLiteral'
import IntegerLiteral from '../../../../world/ai/compile/statements/literals/IntegerLiteral'
import VariableIdentifier from '../../../../world/ai/compile/statements/VariableIdentifier'
import Node from './Node'
import ValueSelect from './ValueSelect'
import FunctionMixin from './FunctionMixin'

export default {
  components: {
    ValueSelect
  },
  extends: Node,
  mixins: [FunctionMixin],
  data: function() {
    return {
      func: this.statement.function,
      autoPopSelectDone: false
    }
  },

  computed: {
    autoPopSelect: function() {
      if (this.params.length === 1) {
        let param = this.params[0]
        let types = param.types
        if (this.compilerConfig.variables === 0) {
          types = types.filter(type => type.type !== VariableIdentifier)
        }
        // If the types possible are only integer literal or direction
        if (types.length === 1 &&
          (types[0].type === DirectionLiteral || types[0].type === IntegerLiteral)) {
          return true
        }
      }
      return false
    }
  },

  mounted() {
    if (this.autoPopSelect && this.inserted && !this.autoPopSelectDone) {
      this.autoPopSelectDone = true
      this.$refs.valueSelects[0].startEdit()
    }
  }
}
</script>

<style lang="scss">
@import '../../mixins';

.action-node {
    @include node-color($action-color);
    display: flex;
    align-items: center;
    padding-right: 10px;

    .function-label {
        margin-right: 5px;
        pointer-events: none;
    }

    .after-word {
        margin: 0 2px 0 7px;
        pointer-events: none;
    }

    .value-select {
        margin-left: 5px;
    }

    &.speach {
        @include node-color($speach-color);
    }
}
</style>
