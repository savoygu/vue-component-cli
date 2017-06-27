var chalk = require('chalk')
var format = require('util').format

/**
 * Prefix.
 */

const PREFIX = '    vue-component-dev-cli'
const SEP = chalk.gray('·')

/**
 *  Log a `message` to the console.
 */

exports.log = function () {
  let msg = format.apply(format, arguments)
  console.log(chalk.white(PREFIX), SEP, msg)
}

/**
 *  Log a error `message` to the console and exist
 *
 * @param message
 */

exports.fatal = function (message) {
  if (message instanceof Error) message = message.message.trim()
  let msg = format.apply(format, arguments)
  console.error(chalk.red(PREFIX), SEP, msg)
  process.exit(1)
}

/**
 * Log a success `message` to the console and exist
 */

exports.success = function () {
  let msg = format.apply(format, arguments)
  console.log(chalk.white(PREFIX), SEP, msg)
}
