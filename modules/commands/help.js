const fs = require('fs')
const { RichEmbed } = require('discord.js')

exports.run = (tri, msg, cb) => {
  const embed = new RichEmbed()
  fs.readdirSync(__dirname).forEach((file) => {
    const temp = require(__dirname + '/' + file.split('.js')[0])
    if (temp.name || temp.description) {
      embed.addField(temp.name, temp.description)
    }
  })

  msg.channel.send(embed.setColor(0x6bedd4).setTitle('Tritium: 트리튬 - 도움말'))
  cb()
}

exports.name = '도움'
exports.keywords = ['help', '도움', '도움말']
exports.description = '이 도움말을 출력합니다'
