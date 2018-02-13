export interface Condition {
    name: string;
}

export async function fetchConditions(): Promise<Condition[]> {
    return [
        { name: 'Poisoned' },
        { name: 'Sleeping' },
        { name: 'Bleeding' },
    ];
}
