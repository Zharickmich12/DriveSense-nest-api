import { Body, Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './jwt.guard';

/**
 * @class AuthController
 * @description Controlador para manejar la autenticación de usuarios (registro, login y perfil).
 * @route /auth
 */
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * @method register
     * @description Registra un nuevo usuario.
     * @route POST /auth/register
     * @param data - Datos del usuario a registrar.
     */
    @Post('register')
    register(@Body() data: CreateUserDTO) {
        return this.authService.register(data);
    }

    /**
    * @method login
    * @description Inicia sesión con credenciales del usuario.
    * @route POST /auth/login
    * @param data - Credenciales de acceso.
    */
    @Post('login')
    login(@Body() data: LoginDTO) {
        return this.authService.login(data);
    }

    /**
    * @method getProfile
    * @description Obtiene el perfil del usuario autenticado mediante JWT.
    * @route GET /auth/profile
    * @guard JwtAuthGuard
    * @returns Información del usuario autenticado.
    */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}