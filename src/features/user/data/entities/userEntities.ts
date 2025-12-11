export interface UserEntity {
  id: string;
  nickname: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  registered_at: string | null;
}
