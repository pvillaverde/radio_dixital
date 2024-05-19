# RADIOD

[![Docker Image Version](https://img.shields.io/docker/v/pvillaverde/radio_dixital)](https://hub.docker.com/repository/docker/pvillaverde/radio_dixital/tags)
[![Docker Pulls](https://img.shields.io/docker/pulls/pvillaverde/radio_dixital)](https://hub.docker.com/repository/docker/pvillaverde/radio_dixital)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/pvillaverde/radio_dixital/docker-image.yml)](https://github.com/pvillaverde/radio_dixital/actions/workflows/docker-image.yml)
[![Artifact Hub Repo](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/pvillaverde-radio_dixital)](https://artifacthub.io/packages/helm/pvillaverde/radio-dixital)

![Live Notification example on Discord](https://pbs.twimg.com/media/ErJW_5RXEAUfApb?format=png&name=900x900)

RADIOD scrapes content from RSS feeds from Blogs, Podcasts, Youtube Videos and also from Youtube & Twitch APIs from the Galician Content Creators registered in the [Asociación Cultural Obradoiro Dixital Galego](https://obradoirodixitalgalego.gal). This content is then used to promote it through the organization social networks (Twitter, Mastodon & Discord) and also store it in a database to later consume it from internal dashboards.

> [!NOTE]
> 💡 The name "RADIOD" is a retroacronym in galician of "Rede Automatizada de Difusión en Internet do Obradoiro Dixital", which would be translated as "Obradoiro Digital Internet Promotion Automated Network".

## 🗂️ Table of Contents

<!-- Created by https://github.com/ekalinin/github-markdown-toc -->

## 🌈 Features

- 🌐 Custom promotion messages for each social network and each content creator type (blogs, youtube, podcast, twitch).
- 🤏 Loosely tied. Each task can be executed separatedly for easy debugging and disabling of unwanted functions.
- 🦟 Use of MQTT Queues to communicate between each task as needed.
- 🚀 Easy to setup with Docker, Kubernetes Helm Chart, or on bare metal.
- 🆓 100% free and open-source
- 🗞️ `refreshBlogs`, `refreshPodcasts`, `refreshYoutube`: These tasks store the Blogs, Podcasts and Youtube channels in the database, as well as its latests entries. Then send the newest entries to an MQTT Queue.
- 📊 `refreshYoutubeStats`: Gathers stats like the channel views and subscribers from the Youtube API and stores them in the database for future analysis.
- 📺 `refreshTwitch`, `refreshTwitchClips`, `refreshTwitchGames`: These tasks store information related to Twitch Channels, its "games" and clips, and help towards having all the required information in the `refreshStreams`.
- 🚦 `refreshStreams`: Intended to be used every minute, it checks the active streams of the monitored channels and handles new and offline streams. It sends all the information required to make content rich notifications.
- 🌎 `publishTwitter`, `publishMastodon`, `publishDiscord`: Subscribe the MQTT topic and publish status update on each social network for each new entry. Twitch Streams are also updated in Discord with a thumbnail of the stream while Live.

### 🐛 Known Bugs

- [] When the MySQL database is restarted, `mysql2` library is getting ACCESS DENIED errors. The workarround its to login manually through the CLI and after that it can login without issues. Might be realated to `caching_sha2_password` auth plugin.
- [] Sometimes posts get promoted more than one time, something is duplicating messages in the MQTT Subscriber. QoS is zero for both publish and subscribe. Can't reproduce it so far, might be related to K8s networking.

### 🛣️ Roadmap

- [] Promote new Twitch Clips or Clips with more than a threshold number of views in the social networks.
- [] Use KNative/OpenFunction to only launch publishers when there are messages, instead of having them pernanently listening the MQTT topics.

**[⬆️ Back to Top](#radiod)**

## 🚀 Getting Started

### 🧩 Requirements

In order to run RADIOD you will need to have a running MySQL Database to store the information (You can [check the schema needed here](./data/schema.sql)) and a MQTT Broker, i.e. [Mosquitto](https://github.com/eclipse/mosquitto/).

You will also need some credentials for the different APIs used by RADIOD:

#### Twitch Application

In order to check Twitch API for channels, streams, clips, etc. you need to register an app in the [Twitch Developer Console](https://dev.twitch.tv/console/apps). From here you will extract the values needed for the [./src/config/twitch.config.ts](./src/config_example/twitch.config.ts)

```ts
export default {
   client_id: "TWITCH_CLIENT_ID",
   client_secret: "TWITCH_CLIENT_SECRET",
};
```

#### Youtube (Google) API key

In order to get Youtube stats (Views, subscriptions) you need an API KEY with access to the Youtube API. [Follow the official documentation](https://developers.google.com/youtube/registering_an_application) to obtain it and then configure it on [./src/config/google.config.ts](./src/config_example/google.config.ts):

```ts
export default {
   appKey: "GOOGLE_APP_KEY",
};
```

#### Twitter API Credentials

Access the [Twitter Developer Portal](https://developer.twitter.com/en/portal/projects/) and create a new project with the account you want to publish on. You will need to enable auth and write permissions. Follow the [documentation of the twitter-api-v2 library](https://www.npmjs.com/package/twitter-api-v2) for more detailed instructions. Once done, configure the file [./src/config/twitter.config.ts](./src/config_example/twitter.config.ts) following the example. You can also customize the message template there.

```
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
   podcast: [...],
   blog: [...],
   twitch: [...],
};
```

#### Mastodon API Credentials

Follow the documentation on the [masto library](https://www.npmjs.com/package/masto) for information on how to setup your API credentials. Then, configure [./src/config/mastodon.config.ts](./src/config_example/mastodon.config.ts) following the example. You can also customize the message template there.

#### Discord Webhook

Follow the [official discord documentation](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) on how to create a webhook. Then configure [./src/config/discord.config.ts](./src/config_example/discord.config.ts) following the example. You can also customize the message template there.

### ☸️ Running it on Kubernetes

The application is designed to be run in Kubernetes, and you can find a [helm chart in here](https://github.com/pvillaverde/helm-charts/tree/main/charts/radio-dixital).
By default the helm chart runs all the tasks in a predefined cron schedules and has the publishers (discord, twitter & mastodon) permanently listening for the mqtt topic. The only thing you need is to configure a secret with all the files in the [config folder](./src/config_example/). The Helm chart will mount the secret as a folder with all the files in the required path for the application to run.

### 🐳 Running in Docker

The helm chart uses the docker images built as part of the Github Actions of this repo and published in [Docker Hub](https://hub.docker.com/repository/docker/pvillaverde/radio_dixital/tags). You can run each of the action passing the argument of the task specified in the [deno.json](./deno.json) and passing the folder with the configuration. i.e:

```bash
docker run -v ./src/config:/opt/radio_dixital/src/config --entrypoint deno pvillaverde/radio_dixital task publishDiscord
```

### 🧱 Running locally

You will need to have Deno installed in your machine, then you can run `deno task` to check all the available tasks and for example `deno task refreshBlogs` to get all the blogs information.

**[⬆️ Back to Top](#radiod)**

<!-- CONTRIBUTING -->

## 🙋Support & Contributing

If you want to add any missing feature or report a bug, you [can request ir or report it here][issues-url]. Also if you are want and know how to do it, go ahead! That's what make the open source community shines, by allowing us to grow and learn from each other creating amazing tools! Any contribution you make is **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🏆 Credits & Acknowledgements 🙏

- [Asociación Cultural Obradoiro Dixital Galego](https://obradoirodixitalgalego.gal)
- [Óscar Otero](https://github.com/olcortesb) - For its support to evolve the old code into loosely tied tasks in its path to Serverless.

## ⚖️ License

[![GitHub license][license-shield]][license-url] - Distributed under the GNU GPL-v3 License. See [LICENSE][license-url] on for more information.

# 🔗 Reference links and bibliography 📚

- [NPM: mysql2](https://www.npmjs.com/package/mysql2)
- [NPM: MQTT](https://github.com/mqttjs/MQTT.js?tab=readme-ov-file#typescript)
- [NPM: Twitter API v2](https://www.npmjs.com/package/twitter-api-v2)
- [NPM: Masto](https://www.npmjs.com/package/masto)
- [NPM: Simple Discord WebHook](https://www.npmjs.com/package/simple-discord-webhooks)
- [Deno nuggets: In-memory DB (session storage)](https://medium.com/deno-the-complete-reference/deno-nuggets-in-memory-db-session-storage-ed5441a8812d)
- [Node.js Typescript with MySQL example](https://www.bezkoder.com/node-js-typescript-mysql/)
- [Instalación de Mosquitto (MQTT Broker) en Docker](https://www.manelrodero.com/blog/instalacion-de-mosquitto-mqtt-broker-en-docker)

**[⬆️ Back to Top](#rede-automatizada-de-difusión-integral-do-obradoiro-dixital)**

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[license-shield]: https://img.shields.io/badge/license-GNU%20GPL--v3-brightgreen
[license-url]: https://github.com/pvillaverde/radio_dixital/blob/main/LICENSE
[project-url]: https://github.com/pvillaverde/radio_dixital
[issues-url]: https://github.com/pvillaverde/radio_dixital/issues
