export interface IUserSearchResponse {
  results: UserSearch[];
}
export class UserSearch {
  constructor(
    public userId: number,
    public id: number,
    public title: string,
    public completed: boolean
  ) {}
}
