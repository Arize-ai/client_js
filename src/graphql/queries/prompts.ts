const PROMPT_FIELDS_FRAGMENT = `
  fragment PromptFields on Prompt {
    id
    name
    description
    messages
    inputVariableFormat
    provider
    modelName
    commitHash
    commitMessage
    llmParameters
    toolCalls
    tags
    createdAt
    updatedAt
  }
`;

export const GET_PROMPT_BY_NODE_ID = `
  query GetPromptByNodeId($id: ID!, $versionLimit: Int) {
    node(id: $id) {
      ... on Prompt {
        ...PromptFields
        versionHistory(first: $versionLimit) {
          edges {
            node {
              id
              commitHash
              commitMessage
              messages
              inputVariableFormat
              provider
              modelName
              llmParameters
              labels
              providerParameters
              createdAt
            }
          }
        }
      }
    }
  }
  ${PROMPT_FIELDS_FRAGMENT}
`;

export const GET_PROMPT_BY_NAME = `
  query GetPromptByName($spaceId: ID!, $name: String!) {
    node(id: $spaceId) {
      ... on Space {
        prompts(name: $name, first: 1) {
          edges {
            node {
              ...PromptFields
            }
          }
        }
      }
    }
  }
  ${PROMPT_FIELDS_FRAGMENT}
`;

export const LIST_PROMPTS_WITH_CONTENT = `
  query ListPromptsWithContent($spaceId: ID!, $first: Int, $after: String) {
    node(id: $spaceId) {
      ... on Space {
        prompts(first: $first, after: $after) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              ...PromptFields
            }
          }
        }
      }
    }
  }
  ${PROMPT_FIELDS_FRAGMENT}
`;

export const CREATE_PROMPT_MUTATION = `
  mutation CreatePrompt(
    $spaceId: ID!,
    $name: String!,
    $description: String,
    $tags: [String!],
    $commitMessage: String!,
    $inputVariableFormat: PromptVersionInputVariableFormatEnum!,
    $provider: ExternalLLMProvider!,
    $model: String,
    $messages: [LLMMessageInput!]!,
    $invocationParams: InvocationParamsInput!,
    $providerParams: ProviderParamsInput!
  ) {
    createPrompt(input: {
      spaceId: $spaceId,
      name: $name,
      description: $description,
      tags: $tags,
      commitMessage: $commitMessage,
      inputVariableFormat: $inputVariableFormat,
      provider: $provider,
      model: $model,
      messages: $messages,
      invocationParams: $invocationParams,
      providerParams: $providerParams
    }) {
      prompt {
        id
        name
      }
    }
  }
`;

export const CREATE_PROMPT_VERSION_MUTATION = `
  mutation CreatePromptVersion(
    $spaceId: ID!,
    $promptId: ID!,
    $commitMessage: String!,
    $inputVariableFormat: PromptVersionInputVariableFormatEnum!,
    $provider: ExternalLLMProvider!,
    $model: String,
    $messages: [LLMMessageInput!]!,
    $invocationParams: InvocationParamsInput!,
    $providerParams: ProviderParamsInput!
  ) {
    createPromptVersion(input: {
      spaceId: $spaceId,
      promptId: $promptId,
      commitMessage: $commitMessage,
      inputVariableFormat: $inputVariableFormat,
      provider: $provider,
      model: $model,
      messages: $messages,
      invocationParams: $invocationParams,
      providerParams: $providerParams
    }) {
      promptVersion {
        id
      }
    }
  }
`;
