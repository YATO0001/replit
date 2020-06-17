const Discord = require("discord.js");
const ayar = require("../../ayarlar.json")

module.exports.run = async (client, message, args) => {



const helpembed = new Discord.RichEmbed()
.setAuthor(message.author.tag, message.author.avatarURL)
.setDescription("Help Commands.")
.addField("Commands;", client.commands.map(props => props.help.name).join(" **|** "))
.setColor('RANDOM')
message.channel.send(helpembed) }
module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["commands","yardım","help"],
  permLevel: 0
};

module.exports.help = {
  name: 'help',
  description: '',
  usage: 'komutlar'
};
   