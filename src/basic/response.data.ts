export class DefaultResponse {
  message: string;
  data?: any;
  public constructor(message: string, data?: any) {
    this.message = message;
    this.data = data;
    console.log({ data });
  }
}
