const fs = require('fs')
const cheerio = require('cheerio')
const path = require('path').resolve()
const superagent = require('superagent')

if (!fs.existsSync(path + '/download/')) fs.mkdirSync(path + '/download/')

exports.run = (tri, msg, cb) => {
  const query = msg.content.split(' ').slice(2).join(' ')
  msg.channel.send('잠시만 기다려 주세요...')
  superagent.get('http://freesound.org/search/?q=' + query, (err, res) => {
    if (err) cb(err)
    else {
      cheerio('.title', res.text).each((i, elem) => {
        if (i < 4) {
          const original = elem.attribs.href
          const soundTitle = elem.attribs.title
          const userName = original.split('/')[2]
          const soundID = original.split('/')[4]
          superagent.get('http://freesound.org' + original, (err2, res2) => {
            if (err2) cb(err2)
            const type = cheerio('dd', res2.text)[0].children[0].data.split('(')[1].split(')')[0]
            const resultLink = 'https://freesound.org' + original + 'download/' + soundID + '__' + userName.toLowerCase() + '__' + soundTitle.toLowerCase() + type
      
            const stream = fs.createWriteStream(path + '/download/' + soundTitle + type)
            const request = superagent.get(resultLink).set('Cookie', 'csrftoken=' + process.env.effectsToken + '; sessionid=zejghwnb6t8pd4bltor7kgapfnl66lnq;')
            request.pipe(stream)
      
            stream.on('close', () => {
              if (fs.statSync(path + '/download/' + soundTitle + type).size < 8000000) {
                msg.channel.send({
                  files: [ path + '/download/' + soundTitle + type ]
                }).then(() => {
                  fs.unlinkSync(path + '/download/' + soundTitle + type)
                })
              } else {
                fs.unlinkSync(path + '/download/' + soundTitle + type)
              }
            })
          })
        }
      })
      cb()
    }
  })
}

exports.name = '이펙'
exports.keywords = ['이펙', 'effect', '이펙트']
exports.description = '여러가지 이펙트들을 검색할 수 있습니다'
