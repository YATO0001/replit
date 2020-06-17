const Discord = require("discord.js");
const ayarlar = require("../../ayarlar.json");

module.exports.run = async (client, message, args) => {
  const yetkili_rol = message.guild.roles.get("KOMUTU KULLANA BILECEK ROL ID YAZ");
  if (!message.member.roles.has("KOMUTU KULLANA BILECEK ROL ID YAZ"))
    return message.reply(
      `Bu Komutu Sadece ${yetkili_rol} Rolüne Sahip Kişiler Kullana Bilir!`
    ); //DCS
  
  const üye =
    message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!üye) return message.reply("Bir Üye Etiketle Yada ID Sini Gir!");

  const isim = args[1];
  if (!isim) return message.reply("Bir İsim Girmelisin");

  const yaş = args[2];
  if (!yaş) return message.reply("Bir Yaş Girmelisin!");

  const üye_isim = `ᨖ ${isim} | ${yaş}`;
  üye.setNickname(üye_isim);

  message.channel.send(
    new Discord.RichEmbed()
      .setTitle(message.guild.name)
      .setThumbnail(üye.user.avatarURL)
      .setFooter(message.channel.name) //DCS
      .setTimestamp()
      .setColor("GREEN")
      .setDescription(
        `${üye} İsimli Kullanıcının İsmi Başarıyla \`${üye_isim}\` Olarak Değiştirildi!`
      )
  );
};
module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
}; //DCS

module.exports.help = {
  name: "isimm",
  description: "",
  usage: "isim <user> <name> <age>"
};