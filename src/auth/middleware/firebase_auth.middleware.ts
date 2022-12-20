import * as firebase from 'firebase-admin';
import * as serviceAccount from '../firebaseServiceAccount.json';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

const firebase_params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

@Injectable()
export class FireBaseAuthMiddleware implements NestMiddleware {
  private defaultApp: any;

  constructor() {
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebase_params),
      databaseURL:
        'https://mongauth-default-rtdb.asia-southeast1.firebasedatabase.app/',
    });
  }
  async use(req: Request, res: Response, next: (error?: any) => void) {
    const token = req.body.access_token;
    console.log({ token: req.body.access_token });
    if (token != null && token !== '') {
      // console.log({ Auth: token.slice(7) });
      await this.defaultApp
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
          console.log({ decodedToken });
          const user = {
            email: decodedToken.email,
            avatar: decodedToken.picture,
            name: decodedToken.name,
          };
          req.user = user;
          // next();
        })
        .catch((err) => {
          console.log({ err });
          next(err);
        });
    }
    next();
  }
  private accessDenied(url: string, res: Response): void {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      message: 'Access denied',
    });
  }
}
