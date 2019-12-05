const shell = require('shelljs')
const chalk = require('chalk')
const figlet = require('figlet')
const ora = require('ora');
const inquirer = require('inquirer')
const path = require('path')
const uuid = require('uuid')
const config = require('./config')

if(!shell.which('git')) {
  shell.echo('require git')
  shell.exit('1')
  
}

const setPinnner = (text, spinner, color) =>{
  spinner.text = text
  spinner.color = color
}
const askQuestions = () => {
  const questions = [
    {
      name: "srcDir",
      type: "input",
      message: "输入源目录"
    },
    {
      type: "input",
      name: "destDir",
      message: "目标目录",
    }
  ]
  return inquirer.prompt(questions)
}

const success = () => {
  console.log(
    chalk.white.bold(`成功了`)
  )
}

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync("Merge Cli", {
        font: "Epic",
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  )
}

const getRelativeDir = (from, to) => {
  return path.win32.relative(from, to)
}
const run = async () => {
  
  init()
  const answers = await askQuestions()
  let {srcDir, destDir} = answers
  // const pwd =shell.pwd().stdout

  if(config.srcDir) {
    srcDir = config.srcDir
  }
  if(config.destDir) {
    destDir = config.destDir
  }
  if(!srcDir) {
    srcDir = shell.pwd().stdout
  } 
  if(!destDir) {
    destDir = path.win32.normalize('D:\\code\\java\\certification-server\\src\\main\\resources\\static')
  }
  
  console.log(`切换到目录${srcDir}`)
  if(shell.cd(`${srcDir}`).code !== 0) {
    shell.echo('hi' + shell.pwd().stdout)
  }

  // 切换到目标文件 生成build directory
  buildDir = path.join(shell.pwd().stdout,'build', '\\')
  

  // 获取当前目录到目标目录的相对路径
  const relativeDir = getRelativeDir(shell.pwd().stdout, destDir)
  console.log(`当前 目录${shell.pwd().stdout}到目标目录${destDir}的相对地址为${relativeDir}`)
  const spinner = ora().start();

  setPinnner("正在打包 请稍等", spinner, 'yellow')
  if(shell.exec('npm run build').code !== 0) {
    shell.echo('npm 打包失败')
    shell.exit('1')
  }
  // 删除目标目录
  setPinnner( `删除${destDir}目录`, spinner, 'yellow')
  if(shell.rm('-rf', destDir + '\\*').code !== 0) {
    shell.echo(`删除文件 ${destDir} 失败`)
  }
  
  setPinnner( `从${buildDir}拷贝文件到${destDir}目录`, spinner, 'yellow')
  shell.cp('-R', buildDir+'*', destDir)
  

  // // git 操作
  shell.cd(relativeDir)  
  console.log(`change directory ... current directory is: ${shell.pwd().stdout}`)  
  setPinnner( `执行git操作`, spinner, 'yellow')
  if(shell.exec(`git add ${shell.pwd().stdout}`).code !== 0) {
    shell.echo(`git add ${shell.pwd().stdout}失败`)
    shell.exit('1')
  }
  if(shell.exec(`git commit -m"chore: 更新静态资源"${uuid.v1()}`).code !== 0) {
    shell.echo(`git commit ${shell.pwd().stdout}失败`)
    shell.exit('1')
  }

  if(shell.exec(`git push`).code !== 0) {
    shell.echo(`git push 失败`)
    shell.exit('1')
  }
  spinner.stop()
  success()
}

run()


module.exports = {
  run
}