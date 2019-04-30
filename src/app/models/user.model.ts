export interface User {
  username: string,
  password: string,
  databaseUrl: string,
  token: [{
    token: string
  }]
}
