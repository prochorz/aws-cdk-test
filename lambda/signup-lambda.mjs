import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event = {}) => {
  const userId = event.request.userAttributes.sub;

  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        id: userId,
        createdAt: new Date().toISOString(),
      }
    });

    const response = await docClient.send(command);

    console.log('User added to DynamoDB', response);
  } catch (error) {
    console.error('Error adding user to DynamoDB:', error);
  }

  return event;
};