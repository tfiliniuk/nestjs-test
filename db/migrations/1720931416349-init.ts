import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1720931416349 implements MigrationInterface {
    name = 'Init1720931416349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "twoFASecret" text, "enable2FA" boolean NOT NULL DEFAULT false, "apiKey" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "playlists" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_a4597f4189a75d20507f3f7ef0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "songs" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "releasedDate" date NOT NULL, "duration" TIME NOT NULL, "lyrics" text NOT NULL, "playListId" integer, CONSTRAINT "PK_e504ce8ad2e291d3a1d8f1ea2f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "artists" ("id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "REL_f7bd9114dc2849a90d39512911" UNIQUE ("userId"), CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "songs_artist" ("songsId" integer NOT NULL, "artistsId" integer NOT NULL, CONSTRAINT "PK_a8151bc57a6016b2af39b92e831" PRIMARY KEY ("songsId", "artistsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_567ffea799196e80e6a84030a0" ON "songs_artist" ("songsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_627ae1fba9bf3af42079b946fc" ON "songs_artist" ("artistsId") `);
        await queryRunner.query(`ALTER TABLE "playlists" ADD CONSTRAINT "FK_708a919e9aa49019000d9e9b68e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs" ADD CONSTRAINT "FK_54cf41bc33d524b206b93581950" FOREIGN KEY ("playListId") REFERENCES "playlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "artists" ADD CONSTRAINT "FK_f7bd9114dc2849a90d39512911b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs_artist" ADD CONSTRAINT "FK_567ffea799196e80e6a84030a08" FOREIGN KEY ("songsId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "songs_artist" ADD CONSTRAINT "FK_627ae1fba9bf3af42079b946fc7" FOREIGN KEY ("artistsId") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs_artist" DROP CONSTRAINT "FK_627ae1fba9bf3af42079b946fc7"`);
        await queryRunner.query(`ALTER TABLE "songs_artist" DROP CONSTRAINT "FK_567ffea799196e80e6a84030a08"`);
        await queryRunner.query(`ALTER TABLE "artists" DROP CONSTRAINT "FK_f7bd9114dc2849a90d39512911b"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_54cf41bc33d524b206b93581950"`);
        await queryRunner.query(`ALTER TABLE "playlists" DROP CONSTRAINT "FK_708a919e9aa49019000d9e9b68e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_627ae1fba9bf3af42079b946fc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_567ffea799196e80e6a84030a0"`);
        await queryRunner.query(`DROP TABLE "songs_artist"`);
        await queryRunner.query(`DROP TABLE "artists"`);
        await queryRunner.query(`DROP TABLE "songs"`);
        await queryRunner.query(`DROP TABLE "playlists"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
