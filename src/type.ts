export enum AIProviderType {
    DEEP_SEEK = "DEEP_SEEK",
    OPEN_AI = "OPEN_AI",
    QWEN = "QWEN",
    GOOGLE_GEMINI = "GOOGLE_GEMINI",
}

export type EditorUser = {
    nickname: string,
    avatarUrl: string,
}