const Axios = require('axios')
const cheerio = require('cheerio')

const scrapPage = async (url)=>{
  try {
    const response = await Axios.get(url);
    const $ = cheerio.load(response.data)
    const result = { title:'', url, childPages:[] }

    $('title').each((i, title) => {
      result.title = title.children[0].data
    });

    $('a').each((i, link) => {

      let href = link.attribs.href?.split('?')[0];
      
      // const href = link.attribs.href;

      if(href)if(href.includes('https://'))result.childPages.push({ "url": href });
    });

    return result

  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  scrapPage
}