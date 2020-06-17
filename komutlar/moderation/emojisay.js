const Discord = require("discord.js");
const db = require("quick.db");
//Dcs Ekibi
exports.run = async (client, message, args) => {
  let tag = "ᨖ"

  const voiceChannels = message.guild.channels.filter(c => c.type === "voice");
  let count = 0;
  for (const [id, voiceChannel] of voiceChannels)
    count += voiceChannel.members.size;

  var sessayı = count.toString().replace(/ /g, "    ");
  var üs2 = sessayı.match(/([0-9])/g);
  sessayı = sessayı.replace(/([a-zA-Z])/g, "YOK").toLowerCase();
  if (üs2) {
    sessayı = sessayı.replace(/([0-9])/g, d => {
      return {
        "0": "0️⃣",
        "1": "1️⃣",
        "2": "2️⃣",
        "3": "3️⃣",
        "4": "️4️⃣",
        "5": "5️⃣",
        "6": "️6️⃣",
        "7": "️7️⃣", //Dcs Ekibi
        "8": "8️⃣",
        "9": "️9️⃣",
        "6": "️6️⃣",
        "7": "️7️⃣",
        "8": "8️⃣",
        "9": "️9️⃣"
      }[d];
    });
  }

  var tags = message.guild.members
    .filter(member => member.user.username.includes(tag))
    .size.toString();
  if (tags) {
    tags = tags.replace(/([0-9])/g, d => {
      return {
        "0": "0️⃣",
        "1": "1️⃣",
        "2": "2️⃣",
        "3": "3️⃣",
        "4": "️4️⃣",
        "5": "5️⃣",
        "6": "️6️⃣", //Dcs Ekibi
        "7": "️7️⃣",
        "8": "8️⃣",
        "9": "️9️⃣"
      }[d];
    });
  }

  var onlayn = message.guild.members
    .filter(m => m.presence.status !== "offline")
    .size.toString()
    .replace(/ /g, "    ");
  var üs4 = onlayn.match(/([0-9])/g);
  onlayn = onlayn.replace(/([a-zA-Z])/g, "YOK").toLowerCase();
  if (üs4) {
    onlayn = onlayn.replace(/([0-9])/g, d => {
      return {
        "0": "0️⃣",
        "1": "1️⃣",
        "2": "2️⃣",
        "3": "3️⃣",
        "4": "️4️⃣",
        "5": "5️⃣", //Dcs Ekibi
        "6": "️6️⃣",
        "7": "️7️⃣",
        "8": "8️⃣",
        "9": "️9️⃣"
      }[d];
    });
  }

  var üyesayısı = message.guild.memberCount.toString().replace(/ /g, "");
  var üs = üyesayısı.match(/([0-9])/g);
  üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "YOK").toLowerCase();
  if (üs) {
    üyesayısı = üyesayısı.replace(/([0-9])/g, d => {
      return {
        "0": "0️⃣",
        "1": "1️⃣",
        "2": "2️⃣",
        "3": "3️⃣",
        "4": "️4️⃣",
        "5": "5️⃣",
        "6": "️6️⃣", //Dcs Ekibi
        "7": "️7️⃣",
        "8": "8️⃣",
        "9": "️9️⃣"
      }[d];
    });
  }

  const dcs = new Discord.RichEmbed()
    .setTitle("Sunucu İstatistik")
    .setColor("BLUE")
    .setFooter(message.guild.name)
    .setTimestamp()
    .setThumbnail(message.guild.iconURL)
    .addField("Toplam Üye", üyesayısı)
    .addField("Toplam Aktif Üye", onlayn)
    .addField("Sesteki Üye Sayısı", sessayı)
    .addField("Taglı Üye Sayısı", tags);
  message.channel.send(dcs);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
//Dcs ekibi
exports.help = {
  name: "say",
  description: "Sunucudakileri Sayar",
  usage: "say"
};
   