const Discord = require("discord.js");
const ayarlar = require("../../ayarlar.json")
const db = require("quick.db");
module.exports.run = async (client, message, args) => {
  let verilcekdcs = await db.fetch(`dcsban_${message.guild.id}`)
  if (!message.member.roles.has(verilcekdcs))
    return message.reply(
      "Ban Komutunu Kullanmak için Sunucu Sahibinin Ayarladığı Role Sahip Olmalısın!"
    );
  const üyedcs =
    message.mentions.users.first() || message.guild.members.get(args[0]);
  if (!üyedcs) return message.reply("Bir Üye Etiketle veya ID Yaz!");
  const sebepdcs = args[1] || `Sebep Girilmedi\nYasaklayan Yetkili: ${message.author.tag}`;

  üyedcs.ban(sebepdcs);
  message.channel.send(
    `${üyedcs.user.tag} İsimli Kullanıcı Sunucudan Yasaklandı!\n${sebepdcs}`
  );
};
module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

module.exports.help = {
  name: "bann",
  description: "",
  usage: "taslak"
};