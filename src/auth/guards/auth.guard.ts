import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
  ) { }

  /* Esto es lo que se crea por defecto al ejecutar el comando
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  } */
  /* Pero yo quiero esto */
  canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest()

    /* Extraemos el token */
    const token = this.extractTokenFromHeader(request);
    console.log(token);


    return Promise.resolve(true);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}
