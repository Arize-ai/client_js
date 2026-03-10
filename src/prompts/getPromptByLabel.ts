import { graphqlFetch, GraphQLClientOptions } from "../graphql";
import { GET_PROMPT_WITH_VERSIONS_BY_NAME } from "../graphql/queries/prompts";
import { PromptWithContent } from "../types";
import { transformGraphQLPrompt, transformGraphQLPromptVersion } from "./utils";
import { RawGraphQLPrompt } from "../types/internal";

export type GetPromptByLabelParams = {
  promptName: string;
  spaceNodeId: string;
  label: string;
  versionLimit?: number;
  apiKey?: string;
  baseUrl?: string;
};

export async function getPromptByLabel(
  params: GetPromptByLabelParams,
): Promise<PromptWithContent> {
  const clientOptions: GraphQLClientOptions = {
    apiKey: params.apiKey,
    baseUrl: params.baseUrl,
  };

  const data = await graphqlFetch<{
    node: {
      prompts: {
        edges: Array<{ node: RawGraphQLPrompt }>;
      };
    };
  }>(clientOptions, GET_PROMPT_WITH_VERSIONS_BY_NAME, {
    spaceId: params.spaceNodeId,
    name: params.promptName,
    versionLimit: params.versionLimit ?? 50,
  });

  const edges = data.node?.prompts?.edges;
  if (!edges || edges.length === 0) {
    throw new Error(
      `Prompt "${params.promptName}" not found in space ${params.spaceNodeId}`,
    );
  }

  const raw = edges[0]!.node;
  const versionEdges = raw.versionHistory?.edges ?? [];
  const match = versionEdges.find((e) =>
    e.node.labels?.includes(params.label),
  );

  if (!match) {
    throw new Error(
      `No version with label "${params.label}" for prompt "${params.promptName}"`,
    );
  }

  const v = match.node;
  const base = transformGraphQLPrompt(raw);
  const { id: _versionNodeId, ...versionFields } = transformGraphQLPromptVersion(v);
  return {
    ...base,
    ...versionFields,
    versionId: v.id,
    updatedAt: new Date(v.createdAt),
  };
}
