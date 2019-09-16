const ping = require('ping')
const { RichEmbed } = require('discord.js')

exports.run = (tri, msg, cb) => {
  let emb = new RichEmbed()
    .setColor(0x1bad74)
    .setTitle('계산중!')
    .setDescription('잠시만 기다려 주세요...')
  msg.channel.send(emb).then((thi) => {
    ping.promise.probe('discordapp.com').then((res) => {
      emb.setTitle('API: ' + (res.alive ? res.time + 'ms' : 'fail'))
        .setColor(0x6bedd4)
        .setDescription('Comu: ' + tri.ping + 'ms')
      thi.edit(emb)
      cb()
    })
  })
}

exports.name = '핑'
exports.description = '트리튬 서버와의 통신 속도를 측정합니다'
exports.keywords = ['핑', '속도', 'ping']
