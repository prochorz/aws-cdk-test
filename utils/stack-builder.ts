import { IAppContext } from '../types';

import * as cdk from 'aws-cdk-lib';

export class StackBuilder extends cdk.Stack {
  private static context: { [key: string]: StackBuilder } = {};

  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    StackBuilder.context[id] = this;
  }

  public get appContext(): IAppContext {
    return StackBuilder.context as any;
  }
}