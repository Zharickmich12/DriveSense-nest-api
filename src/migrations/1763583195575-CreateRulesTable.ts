import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRulesTable1673086827456 implements MigrationInterface {
    name = 'CreateRulesTable1673086827456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`rules\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`dayOfWeek\` varchar(255) NOT NULL,
                \`startTime\` varchar(255) NOT NULL,
                \`endTime\` varchar(255) NOT NULL,
                \`restrictedDigits\` text NOT NULL,
                \`isActive\` tinyint NOT NULL DEFAULT 1,
                \`cityId\` int NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`FK_rules_city\` FOREIGN KEY (\`cityId\`) REFERENCES \`cities\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`rules\``);
    }
}
