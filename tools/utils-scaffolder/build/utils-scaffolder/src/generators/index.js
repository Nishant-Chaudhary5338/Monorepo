// ============================================================================
// GENERATORS - Barrel export for all module generators
// ============================================================================
import { generateApiModule } from './api.js';
import { generateValidationModule } from './validation.js';
import { generateSearchModule } from './search.js';
import { generatePaginationModule } from './pagination.js';
import { generateAuthModule } from './auth.js';
import { generateHooksModule } from './hooks.js';
import { generatePerformanceModule } from './performance.js';
import { generateMediaModule } from './media.js';
import { generateObjectModule } from './object.js';
import { generateDateModule } from './date.js';
import { generateStorageModule } from './storage.js';
import { generateUrlModule } from './url.js';
import { generateClipboardModule } from './clipboard.js';
import { generateLoggerModule } from './logger.js';
import { generateErrorModule } from './error.js';
import { generateCacheModule } from './cache.js';
import { generateStringModule } from './string.js';
import { generateArrayModule } from './array.js';
import { generateNumberModule } from './number.js';
import { generateTypesModule } from './types.js';
import { generateConstantsModule } from './constants.js';
export const generators = {
    api: generateApiModule,
    validation: generateValidationModule,
    search: generateSearchModule,
    pagination: generatePaginationModule,
    auth: generateAuthModule,
    hooks: generateHooksModule,
    performance: generatePerformanceModule,
    media: generateMediaModule,
    object: generateObjectModule,
    date: generateDateModule,
    storage: generateStorageModule,
    url: generateUrlModule,
    clipboard: generateClipboardModule,
    logger: generateLoggerModule,
    error: generateErrorModule,
    cache: generateCacheModule,
    string: generateStringModule,
    array: generateArrayModule,
    number: generateNumberModule,
    types: generateTypesModule,
    constants: generateConstantsModule,
};
export const ALL_MODULE_NAMES = Object.keys(generators);
//# sourceMappingURL=index.js.map