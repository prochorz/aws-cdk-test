import * as cdk from 'aws-cdk-lib';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

import { StackBuilder } from '../utils/stack-builder'

export class AmplifyStack extends StackBuilder {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, 'amplify-nuxt-example', {
      appName: 'my-nuxt-app',
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'prochorz',
        repository: 'nuxt-example',
        oauthToken: cdk.SecretValue.secretsManager('git-token-example')
      }),
      autoBranchDeletion: true,
      platform: amplify.Platform.WEB_COMPUTE,
      customRules: [
        {
          source: '/<*>',
          target: 'index.html',
          status: amplify.RedirectStatus.NOT_FOUND_REWRITE
        }
      ],
      environmentVariables: {
        "COGNITO_USERPOOL_ID": this.appContext.CognitoStack.userPool.userPoolId,
        "COGNITO_USERPOOL_CLIENT_ID": this.appContext.CognitoStack.userPoolClient.userPoolClientId,
        "COGNITO_IDENTITY_POOL_ID": this.appContext.CognitoStack.identityPool.identityPoolId,
        "APPSYNC_API_URL": this.appContext.GraphqlStack.amplifyApi.graphqlUrl,
        "APPSYNC_API_KEY": this.appContext.GraphqlStack.amplifyApi.apiKey || ''
      },
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: 1,
        frontend: {
          phases: {
            preBuild: {
              commands: [
                "corepack enable",
                "npx --yes nypm i"
              ],
            },
            build: {
              commands: ['npm run build'],
            },
          },
          artifacts: {
            baseDirectory: ".amplify-hosting",
            files: ["**/*"],
          },
          cache: {
            paths: ["node_modules/**/*"],
          },
        },
      }) 
    });

    amplifyApp.addBranch("main", { stage: "PRODUCTION" });
  }
}
