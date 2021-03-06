const types = {
  boolean: Symbol('booleanType'),
  integer: Symbol('integerType'),
  object: Symbol('objectType'),
  objectType: Symbol('objectTypeType'),
  terrainType: Symbol('terrainTypeType'),
  direction: Symbol('directionType'),
  message: Symbol('messageType'),
  composite: Symbol('compositeType'),
}
Object.freeze(types)

export default types