const Discord = require("discord.js");

exports.run = function(client, message, args) {
  let guild = message.guild; //Dcs Ekibi

  if (!message.member.hasPermission("BAN_MEMBERS"))
    return message.channel.send(
      "Bu Komutu Kullanabilmek için '**Yönetici**' Yetkisine Sahip Olmalısınız!"
    );
  message.channel.send("**Bütün Yasaklı Üyelerin Yasağını Kaldırdım!**");
  message.guild.fetchBans().then(bans => {
    bans.forEach(ban => {
      message.guild.unban(ban.id);
    });
  });
};
module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["unbal-all", "topluaf", "toplu-af", "genel-af"],
  kategori: "MODERASYON KOMUTLARI",
  permLevel: 0
}; //Dcs Ekibi

module.exports.help = {
  name: "unbanall",
  description: "Sunucdaki Bütün Yasakları Kaldırır!.",
  usage: "unbanall"
};
   