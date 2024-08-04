class UniqueUUIDGenerator {
  constructor() {
    this.generatedUUIDs = new Set();
  }

  generateRandomBytes(length) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
  }

  generateUniqueUUID() {
    let uniqueUUID;
    do {
      uniqueUUID = this.generateUUID(this.generateRandomBytes(16));
    } while (this.generatedUUIDs.has(uniqueUUID));

    this.generatedUUIDs.add(uniqueUUID);
    return uniqueUUID;
  }

  generateUUID(randomBytes) {

    randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;

    randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;

    const hexChars = '0123456789abcdef';
    let uuid = '';

    for (let i = 0; i < 16; i++) {
      uuid += hexChars[randomBytes[i] >> 4];
      uuid += hexChars[randomBytes[i] & 0xf];

      if (i === 3 || i === 5 || i === 7 || i === 9) {
        uuid += '-';
      }
    }

    return uuid;
  }
}

const generator = new UniqueUUIDGenerator();

console.log(generator.generateUniqueUUID());
console.log(generator.generateUniqueUUID());
console.log(generator.generateUniqueUUID());
console.log(generator.generateUniqueUUID());
console.log(generator.generateUniqueUUID());
console.log(generator.generateUniqueUUID());
