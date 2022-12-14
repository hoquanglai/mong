import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox',
  'client_id': process.env.PAY_CLIENT_ID,
  'client_secret': process.env.PAY_CLIENT_SECRET
});


@Injectable()
export class PaymentService {

    async pay(res) : Promise<any> {
        try {
            const create_payment_json = {
              "intent": "sale",
              "payer": {
                  "payment_method": "paypal"
              },
              "redirect_urls": {
                  "return_url": "http://localhost:3000/payment/success",
                  "cancel_url": "http://localhost:3000/payment/cancel"
              },
              "transactions": [{
                  "item_list": {
                      "items": [{
                          "name": "Red Sox Hat",
                          "sku": "001",
                          "price": "25.00",
                          "currency": "USD",
                          "quantity": 1
                      }]
                  },
                  "amount": {
                      "currency": "USD",
                      "total": "25.00"
                  },
                  "description": "Hat for the best team ever"
              }]
            };

            await paypal.payment.create(create_payment_json, function (error, payment,  HttpStatus) {
              if (error) {
                  throw error;
              } else {
                  for(let i = 0;i < payment.links.length;i++){
                    if(payment.links[i].rel === 'approval_url'){
                        res.redirect(payment.links[i].href);
                    }
                  }
              }
            });
          } catch (error) {
            console.log(error);
            throw error;
          }
    }

    async success(query): Promise<any> {
        try {
            const { PayerID, paymentId } = query;
            const execute_payment_json = {
            "payer_id": PayerID,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                }
            }]
            };
            await paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                    console.log(error.response);
                    throw error;
                }
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
