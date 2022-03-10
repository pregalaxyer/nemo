/**
 * @description javascript reserved words
 */
export const RESERVED_WORDS = [
  'arguments',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'eval',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
]
/**
 * @more https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_Types
 * @description illegal words in varibles
 * @example: ❌ user-name (user name) user.name
 * @example: ✅ user_name $user_name
 * @notice Regexp.test with save lastIndex
 */
export const VARIABLES_ILLEGAL_REG = /[^\w|^\$]/g

export const VARIABLES_SEPARATOR = '_'

export const MAP_REG = /Map«/

export const MAP_REG_GLOBAL = /Map«/g

export const MAP_PREFIX = 'Map«'

export const MAP_INNER_REG = /«Map.+»/

export const MAP_CONTENT_REG = /^«(.+)»$/
