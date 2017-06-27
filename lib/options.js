var path = require('path')
var exists = require('fs').existsSync
var metadata = require('read-metadata') // https://github.com/segmentio/read-metadata
var validateName = require('validate-npm-package-name') // https://github.com/npm/validate-npm-package-name
var getGitUser = require('./git-user')

module.exports = function (name, dir) {
  var opts = getMetadata(dir)

  setDefault(opts, 'name', name)
  setValidateName(opts)

  var author = getGitUser()
  if (author) {
    setDefault(opts, 'author', author)
  }

  return opts
}

/**
 * 读取 meta.js Or meta.json
 * @param dir 目标路径
 * @returns {{}}
 */
function getMetadata (dir) {
  var json = path.join(dir, 'meta.json')
  var js = path.join(dir, 'meta.js')
  var opts = {}

  if (exists(json)) {
    opts = metadata.sync(json)
  } else if (exists(js)) {
    var req = require(path.resolve(js))
    if (req !== Object(req)) {
      throw new Error('meta.js needs to expose an object')
    }
    opts = req
  }

  return opts
}

function setDefault (opts, key, value) {
  if (opts.schema) {
    opts.prompts = opts.schema
    delete opts.schema
  }
  var prompts = opts.prompts || (opts.prompts = {})
  if (!prompts[key] || typeof prompts[key] !== 'object') {
    prompts[key] = {
      'type': 'string',
      'default': value
    }
  } else {
    prompts[key]['default'] = value
  }
}

function setValidateName (opts) {
  var name = opts.prompts.name
  var customValidate = name.validate
  name.validate = function (name) {
    var its = validateName(name)
    if (!its.validForNewPackages) {
      var errors = (its.errors || []).concat(its.warnings || [])
      return 'Sorry, ' + errors.join(' and ') + '.'
    }
    if (typeof customValidate === 'function') return customValidate(name)
    return true
  }
}
