#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Step4Stack } from '../lib/step-4-stack';

const app = new cdk.App();
new Step4Stack(app, 'Step4Stack');
