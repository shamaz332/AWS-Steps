import * as cdk from '@aws-cdk/core';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from "@aws-cdk/aws-s3-deployment";

export class HeloWebsiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

const websiteBucket = new s3.Bucket(this,"WebsiteBucket",{
  websiteIndexDocument: 'index.html',
  publicReadAccess: true,
  versioned: true     ///bucket versioning
})
const distribution = new cloudfront.Distribution(this,"dist",{
  defaultBehavior:{
    origin:new origins.S3Origin(websiteBucket)
  }
})
    // Prints out the web endpoint to the terminal
    new cdk.CfnOutput(this,"domainname",{
      value:distribution.domainName
    })
const deploy = new s3deploy.BucketDeployment(this,"deplotingsite",{
  sources : [s3deploy.Source.asset("./website")],
  destinationBucket:websiteBucket,
  distribution: distribution

})

  }
}
