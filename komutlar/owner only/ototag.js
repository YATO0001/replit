//Komutlar/oto-tag.js Dosyasına Atılacaktır!

const Discord = require('discord.js'); //dcs ekibi
const db = require('quick.db')
exports.run = (client, message, args) => { 
  
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`:iptal: Bu komutu kullanabilmek için "\`Yönetici\`" yetkisine sahip olmalısın.`);
  
  let isimm = args.slice(0).join(' ');
  if(!isimm) return message.channel.send(' Ototag Kullanımı Örnek `s!ototag 🔱| -uye-`')
  
   message.channel.send('Oto Tag Sistemi Ayarlanmıştır.\nUnutmayın Sunucuya Yeni Katılan Kullanıcılar içindir. Kapatmak İçin `!!ototagkapat`')
  
    db.set(`ototag_${message.guild.id}`, isimm)  

  };
exports.conf = {
  enabled: true,  
  guildOnly: false, 
  aliases: [], 
  permLevel: 0
};

exports.help = {
  name: 'oto-tag',
  description: 'taslak', 
  usage: 'ototag'
};
