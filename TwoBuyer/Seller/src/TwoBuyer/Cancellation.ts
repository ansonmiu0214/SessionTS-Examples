export enum Receive {
    NORMAL = 1000,
    CLIENT_BROWSER_CLOSED = 1001,
    LOGICAL_ERROR = 4001,
};

export enum Emit {
    CLIENT_BROWSER_CLOSED = 4000,
    LOGICAL_ERROR = 4001,
    ROLE_OCCUPIED = 4002,
};

export const toChannel = (role: string, reason?: any) => ({
    role,
    reason: reason instanceof Error ? reason.message : reason,
});