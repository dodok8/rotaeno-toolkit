import { expect, test, describe } from 'bun:test'
import { fetchRotaenoWikiPage } from '../src/fetchRotaenoWikiPage'
import { parseRotaenoSong } from '../src/parseRotaenoSong'

describe('parseRotaenoSong', () => {
  test('should correctly parse 심장병 song data', async () => {
    const songDocument = await fetchRotaenoWikiPage('심장병')
    const result = parseRotaenoSong(songDocument)

    expect(result).toEqual({
      id: 'xinzang-bing',
      imageUrl:
        '/images/thumb/b/b1/Songs_xinzang-bing.png/256px-Songs_xinzang-bing.png',
      artist: 'HyuN feat. HUBOG',
      releaseVersion: '1.0.3',
      chapter: '基础歌曲',
      title_localized: {
        default: '심장병',
        en: 'simjangbyeong',
        'zh-Hans': '心脏病',
        'zh-Hant': '心臟病',
      },
      source_localized: {
        default: 'Rotaeno Sound Collection',
      },
      charts: [
        {
          difficultyLevel: 'I',
          difficultyDecimal: 1,
          chartDesigner: 'TangScend',
          jacketDesigner: 'Juice Black',
        },
        {
          difficultyLevel: 'II',
          difficultyDecimal: 3,
          chartDesigner: 'TangScend',
          jacketDesigner: 'Juice Black',
        },
        {
          difficultyLevel: 'III',
          difficultyDecimal: 8.2,
          chartDesigner: 'TangScend',
          jacketDesigner: 'Juice Black',
        },
        {
          difficultyLevel: 'IV',
          difficultyDecimal: 9.5,
          chartDesigner: 'TangScend',
          jacketDesigner: 'Juice Black',
        },
      ],
    })
  })

  test('should correctly parse アイロニ song data', async () => {
    const songDocument = await fetchRotaenoWikiPage('アイロニ')
    const result = parseRotaenoSong(songDocument)

    expect(result).toEqual({
      id: 'irony',
      imageUrl: '/images/thumb/4/4e/Songs_irony.png/256px-Songs_irony.png',
      artist: 'すこっぷ',
      releaseVersion: '1.9.0',
      chapter: '自未来的歌',
      title_localized: {
        default: 'アイロニ',
        en: 'Irony',
      },
      source_localized: {
        default: 'Original',
      },
      charts: [
        {
          difficultyLevel: 'I',
          difficultyDecimal: 3,
          chartDesigner: '明日',
          jacketDesigner: 'はるはる',
        },
        {
          difficultyLevel: 'II',
          difficultyDecimal: 5,
          chartDesigner: '明日',
          jacketDesigner: 'はるはる',
        },
        {
          difficultyLevel: 'III',
          difficultyDecimal: 7,
          chartDesigner: '明日',
          jacketDesigner: 'はるはる',
        },
        {
          difficultyLevel: 'IV',
          difficultyDecimal: 11.6,
          chartDesigner: '明日',
          jacketDesigner: 'はるはる',
        },
      ],
    })
  })

  test("should correctly parse Heaven's Cage song data", async () => {
    const songDocument = await fetchRotaenoWikiPage("Heaven's Cage")
    const result = parseRotaenoSong(songDocument)

    expect(result).toEqual({
      id: 'heavens-cage',
      imageUrl:
        '/images/thumb/5/55/Songs_heavens-cage.png/256px-Songs_heavens-cage.png',
      artist: 'ETIA.',
      releaseVersion: '2.0.0',
      chapter: '第三章 - 泾渭分明之地',
      title_localized: {
        default: "Heaven's Cage",
      },
      source_localized: {
        default: 'Rotaeno Sound Collection',
      },
      charts: [
        {
          difficultyLevel: 'I',
          difficultyDecimal: 3,
          chartDesigner: 'Adashi',
          jacketDesigner: '三更',
        },
        {
          difficultyLevel: 'II',
          difficultyDecimal: 7,
          chartDesigner: 'Adashi',
          jacketDesigner: '三更',
        },
        {
          difficultyLevel: 'III',
          difficultyDecimal: 10.4,
          chartDesigner: 'Adashi',
          jacketDesigner: '三更',
        },
        {
          difficultyLevel: 'IV',
          difficultyDecimal: 13.1,
          chartDesigner: 'AngrierB',
          jacketDesigner: '三更',
        },
        {
          difficultyLevel: 'IV-α',
          difficultyDecimal: 13.9,
          chartDesigner: 'Ada▥hi',
          jacketDesigner: '三更',
        },
      ],
    })
  })
})
