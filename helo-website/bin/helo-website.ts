#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HeloWebsiteStack } from '../lib/helo-website-stack';

const app = new cdk.App();
new HeloWebsiteStack(app, 'HeloWebsiteStack');
