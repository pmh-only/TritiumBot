// main color: #6bedd4

const msgModule = require('./modules/msgProc')
const logger = require('./modules/logger')

const discord = require('discord.js')
const chalk = require('chalk')

const tri = new discord.Client()

tri.login(process.env.triToken)

tri.on('ready', () => {
  tri.user.setActivity('your all messages', { type: 'WATCHING' })
  console.log(chalk.green(tri.user.username + ' is online!'))
})

tri.on('message', (msg) => {
  msgModule.proc(tri, msg, (err) => {
    if (err) logger.error(err)
    else console.log(msg.author.username + '\'s command is solved')
  })
})
