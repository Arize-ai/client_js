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
