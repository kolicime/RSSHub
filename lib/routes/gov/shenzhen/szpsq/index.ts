import { load } from 'cheerio';
import { Agent, fetch } from 'undici';

import InvalidParameterError from '@/errors/types/invalid-parameter';
import type { Route } from '@/types';
import cache from '@/utils/cache';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

type CategoryConfig = {
    title: string;
    url: string;
};

type ListItem = {
    title: string;
    link: string;
    pubDate?: Date;
};

// www.szpsq.gov.cn negotiates an EC point that Node's OpenSSL 3 rejects with
// "tls_process_ske_ecdhe:bad ecpoint", so the default fetch fails the TLS
// handshake. Forcing a non-ECDHE cipher suite avoids the broken curve
// negotiation. ofetch cannot be used here because it does not forward the
// `dispatcher` option to its internal fetch call.
const tlsAgent = new Agent({ connect: { ciphers: 'DEFAULT:!ECDHE' } });

const fetchText = async (url: string): Promise<string> => {
    const response = await fetch(url, { dispatcher: tlsAgent });
    return await response.text();
};

const categories = {
    tzgg: {
        title: '通知公告',
        url: 'https://www.szpsq.gov.cn/ztfw/zfbzfw/tzgg/index.html',
    },
    zcfg: {
        title: '政策法规',
        url: 'https://www.szpsq.gov.cn/ztfw/zfbzfw/zcfg/index.html',
    },
    xmxx: {
        title: '项目信息',
        url: 'https://www.szpsq.gov.cn/ztfw/zfbzfw/xmxx/index.html',
    },
    fptg: {
        title: '分配通告',
        url: 'https://www.szpsq.gov.cn/ztfw/zfbzfw/fptg/index.html',
    },
    fpgc: {
        title: '分配过程',
        url: 'https://www.szpsq.gov.cn/ztfw/zfbzfw/fpgc/index.html',
    },
    fpjg: {
        title: '分配结果',
        url: 'https://www.szpsq.gov.cn/ztfw/zfbzfw/fpjg/index.html',
    },
} satisfies Record<string, CategoryConfig>;

type CategoryKey = keyof typeof categories;

const isCategoryKey = (category: string): category is CategoryKey => category in categories;

export const route: Route = {
    path: '/shenzhen/szpsq/zfbzfw/:category',
    categories: ['government'],
    example: '/gov/shenzhen/szpsq/zfbzfw/tzgg',
    parameters: { category: '保障性住房栏目' },
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['www.szpsq.gov.cn/ztfw/zfbzfw/:category/index.html', 'www.szpsq.gov.cn/ztfw/zfbzfw/:category/'],
            target: '/gov/shenzhen/szpsq/zfbzfw/:category',
        },
    ],
    name: '保障性住房',
    maintainers: ['Kolicime'],
    handler,
    description: `| 通知公告 | 政策法规 | 项目信息 | 分配通告 | 分配过程 | 分配结果 |
| :------: | :------: | :------: | :------: | :------: | :------: |
|   tzgg   |   zcfg   |   xmxx   |   fptg   |   fpgc   |   fpjg   |`,
};

async function handler(ctx) {
    const category = ctx.req.param('category');
    if (!isCategoryKey(category)) {
        throw new InvalidParameterError('Bad category. See <a href="https://docs.rsshub.app/routes/government#深圳市坪山区人民政府">docs</a>');
    }

    const config = categories[category];
    const response = await fetchText(config.url);
    const $ = load(response);
    const list = $('.listsBox li')
        .toArray()
        .map((item): ListItem | undefined => {
            const element = $(item);
            const link = element.find('a').first();
            const href = link.attr('href');
            const title = element.attr('title') || link.find('em').remove().end().text().trim();
            const dateText = link.find('em').text().trim();

            if (!href || !title) {
                return undefined;
            }

            return {
                title,
                link: new URL(href, config.url).href,
                ...(dateText ? { pubDate: timezone(parseDate(dateText, 'YYYY-MM-DD'), 8) } : {}),
            };
        })
        .filter((item): item is ListItem => item !== undefined);

    const items = await Promise.all(
        list.map((item) =>
            cache.tryGet(item.link, async () => {
                try {
                    const detailResponse = await fetchText(item.link);
                    const content = load(detailResponse);
                    const description = content('.article-content, .TRS_Editor').first().html();
                    return {
                        ...item,
                        ...(description ? { description } : {}),
                    };
                } catch {
                    // Some entries (e.g. 政策法规) link to other government domains
                    // whose TLS requirements conflict with this site's. When the
                    // detail page is unreachable, fall back to the list-level item
                    // so a single unreachable link does not break the whole feed.
                    return item;
                }
            })
        )
    );

    return {
        title: `深圳市坪山区人民政府 - 保障性住房 - ${config.title}`,
        link: config.url,
        item: items,
    };
}
