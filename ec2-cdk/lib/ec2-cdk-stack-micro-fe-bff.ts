import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as keypair from "cdk-ec2-key-pair";        // Helper to create EC2 SSH keypairs
import * as path from "path";                       // Helper for working with file paths

import {
  Stack,
  StackProps,
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_ecs_patterns as ecs_patterns,
  aws_iam as iam,
  aws_s3_assets as s3assets,
} from 'aws-cdk-lib';

export class EcsCdkStackBFF extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Look up the default VPC
    const vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true
    });

    const taskIamRole = new iam.Role(this, "AppRoleBFF", {
      roleName: "AppRoleBFF",
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskBFF', {
      taskRole: taskIamRole,
    });

    taskDefinition.addContainer('MyContainer', {
      image: ecs.ContainerImage.fromAsset('../bff-private'),
      portMappings: [{ containerPort: 80 }],
      memoryReservationMiB: 256,
      cpu: 256,
    });

    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyApp", {
      vpc: vpc,
      taskDefinition: taskDefinition,
      desiredCount: 1,
      serviceName: 'MyWebApp',
      assignPublicIp: true,
      publicLoadBalancer: true,
    })

  }
}
