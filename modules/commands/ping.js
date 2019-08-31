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

exports.keywords = ['핑', '속도', 'ping']
