import { DataSource } from '../entities/DataSource'

export interface IDataSourceRepository {
  findById(id: string): Promise<DataSource | null>
  findByUserId(userId: string): Promise<DataSource[]>
  findAllActive(): Promise<DataSource[]>
  save(source: DataSource): Promise<DataSource>
  update(source: DataSource): Promise<DataSource>
  delete(id: string): Promise<void>
}
