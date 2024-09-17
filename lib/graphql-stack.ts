import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as graphql from '@aws-amplify/graphql-api-construct';

import { StackBuilder } from '../utils/stack-builder'

export class GraphqlStack extends StackBuilder {
  public amplifyApi: graphql.AmplifyGraphqlApi;

  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.amplifyApi = new graphql.AmplifyGraphqlApi(this, 'AmplifyCdkGraphQlApi', {
      definition: graphql.AmplifyGraphqlDefinition.fromFiles('graphql/schema.graphql'),
      authorizationModes: {
        defaultAuthorizationMode: 'API_KEY',
        apiKeyConfig: {
          expires: cdk.Duration.days(30)
        },
        userPoolConfig: {
          userPool: this.appContext.CognitoStack.userPool
        }
      }
    });

    const userHistoryTableSource = this.amplifyApi.addDynamoDbDataSource('userHistoryTableSource', this.appContext.DynamoDBStack.userHistoryTable);

    // Define the resolver for the `User` type
    this.amplifyApi.addResolver('GetUserHistoryResolver', {
      typeName: 'Query',
      fieldName: 'getUserHistory',
      dataSource: userHistoryTableSource,
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem('id', 'id'),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
  }
}
