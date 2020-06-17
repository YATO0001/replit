const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const weather = require("weather-js");
const fs = require("fs");
const db = require("quick.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader")(client);
const path = require("path");
const request = require("request");
const snekfetch = require("snekfetch");
const queue = new Map();
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar", (err,results) => {
  results.forEach(result => {
    fs.readdir(`./komutlar/${result}`, (err, files) => {
      files.forEach(file => {
        let props = require(`./komutlar/${result}/${file}`)
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.help.name);
        });
      })
    })
  })
})
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.on(`guildMemberAdd`, async member => { //DCS EKİBİ
  const dcs = new Discord.RichEmbed()
   .setTitle("HOŞGELDİN")
.setColor("RANDOM")
.setFooter(client.user.username)
.setThumbnail(member.guild.iconURL)
.setDescription(`**${member.guild.name} İsimli Sunucuya Hoş Geldin!**`)
  member.send(dcs);
});

client.on('guildMemberAdd', async member => {
  
  let user = member.user 
  let hgbb = await db.fetch(`hgbb${member.guild.id}`)
  let sunucu =  member.guild.channels.get(hgbb)

  const embed = new Discord.RichEmbed()
  .setColor('RED')
  .setAuthor(user.tag, user.avatarURL)
  .setThumbnail(user.avatarURL)
  .setDescription(`${user} Sunucucuya Katıldı Toplam Üye: \`${sunucu.guild.memberCount}\``)
  .setFooter(user, `Sunucuya Katıldı!`)
  sunucu.send(embed) //dcs ekibi
})

client.on('guildMemberRemove', async member => {

  let user = member.user
  let hgbb = await db.fetch(`hgbb${member.guild.id}`)
  let sunucu =  member.guild.channels.get(hgbb)

  const embed = new Discord.RichEmbed() //DCS EKİBİ
  .setColor('RED')
  .setAuthor(user.tag, user.avatarURL)
  .setThumbnail(user.avatarURL)
  .setDescription(`${user} Sunucudan Ayrıldı! Geriye Kalan Üye: ${sunucu.guild.memberCount}`)
  .setFooter(user, `Sunucudan Ayrıldı!`)
  sunucu.send(embed)
})

client.on('message', async msg => {
    if (msg.content.toLowerCase() === prefix + "rainbow") { //Tırnak İçindeki Yazı Komuttur
   if (msg.channel.type === "dm") return;
  const rol = 'Véra' // Rol ismi buraya
  setInterval(() => {
      msg.guild.roles.find(s => s.name === rol).setColor("RANDOM")
      },14000);//Hızıyla oynamayın
  }
});

client.on("guildMemberAdd", async (member) => { // ban atınca
  let logs = await member.guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"}); // geçmişte atılan tüm banları çek
  let op = logs.entries.first().executor; // geçmişte atılan banlar sıralanmış şekilde gelir, son atılandan ilk atılana doğru, ilk nesneyi
  // yani son atılan banı çek, .executor ile ban atanı çek
  let userLogs = logs.entries.array().slice(1).filter(log => log.executor.id == op.id);
  // tüm atılan banların ilkini alma (slice(1), yani son banı alma) ardından ban atan kullanıcı son ban atan kullanıcıya eşit olanları filtrele
  // elimizde artık son ban atan kullanıcının attığı banlar var

  let minute = 30;
  // bunu değiştirebilirsin, 30 dakika içinde
  let s = 1;
  // 3 ban atarsa

  let d = Date.now() - (1000 * minute * 60 * 60);
  // şuanki süreden 30 dakika çıkarıldı

  if(!(new Array(s - 1)).fill(0).map((el, i) => i).map(el => (userLogs[el].createdTimestamp > d)).includes(false)) {
  // filtrelenmiş olaylardan (son atılan banı sildirdik ve kullanıcının attığı banları almıştık) son (s - 1) tanesi (minute) dakika içinde yapıldıysa
    member.roles.array().filter(a => a.name != "@everyone").forEach(role => { // @everyone dışındaki her rol için bunu uygula
      member.removeRole(role.id); // rolü sil
    })

    member.addRole("719742074467123222");
  }
})

