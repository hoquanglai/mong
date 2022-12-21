export interface jwtTokenData {
  email: string;
  sub: number;
  iat?: number;
  exp?: number;
}
