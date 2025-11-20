import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1763600142058 implements MigrationInterface {
    name = 'InitMigration1763600142058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user\` varchar(255) NULL, \`method\` varchar(255) NULL, \`endpoint\` varchar(255) NULL, \`body\` text NULL, \`vehiclePlate\` varchar(255) NULL, \`result\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`cityId\` int NULL, \`vehicleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` DROP FOREIGN KEY \`FK_20f139b9d79f917ef735efacb00\``);
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cities\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`rules\` DROP FOREIGN KEY \`FK_9e40bd4a3cc196688c1e694536e\``);
        await queryRunner.query(`ALTER TABLE \`rules\` CHANGE \`cityId\` \`cityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` ADD CONSTRAINT \`FK_20f139b9d79f917ef735efacb00\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`logs\` ADD CONSTRAINT \`FK_b64ea732fe8fcaf88706e104107\` FOREIGN KEY (\`cityId\`) REFERENCES \`cities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`logs\` ADD CONSTRAINT \`FK_5c0c73e3331c274e13ae0cb9d73\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rules\` ADD CONSTRAINT \`FK_9e40bd4a3cc196688c1e694536e\` FOREIGN KEY (\`cityId\`) REFERENCES \`cities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rules\` DROP FOREIGN KEY \`FK_9e40bd4a3cc196688c1e694536e\``);
        await queryRunner.query(`ALTER TABLE \`logs\` DROP FOREIGN KEY \`FK_5c0c73e3331c274e13ae0cb9d73\``);
        await queryRunner.query(`ALTER TABLE \`logs\` DROP FOREIGN KEY \`FK_b64ea732fe8fcaf88706e104107\``);
        await queryRunner.query(`ALTER TABLE \`vehicles\` DROP FOREIGN KEY \`FK_20f139b9d79f917ef735efacb00\``);
        await queryRunner.query(`ALTER TABLE \`rules\` CHANGE \`cityId\` \`cityId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rules\` ADD CONSTRAINT \`FK_9e40bd4a3cc196688c1e694536e\` FOREIGN KEY (\`cityId\`) REFERENCES \`cities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cities\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` ADD CONSTRAINT \`FK_20f139b9d79f917ef735efacb00\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE \`logs\``);
    }

}
