export default {
   youtube: {
      enable: true,
      messageTemplate:
         '🤖🎬 {channelName}{mentionUser} acaba de publicar o vídeo "{title}". Dálle unha ollada en\n{url} #GalegoTube #Youtubeiras #ObradoiroDixital',
      webhook: new URL(
         "DISCORD_WEBHOOK_URL",
      ),
   },
   podcast: {
      enable: true,
      messageTemplate:
         '🤖🔊 {channelName}{mentionUser} acaba de publicar un novo falangullo : "{title}". Podes escoitalo en\n{url} #PodGalego #ObradoiroDixital',
      webhook: new URL(
         "DISCORD_WEBHOOK_URL",
      ),
   },
   blog: {
      enable: true,
      messageTemplate:
         '🤖🌽 {channelName}{mentionUser} acaba de publicar unha nova entrada no #Blogomillo : "{title}". Podes leela en\n{url} #ObradoiroDixital',
      webhook: new URL(
         "DISCORD_WEBHOOK_URL",
      ),
   },
   twitch: {
      enable: true,
      messageTemplate:
         '🤖📺 {channelName}{mentionUser} está agora en directo emitindo "{title}". Dálle unha ollada en\n{url} #GalegoTwitch #TwitchEnGalego #ObradoiroDixital',
      webhook: new URL(
         "DISCORD_WEBHOOK_URL",
      ),
   },
};
