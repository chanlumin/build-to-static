// const shell = require('shelljs')
const shell = require('shelljs')
if(!shell.which('git')) {
  shell.echo('require git')
  shell.exit('1')
}

shell.exec('git init')
shell.exec('git add .')
if (shell.exec('git commit -am "Auto-commit"').code !== 0) {
  shell.echo('Error: Git commit failed');
  shell.exit(1);
}
console.log(a.code)
shell.rm('package-lock.json')