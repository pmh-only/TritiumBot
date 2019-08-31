const { WebhookClient, RichEmbed } = require('discord.js')
const webhook = new WebhookClient('616978035018563589', 'uqYrtOw_yh2JNnwMz9pHm6ehGs4bMhsGCRdmPJJm0QkapJmzsCtD1YZTaAwZQH0glavi')

exports = {
  error: (message, location) => {
    const embed = new RichEmbed()
      .setTitle('Tritium Error on ' + location)
      .setDescription(message)
    webhook.send(embed)
  }
}