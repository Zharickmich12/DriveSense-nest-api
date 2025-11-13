import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";

/**
 * @class RolesGuard
 * @description Guardia personalizada que valida el rol del usuario autenticado.
 * @implements CanActivate
 * @throws ForbiddenException - Si el usuario no está autenticado o no tiene permisos.
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

     /**
     * @method canActivate
     * @description Verifica si el usuario tiene los roles requeridos para acceder a la ruta.
     * @param context - Contexto de ejecución HTTP.
     * @returns true si el usuario tiene permisos, lanza excepción si no.
     */
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!requiredRoles) return true;

        const { user } = context.switchToHttp().getRequest();

        if (!user) throw new ForbiddenException ('Usuario no autenticado')

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException ('No tiene permiso para acceder a este ruta')
        }
        return true;
    }
}