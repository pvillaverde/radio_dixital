export default {
   youtube: {
      enable: true,
      messageTemplate:
         '🤖🎬 {channelName}{mentionUser} acaba de publicar o vídeo "{title}". Dálle unha ollada en\n{url} #GalegoTube #Youtubeiras #ObradoiroDixital',
      appKey: "TWITTER_APP_KEY",
      appSecret: "TWITTER_APP_SECRET",
      accessToken: "TWITTER_ACCESS_TOKEN",
      accessSecret: "TWITTER_ACCESS_SECRET",
   },
   podcast: {
      enable: false,
      messageTemplate:
         '🤖🔊 {channelName}{mentionUser} acaba de publicar un novo falangullo : "{title}". Podes escoitalo en\n{url} #PodGalego #ObradoiroDixital',
      appKey: "TWITTER_APP_KEY",
      appSecret: "TWITTER_APP_SECRET",
      accessToken: "TWITTER_ACCESS_TOKEN",
      accessSecret: "TWITTER_ACCESS_SECRET",
   },
   blog: {
      enable: true,
      messageTemplate:
         '🤖🌽 {channelName}{mentionUser} acaba de publicar unha nova entrada no #Blogomillo : "{title}". Podes leela en\n{url} #ObradoiroDixital',
      appKey: "TWITTER_APP_KEY",
      appSecret: "TWITTER_APP_SECRET",
      accessToken: "TWITTER_ACCESS_TOKEN",
      accessSecret: "TWITTER_ACCESS_SECRET",
   },
   twitch: {
      enable: true,
      messageTemplate:
         '🤖📺 {channelName}{mentionUser} está agora en directo emitindo "{title}". Dálle unha ollada en\n{url} #GalegoTwitch #TwitchEnGalego #ObradoiroDixital',
      appKey: "TWITTER_APP_KEY",
      appSecret: "TWITTER_APP_SECRET",
      accessToken: "TWITTER_ACCESS_TOKEN",
      accessSecret: "TWITTER_ACCESS_SECRET",
   },
};
