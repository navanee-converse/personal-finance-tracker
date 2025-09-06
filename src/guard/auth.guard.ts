import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
@Injectable()
export class JwtAUthGuard extends AuthGuard('jwt') {
    // canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        
    // }
}
