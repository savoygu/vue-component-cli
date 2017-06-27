var async = require('async')
var inquirer = require('inquirer') // https://github.com/SBoudrias/Inquirer.js 常用的交互式命令行用户界面的集合

var promptMapping = {
  string: 'input',
  boolean: 'confirm'
}

module.exports = function ask (prompts, data, done) {
  async.eachSeries(Object.keys(prompts), function (key, next) {
    prompt(data, key, prompts[key], next)
  }, done)
}

function prompt (data, key, prompt, done) {
  /**
   * type: 提示类型，默认为input，可能的值：input, confirm, list, rawlist, expand, checkbox, password, editor
   * name: 用来储存回答的key
   * message: 提出的问题
   * default: 默认回答
   * choices: 选中的值
   * validate: 校验用户输入
   */
  inquirer.prompt([{
    type: promptMapping[prompt.type] || prompt.type,
    name: key,
    message: prompt.message || prompt.label || key,
    default: prompt.default,
    choices: prompt.choices || [],
    validate: prompt.validate || function () { return true }
  }]).then(function (answers) {
    if (Array.isArray(answers[key])) {
      data[key] = {}
      answers[key].forEach(function (multiChoiceAnswser) {
        data[key][multiChoiceAnswser] = true
      })
    } else if (typeof answers[key] === 'string') {
      data[key] = answers[key].replace(/"/g, '\\"')
    } else {
      data[key] = answers[key]
    }
    done()
  })
}
