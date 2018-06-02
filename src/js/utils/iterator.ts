export function* enumerate<T>(iterable: Iterable<T>, start: number = 0): Iterable<[number, T]> {
    let counter = start;
    for (const elem of iterable) {
        yield [counter, elem];
        counter += 1;
    }
}
