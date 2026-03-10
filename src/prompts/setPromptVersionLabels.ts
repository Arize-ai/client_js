import { graphqlFetch, GraphQLClientOptions } from "../graphql";
import { PATCH_PROMPT_VERSION_MUTATION } from "../graphql/queries/prompts";
import { warnPreRelease } from "../utils/warning";

export type SetPromptVersionLabelsParams = {
  versionId: string;
  labels: string[];
  apiKey?: string;
  baseUrl?: string;
};

export type SetPromptVersionLabelsResult = {
  id: string;
  labels: string[];
};

export async function setPromptVersionLabels(
  params: SetPromptVersionLabelsParams,
): Promise<SetPromptVersionLabelsResult> {
  warnPreRelease({ functionName: "setPromptVersionLabels" });
  const clientOptions: GraphQLClientOptions = {
    apiKey: params.apiKey,
    baseUrl: params.baseUrl,
  };

  const data = await graphqlFetch<{
    patchPromptVersion: {
      promptVersion: { id: string; labels: string[] };
    };
  }>(clientOptions, PATCH_PROMPT_VERSION_MUTATION, {
    versionId: params.versionId,
    labels: params.labels,
  });

  return data.patchPromptVersion.promptVersion;
}
