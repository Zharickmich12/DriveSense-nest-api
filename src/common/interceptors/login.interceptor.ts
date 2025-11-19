import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { LogsService } from '../../logs/logs.service'; // Ajusta la ruta a tu LogsService
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // Inyectamos el servicio de Logs para poder guardar los datos
  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    // 1. Capturar datos de la petición
    const method = req.method;
    const endpoint = req.originalUrl;
    
    // Usamos 'undefined' en lugar de 'null' para coincidir con el DTO (como corregimos antes)
    const body = req.body ? JSON.stringify(req.body) : undefined; 
    
    // Asumimos que el usuario está en req.user (si usas autenticación)
    const user = req.user?.email || 'anonymous'; 

    // 2. Ejecutar la petición (next.handle()) y usar tap() para registrar al finalizar
    return next.handle().pipe(
      tap(() => {
        // Esta parte se ejecuta DESPUÉS de que la petición fue procesada por el controlador
        
        // 3. Crear el log con los datos capturados
        this.logsService.create({
          user,
          method,
          endpoint,
          body,
        });
      }),
    );
  }
}
