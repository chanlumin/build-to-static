const shell = require('shelljs')

// shell.exec(`git add ${}`)
console.log(shell.pwd().stdout)

let r = shell.exec(`git add ${shell.pwd().stdout}`)
console.log(r.code)