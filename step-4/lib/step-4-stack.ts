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

//adding lambda

const notesLambda  = new lambda.Function(this,"Noteshandler",{
  runtime: lambda.Runtime.NODEJS_12_X,
  handler: 'todo.handler',
  code: lambda.Code.fromAsset('functions'),
  memorySize: 1024
})
// Set the new Lambda function as a data source for the AppSync API
const lambdaDs = api.addLambdaDataSource('lambdaDatasource', notesLambda);


lambdaDs.createResolver({
  typeName: "Query",
  fieldName: "getNoteById"
});

lambdaDs.createResolver({
  typeName: "Query",
  fieldName: "listNotes"
});

lambdaDs.createResolver({
  typeName: "Mutation",
  fieldName: "createNote"
});

lambdaDs.createResolver({
  typeName: "Mutation",
  fieldName: "deleteNote"
});

lambdaDs.createResolver({
  typeName: "Mutation",
  fieldName: "updateNote"
});


  }
}
