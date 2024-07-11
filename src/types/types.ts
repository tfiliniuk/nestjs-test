export interface PayloadType {
  userId: number;
  email: string;
  artistId?: number;
}

export type enable2FAType = {
  secret: string;
};
