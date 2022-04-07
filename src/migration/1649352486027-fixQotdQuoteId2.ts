import {MigrationInterface, QueryRunner} from "typeorm";

export class fixQotdQuoteId21649352486027 implements MigrationInterface {
    name = 'fixQotdQuoteId21649352486027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qotd" DROP COLUMN "quoteId"`);
        await queryRunner.query(`ALTER TABLE "qotd" ADD "quoteId" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qotd" DROP COLUMN "quoteId"`);
        await queryRunner.query(`ALTER TABLE "qotd" ADD "quoteId" character varying NOT NULL`);
    }

}
