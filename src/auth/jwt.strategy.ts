import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * @class JwtStrategy
 * @description Estrategia Passport para validar tokens JWT.
 * @extends PassportStrategy
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET_KEY') || ''
        });
    }

     /**
     * @method validate
     * @description Retorna los datos del payload JWT después de ser verificados.
     * @param payload - Información contenida en el token JWT.
     * @returns Objeto con los datos básicos del usuario.
     */
    async validate(payload: any) {
        return { id: payload.sub, email: payload.email, role: payload.role};
    }

}
