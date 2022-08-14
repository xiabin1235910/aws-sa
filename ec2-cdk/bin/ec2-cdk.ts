#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { EcsCdkStackBFF } from '../lib/ec2-cdk-stack-micro-fe-bff'
const app = new cdk.App();
// new Ec2CdkStack(app, 'Ec2CdkStack', {
//   /* Uncomment the next line to specialize this stack for the AWS Account
//    * and Region that are implied by the current CLI configuration. */
//   // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

//   /* Uncomment the next line if you know exactly what Account and Region you
//    * want to deploy the stack to. */
//   env: { account: '413469092433', region: 'ap-southeast-3' },

//   /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
// });

new EcsCdkStackBFF(app, 'EcsCdkStackBFF', {
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env: { account: '413469092433', region: 'ap-southeast-3' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

import { EcsCdkStackStorybook } from '../lib/ec2-cdk-stack-micro-fe-storybook'
const appStorybook = new cdk.App();

new EcsCdkStackStorybook(appStorybook, 'EcsCdkStackStorybook', {
  env: { account: '413469092433', region: 'ap-southeast-3' },
});

import { EcsCdkStackWebsite1 } from '../lib/ec2-cdk-stack-micro-fe-website1'
const appWebsite1 = new cdk.App();

new EcsCdkStackWebsite1(appWebsite1, 'EcsCdkStackWebsite1', {
  env: { account: '413469092433', region: 'ap-southeast-3' },
});

import { EcsCdkStackWebsite2 } from '../lib/ec2-cdk-stack-micro-fe-website2'
const appWebsite2 = new cdk.App();

new EcsCdkStackWebsite2(appWebsite2, 'EcsCdkStackWebsite2', {
  env: { account: '413469092433', region: 'ap-southeast-3' },
});

import { EcsCdkStackNginx } from '../lib/ec2-cdk-stack-micro-fe-nginx'
const appNginx = new cdk.App();

new EcsCdkStackNginx(appNginx, 'EcsCdkStackNginx', {
  env: { account: '413469092433', region: 'ap-southeast-3' },
});