client.on("message", async msg => {
  let member = msg.mentions.users.first() || msg.author;

  const reason = msg.content
    .split(" ") 
    .slice(1) //dcs ekibi
    .join(" ");
  let akanal = await db.fetch(`destekkanal${msg.guild.id}`);
  if (msg.channel.id == akanal) {
    msg.channel.bulkDelete(1);
    let roleee = await db.fetch(`destekrole${msg.guild.id}`);
    let rl = msg.guild.roles.find(v => v.id === roleee);
    const listedChannels = [];
    let onl;
    msg.guild.members.forEach(p => {
      if (p.roles.has(rl.id)) {
        if (msg.guild.member(p).user.presence.status === "idle")
          onl = ":orange_circle:" 
        if (msg.guild.member(p).user.presence.status === "dnd")
          onl = ":red_circle:"
        if (msg.guild.member(p).user.presence.status === "online")
          onl = ":green_circle:"
        if (msg.guild.member(p).user.presence.status === "offline")
          onl = ":white_circle:"

        listedChannels.push(`\`${p.user.tag}` + "\` " + onl );
      }
    });
    if (!msg.guild.channels.find(xx => xx.name === "DESTEK")) {
      await msg.guild.createChannel(`DESTEK`, "category");
    }
    let a = msg.guild.channels.find(xxx => xxx.name === "DESTEK");
    if (
      msg.guild.channels.some(
        kk =>
          kk.name ===
          `destek-${msg.guild.member(member).user.username.toLowerCase() +
            msg.guild.member(member).user.discriminator}`
      ) == true
    )
      return msg.author.send(`**Destek Sistemi Açma İşlemi Başarısız!\nSebep: \`Açılmış Zaten 1 Tane Destek Talebiniz Var.\`**`);
    msg.guild
      .createChannel(`destek-${member.tag}`, "text")
      .then(c => {
        let role2 = msg.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role2, {
          SEND_MESSAGES: false,
          READ_MESSAGES: false
        });
        c.overwritePermissions(msg.author, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
        });

        c.setParent(a);

        const embed = new Discord.RichEmbed() //dcs ekibi
          .setColor("DAR_BLUE")
          .setAuthor(`${client.user.username} | Destek Sistemi`)
          .addField(
            `Merhaba ${msg.author.username}!`,
            `Destek Yetkilileri burada seninle ilgilenecektir. \nDestek talebini kapatmak için \`${prefix}kapat\` yazabilirsin.`
          )
          .addField(`» Kullanıcı:`, `<@${msg.author.id}>`, true)
          .addField(`» Talep Konusu/Sebebi:`, `\`${msg.content}\``, true)
          .addField(
            `**Destek Rolündeki Yetkililer;**`,          
`${listedChannels.join(`\n`)}`
          )
          .setFooter(`${client.user.username} | Destek Sistemi`)
          .setTimestamp();
        c.send({ embed: embed });
      })
      .catch(console.error);
  }
});

client.on("message", message => {
  if (message.content.toLowerCase().startsWith(prefix + `kapat`)) {
    if (!message.channel.name.startsWith(`destek-`))
      return message.channel.send(
        `Bu komut sadece Destek Talebi kanallarında kullanılablir!`
      );

    var deneme = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setAuthor(`Destek Talebi Kapatma İşlemi`)
      .setDescription(
        `Destek talebini kapatmayı onaylamak için, \n10 saniye içinde \`evet\` yazınız.`
      )
      .setFooter(`${client.user.username} | Destek Sistemi`);
    message.channel.send(deneme).then(m => {
      message.channel
        .awaitMessages(response => response.content === "evet", {
          max: 1,
          time: 10000,
          errors: ["time"]
        })
        .then(collected => {
          message.channel.delete(); //dcs ekibi
        })
        .catch(() => {
          m.edit("Destek Talebi kapatma isteğin zaman aşımına uğradı!").then(
            m2 => {
              m2.delete();
            },
            3000
          );
        });
    });
  }
});

