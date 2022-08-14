import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import {
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_ecs_patterns as ecs_patterns,
  aws_iam as iam,
  aws_s3_assets as s3assets,
} from 'aws-cdk-lib';

export class EcsCdkStackWebsite2 extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Look up the default VPC
    const vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true
    });

    const taskIamRole = new iam.Role(this, "AppRoleWebsite2", {
      roleName: "AppRoleWebsite2",
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskWebsite2', {
      taskRole: taskIamRole,
    });

    taskDefinition.addContainer('MyContainerWebsite2', {
      image: ecs.ContainerImage.fromAsset('../server-side-rendering/website2'),
      portMappings: [{ containerPort: 80 }],
      memoryReservationMiB: 256,
      cpu: 256,
    });

    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyAppWebsite2", {
      vpc: vpc,
      taskDefinition: taskDefinition,
      desiredCount: 1,
      serviceName: 'MyContainerWebsite2',
    })

  }
}
