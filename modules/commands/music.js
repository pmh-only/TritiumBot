const discloud = require('../discloud')
const { RichEmbed } = require('discord.js')
const randomHexColor = require('random-hex-color')

exports.run = (tri, msg, cb) => {
  if (!msg.guild) {
    msg.channel.send('엇, 저런! 뮤직 기능은 서버에서만 사용가능합니다!')
    cb()
  } else if (!msg.content.split(' ')[2]) {
    const emb = new RichEmbed()
      .setColor(randomHexColor())
      .setTitle('Tritium Musics!')
      .setDescription('> 트리튬 뮤직 추가\n> 트리튬 뮤직 재생')
    msg.channel.send(emb)
    cb()
  } else switch (msg.content.split(' ')[2]) {
    case '추가':
      msg.channel.send('트리튬 클라우드에 추가할 음악 파일을 음악의 이름과 함깨 보내주세요 (현재 mp3만 가능합니다)')
      msg.channel.awaitMessages((m) => m.author.id === msg.author.id  && (!m.attachments ? false : m.attachments.first().filename.endsWith('.mp3')), {
        max: 1,
        time: 60000
      }).then((collected) => {
        if (!collected.first()) {
          msg.channel.send('시간이 초과되었습니다! 다시시도해 주세요!')
          cb()
        } else {
          const title = collected.first().content || collected.first().attachments.first().filename
          discloud.write(title, collected.first().attachments.first().url)
          msg.channel.send(title + '로 저장을 완료하였습니다!')
          cb()
        }
      })
      break

    case '재생':
      if (!msg.member.voiceChannel || !msg.member.voiceChannel.joinable) {
        msg.channel.send('엇, 저런! 음성채널에 들어와 있지 않거나 들어갈 수 없어요!')
        cb()
      } else {
        const query = msg.content.split(' ').slice(3).join(' ')
        msg.member.voiceChannel.join().then((connection) => {
          const read = discloud.read(query)
          if (!read) {
            msg.channel.send(query + '는 트리튬 클라우드에 존재하지 않습니다')
            cb()
          } else {
            connection.playArbitraryInput(read.url)
            msg.channel.send(query + '를 재생합니다')
            cb()
          }
        })
      }
      break

    default:
      msg.channel.send('없는 명령어 입니다!')
      break
  }
}

exports.name = '뮤직'
exports.keywords = ['뮤직', 'music', '음악']
exports.description = '트리튬 뮤직 클라우드 서비스입니다'