client.on("guildMemberAdd", async member => {
let kanal = await db.fetch(`otok_${member.guild.id}`)  
let rol = await db.fetch(`otorol_${member.guild.id}`)   
let mesaj =  db.fetch(`otomesaj_${member.guild.id}`)  
if(!kanal) return

if(!mesaj) {
  
  client.channels.get(kanal).send('HG BB SİSTEMİ PİNKDAWN Otomatik Rol Verildi Seninle Beraber `'+member.guild.memberCount+'` Kişiyiz! Hoşgeldin! `'+member.user.username+'`')
member.addRole(rol)
  return
} //dcs ekibi

if(mesaj) {
  var mesajs = await db.fetch(`otomesaj_${member.guild.id}`).replace("-uye-", `${member.user.tag}`).replace("-rol-", `${member.guild.roles.get(rol).name}`).replace("-server-", `${member.guild.name}`).replace("-uyesayisi-", `${member.guild.memberCount}`).replace("-botsayisi-", `${member.guild.members.filter(m => m.user.bot).size}`).replace("-bolge-", `${member.guild.region}`).replace("-kanalsayisi-", `${member.guild.channels.size}`)
  member.addRole(rol)
  client.channels.get(kanal).send(mesajs)

}  
  
});

client.on("channelDelete", async function(channel) {
 
    const log = channel.guild.channels.get("LOG KANAL ID GIRIN")
   
    if (!log) return;
    let verilcek = channel.guild.roles.get("CEZALI ROL ID GIRIN")
    if (!verilcek) return;
    let entry = await channel.guild
      .fetchAuditLogs({ type: "CHANNEL_DELETE" })
      .then(a => a.entries.first());
    
    if (entry.executor.id == channel.guild.owner.id) return;
    let kisi = channel.guild.member(entry.executor);
    await kisi.roles.forEach(x =>
      kisi.removeRole(x).then(f => kisi.addRole(verilcek))
    );
    let mu = new Discord.RichEmbed()
      .setTitle(`UYARI`)
      .setColor("RED")
      .setTimestamp()
      .setThumbnail(channel.guild.iconURL) //Dcs Ekibi
      .setFooter(channel.guild.name)
      .setDescription(
        `**\`${channel.name}\`  İsimli Kanal Silindi Ancak Kanal Koruma Sistemi Sayesinde Sunucuya Geri Yüklendi ve Kanalı Silen Kişinin Yetkileri Alındı!\n \n__▪ Kanalı Silen Kişi:__ ${entry.executor}\n__▪ Kişinin ID'si:__ \`${entry.executor.id}\`\n__▪ Kişinin Tagı:__ \`${entry.executor.tag}\`**`
      );

    let kategoriID = channel.parentID;
    channel.clone(this.name, true, true).then(z => {
      let chn = z.guild.channels.find(x => x.id === z.id);
      if (kategoriID) {
        chn.setParent(chn.guild.channels.find(s => s.id === kategoriID));
      }
      if (channel.type == "voice") return log.send(mu);
      let everyone = channel.guild.roles.find(x => x.name === "@everyone");
      const embed = new Discord.RichEmbed()
        .setTitle(`BİLDİRİ`)
        .setColor("RED")
        .setThumbnail(channel.guild.iconURL)
        .setFooter(channel.guild.name)
        .setTimestamp()
        .setDescription(
          `**Bu Kanal Silindi Ancak Kanal Koruma Sistemi Sayesinde Sunucuya Geri Yüklendi ve Kanalı Silen Kişinin Yetkileri Alındı!\n \n__▪ Kanalı Silen Kişi:__ ${entry.executor}\n__▪ Kişinin ID'si:__ \`${entry.executor.id}\`**`
        );
      chn.send(embed);
      log.send(mu);
      let dcs = new Discord.RichEmbed()
      .setTitle(`UYARI`)
      .setColor("RED")
      .setTimestamp()
      .setThumbnail(channel.guild.iconURL) //Dcs Ekibi
      .setFooter(channel.guild.name)
      .setDescription(
        `**\`${channel.name}\`  İsimli Kanal Silindi Ancak Kanal Koruma Sistemi Sayesinde Sunucuya Geri Yüklendi ve Kanalı Silen Kişinin Yetkileri Alındı!\n \n__▪ Kanalı Silen Kişinin ID'si:__ \`${entry.executor.id}\`\n__▪ Kişinin Tagı:__ \`${entry.executor.tag}\`**`
      );
      channel.guild.owner.send(dcs)
    });
});
     
