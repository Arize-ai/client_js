import { RawAiIntegration } from "../../types/internal";

const mockDateString = "2026-02-13T21:27:19.055Z";
const mockUpdatedDateString = "2026-02-13T21:27:19.279Z";
const mockIntegrationId = "TGxtSW50ZWdyYXRpb246MTI6YUJjRA==";
const mockUserId = "VXNlcjoxOm5OYkM=";

export const mockAiIntegration: RawAiIntegration = {
  id: mockIntegrationId,
  name: "My OpenAI Integration",
  provider: "openAI",
  has_api_key: true,
  base_url: null,
  model_names: ["gpt-4", "gpt-4o"],
  headers: null,
  enable_default_models: true,
  function_calling_enabled: true,
  auth_type: "default",
  provider_metadata: null,
  scopings: [{ organization_id: null, space_id: null }],
  created_at: mockDateString,
  updated_at: mockUpdatedDateString,
  created_by_user_id: mockUserId,
};
