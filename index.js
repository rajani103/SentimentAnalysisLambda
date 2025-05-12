const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const comprehend = new AWS.Comprehend();
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        // Get the S3 bucket and key from the event
        const bucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        
        // Check if the file is a .txt file
        if (!key.endsWith('.txt')) {
            console.log('Not a text file, skipping processing:', key);
            return {
                statusCode: 200,
                body: JSON.stringify('File skipped - not a text file')
            };
        }
        
        console.log(`Processing file: ${key} from bucket: ${bucket}`);
        
        // Get the file content from S3
        const s3Response = await s3.getObject({
            Bucket: bucket,
            Key: key
        }).promise();
        
        // Convert the file content to text
        const text = s3Response.Body.toString('utf-8');
        console.log('File content retrieved successfully');
        
        // Detect sentiment using Amazon Comprehend
        const comprehendParams = {
            LanguageCode: 'en',
            Text: text
        };
        
        const sentimentResponse = await comprehend.detectSentiment(comprehendParams).promise();
        console.log('Sentiment detected:', sentimentResponse.Sentiment);
        
        // Truncate text to 1000 characters if needed
        const truncatedText = text.length > 1000 ? text.substring(0, 1000) : text;
        
        // Store results in DynamoDB
        const dynamoParams = {
            TableName: 'SentimentResults',
            Item: {
                filename: key,
                sentiment: sentimentResponse.Sentiment,
                text: truncatedText,
                timestamp: new Date().toISOString()
            }
        };
        
        await dynamodb.put(dynamoParams).promise();
        console.log('Results stored in DynamoDB successfully');
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'File processed successfully',
                filename: key,
                sentiment: sentimentResponse.Sentiment
            })
        };
    } catch (error) {
        console.error('Error processing file:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error processing file',
                error: error.message
            })
        };
    }
};