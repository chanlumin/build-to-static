// const shell = require('shelljs')
const shell = require('shelljs')
if(!shell.which('git')) {
  shell.echo('require git')
  shell.exit('1')
}

shell.exec('git init')
shell.exec('git add .')
shell.exec('git commit -am "更新静态资源"')
shell.rm()