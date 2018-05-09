export function cancellable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        promise.then(
            (...values: any[]) => (signal.aborted ? undefined : resolve(...values)),
            (...values: any[]) => (signal.aborted ? undefined : reject(...values)),
        );
    });
}
