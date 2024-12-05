declare module 'pdf-parse' {
  interface PDFParseOptions {
    pagerender?: (pageData: any) => Promise<string>;
    max?: number;
  }

  interface PDFParseResult {
    numpages: number;
    numrender: number;
    info: any;
    text: string;
  }

  function pdfParse(
    data: Buffer | string, 
    options?: PDFParseOptions
  ): Promise<PDFParseResult>;

  export = pdfParse;
}
