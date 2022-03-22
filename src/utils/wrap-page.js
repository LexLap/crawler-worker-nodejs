const { scrapPage } = require("./scrapper")
const { sendMessageToQueue } = require("./sqs")

const wrapPage = async (task, url) =>{

    const scrapUrl = task.currentDepth == 0 ? task.startUrl : url
    const scrappedData = await scrapPage(scrapUrl)
    // console.log(scrappedData.childPages)
    if(scrappedData?.childPages){
        scrappedData.childPages.map((childPage, i) =>{
            if(childPage.url != task.startUrl){
                const  page = {
                    // "title": "",
                    "url": childPage.url,
                    "parentPage": scrapUrl,
                    "depth": task.currentDepth + 1
                }
                scrappedData.childPages[i] = page
                sendMessageToQueue(task, page)
            }
        }) 
        return { task, scrappedData }    
    }
    
}


module.exports={
    wrapPage
}