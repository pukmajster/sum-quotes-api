import {MigrationInterface, QueryRunner} from "typeorm";

export class makequotenullable1649085474020 implements MigrationInterface {
    name = 'makequotenullable1649085474020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "quote" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "quote" SET NOT NULL`);
    }

}
