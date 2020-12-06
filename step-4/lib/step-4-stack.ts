import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';

export class Step4Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creates the AppSync API
    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'cdk-notes-appsync-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
         
        },
      },
      xrayEnabled: true,
    });



  // Prints out the AppSync GraphQL endpoint to the terminal
  new cdk.CfnOutput(this, "GraphQLAPIURL", {
    value: api.graphqlUrl
   });

   // Prints out the AppSync GraphQL API key to the terminal
   new cdk.CfnOutput(this, "GraphQLAPIKey", {
     value: api.apiKey || ''
   });

   // Prints out the stack region to the terminal
   new cdk.CfnOutput(this, "Stack Region", {
     value: this.region
   });
  }
}
