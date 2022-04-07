import {MigrationInterface, QueryRunner} from "typeorm";

export class createQotd1649351664516 implements MigrationInterface {
    name = 'createQotd1649351664516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "qotd" ("id" SERIAL NOT NULL, "quoteId" integer NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_27fe314921ef06c4bd224da7f5d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "qotd"`);
    }

}
