import { beforeEach, describe, expect, it, vi } from 'vitest';

import InvalidParameterError from '@/errors/types/invalid-parameter';
import cache from '@/utils/cache';
import ofetch from '@/utils/ofetch';

vi.mock('@/utils/ofetch', () => ({
    default: vi.fn(),
}));

vi.mock('@/utils/cache', () => ({
    default: {
        tryGet: vi.fn(),
    },
}));

const mockedOfetch = vi.mocked(ofetch);
const mockedTryGet = vi.mocked(cache.tryGet);

const createContext = (category: string) =>
    ({
        req: {
            param: (name: string) => {
                if (name === 'category') {
                    return category;
                }
                return;
            },
        },
    }) as any;

const listHtml = `
<html>
<body>
<div class="whiteBg listsBox">
<div class="newListsT1 newListsH">
<ul>
<li title="坪山区住房保障通知"><a href="./content/post_12811714.html"><i></i>坪山区住房保障通知<em>2026-06-01</em></a></li>
<li title="坪山区配租提醒"><a href="/ztfw/zfbzfw/tzgg/content/post_12803045.html"><i></i>坪山区配租提醒<em>2026-05-30</em></a></li>
</ul>
</div>
</div>
</body>
</html>
`;

const detailHtml = `
<html>
<body>
<div class="article-content p30"><p>这是保障性住房通知正文。</p></div>
</body>
</html>
`;

describe('深圳市坪山区人民政府保障性住房', () => {
    beforeEach(() => {
        mockedOfetch.mockReset();
        mockedTryGet.mockReset();
        mockedTryGet.mockImplementation((_key, getter) => getter());
    });

    it.each([
        ['tzgg', '通知公告', 'https://www.szpsq.gov.cn/ztfw/zfbzfw/tzgg/index.html'],
        ['zcfg', '政策法规', 'https://www.szpsq.gov.cn/ztfw/zfbzfw/zcfg/index.html'],
        ['xmxx', '项目信息', 'https://www.szpsq.gov.cn/ztfw/zfbzfw/xmxx/index.html'],
        ['fptg', '分配通告', 'https://www.szpsq.gov.cn/ztfw/zfbzfw/fptg/index.html'],
        ['fpgc', '分配过程', 'https://www.szpsq.gov.cn/ztfw/zfbzfw/fpgc/index.html'],
        ['fpjg', '分配结果', 'https://www.szpsq.gov.cn/ztfw/zfbzfw/fpjg/index.html'],
    ])('maps category %s to the expected source URL', async (category, title, url) => {
        const { route } = await import('@/routes/gov/shenzhen/szpsq/index');
        mockedOfetch.mockResolvedValueOnce(listHtml).mockResolvedValueOnce(detailHtml).mockResolvedValueOnce(detailHtml);

        const data = await route.handler(createContext(category));

        expect(mockedOfetch).toHaveBeenNthCalledWith(1, url);
        expect(data.title).toBe(`深圳市坪山区人民政府 - 保障性住房 - ${title}`);
        expect(data.link).toBe(url);
        expect(data.item).toHaveLength(2);
    });

    it('parses list items, normalizes links, parses dates, and fetches detail descriptions through cache', async () => {
        const { route } = await import('@/routes/gov/shenzhen/szpsq/index');
        mockedOfetch.mockResolvedValueOnce(listHtml).mockResolvedValueOnce(detailHtml).mockResolvedValueOnce(detailHtml);

        const data = await route.handler(createContext('tzgg'));

        expect(data.title).toBe('深圳市坪山区人民政府 - 保障性住房 - 通知公告');
        expect(data.link).toBe('https://www.szpsq.gov.cn/ztfw/zfbzfw/tzgg/index.html');
        expect(data.item).toEqual([
            expect.objectContaining({
                title: '坪山区住房保障通知',
                link: 'https://www.szpsq.gov.cn/ztfw/zfbzfw/tzgg/content/post_12811714.html',
                description: '<p>这是保障性住房通知正文。</p>',
            }),
            expect.objectContaining({
                title: '坪山区配租提醒',
                link: 'https://www.szpsq.gov.cn/ztfw/zfbzfw/tzgg/content/post_12803045.html',
                description: '<p>这是保障性住房通知正文。</p>',
            }),
        ]);
        expect(data.item[0].pubDate?.toISOString()).toBe('2026-05-31T16:00:00.000Z');
        expect(data.item[1].pubDate?.toISOString()).toBe('2026-05-29T16:00:00.000Z');
        expect(mockedTryGet).toHaveBeenCalledTimes(2);
        expect(mockedTryGet).toHaveBeenNthCalledWith(1, 'https://www.szpsq.gov.cn/ztfw/zfbzfw/tzgg/content/post_12811714.html', expect.any(Function));
        expect(mockedTryGet).toHaveBeenNthCalledWith(2, 'https://www.szpsq.gov.cn/ztfw/zfbzfw/tzgg/content/post_12803045.html', expect.any(Function));
    });

    it('omits pubDate when the list item has no date text', async () => {
        const { route } = await import('@/routes/gov/shenzhen/szpsq/index');
        mockedOfetch.mockResolvedValueOnce('<div class="listsBox"><ul><li title="无日期通知"><a href="content/post_1.html"><i></i>无日期通知</a></li></ul></div>').mockResolvedValueOnce(detailHtml);

        const data = await route.handler(createContext('tzgg'));

        expect(data.item).toHaveLength(1);
        expect(data.item[0]).toEqual(
            expect.objectContaining({
                title: '无日期通知',
                link: 'https://www.szpsq.gov.cn/ztfw/zfbzfw/tzgg/content/post_1.html',
                description: '<p>这是保障性住房通知正文。</p>',
            })
        );
        expect(data.item[0].pubDate).toBeUndefined();
    });

    it('throws InvalidParameterError for unsupported category', async () => {
        const { route } = await import('@/routes/gov/shenzhen/szpsq/index');

        await expect(route.handler(createContext('bad'))).rejects.toBeInstanceOf(InvalidParameterError);
        expect(mockedOfetch).not.toHaveBeenCalled();
    });
});
