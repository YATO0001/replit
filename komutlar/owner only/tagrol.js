const Discord = require("discord.js");
const ayarlar = require("../../ayarlar.json")

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_ROLES"))
    return message.reply(
      `Bu Komutu Kullanabilmek İçin **Yönetici** Yetkisine Sahip Olmalısın!`
    ); //Dcs Ekibi

  if (!args[0])
    return message.reply(
      `:x: Rol Verilecek Kullanıcıların, Adında Bulunması Gereken Tagı Giriniz! |  \`${ayarlar.prefix}tagarol tag @rol\``
    );
  let role = message.mentions.roles.first() || message.guild.roles.get(args[1]);
  if (!role)
    return message.reply(
      `:x: Kullanıcı Adında Tag Bulunan Kullanıcılara Verilecek Rolü Belirtiniz! |  \`${ayarlar.prefix}tagarol tag @rol\``
    );

  try {
    let rolveriliyor = await message.channel.send(
      `Kullanıcı Adında Tag Olup, Belirtilen Role Sahip Olmayan Kişi Sayısı: ${
        message.guild.members.filter(
          x => x.user.username.includes(args[0]) && !x.roles.has(role.id)
        ).size
      } \nRolleri Veriliyor...`
    );
    await message.guild.members
      .filter(x => x.user.username.includes(args[0]) && !x.roles.has(role.id))
      .forEach(a => a.addRole(role.id));
    await rolveriliyor.edit(
      `Belirtilen Taga Sahip Toplam **(${
        message.guild.members.filter(
          x => x.user.username.includes(args[0]) && !x.roles.has(role.id)
        ).size
      } Kişiye)**  \`${
        message.guild.roles.get(role.id).name
      }\`  Rolünü Başarıyla Verdim!`
    );
  } catch (err) {
    message.reply("İşlem Başarısız. Yetkilerimi Kontrol Ediniz.");
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
}; //Dcs Ekibi

exports.help = {
  name: "tagarol",
  description: "Belirtilen Taga Sahip Kullanıcılara Belirtilen Rolü Verir.",
  usage: "tagarol [tag] [rol]"
};
   