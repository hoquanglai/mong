import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus ,Redirect, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Response, Request } from 'express';


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/pay')
  async create(@Res() res:Response, @Body() createPaymentDto: CreatePaymentDto) {
    try {
      await this.paymentService.pay(res);
      res.status(HttpStatus.OK);
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.BAD_REQUEST).send(`Can't pay.`);
    }
  }

  @Get('/success')
  async success(@Query() query,@Res() res:Response) {
    try {
      await this.paymentService.success(query);
      res.status(HttpStatus.OK);
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.BAD_REQUEST).send(`Can't pay.`);
    }
  }

  @Get('cancel')
  cancel(@Res() req: Request,@Res() res:Response) {
    console.log('Cancelled');
    res.send('Cancelled');
  }
}
