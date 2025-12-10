export interface UserEntity {
  id: string;
  nickname: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  auth_user_id: string | null;
  registered_at: string | null;
}
