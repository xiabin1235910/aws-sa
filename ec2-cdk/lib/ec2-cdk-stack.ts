import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

// import * as ec2 from "@aws-cdk/aws-ec2";            // Allows working with EC2 and VPC resources
// import * as iam from "@aws-cdk/aws-iam";            // Allows working with IAM resources
// import * as s3assets from "@aws-cdk/aws-s3-assets"; // Allows managing files with S3
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

export class Ec2CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Look up the default VPC
    const vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true
    });

    // Create a key pair to be used with this EC2 Instance
    const key = new keypair.KeyPair(this, "KeyPair", {
      name: "cdk-keypair",
      description: "Key Pair created with CDK Deployment",
    });
    key.grantReadOnPublicKey;

    // Security group for the EC2 instance
    const securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc,
      description: "Allow SSH (TCP port 22) and HTTP (TCP port 80) in",
      allowAllOutbound: true,
    });

    // Allow SSH access on port tcp/22
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH Access"
    );

    // Allow HTTP access on port tcp/80
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP Access"
    );

    // IAM role to allow access to other AWS services
    const role = new iam.Role(this, "ec2Role", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    // IAM policy attachment to allow access to 
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore")
    );

    // Look up the AMI Id for the Amazon Linux 2 Image with CPU Type X86_64
    const ami = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      cpuType: ec2.AmazonLinuxCpuType.X86_64,
    });

    // Create the EC2 instance using the Security Group, AMI, and KeyPair defined.
    const ec2Instance = new ec2.Instance(this, "Instance", {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ami,
      securityGroup: securityGroup,
      keyName: key.keyPairName,
      role: role,
    });

    // --- BFF private App ---
    // Upload the sample app  to S3
    const sampleAppAsset = new s3assets.Asset(this, "BffAsset", {
      path: path.join(__dirname, "../../bff-private"),
    });

    // Allow EC2 instance to read the file
    sampleAppAsset.grantRead(role);

    // Download the file from S3, and store the full location and filename as a variable
    const sampleAppFilePath = ec2Instance.userData.addS3DownloadCommand({
      bucket: sampleAppAsset.bucket,
      bucketKey: sampleAppAsset.s3ObjectKey,
    });

    // --- BFF ---

    // --- Configuration Script ---
    // Upload the configuration file to S3
    const configScriptAsset = new s3assets.Asset(this, "ConfigScriptAsset", {
      path: path.join(__dirname, "../../bff-private/configure_amz_linux_bff.sh"),
    });

    // Allow EC2 instance to read the file
    configScriptAsset.grantRead(ec2Instance.role);

    // Download the file from S3, and store the full location and filename as a variable
    const configScriptFilePath = ec2Instance.userData.addS3DownloadCommand({
      bucket: configScriptAsset.bucket,
      bucketKey: configScriptAsset.s3ObjectKey,
    });

    // Add a line to the user data to executy the downloaded file
    ec2Instance.userData.addExecuteFileCommand({
      filePath: configScriptFilePath,
      arguments: sampleAppFilePath,
    });

    // --- Configuration Script ---


    // Create outputs for connecting

    // Output the public IP address of the EC2 instance
    new cdk.CfnOutput(this, "IP Address", {
      value: ec2Instance.instancePublicIp,
    });

    // Command to download the SSH key
    new cdk.CfnOutput(this, "Download Key Command", {
      value:
        "aws secretsmanager get-secret-value --secret-id ec2-ssh-key/cdk-keypair/private --query SecretString --output text > cdk-key.pem && chmod 400 cdk-key.pem",
    });

    // Command to access the EC2 instance using SSH
    new cdk.CfnOutput(this, "ssh command", {
      value:
        "ssh -i cdk-key.pem -o IdentitiesOnly=yes ec2-user@" +
        ec2Instance.instancePublicIp,
    });
  }

  // example resource
  // const queue = new sqs.Queue(this, 'Ec2CdkQueue', {
  //   visibilityTimeout: cdk.Duration.seconds(300)
  // });
}
