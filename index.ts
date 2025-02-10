import * as cheerio from 'cheerio'
import Elysia from 'elysia'

const baseUrl = 'https://arknights.wiki.gg/wiki'

const app = new Elysia({ prefix: '/api' })

app.get('/v1', async ({ error }) => {
  try {
    const operators = (await Array.from({ length: 6 }).reduce(
      async (acc, _, i) => {
        const res = await fetch(`${baseUrl}/Operator/${i + 1}-star`)
        const html = await res.text()
        const $ = cheerio.load(html)

        const operatorTable = $('table.mrfz-wtable')

        const ops: { name: string; url: string }[] = []
        operatorTable.find('tr').each((_, element) => {
          const nameCell = $(element).find('td:nth-child(2)')

          const name = nameCell.text().trim().replace('_', ' ')
          const url = nameCell.find('a').attr('href')?.toString() ?? ''
          if (name && url)
            ops.push({
              name,
              url: `http://localhost:3000/api/v1${url.replace('/wiki', '')}`,
            })
        })

        return [...((await acc) as { name: string; url: string }[]), ...ops]
      },
      Promise.resolve([] as { name: string; url: string }[]),
    )) as { name: string; url: string }[]

    return operators
  } catch (e) {
    if (e instanceof Error) return error('Internal Server Error', { message: e.message })
    return error('Internal Server Error', { message: 'Unknow error' })
  }
})

app.get('/v1/:slug', async ({ params, error }) => {
  try {
    const res = await fetch(`${baseUrl}/${params.slug}`)
    const $ = cheerio.load(await res.text())
    const img = $('.pi-image-thumbnail')

    const ress = await fetch(`${baseUrl}/${params.slug}/File`)
    const $$ = cheerio.load(await ress.text())
    const profile = $$('#Profile').parent().parent().find('tr:nth-child(2)')

    return {
      name: params.slug,
      description: profile.text().trim(),
      img: `https://arknights.wiki.gg${img.attr('src')}`,
    }
  } catch (e) {
    if (e instanceof Error) return error('Internal Server Error', { message: e.message })
    return error('Internal Server Error', { message: 'Unknow error' })
  }
})

app.listen(3000)
