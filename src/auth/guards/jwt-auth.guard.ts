import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        if (err || !user) {
          throw err || new UnauthorizedException({ "statusCode": 401,
            "message": 'You need to be logged-in to access this resource.',
            "error": "Unauthorized"});
        }
        return user;
      }
}
