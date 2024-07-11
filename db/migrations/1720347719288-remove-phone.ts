import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePhone1720347719288 implements MigrationInterface {
    name = 'RemovePhone1720347719288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" text`);
    }

}
