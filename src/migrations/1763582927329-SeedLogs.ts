import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLogsTableIfNotExists1763582927329 implements MigrationInterface {
    name = 'CreateLogsTableIfNotExists1763582927329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear la tabla 'logs' solo si no existe
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS logs (
                id INT NOT NULL AUTO_INCREMENT,
                user VARCHAR(255) NULL,
                method VARCHAR(255) NULL,
                endpoint VARCHAR(255) NULL,
                body TEXT NULL,
                vehiclePlate VARCHAR(255) NULL,
                result VARCHAR(255) NULL,
                createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                cityId INT NULL,
                vehicleId INT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB
        `);

        // Agregar relaciones con City y Vehicle si existen las tablas
        await queryRunner.query(`
            ALTER TABLE logs 
            ADD CONSTRAINT IF NOT EXISTS FK_logs_city FOREIGN KEY (cityId) REFERENCES cities(id) ON DELETE NO ACTION ON UPDATE NO ACTION
        `).catch(() => {}); // Ignora si la tabla 'cities' no existe aún

        await queryRunner.query(`
            ALTER TABLE logs 
            ADD CONSTRAINT IF NOT EXISTS FK_logs_vehicle FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE NO ACTION ON UPDATE NO ACTION
        `).catch(() => {}); // Ignora si la tabla 'vehicles' no existe aún
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar la tabla logs si existe
        await queryRunner.query(`DROP TABLE IF EXISTS logs`);
    }
}
