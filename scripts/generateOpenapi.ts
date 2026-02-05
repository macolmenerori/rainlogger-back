/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import YAML from 'yaml';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rainlogger API',
      version: '1.0.0',
      description: 'API for logging rainfall measurements'
    },
    servers: [
      {
        url: '/api/v1/rainlogger',
        description: 'API base path'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

const openapiSpecification = swaggerJsdoc(options);

const useJson = process.argv.includes('--json');
const outputFile = useJson ? 'openapi.json' : 'openapi.yaml';
const outputPath = path.join(process.cwd(), outputFile);

const content = useJson
  ? JSON.stringify(openapiSpecification, null, 2)
  : YAML.stringify(openapiSpecification);

fs.writeFileSync(outputPath, content, 'utf-8');

console.log(`OpenAPI specification generated: ${outputFile}`);
