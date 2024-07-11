import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePhone1720325418493 implements MigrationInterface {
    name = 'RemovePhone1720325418493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" text`);
    }

}
