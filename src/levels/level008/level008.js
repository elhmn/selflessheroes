import map from './map008.json'
const messages = {}
for (let language of SUPPORTED_LANGUAGES) {
  messages[language] = require(`./level008-messages-${language}.json`)
}

const level = {
  mapConfig: map,
  messages: messages,

  startingCode: "a:\nstep(e)\njump a\n",
  maxStep: 200,
  speedTarget: 71,
  lengthTarget: 4,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['bonfire', 'nothing'],
    actionFunctions: ['step_once', 'fireball'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: 'all_bonfires',
    lose: 'default_loss'
  }
}

export default level