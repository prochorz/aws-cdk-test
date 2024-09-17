import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import {
	IdentityPool,
	UserPoolAuthenticationProvider,
} from '@aws-cdk/aws-cognito-identitypool-alpha';

import { StackBuilder } from '../utils/stack-builder'

export class CognitoStack extends StackBuilder {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly identityPool: IdentityPool;

  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const appName = 'Amplify';

    // Create a Cognito User Pool
    this.userPool = new cognito.UserPool(this, `${appName}-userpool`, {
      userPoolName: 'AmplifyUserPool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      lambdaTriggers: {
        postConfirmation: this.appContext.LambdaStack.signupFunction
      }
    });

    // Add a User Pool Client
    this.userPoolClient = new cognito.UserPoolClient(this, `${appName}-userpool-client`, {
      userPool: this.userPool
    });

    this.identityPool = new IdentityPool(this, `${appName}-identitypool`,
      {
        identityPoolName: `${appName}-identitypool`,
        allowUnauthenticatedIdentities: true,
        authenticationProviders: {
          userPools: [
            new UserPoolAuthenticationProvider({
              userPool: this.userPool,
              userPoolClient: this.userPoolClient,
            }),
          ],
        },
      }
    )

    new cdk.CfnOutput(this, 'UserPoolId', {
			value: this.userPool.userPoolId,
		})
		new cdk.CfnOutput(this, 'UserPoolClientId', {
			value: this.userPoolClient.userPoolClientId,
		})
		new cdk.CfnOutput(this, 'IdentityPoolId', {
			value: this.identityPool.identityPoolId,
		})
		new cdk.CfnOutput(this, 'Region', {
			value: this.region,
		})
  }
}
