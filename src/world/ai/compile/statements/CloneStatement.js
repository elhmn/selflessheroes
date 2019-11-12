import PrimaryStatement from './PrimaryStatement'
import DirectionLiteral from './literals/DirectionLiteral'
import CloneAction from '../../../actions/CloneAction'
import {
  createUnitExpression,
  indexOfStringInLines,
} from '../utils'
import {
  MismatchStatementException
} from '../CompilerException'
import {
  NotDecompilableStatementException
} from '../DecompilerException'

export default class CloneStatement extends PrimaryStatement {

  constructor(line, column) {
    super('CloneStatement', line, column)
    this.direction = null
    this.anchor = null
    this.anchorStatement = null
  }

  isCodeComplete() {
    return this.code.length >= 1
  }

  setAnchorStatement(anchorStatement) {
    this.anchorStatement = anchorStatement
    this.anchor = anchorStatement.name
  }

  compile(config, context) {
    this.checkIsAllowed(config, 'type_clone')

    let joinedCode = this.code.join(' ')
    let groupsRegExp = /^(\s*clone\s+)(\w+)(\s+)(\w+)(\s*)$/
    let res = groupsRegExp.exec(joinedCode)
    if (!res) {
      throw new MismatchStatementException('clone statements must have a direction and a target anchor', this, {
        template: 'exception_mismatch_keyword_template',
        values: {
          statementType: {
            template: 'type_clone'
          }
        }
      })
    }
    this.direction = createUnitExpression([res[2]], [DirectionLiteral], this, this.line, this.column + res[1].length)
    this.direction.compile(config, context)
    this.anchor = res[4]
  }

  static getDirectionType() {
    return [{
      type: DirectionLiteral,
      validator: DirectionLiteral.notHereValidator
    }]
  }

  decompile(indent, line, column) {
    super.decompile(line, column)

    let executable = true
    let code = 'clone '

    let directionCode = this.undefinedCode
    if (this.direction) {
      executable &= this.direction.decompile(indent, line, this.column + code.length)
      directionCode = this.direction.code[0]
    } else {
      executable = false
    }
    code += directionCode

    if (!this.anchor) {
      throw new NotDecompilableStatementException('this clone statement has no anchor', this)
    }

    this.code = [code + ' ' + this.anchor]
    this.indentCode(indent)

    return executable
  }

  execute(context) {
    return {
      step: true,
      complete: true,
      goto: null,
      action: new CloneAction(this.direction, this.anchorStatement)
    }
  }
}

CloneStatement.startLineRegExp = /^\s*clone/
CloneStatement.correctCodeRegExp = /^\s*clone\s+(\w+)\s+(\w+)\s*$/
CloneStatement.codeRegExp = /^\s*clone\s+(\w+)\s+(\w+).*$/
CloneStatement.keyword = 'clone'