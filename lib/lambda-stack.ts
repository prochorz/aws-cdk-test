import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { StackBuilder } from '../utils/stack-builder'

export class LambdaStack extends StackBuilder {
  public readonly signupFunction: lambda.Function;

  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const layer = new lambda.LayerVersion(this, 'MyLayer', {
      code: lambda.Code.fromAsset('lambda-layers'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      license: 'Apache-2.0',
      description: 'A layer that contains aws-dynamodb and other dependencies',
    });

    this.signupFunction = new lambda.Function(this, 'SignupLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'signup-lambda.handler',
      code: lambda.Code.fromAsset('lambda'),
      layers: [layer],
      environment: {
        TABLE_NAME: this.appContext.DynamoDBStack.userHistoryTable.tableName
      },
    });

    this.appContext.DynamoDBStack.userHistoryTable.grantReadWriteData(this.signupFunction);
  }
}
