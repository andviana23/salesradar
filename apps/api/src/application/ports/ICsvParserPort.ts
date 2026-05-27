export interface ParsedRow {
  [column: string]: string
}

export interface ICsvParserPort {
  parse(buffer: Buffer): Promise<ParsedRow[]>
  getHeaders(buffer: Buffer): Promise<string[]>
}
