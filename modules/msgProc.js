process.env.GOOGLE_APPLICATION_CREDENTIALS = __dirname + '/../lib/Tritium.json'

const fs = require('fs')
const { SessionsClient } = require('dialogflow')
const dialogClient = new SessionsClient()
const superagent = require('superagent')

let commandList = []
fs.readdirSync(__dirname + '/commands').forEach((path, index) => {
  commandList[index] = {
    module: require(__dirname + '/commands/' + path.split('.js')[0])
  }
  commandList[index].keywords = commandList[index].module.keywords
})

exports.proc = (tri, msg, cb) => {
  if (msg.author.isBot) return
  if (!msg.content.startsWith('트리튬') && !msg.content.startsWith('3') && !msg.content.startsWith('트')) return
  msg.channel.startTyping()

  let solved = false
  const msgReals = msg.content.split(' ')[1]

  if (!msgReals) {
    msg.channel.send('ㅎㅇ "트리튬 도움"을 입력해 도움말을 봐봐')
    cb()
  } else {

    commandList.forEach((command) => {
      command.keywords.forEach((keyword) => {
        if (msgReals === keyword) {
          solved = true
          command.module.run(tri, msg, (cmdErr) => {
            if (cmdErr) cb(cmdErr)
            else cb()
          })
        }
      })
    })
  
    if (!solved) superagent.get('https://open-korean-text-api.herokuapp.com/extractPhrases?text=' + encodeURI(msgReals), (err, res) => {
      if (err) cb(err)
      else {
        result = res.body.phrases
  
        result.forEach((phrase, index) => {
          result[index] = phrase.split('(')[0]
        })
  
        commandList.forEach((command) => {
          command.keywords.forEach((keyword) => {
            if (result.includes(keyword)) {
              solved = true
              command.module.run(tri, msg, (cmdErr) => {
                if (cmdErr) cb(cmdErr)
                else cb()
              })
            }
          })
        })
      }
  
      if (!solved) dialogClient.detectIntent({ session: dialogClient.sessionPath('tritium-kkbvva', msg.author.id), queryInput: { text: { text: msgReals, languageCode: 'ko-KR' } } }).then((res) => {
        switch (res[0].queryResult.fulfillmentText.split(';')[0]) {
          case 'say':
            msg.channel.send(res[0].queryResult.fulfillmentText.split(';')[1])
            cb()
            break
  
          case 'ignore':
            cb()
            break
        }
      })
    })
  }
}
