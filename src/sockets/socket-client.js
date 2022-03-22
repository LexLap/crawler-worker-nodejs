const io = require('socket.io-client')
const { pollMessages } = require('../utils/sqs')
const { wrapPage } = require('../utils/wrap-page')

const socket = io.connect(process.env.MGMT_SERVER)
// const socket = io.connect('http://localhost:3030')

socket.on('connected', socket.emit('worker-join'), console.log('Socket connected with management server'))

socket.on('new-task', async (task) => {
    const result = await wrapPage(task)
    // console.log(result)
    socket.emit('page-data', result)
})

socket.on('task-update', async (task) =>{
    try{
        const messages = await pollMessages(task)

        if(messages?.length > 0){
            messages.map(async (message)=>{
                if(task.currentDepth == message.MessageAttributes.pageDepth.StringValue){
                    const result = await wrapPage(task, message.Body)
                    // console.log(result)
                    if(result?.task)
                        // setTimeout(function(){ console.log("Sleep"); }, 3000);
                        socket.emit('page-data', result)

                    // task.data.childPages.map(async (page)=>{
                    //     console.log(page.url, message.MessageAttributes.parentPage.StringValue)
                    //     if(page.url == message.MessageAttributes.parentPage.StringValue ||
                    //         page.url + '/' == message.MessageAttributes.parentPage.StringValue){
                    //         const result = await wrapPage(task, message.Body)
                    //         // console.log(result)
                    //         socket.emit('page-data', result)
                    //         // console.log(message.MessageAttributes.pageDepth.StringValue)
                    //         // console.log(message.MessageAttributes.parentPage.StringValue)
                    //         // console.log(message.Body)
                    //     }
                    // })
                }
            })
        }
    }catch{}
})



module.exports = {
    socket
}