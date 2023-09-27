export interface VersionModel {
    version: {
        major: number;
        minor: number;
    },
    release: number;
    timestamp: number;
    developer: string;
}
