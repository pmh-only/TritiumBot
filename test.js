const fs = require('fs')
const path = require('path').resolve()
fs.readdir(path + '/modules/commands/', (err, files) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    if (files.length < 1) {
      console.error('No commads detected!')
      process.exit(1)
    } else {
      files.forEach((file) => {
        try {
          require(path + '/modules/commands/' + file)
        } catch (err) {
          if (err) {
            console.error(err)
            process.exit(1)
          }
        }
      })

      console.log('Finished!')
      process.exit(0)
    }
  }
})
