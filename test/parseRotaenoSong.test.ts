import { expect, test, describe } from 'bun:test'
import { fetchRotaenoWikiPage } from '../src/fetchRotaenoWikiPage'
import { parseRotaenoSong } from '../src/parseRotaenoSong'

describe('parseRotaenoSong', () => {
  test('should correctly parse 심장병 song data', async () => {
    const songDocument = await fetchRotaenoWikiPage('심장병')
    const result = parseRotaenoSong(songDocument)

    expect(result).toEqual({
      id: 'xinzang-bing',
      artist: 'HyuN feat. HUBOG',
      releaseVersion: '1.0.3',
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
      artist: 'すこっぷ',
      releaseVersion: '1.9.0',
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
          difficultyDecimal: 12,
          chartDesigner: '明日',
          jacketDesigner: 'はるはる',
        },
      ],
    })
  })
})
