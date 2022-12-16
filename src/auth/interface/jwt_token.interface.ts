export interface jwtTokenData {
  userEmail: string;
  sub: number;
  iat?: number;
  exp?: number;
}
