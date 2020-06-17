//BU KOD DİSCORD CODE SHARE SUNUCUSUNA AİTTİR İZİNSİZ (Ç)ALMAYIN

const Discord = require('discord.js');
const db = require('quick.db')
module.exports.run = async (bot, message, args, member, client, level) => {
  if(!message.member.roles.has("719741733000184038")) return message.channel.send(`Hata ! Yeterli Yetkin Yok !`);
const isim = args[1]
if(!isim)
return message.reply("Bir Isim Gir Örnek: `!erkek <@KİŞİ> <isim> <yaş>`")
const yaş = args[2]
if(!yaş)
return message.reply("Bir Yaş Gir Örnek: `!erkek <@KİŞİ> <isim> <yaş>`")
  let user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if (!user) return message.reply("**Etiket Atmayı Unuttun!**");
  user.addRole('719742074467123222')
  user.removeRole('719741622719348757')
const ky = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setDescription(`${user}, **kullanıcısına başarı ile erkek rolü verildi\nİsmi ${isim} Olarak Ayarlandı\nYaşı ${yaş} Olarak Ayarlandı!**`)
        .setColor('BLACK')
        .setTimestamp()
        message.channel.send(ky)
  user.setNickname("  ⸸ | " + isim + " " + yaş)
} 
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["bay"],
    permLevel: 0
}
exports.help = {
    name: 'erkek',
    description: 'kayıt',
    usage: 'kayıt'
}
   