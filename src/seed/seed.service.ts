import { Injectable } from '@nestjs/common';
import { seedData } from 'db/seeds/data-seed';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(private readonly connection: DataSource) {}

  async seed(): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      await seedData(manager);

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log('Error during database seeding', error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
