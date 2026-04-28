BEGIN;

-- 1) next_auth.users의 프로필 정보를 기존 public.users 행에 병합한다.
UPDATE public.users AS pu
SET
  name = COALESCE(na.name, pu.name),
  email = COALESCE(na.email, pu.email),
  email_verified = na."emailVerified",
  image = COALESCE(na.image, pu.image)
FROM next_auth.users AS na
WHERE pu.auth_user_id = na.id;

-- 2) 매핑되지 않은 next_auth.users가 있으면 public.users에 신규 생성한다.
INSERT INTO public.users (id, name, email, email_verified, image)
SELECT na.id, na.name, na.email, na."emailVerified", na.image
FROM next_auth.users AS na
LEFT JOIN public.users AS pu ON pu.auth_user_id = na.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO UPDATE
SET
  name = COALESCE(EXCLUDED.name, public.users.name),
  email = COALESCE(EXCLUDED.email, public.users.email),
  email_verified = EXCLUDED.email_verified,
  image = COALESCE(EXCLUDED.image, public.users.image);

-- 3) 계정/세션/검증 토큰을 public auth 테이블로 이관한다.
INSERT INTO public.accounts (
  user_id,
  type,
  provider,
  provider_account_id,
  refresh_token,
  access_token,
  expires_at,
  token_type,
  scope,
  id_token,
  session_state
)
SELECT
  a."userId",
  a.type,
  a.provider,
  a."providerAccountId",
  a.refresh_token,
  a.access_token,
  a."expiresAt"::integer,
  a.token_type,
  a.scope,
  a.id_token,
  a.session_state
FROM next_auth.accounts AS a
ON CONFLICT (provider, provider_account_id) DO UPDATE
SET
  user_id = EXCLUDED.user_id,
  type = EXCLUDED.type,
  refresh_token = EXCLUDED.refresh_token,
  access_token = EXCLUDED.access_token,
  expires_at = EXCLUDED.expires_at,
  token_type = EXCLUDED.token_type,
  scope = EXCLUDED.scope,
  id_token = EXCLUDED.id_token,
  session_state = EXCLUDED.session_state;

INSERT INTO public.sessions (session_token, user_id, expires)
SELECT s."sessionToken", s."userId", s.expires
FROM next_auth.sessions AS s
ON CONFLICT (session_token) DO UPDATE
SET
  user_id = EXCLUDED.user_id,
  expires = EXCLUDED.expires;

INSERT INTO public.verification_tokens (identifier, token, expires)
SELECT vt.identifier, vt.token, vt.expires
FROM next_auth.verification_tokens AS vt
ON CONFLICT (identifier, token) DO NOTHING;

-- 4) legacy 연결 컬럼 제거 후 next_auth 스키마를 삭제한다.
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_auth_user_id_fkey;
ALTER TABLE public.users DROP COLUMN IF EXISTS auth_user_id;

ALTER TABLE public.users_v2 DROP CONSTRAINT IF EXISTS users_v2_auth_user_id_fkey;
ALTER TABLE public.users_v2 DROP COLUMN IF EXISTS auth_user_id;

DROP TABLE IF EXISTS next_auth.accounts CASCADE;
DROP TABLE IF EXISTS next_auth.sessions CASCADE;
DROP TABLE IF EXISTS next_auth.verification_tokens CASCADE;
DROP TABLE IF EXISTS next_auth.users CASCADE;
DROP SCHEMA IF EXISTS next_auth;

COMMIT;
