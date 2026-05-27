export interface SheetRow {
  [column: string]: string
}

export interface IGoogleSheetsPort {
  fetchRows(sheetUrl: string): Promise<SheetRow[]>
  getHeaders(sheetUrl: string): Promise<string[]>
}
