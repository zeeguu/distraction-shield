import * as uuid from 'uuid'

export function generateUUID() {
    let UUID = uuid.v1();
    return UUID;
}