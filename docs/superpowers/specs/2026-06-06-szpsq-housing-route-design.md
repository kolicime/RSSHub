# 坪山区人民政府保障性住房 RSSHub 路由设计

## 背景

为深圳市坪山区人民政府网站的“保障性住房”内容新增 RSSHub 订阅能力。目标总页面为 `https://www.szpsq.gov.cn/zwgk/zdlyxxgk/bzxzf/index.html`，其中 6 个保障性住房子栏目需要分别可订阅：通知公告、政策法规、项目信息、分配通告、分配过程、分配结果。

## 目标

新增一个参数化 RSSHub 路由，通过路径参数选择 6 个栏目之一：

`/gov/shenzhen/szpsq/zfbzfw/:category`

支持的 `category` 值：

| 栏目 | category | 源页面 |
| --- | --- | --- |
| 通知公告 | `tzgg` | `https://www.szpsq.gov.cn/ztfw/zfbzfw/tzgg/index.html` |
| 政策法规 | `zcfg` | `https://www.szpsq.gov.cn/ztfw/zfbzfw/zcfg/index.html` |
| 项目信息 | `xmxx` | `https://www.szpsq.gov.cn/ztfw/zfbzfw/xmxx/index.html` |
| 分配通告 | `fptg` | `https://www.szpsq.gov.cn/ztfw/zfbzfw/fptg/index.html` |
| 分配过程 | `fpgc` | `https://www.szpsq.gov.cn/ztfw/zfbzfw/fpgc/index.html` |
| 分配结果 | `fpjg` | `https://www.szpsq.gov.cn/ztfw/zfbzfw/fpjg/index.html` |

## 非目标

- 不聚合 6 个栏目为一个总 feed。
- 不提供自定义分页、筛选、数量限制参数；用户可使用 RSSHub 通用参数。
- 不使用 Puppeteer，除非实现验证时发现页面必须依赖客户端渲染。
- 不把正文中已有的标题、日期、来源重复拼入 `description`。

## 文件结构

新增：

- `lib/routes/gov/shenzhen/szpsq/namespace.ts`
- `lib/routes/gov/shenzhen/szpsq/index.ts`

不新增独立 README 或 radar 文件；根据项目 `AGENTS.md` 的要求，描述放入 `Route['description']`，radar 放入 `Route['radar']`。

## Namespace 设计

`namespace.ts` 定义：

- `name`: `深圳市坪山区人民政府`
- `url`: `www.szpsq.gov.cn`
- `categories`: `['government']`
- `lang`: `zh-CN`

## Route 元信息

`index.ts` 定义 route：

- `path`: `/shenzhen/szpsq/zfbzfw/:category`
- `example`: `/gov/shenzhen/szpsq/zfbzfw/tzgg`
- `parameters`: `{ category: '保障性住房栏目' }`
- `categories`: `['government']`
- `name`: `保障性住房`
- `features.requirePuppeteer`: `false`
- `features.requireConfig`: `false`
- 其他 feature flags 维持 RSSHub 常见默认布尔值。

`description` 使用表格列出 6 个栏目代码，避免用户需要阅读源码才能知道可用值。

## 数据获取与解析

实现使用配置表维护 6 个栏目的标题和 URL。handler 从 `ctx.req.param('category')` 获取栏目代码，并在配置表中查找。

- 若栏目代码不存在，抛出 `InvalidParameterError`，错误信息指向对应 RSSHub government docs anchor。
- 若栏目代码存在，使用 RSSHub 项目现有 HTTP 工具请求栏目页面 HTML。
- 使用 `cheerio` 解析列表页中的文章条目。
- 从列表条目中提取：
  - `title`: 文章标题。
  - `link`: 文章详情页绝对链接。相对链接通过 `new URL(href, currentUrl).href` 归一化。
  - `pubDate`: 页面提供日期时使用 `parseDate` 解析，并按中国时区处理；页面没有日期时省略，不使用当前时间兜底。

如果实现验证确认详情页正文结构稳定，则对每个详情页使用 `cache.tryGet(item.link, async () => ...)` 获取正文，填充 `description`。若详情页结构不稳定或列表页已提供足够摘要，则不强行填充正文，避免输出错误内容。

## RSS 输出

返回 feed：

- `title`: `深圳市坪山区人民政府 - 保障性住房 - <栏目名>`
- `link`: 当前栏目页面 URL。
- `item`: 当前栏目第一页列表条目。

每个 item 至少包含 `title` 和唯一 `link`；如果源站提供日期，则包含 `pubDate`；如果详情页正文成功解析，则包含 `description`。

## Radar 设计

在 route 的 `radar` 中维护当前源站映射，source 使用无协议格式：

- `www.szpsq.gov.cn/ztfw/zfbzfw/:category/index.html`
- `www.szpsq.gov.cn/ztfw/zfbzfw/:category/`

目标：

- `/gov/shenzhen/szpsq/zfbzfw/:category`

如果 RSSHub Radar 对这类固定栏目更适合显式映射，则实现时可为 6 个栏目分别提供带 `title` 的 radar 条目，但仍保持单个参数化 route。

## 错误处理

- 非法 `category` 返回 `InvalidParameterError`。
- 不手动吞掉空列表错误；如果源站结构变化导致 item 为空，让 RSSHub 内部检查暴露问题。
- 不使用伪造日期。
- 不为不可解析正文填充误导性 fallback。

## 测试与验证

实现完成后运行与 RSSHub 路由相关的最小验证：

1. 静态检查或类型检查，确保新增 TypeScript 文件符合项目规范。
2. 对示例路由 `/gov/shenzhen/szpsq/zfbzfw/tzgg` 做路由级验证。
3. 至少验证 6 个 category 配置均能映射到正确栏目 URL。
4. 验证非法 category 会抛出清晰错误。

如果本地网络无法访问 `www.szpsq.gov.cn`，应如实报告，并至少完成代码结构、类型、参数错误路径和配置映射验证。

## 维护约束

- 遵循 RSSHub 新路由文档的 route/namespace 结构。
- 遵循 `AGENTS.md`：route example 以 `/` 开头，namespace url 不带协议，radar source 不带协议，categories 只写 `government`，不新增 README/radar 文件。
- 不在 `lib/router.js` 注册新路由。
- 若请求详情页正文，必须使用缓存，避免对源站造成重复请求。
