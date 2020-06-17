const Discord = require("discord.js");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {
  if (!args[0])
    return message.reply(
      "Yanlış Kullanım!\nDoğru Kullanım: `!ban-yetki rol-ayarla @ban-atacak-rol`"
    );
  if (args[0] === "rol-ayarla") {
    const rol = await db.fetch(`dcsban_${message.guild.id}`);
      let kanallogdcs = message.mentions.roles.first();
      if (!kanallogdcs)
        message.channel.send(
          new Discord.RichEmbed()
            .setTitle(`⚠  UYARI`)
            .setDescription("**Bir Rol Etiketlemelisin!**")
            .addField(
              `ℹ Doğru Kullanım`,
              `\`!ban-yetki rol-ayarla @ban-atacak-rol\``
            )
            .setColor("RED")
            .setTimestamp()
            .setFooter(message.guild.name)
            .setThumbnail(message.guild.iconURL)
        );
if(rol)
  return message.reply("Zaten Bir Rol Ayarları!")
      await db.set(`dcsban_${message.guild.id}`, kanallogdcs.id);
      message.channel.send(
        new Discord.RichEmbed()
          .setTitle(`✅  BAŞARILI`)
          .setDescription(
            `**__Ban Sistemi__ Ban Atacak Yetkili Rolü Başarıyla <@&${kanallogdcs.id}> Olarak Ayarlandı!\n \n▪ Sıfırlamak için: \`!ban-yetki rol-sıfırla\`**`
          )
          .setColor("GREEN")
          .setTimestamp()
          .setFooter(message.guild.name)
          .setThumbnail(message.guild.iconURL)
      );
    }

  if (args[0] === "rol-sıfırla") {
    const rol = await db.fetch(`dcsban_${message.guild.id}`)
    if(!rol)
      return message.reply("Bir Rol Ayarlı Değil!")
    await db.delete(`dcsban_${message.guild.id}`);
    let log = new Discord.RichEmbed()
      .setTitle(`✅ BAŞARILI`)
      .setColor("RED")
      .setTimestamp()
      .setFooter(message.guild.name)
      .setThumbnail(message.guild.iconURL)
      .setDescription(
        "**__Ban Sistemi__ Ban Atacak Yetkili Rolü Başarıyla Sıfırlandı!\n \n▪Ayarlamak için: `!ban-yetki rol-ayarla @ban-atacak-rol`**"
      );
    message.channel.send(log);
  }
};
module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

module.exports.help = {
  name: "ban-yetki",
  description: "",
  usage: "taslak"
};