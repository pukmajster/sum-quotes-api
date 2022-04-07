import {MigrationInterface, QueryRunner} from "typeorm";

export class fixQotdQuoteId1649352459098 implements MigrationInterface {
    name = 'fixQotdQuoteId1649352459098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qotd" DROP COLUMN "quoteId"`);
        await queryRunner.query(`ALTER TABLE "qotd" ADD "quoteId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qotd" DROP COLUMN "quoteId"`);
        await queryRunner.query(`ALTER TABLE "qotd" ADD "quoteId" integer NOT NULL`);
    }

}
