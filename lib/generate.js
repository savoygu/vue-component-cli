var path = require('path')
var async = require('async')
var Metalsmith = require('metalsmith') // https://github.com/segmentio/metalsmith
var render = require('consolidate').handlebars.render
var getOptions = require('./options')
var logger = require('./logger')
var ask = require('./ask')

module.exports = function generate (name, src, dest, done) {
  var opts = getOptions(name, src)
  var metalsmith = Metalsmith(path.join(src, 'template'))
  var data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true
  })
  metalsmith.use(askQuestions(opts.prompts))
    .use(renderTemplateFiles())

  metalsmith.clean(false)
    .source('.')
    .destination(dest)
    .build(function (err, files) {
      done(err)
      logMessage(opts.completeMessage, data)
    })

  return data
}

/**
 * 提问问题
 * @param prompts
 * @returns {Function}
 */
function askQuestions (prompts) {
  return function (files, metalsmith, done) {
    ask(prompts, metalsmith.metadata(), done)
  }
}

function renderTemplateFiles () {
  return function (files, metalsmith, done) {
    var keys = Object.keys(files)
    var metalsmithMetadata = metalsmith.metadata()
    async.each(keys, function (file, next) {
      var str = files[file].contents.toString()
      if (!/{{([^{}]+)}}/g.test(str)) {
        return next()
      }
      render(str, metalsmithMetadata, function (err, res) {
        if (err) {
          err.message = `[${file}] ${err.message}`
          return next(err)
        }
        /* eslint-disable no-new-func */
        files[file].contents = new Buffer(res)
        next()
      })
    }, done)
  }
}

function logMessage (message, data) {
  if (!message) return
  render(message, data, function (err, res) {
    if (err) {
      logger.fatal('\n Error when rendring template complete message: ' + err.message.trim())
    } else {
      var str = res.split(/\r?\n/g).map(function (line) {
        return '  ' + line
      }).join('\n')
      console.log('\n' + str)
    }
  })
}
