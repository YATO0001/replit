const Discord = require("discord.js");
exports.run = (client, message, args) => { //Dcs Ekibi
  if (message.author.id != "KENDI ID NIZI YAZIN")
    return message.reply("❌ Bu Komutu Sadece Yapımcılar Kullanabilir!");

  if (!message.guild) {
    const ozelmesajuyari = new Discord.RichEmbed()
      .setColor(0xff0000)
      .setTimestamp()
      .setAuthor(message.author.username, message.author.avatarURL)
      .addField("⚠ Uyarı ⚠", "Bu  Komutu Özel Mesajlarda Kullanamazsın!");
    return message.author.sendEmbed(ozelmesajuyari);
  } //DCS Ekibi
  let guild = message.guild;
  let reason = args.slice(1).join(" ");
  let user = message.mentions.users.first();
  if (reason.length < 1) return message.reply("❌ Bir Mesaj Yazmalısın!");
  if (message.mentions.users.size < 1)
    return message
      .reply("❌ Kime Mesaj Atmam Gerektiğini Yazmalısın!")
      .catch(console.error);
  message.delete();
  message.reply("✅ Mesaj Gönderildi!");
  const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setTitle(`**🎆 Yeni Mesaj 🎆**`)
    .setTimestamp()
    .setDescription(reason);
  return user.send(embed);
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["dm"],
  permlevel: 4
};
exports.help = {
  name: "mesajat",
  description: "Bir kullanıcıya özel mesaj yollar.",
  usage: "mesajat"
};

//Dcs Ekibi
   