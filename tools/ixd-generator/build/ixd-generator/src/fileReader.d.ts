export interface DesignFileResult {
    base64: string;
    mimeType: string;
    width: number;
    height: number;
    page: number;
    totalPages: number;
    source: 'image' | 'pdf';
}
export declare function readDesignFile(filePath: string, pageNumber?: number): Promise<DesignFileResult>;
export declare function getPdfPageCount(filePath: string): number;
//# sourceMappingURL=fileReader.d.ts.map