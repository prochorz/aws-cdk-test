import type { GraphqlStack } from '../lib/graphql-stack';
import type { CognitoStack } from '../lib/cognito-stack';
import type { LambdaStack } from '../lib/lambda-stack';
import type { AmplifyStack } from '../lib/amplify-stack';
import type { DynamoDBStack } from '../lib/dynamodb-stack';

export enum E_APP_STAK {
    COGNITO_STACK = 'CognitoStack',
    AMPLIFY_STACK = 'AmplifyStack',
    LAMBDA_STACK = 'LambdaStack',
    DYNAMODB_STACK = 'DynamoDBStack',
    GRAPHQL_STACK = 'GraphqlStack',
}

export interface IAppContext {
    [E_APP_STAK.COGNITO_STACK]: CognitoStack,
    [E_APP_STAK.AMPLIFY_STACK]: AmplifyStack,
    [E_APP_STAK.DYNAMODB_STACK]: DynamoDBStack,
    [E_APP_STAK.LAMBDA_STACK]: LambdaStack,
    [E_APP_STAK.GRAPHQL_STACK]: GraphqlStack,
}