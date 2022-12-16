import { DefaultResponse } from '../basic/response.data';
export class SuccessResponse extends DefaultResponse {
  constructor(message: string, data: any) {
    super(message, data);
  }
}
