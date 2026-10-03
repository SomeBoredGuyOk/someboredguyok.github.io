export interface GoogleSheetsResponse {
  range: string;
  majorDimension: 'ROWS' | 'COLUMNS';
  values: string[][]; // The 2D array representing rows and columns
}