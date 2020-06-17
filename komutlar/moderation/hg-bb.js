const Discord = require('discord.js')
const db = require('quick.db')
//dcs ekibi
exports.run = async (client, message ,args) => {

  let kanal = message.mentions.channels.first()

  if(args[0] == 'log-ayarla') {
  db.set(`hgbb${message.guild.id}`, kanal.id)
  message.channel.send(`**Hoş Geldin - ByeBye Kanalı Başarıyla \`${kanal.name}\` Olarak Ayarlandı!**`)
    return;
  }

  if(args[0] == 'log-sıfırla') {
  db.delete(`hgbb${message.guild.id}`)
  message.channel.send(`**Sistem Sıfırlandı!**`)
    return;
  }
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [], //dcs ekibi
  permLevel: 0,
};

exports.help = {
  name: "hg-bb",
}; 
