const Discord = require('discord.js')
const db = require('quick.db')
const a = require('../../ayarlar.json')

exports.run = async (client, message, args) => {
if(args[0] === "kapat") {
  
db.delete(`cfxget${message.guild.id}`)
  
  message.channel.send( new Discord.RichEmbed()
  .setDescription(`Giriş Çıkış başarıyla kapatıldı!`)
  .setColor("#00ff88")
  .setFooter(`${client.user.username} | Giriş Çıkış Sistemi.`, client.user.avatarURL))
} 
else {
  

  let yarrakkanalı = message.mentions.channels.first();
  
  if(cyarrakkanalı) return message.channel.send(new Discord.RichEmbed()
  .setTitle(`**\`GirişÇıkış Bilgi;\`**`)
  .setDescription(`** ** \n**Ayarlamak İçin**: \`${a.prefix}girişçıkış #kanal\`\n\n **Kapatmak İçin:** \`${a.prefix}girişçıkış kapat\``)
  .setColor("#00ff88")
  .setFooter(`${client.user.username} | Giriş Çıkış Sistemi.`, client.user.avatarURL)
  )
  

  db.set(`cfxget${message.guild.id}`, yarrakkanalı.id)
  

  message.channel.send(new Discord.RichEmbed()
  .setDescription(`Giriş çıkış mesajlarının atılacağı kanal **${cfxs}** olarak ayarlandı!`)
  .setColor("#00ff88")
  .setFooter(`${client.user.username} | Giriş Çıkış Sistemi.`, client.user.avatarURL))
  
  
}}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 3,
};

exports.help = {
  name: 'girişçıkış'
};