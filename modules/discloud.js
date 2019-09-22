const fs = require('fs')
const uuid = require('uuid/v4')
const path = require('path').resolve()
if (!fs.existsSync(path + '/db/discloud.json')) fs.writeFileSync(path + '/db/discloud.json', '{}')
const discloud = require(path + '/db/discloud.json')

exports.read = (id) => {
  console.log('Discloud - Read: ' + id)
  if (!discloud[id]) return null
  return discloud[id]
}

exports.write = (title, url) => {
  const id = uuid()
  discloud[title] = {
    id: id,
    url: url
  }
  fs.writeFileSync(path + '/db/discloud.json', JSON.stringify(discloud))
  return id
}
