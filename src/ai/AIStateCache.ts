export type AIStateCache = {
    key: string;
    read: (key: string) => unknown;
    write: (key: string, value: unknown) => void;
};

export const getAIStateCacheKey = (stateCache: AIStateCache, name: string) => `${stateCache.key}/${name}`;
