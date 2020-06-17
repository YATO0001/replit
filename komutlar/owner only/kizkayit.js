//BU KOD DİSCORD CODE SHARE SUNUCUSUNA AİTTİR İZİNSİZ (Ç)ALMAYIN

const Discord = require('discord.js');
const db = require('quick.db')
module.exports.run = async (bot, message, args, member, client, level) => {
  if(!message.member.roles.has("719741733000184038")) return message.channel.send(`Hata ! Yeterli Yetkin Yok !`);
const isim = args[1]
if(!isim)
return message.reply("Bir Isim Gir Örnek: `!kadın <@KİŞİ> <isim> <yaş>`")
const yaş = args[2]
if(!yaş)
return message.reply("Bir Yaş Gir Örnek: `!kadın <@KİŞİ> <isim> <yaş>`")
  let user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if (!user) return message.reply("**Etiket Atmayı Unuttun!**");
  user.addRole('719742197125218386')
  user.removeRole('719741622719348757')
const ky = new Discord.RichEmbed()
         .setAuthor(message.author.tag, message.author.avatarURL)  
        .setDescription(`${user}, **kullanıcısına başarı ile kadın rolü verildi\nİsmi ${isim} Olarak Ayarlandı\nYaşı ${yaş} Olarak Ayarlandı!**`)
        .setColor('BLACK')
        .setTimestamp()
        message.channel.send(ky)
  user.setNickname(" ⸸ | " + isim + " " + yaş)
} 
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["kız"],
    permLevel: 0
}
exports.help = {
    name: 'kadın',
    description: 'kayıt',
    usage: 'kayıt'
}
   