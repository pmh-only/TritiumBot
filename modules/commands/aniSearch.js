const superagent = require('superagent')
const randomHexColor = require('random-hex-color')
const { RichEmbed } = require('discord.js')

exports.run = (tri, msg, cb) => {
  msg.channel.send('검색할 애니의 이름을 입력해주세요')
  msg.channel.awaitMessages((m) => m.author.id === msg.author.id, {
    max: 1,
    time: 60000
  }).then((collected) => {
    if (!collected.array()[0]) {
      msg.channel.send('검색 제한시간 초과에요!')
      cb()
    } else {
      const query = collected.array()[0].content
      
      superagent.get('https://kitsu.io/api/edge/anime?filter[text]=' + encodeURI(query), (err, res) => {
        if (err) {
          msg.channel.send(err)
          cb(err)
        } else {
          let page = 0
          const data = res.body.data
          if (data.length < 1) {
            msg.channel.send('저런! 검색 결과가 없어요!')
            cb()
          } else {
            const attributes = data[page].attributes
            const emb = new RichEmbed()
              .setColor(randomHexColor())
              .setTitle((page + 1) + '. ' + attributes.canonicalTitle)
              .setDescription(attributes.synopsis)
            if (attributes.coverImage && attributes.coverImage.large) {
              emb.setThumbnail(attributes.coverImage.large)
            }
            if (attributes.posterImage && attributes.posterImage.large) {
              emb.setImage(attributes.posterImage.large)
            }
            msg.channel.send(emb).then((targetMsg) => {
              targetMsg.react('▶')
              const collector = targetMsg.createReactionCollector((reac, user) => user.id === msg.author.id, { time: 60000 })
              collector.on('collect', () => {
                page++
                if (data[page]) {
                  const attributes = data[page].attributes
                  const emb = new RichEmbed()
                    .setColor(randomHexColor())
                    .setTitle((page + 1) + '. ' + attributes.canonicalTitle)
                    .setDescription(attributes.synopsis)
                  if (attributes.coverImage && attributes.coverImage.large) {
                    emb.setThumbnail(attributes.coverImage.large)
                  }
                  if (attributes.posterImage && attributes.posterImage.large) {
                    emb.setImage(attributes.posterImage.large)
                  }
                  targetMsg.edit(emb)
                } else {
                  targetMsg.edit('다음 애니메이션을 찾을 수 없습니다')
                }
              })
              collector.on('end', () => {
                targetMsg.react('❌')
                cb()
              })
            })
          }
        }
      })
    }
  })
}

exports.name = '애니검색'
exports.apiInfo = { name: 'Kitsu API powered by apiary', path: 'https://kitsu.io/api/edge', document: 'https://kitsu.docs.apiary.io' }
exports.keywords = ['애니검색', '애니', 'anime']
exports.description = '에니메이션 정보를 검색합니다'
