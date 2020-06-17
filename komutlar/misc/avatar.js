const Discord = require("discord.js");
exports.run = (client, message, args) => {
  let mention = message.mentions.users.first();
  let sender = "";

  if (message.channel.guild.member(message.author).nickname == null) {
    sender = message.author.username;
  } else {
    sender = message.channel.guild.member(message.author).nickname;
  }
  if (mention != null || mention != undefined) {
    var name = mention.username + "";
    if (mention.username.endsWith("")) {
      name = mention.username + "";
    }
    const avatarEmbedOther = new Discord.RichEmbed()
      .setAuthor(mention.username, mention.avatarURL)
      .setColor("RANDOM")
      .setImage(mention.avatarURL)
      .setFooter(
        `${message.author.tag} Tarafından İstendi!`,
        message.author.avatarURL
      );
    message.channel.sendEmbed(avatarEmbedOther);
    return;
  } else {
    const avatarEmbedYou = new Discord.RichEmbed()
      .setAuthor(sender, message.author.avatarURL)
      .setColor("RANDOM")
      .setImage(message.author.avatarURL)
      .setFooter(
        `${message.author.tag} Tarafından İstendi!`,
        message.author.avatarURL
      );
    message.channel.sendEmbed(avatarEmbedYou);
    return;
  }
  message.channel.sendMessage("❌ HATA ❌");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["avatar", "pp"],
  kategori: "KULLANICI KOMUTLARI",
  permLevel: 0
};

exports.help = {
  name: "avatar",
  description: "Etiketlediğiniz veya Kendinizin Profil Fotosunu Gösterir.",
  usage: "/pp <etiket> veya /avatar"
};
   