const superagent = require('superagent')
const randomHexColor = require('random-hex-color')
const { RichEmbed } = require('discord.js')

exports.run = (tri, msg, cb) => {
  superagent.get('nekobot.xyz/api/image?type=neko', (err, res) => {
    if (err) {
      msg.channel.send(err)
      cb(err)
    } else {
      const emb = new RichEmbed()
        .setColor(randomHexColor())
        .setImage(res.body.message)
        .setDescription(':arrow_forward:를 두번 눌러 다음 네코를 불러올 수 있습니다')
      msg.channel.send(emb).then((targetMsg) => {
        targetMsg.react('▶')
        const collector = targetMsg.createReactionCollector((reac, user) => user.id === msg.author.id, { time: 60000 })
        collector.on('collect', () => {
          superagent.get('nekobot.xyz/api/image?type=neko', (err, res) => {
            if (err) {
              msg.channel.send(err)
              cb(err)
            } else {
              const emb = new RichEmbed()
                .setColor(randomHexColor())
                .setImage(res.body.message)
                .setFooter('Powered by nekobot.xyz')
                .setDescription(':arrow_forward:를 두번 눌러 다음 네코를 불러올 수 있습니다')
              targetMsg.edit(emb)
              targetMsg.react('▶')
            }
          })
        })
        collector.on('end', () => {
          targetMsg.react('❌')
          cb()
        })
      })
    }
  })
}

exports.name = '네코'
exports.keywords = ['neko', '네코', '냥']
exports.description = '냥이들을 위한 기능입니다'