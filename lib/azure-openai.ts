import { AzureKeyCredential, OpenAIClient } from '@azure/openai'

if (!process.env.AZURE_OPENAI_API_KEY) {
  throw new Error('Missing Azure OpenAI API Key')
}

if (!process.env.AZURE_OPENAI_ENDPOINT) {
  throw new Error('Missing Azure OpenAI Endpoint')
}

const endpoint = process.env.AZURE_OPENAI_ENDPOINT
const azureApiKey = process.env.AZURE_OPENAI_API_KEY

export const openAIClient = new OpenAIClient(
  endpoint,
  new AzureKeyCredential(azureApiKey)
)