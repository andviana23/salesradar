export type SourceType = 'csv' | 'google_sheets'

export interface ColumnMapping {
  date: string
  value: string
  product?: string
  seller?: string
}

export interface DataSourceProps {
  id: string
  userId: string
  type: SourceType
  url?: string
  columns: ColumnMapping
  lastSync?: Date
  createdAt: Date
}

export class DataSource {
  private constructor(private readonly props: DataSourceProps) {}

  static create(props: DataSourceProps): DataSource {
    if (props.type === 'google_sheets' && !props.url) {
      throw new Error('Google Sheets source requires a URL')
    }
    return new DataSource(props)
  }

  get id() { return this.props.id }
  get userId() { return this.props.userId }
  get type() { return this.props.type }
  get url() { return this.props.url }
  get columns() { return this.props.columns }
  get lastSync() { return this.props.lastSync }
  get createdAt() { return this.props.createdAt }

  markSynced(): DataSource {
    return new DataSource({ ...this.props, lastSync: new Date() })
  }

  get isCsv() { return this.props.type === 'csv' }
  get isSheets() { return this.props.type === 'google_sheets' }
}
