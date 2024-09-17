import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

import { StackBuilder } from '../utils/stack-builder'

export class DynamoDBStack extends StackBuilder {
  public readonly userHistoryTable: dynamodb.Table;

  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // Створення таблиці DynamoDB
    this.userHistoryTable = new dynamodb.Table(this, 'UserHistoryTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      // billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      // removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }
}
