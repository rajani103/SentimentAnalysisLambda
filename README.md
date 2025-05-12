# S3 Text Sentiment Analysis Lambda

This project contains an AWS Lambda function that is triggered when a text file is uploaded to an S3 bucket. The function analyzes the sentiment of the text using Amazon Comprehend and stores the results in a DynamoDB table.

## Architecture

1. User uploads a `.txt` file to the S3 bucket
2. S3 event triggers the Lambda function
3. Lambda reads the file content from S3
4. Lambda uses Amazon Comprehend to analyze the sentiment of the text
5. Lambda stores the results in a DynamoDB table named `SentimentResults`

## Resources Created

- Lambda function for sentiment analysis
- S3 bucket for text file uploads
- DynamoDB table for storing sentiment results
- IAM roles and policies for necessary permissions

## Deployment

This project uses AWS SAM (Serverless Application Model) for deployment. To deploy:

1. Install the AWS SAM CLI: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html

2. Build the application:
   ```
   sam build
   ```

3. Deploy the application:
   ```
   sam deploy --guided
   ```

4. Follow the prompts to complete the deployment.

## Testing

After deployment, you can test the function by uploading a `.txt` file to the created S3 bucket. The sentiment analysis results will be stored in the DynamoDB table.

## Structure

- `index.js` - Lambda function code
- `template.yaml` - SAM template defining AWS resources
- `package.json` - Node.js project configuration