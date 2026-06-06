<p align="center">
<img src="https://docs.rsshub.app/img/logo.png" alt="RSSHub" width="100">
</p>
<h1 align="center">RSSHub</h1>

> 🧡 Everything is RSSible

[![](https://img.shields.io/badge/dynamic/json?url=https://rsshub-analytics.diygod.workers.dev/&query=requests&color=F38020&label=requests&logo=cloudflare&style=flat-square&suffix=/month)](https://rsshub.app)
[![docker publish](https://img.shields.io/docker/pulls/diygod/rsshub?label=docker%20pulls&logo=docker&style=flat-square)](https://hub.docker.com/r/diygod/rsshub)
[![npm publish](https://img.shields.io/npm/dt/rsshub?label=npm%20downloads&logo=npm&style=flat-square)](https://www.npmjs.com/package/rsshub)
[![test](https://img.shields.io/github/actions/workflow/status/DIYgod/RSSHub/test.yml?branch=master&label=test&logo=github&style=flat-square)](https://github.com/DIYgod/RSSHub/actions/workflows/test.yml?query=event%3Apush+branch%3Amaster)
[![Test coverage](https://img.shields.io/codecov/c/github/DIYgod/RSSHub.svg?style=flat-square&logo=codecov)](https://app.codecov.io/gh/DIYgod/RSSHub/branch/master)
[![Visitors](https://hitscounter.dev/api/hit?url=https%3A%2F%2Fgithub.com%2FDIYgod%2FRSSHub&label=RSS+lovers&icon=rss-fill&color=%23ff752e)](https://github.com/DIYgod/RSSHub)

[![Telegram group](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.swo.moe%2Fstats%2Ftelegram%2Frsshub&query=count&color=2CA5E0&label=Telegram%20Group&logo=telegram&cacheSeconds=3600&style=flat-square)](https://t.me/rsshub) [![Telegram channel](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.swo.moe%2Fstats%2Ftelegram%2FawesomeRSSHub&query=count&color=2CA5E0&label=Telegram%20Channel&logo=telegram&cacheSeconds=3600&style=flat-square)](https://t.me/awesomeRSSHub) [![X (Twitter)](https://img.shields.io/badge/any_text-Follow-blue?color=2CA5E0&label=Twitter&logo=X&cacheSeconds=3600&style=flat-square)](https://x.com/intent/follow?screen_name=_RSSHub)

[![](https://github.com/user-attachments/assets/68c66528-8c79-4a8a-8e43-ade7d936ab80)](https://folo.is/)

## Introduction

RSSHub is the world's largest RSS network, consisting of over 5,000 global instances.

RSSHub delivers millions of contents aggregated from all kinds of sources, our vibrant open source community is ensuring the deliver of RSSHub's new routes, new features and bug fixes.

RSSHub pairs especially well with [Folo](https://folo.is/), an AI RSS reader for feed discovery and modern reading workflows. The project is also open source on [GitHub](https://github.com/RSSNext/Folo).

[Documentation](https://docs.rsshub.app) | [Folo](https://folo.is/) | [Telegram Group](https://t.me/rsshub) | [Telegram Channel](https://t.me/awesomeRSSHub) | [X (Twitter)](https://x.com/intent/follow?screen_name=_RSSHub)

## New Route: 深圳市坪山区人民政府 - 保障性住房

为深圳市坪山区人民政府网站的「保障性住房」内容提供 RSS 订阅，覆盖 6 个栏目。

**路由：** `/gov/shenzhen/szpsq/zfbzfw/:category`

**示例：** `/gov/shenzhen/szpsq/zfbzfw/tzgg`

**参数：** `category`，保障性住房栏目，取值如下表。

| 栏目     | category | 栏目页面                                               |
| -------- | -------- | ------------------------------------------------------ |
| 通知公告 | `tzgg`   | `https://www.szpsq.gov.cn/ztfw/zfbzfw/tzgg/index.html` |
| 政策法规 | `zcfg`   | `https://www.szpsq.gov.cn/ztfw/zfbzfw/zcfg/index.html` |
| 项目信息 | `xmxx`   | `https://www.szpsq.gov.cn/ztfw/zfbzfw/xmxx/index.html` |
| 分配通告 | `fptg`   | `https://www.szpsq.gov.cn/ztfw/zfbzfw/fptg/index.html` |
| 分配过程 | `fpgc`   | `https://www.szpsq.gov.cn/ztfw/zfbzfw/fpgc/index.html` |
| 分配结果 | `fpjg`   | `https://www.szpsq.gov.cn/ztfw/zfbzfw/fpjg/index.html` |

**订阅地址示例**（以本地部署 `http://localhost:1200` 为例，可替换为任意 RSSHub 实例）：

| 栏目     | 订阅地址                                               |
| -------- | ------------------------------------------------------ |
| 通知公告 | `http://localhost:1200/gov/shenzhen/szpsq/zfbzfw/tzgg` |
| 政策法规 | `http://localhost:1200/gov/shenzhen/szpsq/zfbzfw/zcfg` |
| 项目信息 | `http://localhost:1200/gov/shenzhen/szpsq/zfbzfw/xmxx` |
| 分配通告 | `http://localhost:1200/gov/shenzhen/szpsq/zfbzfw/fptg` |
| 分配过程 | `http://localhost:1200/gov/shenzhen/szpsq/zfbzfw/fpgc` |
| 分配结果 | `http://localhost:1200/gov/shenzhen/szpsq/zfbzfw/fpjg` |

**说明：**

- 每个栏目独立订阅，输出该栏目列表页的文章，包含标题、链接、发布日期与正文。
- 「政策法规」栏目部分文章链接指向 `zjj.sz.gov.cn` 等其他政府域名，若详情页因 TLS 兼容问题无法抓取，将自动降级为列表级条目（保留标题、链接、日期），不会影响整个订阅源的可用性。

## Related Projects

- [Folo](https://folo.is/) | An AI RSS reader that works especially well with RSSHub. Source code: [GitHub](https://github.com/RSSNext/Folo).
- [RSSHub Radar](https://github.com/DIYgod/RSSHub-Radar) | A browser extension that can help you quickly discover and subscribe to the RSS and RSSHub of current websites.
- [RSSBud](https://github.com/Cay-Zhang/RSSBud) | RSSHub Radar for iOS platform, designed specifically for mobile ecosystem optimization.
- [RSSAid](https://github.com/LeetaoGoooo/RSSAid) | RSSHub Radar for Android platform built with Flutter.
- [DocSearch](https://github.com/Fatpandac/DocSearch) | Link RSSHub DocSearch into Raycast.
- [Awesome RSSHub Routes](https://github.com/JackyST0/awesome-rsshub-routes) | Curated list of RSS feeds and RSSHub routes.

## Contribute

We welcome all pull requests. Suggestions and feedback are also welcomed [here](https://github.com/DIYgod/RSSHub/issues).

Refer to [Quick Start](https://docs.rsshub.app/joinus/)

## Deployment

Refer to [Deployment](https://docs.rsshub.app/deploy/)

## Special Thanks

<div align="center">

[![](https://opencollective.com/RSSHub/contributors.svg?width=890)](https://github.com/DIYgod/RSSHub/graphs/contributors)

Logo designer [sheldonrrr](https://dribbble.com/sheldonrrr)

[![](https://raw.githubusercontent.com/DIYgod/sponsors/main/sponsors.simple.svg)](https://github.com/DIYgod/sponsors)

<a href="https://www.cloudflare.com" target="_blank"><img height="50px" src="https://i.imgur.com/7Ph27Fq.png"></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://www.netlify.com" target="_blank"><img height="40px" src="https://i.imgur.com/cU01915.png"></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://1password.com" target="_blank"><img height="40px" src="https://i.imgur.com/a2XjflO.png"></a>

</div>

## Author

**RSSHub** © [DIYgod](https://github.com/DIYgod), Released under the [AGPL-3.0](./LICENSE) License.<br>
Authored and maintained by DIYgod with help from contributors ([list](https://github.com/DIYgod/RSSHub/contributors)).

> Blog [@DIYgod](https://diygod.cc) · GitHub [@DIYgod](https://github.com/DIYgod) · X (Twitter) [@DIYgod](https://x.com/DIYgod) · Telegram Channel [@awesomeDIYgod](https://t.me/awesomeDIYgod)