client.on("roleDelete", async role => {
    let rol = role.guild.roles.get("CEZALI ROL ID YAZIN")
    let log = role.guild.channels.get("LOG KANAL ID YAZIN")
    if (!rol) return;
    if (!log) return;
    const entry = await role.guild
      .fetchAuditLogs({ type: "ROLE_DELETE" })
      .then(audit => audit.entries.first());
    if (entry.executor.id == role.guild.owner.id) return;
    role.guild.createRole({
      name: role.name,
      color: role.color,
      permissions: role.permissions
    });//Dcs Ekibi
    role.guild.roles.forEach(c =>
      role.guild
        .member(entry.executor)
        .removeRole(c)
        .then(f => role.guild.member(entry.executor).addRole(rol))
    );
    const embed = new Discord.RichEmbed()
      .setTitle(`UYARI`)
      .setFooter(role.guild.name)
      .setThumbnail(role.guild.iconURL)
      .setColor("RED")
      .setTimestamp()
      .setDescription(
        `**Bir Rol Silindi ve Sunucuya Geri Yüklendi! Rolü Silen Kişinin Tüm Yetkileri Alındı!\n \n__▪ Silinen Rol:__ \`${role.name}\`\n__▪ Rolü Silen Kişi:__ ${entry.executor}\n__▪ Kullanıcının ID"si:__ \`${entry.executor.id}\`**`
      );
    log.send(embed);
    const dcs = new Discord.RichEmbed()
      .setTitle(`UYARI`)
      .setFooter(role.guild.name)
      .setThumbnail(role.guild.iconURL)
      .setColor("RED")
      .setTimestamp()
      .setDescription(
        `**Bir Rol Silindi ve Sunucuya Geri Yüklendi! Rolü Silen Kişinin Tüm Yetkileri Alındı!\n \n__▪ Silinen Rol:__ \`${role.name}\`\n__▪ Rolü Silen Kişi:__ ${entry.executor.tag}\n__▪ Kullanıcının ID"si:__ \`${entry.executor.id}\`**`
      );
      role.guild.owner.send(dcs)
  
});
   
