const AWS = require('aws-sdk');
const { redisLookupURL } = require('./redis');
const sqs = new AWS.SQS({
    apiVersion: "2012-11-05",
    region: "eu-west-1"
});


const sendMessageToQueue = async (task, page) => {
    const QueueUrl = task.queueUrl;
    const MessageBody = page.url;
    const pageDepth = page.depth + ""
    const title = page.title;
    const parentPage = page.parentPage

    try {
        const { MessageId } = await sqs.sendMessage({
            QueueUrl,
            MessageAttributes: {
                // "pageTitle": {
                //     DataType: "String",
                //     StringValue: title
                // },
                "pageDepth": {
                    DataType: "String",
                    StringValue: pageDepth
                },
                "parentPage": {
                    DataType: "String",
                    StringValue: parentPage
                }
            },
            MessageBody
        }).promise();
        // req.messageId = MessageId;
        // console.log(MessageId)
    } catch (err) {
        console.log(err);
    }
};

const pollMessages = async (task) => {
    const QueueUrl = task.queueUrl;
    try {
        const { Messages } = await sqs.receiveMessage({
            QueueUrl,
            MaxNumberOfMessages: 10,
            MessageAttributeNames: [
                "All"
            ],
            VisibilityTimeout: 30,
            WaitTimeSeconds: 10
        }).promise();

        // return Messages
        // const response = Messages || [];
        const polledMessages = []


        if (Messages) {
            console.log(Messages.length)
            const messagesDeleteFuncs = Messages.map(async message => {
                if(message.MessageAttributes.pageDepth.StringValue == task.currentDepth){
                    const isRedisRecord = await redisLookupURL(message.Body)
                    console.log(isRedisRecord)
                    polledMessages.push(message)
                    return sqs.deleteMessage({
                        QueueUrl,
                        ReceiptHandle: message.ReceiptHandle
                    }).promise();
                }
            });

            Promise.allSettled(messagesDeleteFuncs)
                .then(
                    // data => 
                    // console.log()
                );
            
        }

        return polledMessages

    } catch (err) {
        console.log(err);
    }
};


module.exports = {
    sendMessageToQueue,
    pollMessages
};