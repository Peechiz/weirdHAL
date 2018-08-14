const request = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')

const BASE_URL = 'http://lyrics.wikia.com'

request(BASE_URL + '/wiki/%22Weird_Al%22_Yankovic')
  .then(html => {
    const $ = cheerio.load(html)
    let links = $('.mw-headline')
      .map(function(){
        return {
          album: $(this).text(),
          songs: $(this).parent().next().next('ol')
            .find('a').map(function(){
              return {
                title: $(this).text(),
                href: BASE_URL + $(this).attr('href')
              }
            }).get()
        }
      }).get()
    console.log('data gathered. writing file...')
    fs.writeFileSync('weirdAl.json', JSON.stringify(links, null, 2))
  })