export type ApiKeyTier = "standard" | "pro" | "enterprise";

export interface ApiKeyRecord {
  id: string;
  name: string;
  key_prefix: string;
  tier: ApiKeyTier;
  scopes: string[];
  rate_limit_rpm: number;
  created_at: string;
  last_used_at?: string;
  expires_at?: string;
  revoked_at?: string;
}

export interface ApiKeyCreateResponse {
  api_key: ApiKeyRecord;
  secret: string;
}

export interface TraceRecord {
  trace_id: string;
  timestamp: string;
  provider: string;
  model: string;
  environment?: string;
  git_sha?: string;
  metrics: {
    latency_ms?: number;
    tokens_in?: number;
    tokens_out?: number;
  };
  tags?: string[];
}

export interface TestRunRecord {
  run_id: string;
  timestamp: string;
  git_sha: string;
  git_branch?: string;
  status?: "passed" | "warning" | "failed";
  total_cases: number;
  passed_cases: number;
  warned_cases: number;
  failed_cases: number;
  violations: {
    policy_id: string;
    severity: string;
    message: string;
  }[];
}
