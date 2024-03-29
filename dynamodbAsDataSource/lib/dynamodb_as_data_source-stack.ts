import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";

export class DynamodbAsDataSourceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    ///APPSYNC API gives you a graphql api with api key
    const api = new appsync.GraphqlApi(this, "GRAPHQL_API", {
      name: "dynamodb-as-DS",
      schema: appsync.Schema.fromAsset("graphql/schema.gql"), ///Path specified for lambda
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY, ///Defining Authorization Type
        },
      },
      xrayEnabled: true, ///Enables xray debugging
    });

    ///Print Graphql Api Url on console after deploy
    new cdk.CfnOutput(this, "APIGraphQlURL", {
      value: api.graphqlUrl,
    });

    ///Print API Key on console after deploy
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    ///Defining a DynamoDB Table
    const dynamoDBTable = new ddb.Table(this, "Table", {
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });
    ///Attaching Datasource to api
    const db_data_source = api.addDynamoDbDataSource(
      "DataSources",
      dynamoDBTable
    );

    db_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "createNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PartitionKey.partition("id").auto(), ///Create an autoID for your primary Key Id
        appsync.Values.projecting() ///Add Remaining input values
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(), ////Mapping template for a single result item from DynamoDB.
    });

    db_data_source.createResolver({
      typeName: "Query",
      fieldName: "notes",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(), ///Mapping template to scan a DynamoDB table to fetch all entries.
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(), ////Mapping template for a single result item from DynamoDB.
    });
  

    db_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "updateNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        ///Mapping template to save a single item to a DynamoDB table.
        appsync.PartitionKey.partition("id").is("id"), ///Where id is input ID
        appsync.Values.projecting()
      ), ///Add Remaining input values

      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(), ////Mapping template for a single result item from DynamoDB.
    });
  }
}
