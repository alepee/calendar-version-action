interface ExecOptions {
    cwd?: string;
    silent?: boolean;
}
export declare class GitExecutor {
    static execute(command: string[], options?: ExecOptions): Promise<string>;
}
export {};
