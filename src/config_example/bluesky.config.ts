export default {
   youtube: {
      enable: true,
      messageTemplate:
         '🤖🎬 {channelName}{mentionUser} acaba de publicar o vídeo "{title}". Dálle unha ollada en\n{url} #GalegoTube #Youtubeiras #ObradoiroDixital',
      identifier: "BLUESKY_IDENTIFIER",
      password: "BLUESKY_PASSWORD",
   },
   podcast: {
      enable: false,
      messageTemplate:
         '🤖🔊 {channelName}{mentionUser} acaba de publicar un novo falangullo : "{title}". Podes escoitalo en\n{url} #PodGalego #ObradoiroDixital',
      identifier: "BLUESKY_IDENTIFIER",
      password: "BLUESKY_PASSWORD",
   },
   blog: {
      enable: true,
      messageTemplate:
         '🤖🌽 {channelName}{mentionUser} acaba de publicar unha nova entrada no #Blogomillo : "{title}". Podes leela en\n{url} #ObradoiroDixital',
      identifier: "BLUESKY_IDENTIFIER",
      password: "BLUESKY_PASSWORD",
   },
   twitch: {
      enable: true,
      messageTemplate:
         '🤖📺 {channelName}{mentionUser} está agora en directo emitindo "{title}". Dálle unha ollada en\n{url} #GalegoTwitch #TwitchEnGalego #ObradoiroDixital',
      identifier: "BLUESKY_IDENTIFIER",
      password: "BLUESKY_PASSWORD",
   },
};
