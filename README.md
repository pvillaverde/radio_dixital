# Rede Automatizada de Difusión Integral do Obradoiro Dixital

[![GitHub license][license-shield]][license-url]

Esta aplicación encárgase de obter a información das canles rexistradas na [Asociación Cultural Obradoiro Dixital Galego](https://obradoirodixitalgalego.gal) e difundir o novo contido que xeran estes proxectos en galego pola rede, a través das canles da asociación (Twitter, Mastodon e Discord).

# 🗂️ Índice

- [Rede Automatizada de Difusión Integral do Obradoiro Dixital](#rede-automatizada-de-difusión-integral-do-obradoiro-dixital)
- [🗂️ Índice](#️-índice)
  - [📝 Folla de ruta](#-folla-de-ruta)
  - [🧩 Requerimentos](#-requerimentos)
  - [🧑‍🍳 Configuración](#-configuración)
  - [🏗️ Instalación](#️-instalación)
  - [🧙 Cómo se usa?](#-cómo-se-usa)
  - [🎯 Créditos](#-créditos)
  - [⚖️ Licenza](#️-licenza)
- [🔗 Ligazóns de referencia e bibliografía 📚](#-ligazóns-de-referencia-e-bibliografía-)

<!-- Created by https://github.com/ekalinin/github-markdown-toc -->

## 📝 Folla de ruta

- [x] Feito en DENO.
- [x] Acoplamento feble. Cada compoñente executarase pola súa conta e pasaralle os mensaxes a outro mediante unha cola MQTT.
- [x] Xerar unha táboa co histórico de capítulos dos podcasts e dos vídeos de Youtube. Permitiría ver unha evolución do contido da canle, xerando as nosas propias estatísticas, así como facer resumos mensuais por exemplo.
- [x] RefreshBlogs
- [x] RefreshPodcast
- [x] RefreshYoutube
- [x] RefreshYoutubeStats
- [ ] RefreshTwitch
- [ ] RefreshTwitchClips
- [ ] RefreshTwitchStreams
- [x] PublishTwitter
- [x] PublishMastodon
- [x] PublishDiscord

## 🧩 Requerimentos

- Unha base de datos MySQL para almacenar toda a información dos proxectos e as súas entradas.
- Un broker MQTT, por exemplo [Mosquitto](https://github.com/eclipse/mosquitto/).

## 🏗️ Instalación

Podes atopar un Helm para desplegalo en Kubernetes no [repositorio de Helm Charts](https://github.com/pvillaverde/helm-charts/tree/main/charts/radio-dixital).

## 🧑‍🍳 Configuración

Na carpeta [config_example](./src/config_example/) están todas as configuracións que hai que especificar para que funcione correctamente. Entre elas están as distintas credenciais das redes sociais, da base de datos, do broker MQTT ou das APIs de Google ou Twitch.

## 🧙 Cómo se usa?

## 🎯 Créditos

- [Asociación Cultural Obradoiro Dixital Galego](https://obradoirodixitalgalego.gal)
- [Óscar Otero](https://github.com/olcortesb) - Polo seu apoio e contribución para esnaquizar o antigo bot de cara a facelo Serverless.

🙏 Grazas!

## ⚖️ Licenza

[![GitHub license][license-shield]][license-url] - Distributed under the GNU GPL-v3 License. See [LICENSE][license-url] on for more information.

# 🔗 Ligazóns de referencia e bibliografía 📚

- [NPM: mysql2](https://www.npmjs.com/package/mysql2)
- [NPM: MQTT](https://github.com/mqttjs/MQTT.js?tab=readme-ov-file#typescript)
- [NPM: Twitter API v2](https://www.npmjs.com/package/twitter-api-v2)
- [NPM: Masto](https://www.npmjs.com/package/masto)
- [NPM: Simple Discord WebHook](https://www.npmjs.com/package/simple-discord-webhooks)
- [Using MySQL in Node.js with TypeScript](https://medium.com/deno-the-complete-reference/deno-nuggets-in-memory-db-session-storage-ed5441a8812d)
- [Node.js Typescript with MySQL example](https://www.bezkoder.com/node-js-typescript-mysql/)
- [Instalación de Mosquitto (MQTT Broker) en Docker](https://www.manelrodero.com/blog/instalacion-de-mosquitto-mqtt-broker-en-docker)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[license-shield]: https://img.shields.io/badge/license-GNU%20GPL--v3-brightgreen
[license-url]: https://github.com/pvillaverde/radio_dixital/blob/main/LICENSE
[project-url]: https://github.com/pvillaverde/radio_dixital
[issues-url]: https://github.com/pvillaverde/radio_dixital/issues
