#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AmplifyStack } from '../lib/amplify-stack';
import { DynamoDBStack } from '../lib/dynamodb-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { CognitoStack } from '../lib/cognito-stack';
import { GraphqlStack } from '../lib/graphql-stack';

import { E_APP_STAK } from '../types';

const env = { account: '014498645412', region: 'us-east-2' };

const app = new cdk.App();

new DynamoDBStack(app, E_APP_STAK.DYNAMODB_STACK, { env });
new LambdaStack(app, E_APP_STAK.LAMBDA_STACK, { env });
new CognitoStack(app, E_APP_STAK.COGNITO_STACK, { env });
new GraphqlStack(app, E_APP_STAK.GRAPHQL_STACK, { env });

new AmplifyStack(app, E_APP_STAK.AMPLIFY_STACK, { env });