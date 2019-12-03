const shell = require('shelljs')

// shell.exec(`git add ${}`)
console.log(shell.pwd().stdout)

shell.exec(`git add ${shell.pwd().stdout}`)