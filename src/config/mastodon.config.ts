export default {
   youtube: {
      enable: true,
      messageTemplate:
         '🤖🎬 {channelName}{mentionUser} acaba de publicar o vídeo "{title}". Dálle unha ollada en\n{url} #GalegoTube #Youtubeiras #ObradoiroDixital',
      accessToken: "MASTODON_BOT_ACCESS_TOKEN",
      url: "MASTODON_INSTANCE_API_ENDPOINT",
   },
   podcast: {
      enable: true,
      messageTemplate:
         '🤖🔊 {channelName}{mentionUser} acaba de publicar un novo falangullo : "{title}". Podes escoitalo en\n{url} #PodGalego #ObradoiroDixital',
      accessToken: "MASTODON_BOT_ACCESS_TOKEN",
      url: "MASTODON_INSTANCE_API_ENDPOINT",
   },
   blog: {
      enable: true,
      messageTemplate:
         '🤖🌽 {channelName}{mentionUser} acaba de publicar unha nova entrada no #Blogomillo : "{title}". Podes leela en\n{url} #ObradoiroDixital',
      accessToken: "MASTODON_BOT_ACCESS_TOKEN",
      url: "MASTODON_INSTANCE_API_ENDPOINT",
   },
   twitch: {
      enable: true,
      messageTemplate:
         '🤖📺 {channelName}{mentionUser} está agora en directo emitindo "{title}". Dálle unha ollada en\n{url} #GalegoTwitch #TwitchEnGalego #ObradoiroDixital',
      accessToken: "MASTODON_BOT_ACCESS_TOKEN",
      url: "MASTODON_INSTANCE_API_ENDPOINT",
   },
};
