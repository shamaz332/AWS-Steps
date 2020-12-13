#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DynamodbAsDataSourceStack } from '../lib/dynamodb_as_data_source-stack';

const app = new cdk.App();
new DynamodbAsDataSourceStack(app, 'DynamodbAsDataSourceStack');
