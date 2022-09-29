const TO_STRING = Object.prototype.toString

export function getDataType(data: any) {
  return TO_STRING.call(data).slice(8, -1) // Proxy 暂不考虑吧
}

export const isNull = (x: any) => x === null
export const isUndefined = (x: any) => x === undefined
export const isBoolean = (x: any) => x === true || x === false || getDataType(x) === 'Boolean'
export const isNumber = (x: any) => getDataType(x) === 'Number'
export const isString = (x: any) => getDataType(x) === 'String'

export const isArray = Array.isArray || (x => getDataType(x) === 'Array')
export const isFunction = (x: any) => typeof x === 'function'
export const isObject = (x: any) => getDataType(x) === 'Object'
export const isNonNullObject = (x: any) => isObject(x) && !isNull(x)
export const isArrayBuffer = (x: any) => getDataType(x) === 'ArrayBuffer'
