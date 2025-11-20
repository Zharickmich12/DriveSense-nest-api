import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1763600958554 implements MigrationInterface {
    name = 'InitMigration1763600958554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL DEFAULT 'user', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cities\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 0, \`description\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a0ae8d83b7d32359578c486e7f\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user\` varchar(255) NULL, \`method\` varchar(255) NULL, \`endpoint\` varchar(255) NULL, \`body\` text NULL, \`vehiclePlate\` varchar(255) NULL, \`result\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`cityId\` int NULL, \`vehicleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vehicles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`licensePlate\` varchar(20) NOT NULL, \`brand\` varchar(50) NOT NULL, \`model\` varchar(50) NOT NULL, \`year\` int NOT NULL, \`type\` varchar(255) NOT NULL DEFAULT 'car', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, UNIQUE INDEX \`IDX_79a273823977d25c7523162cd5\` (\`licensePlate\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dayOfWeek\` varchar(255) NOT NULL, \`startTime\` varchar(255) NOT NULL, \`endTime\` varchar(255) NOT NULL, \`restrictedDigits\` text NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`cityId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`logs\` ADD CONSTRAINT \`FK_b64ea732fe8fcaf88706e104107\` FOREIGN KEY (\`cityId\`) REFERENCES \`cities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`logs\` ADD CONSTRAINT \`FK_5c0c73e3331c274e13ae0cb9d73\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` ADD CONSTRAINT \`FK_20f139b9d79f917ef735efacb00\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rules\` ADD CONSTRAINT \`FK_9e40bd4a3cc196688c1e694536e\` FOREIGN KEY (\`cityId\`) REFERENCES \`cities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rules\` DROP FOREIGN KEY \`FK_9e40bd4a3cc196688c1e694536e\``);
        await queryRunner.query(`ALTER TABLE \`vehicles\` DROP FOREIGN KEY \`FK_20f139b9d79f917ef735efacb00\``);
        await queryRunner.query(`ALTER TABLE \`logs\` DROP FOREIGN KEY \`FK_5c0c73e3331c274e13ae0cb9d73\``);
        await queryRunner.query(`ALTER TABLE \`logs\` DROP FOREIGN KEY \`FK_b64ea732fe8fcaf88706e104107\``);
        await queryRunner.query(`DROP TABLE \`rules\``);
        await queryRunner.query(`DROP INDEX \`IDX_79a273823977d25c7523162cd5\` ON \`vehicles\``);
        await queryRunner.query(`DROP TABLE \`vehicles\``);
        await queryRunner.query(`DROP TABLE \`logs\``);
        await queryRunner.query(`DROP INDEX \`IDX_a0ae8d83b7d32359578c486e7f\` ON \`cities\``);
        await queryRunner.query(`DROP TABLE \`cities\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
