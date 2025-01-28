export interface IJwtItem {
  sub: string;
  jti: string;
  iat: number;
  rol: string;
  id: string;
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
}
