export interface ComponentEntry {
    name: string;
    importPath: string;
    propsPreview: string;
    hasVariants: boolean;
}
export interface UICatalog {
    packageName: string;
    componentsPath: string;
    components: ComponentEntry[];
    totalCount: number;
}
export declare function getUICatalog(componentsDir: string, packageName?: string): UICatalog;
export declare function formatCatalogForPrompt(catalog: UICatalog): string;
//# sourceMappingURL=uiCatalog.d.ts.map