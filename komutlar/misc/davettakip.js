//komutlar7davet-takip.js Dosyasına Atılacaktır!

const Discord = require('discord.js');
const db = require('quick.db');

exports.run =async (client, message, params, args) => {
     let logkanali = message.mentions.channels.first();  
     if (!logkanali) return message.channel.send(' Davet kanalı ayarlamak için **bir kanal etiketlemeniz gerekli!** `s!davet-kanal-ayarla #kanal`')
    const evettek = client.emojis.get('632384838749388800'); 
     if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(' Bu komutu kullanabilmek için **yeterli izne sahip değilsin!**')
    if (db.has(`davetChannel_${message.guild.id}`) === true) {
   let i = await db.set(`davetChannel_${message.guild.id}`, logkanali.id)
   message.channel.send(`Davet kanalı <#${i}> olarak değiştirildi.`)
    }
    if (db.has(`davetChannel_${message.guild.id}`) === false) {
    let i = await db.set(`davetChannel_${message.guild.id}`, logkanali.id) //dcs ekibi
     //message.channel.send(`Davet kanalı, <#${i}> olarak ayarlandı.`)
    message.channel.send(`Davet kanalı <#${i}> olarak ayarlandı.`)
    }
}   
    
exports.conf = {
 enabled: true,
 guildOnly: false,
 aliases: ['davet-kanalı','davet-kanal-ayarla'],
 permLevel: 3,
  kategori: 'Ayarlar'
};

exports.help = {
 name: 'davet-kanal',
 description: 'Sunucuya en son giren kişinin kimin davetiyle girdiğini gösterir o davetin kaç kere kullanıldığınıda gösterir.',
 usage: 'davet-kanal #kanal'
};
