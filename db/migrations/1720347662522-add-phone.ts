import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhone1720347662522 implements MigrationInterface {
    name = 'AddPhone1720347662522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

}