const invites = {};
const wait = require('util').promisify(setTimeout);
client.on('ready', async () => {
  wait(1000);
  client.guilds.forEach(g => {
    g.fetchInvites()
    .catch(error => { 
        return
    })
    .then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  }); //dcs ekibi
});
client.on('guildMemberAdd', async member => {
  let davetChannel = await db.fetch(`davetChannel_${member.guild.id}`)
  const giriss = client.emojis.get('632384838749388800')
  member.guild.fetchInvites().then(guildInvites => {
    const ei = invites[member.guild.id];
    invites[member.guild.id] = guildInvites;
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    const inviter = client.users.get(invite.inviter.id);
    //:inbox_tray:
    if (!member.guild.channels.get(davetChannel)) return console.log(`memberLogChannel`)
    else member.guild.channels.get(davetChannel).send(`\`@${member.user.tag}\` adlı kullanıcı sunucuya katıldı! <@${inviter.id}> tarafından sunucuya davet edildi! [**${invite.uses}** davete sahip!]`)
  });
}); 
client.on('ready', async () => {
  wait(1000);
  client.guilds.forEach(g => {
    g.fetchInvites()
    .catch(error => { 
        return
    })
    .then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});

function a() {
    return new Promise(resolve => {
        setTimeout(() => { //Dcs Ekibi
            client.guilds.get('719201367834755072').setName('▪ Heaven ♡ | ▪ #0.1K');
        }, 3000);
      });
}

  function b() {
    return new Promise(resolve => {
        setTimeout(() => {
            client.guilds.get('719201367834755072').setName('▪ Heaven ♡ | #BAKIMDA');
            c(); //Dcs Ekibi
        }, 3000);
      });
  }
  function c() {
    return new Promise(resolve => {
        setTimeout(() => {
            client.guilds.get('719201367834755072').setName('▪ Heaven ♡ ');
            a();
        }, 3000);
      }); //Dcs Ekibi
  }
 
 client.on('ready', async message => {
   a();
 })
//Değişen Sunucu İsmi
//Maine Atınız!

client.on("message", async message => {
const dcsk = client.channels.get("719203001687867436")
let dcst = "ᨖ"

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
    .filter(member => member.user.username.includes(dcst))
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

dcsk.setTopic(`> **Topam Üye: __${üyesayısı}__**\n> **Toplam Online: __${onlayn}__**\n> **Sesteki Üye: __${sessayı}__**\n> **Taglı Üye: __${tags}__**`)

})


//Main Dosyasına Atın!
client.on('message', message => {
//Dcs Ekibi
const prefix = ayarlar.prefix

if (message.content === `<@719214665602695199>`) {
message.channel.send(`Prefixim: ` + prefix) //Dcs Ekibi
}});

client.on("guildMemberAdd", async member => {
let cfxt = await db.fetch(`cfxget${member.guild.id}`)
let cfxkanal = member.guild.channels.find('id', cfxt)

const ca = member.user.displayAvatarURL
var { createCanvas, loadImage } = require('canvas')
var canvas = createCanvas(900, 450)
var cfx = canvas.getContext('2d');
loadImage(cassieload.cg).then(cg => {
loadImage(ca).then(caa => {
cfx.drawImage(cg, 0, 0, 900, 450);
cfx.drawImage(caa, 600,170, 264, 262  );
cfx.beginPath()
cfx.beginPath()
cfx.fillStyle = `#32CD32`;
cfx.font = '36px sans-serif';
cfx.textAlign = "left";
cfx.fillText(`${member.user.tag}`, 540, 140)
  
cfxkanal.send(new Discord.Attachment(canvas.toBuffer(), "codefenixgiris.png"))
})}) 
})

client.on("guildMemberRemove", async member => {
  
let cfxt = await db.fetch(`cfxget${member.guild.id}`)

let cfxkanal = member.guild.channels.find('id', cfxt)

const ca = member.user.displayAvatarURL
var { createCanvas, loadImage } = require('canvas')
var canvas = createCanvas(900, 450)
var cfx = canvas.getContext('2d');
loadImage(cassieload.cc).then(cc => {
loadImage(ca).then(caa => {
cfx.drawImage(cc, 0, 0, 900, 450);
cfx.drawImage(caa, 600,170, 264, 262  );
cfx.beginPath()
cfx.fillStyle = `#32CD32`;
cfx.font = '36px sans-serif';
cfx.textAlign = "left";
cfx.fillText(`${member.user.tag}`, 540, 140)
  
cfxkanal.send(new Discord.Attachment(canvas.toBuffer(), "codefenixcikis.png"))
})}) 
})

var cassieload = {
  "cc": "https://cdn.discordapp.com/attachments/703327606883483789/703335467684200478/download.jpg",
  "cg": "https://cdn.discordapp.com/attachments/703327606883483789/703335467684200478/download.jpg",
}

client.login(ayarlar.token);
