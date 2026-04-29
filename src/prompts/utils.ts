import { Prompt, PromptVersion, PromptWithVersion } from "../types";
import {
  RawPrompt,
  RawPromptVersion,
  RawPromptWithVersion,
} from "../types/internal";

export function transformPrompt(prompt: RawPrompt): Prompt {
  const { space_id, created_at, updated_at, created_by_user_id, ...rest } =
    prompt;
  return {
    ...rest,
    spaceId: space_id,
    createdAt: new Date(created_at),
    updatedAt: new Date(updated_at),
    createdByUserId: created_by_user_id,
  };
}

export function transformPromptVersion(
  version: RawPromptVersion,
): PromptVersion {
  const {
    prompt_id,
    commit_hash,
    commit_message,
    input_variable_format,
    invocation_params,
    provider_params,
    created_at,
    created_by_user_id,
    ...rest
  } = version;
  return {
    ...rest,
    promptId: prompt_id,
    commitHash: commit_hash,
    commitMessage: commit_message,
    inputVariableFormat: input_variable_format,
    invocationParams: invocation_params,
    providerParams: provider_params,
    toolConfig: invocation_params?.tool_config,
    createdAt: new Date(created_at),
    createdByUserId: created_by_user_id,
  };
}

export function transformPromptWithVersion(
  prompt: RawPromptWithVersion,
): PromptWithVersion {
  const { version, ...rest } = prompt;
  return {
    ...transformPrompt(rest),
    version: transformPromptVersion(version),
  };
}
