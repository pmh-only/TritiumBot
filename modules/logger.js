const { WebhookClient, RichEmbed } = require('discord.js')
const webhook = new WebhookClient('622685970550226944', process.env.triLogger)
exports.error = (message) => {
  const embed = new RichEmbed()
    .setTitle('Tritium Error!')
    .setDescription(message)
    .setColor(0xff0000)
  webhook.send(embed)
}