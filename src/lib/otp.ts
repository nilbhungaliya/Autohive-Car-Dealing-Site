import { bcryptPasswordHash } from "./bcrypt";
import { redis } from "./redis-store";

const REDIS_PREFIX = "otp";

export async function issuChallenge(userId: string, email: string) {
    const array = new Uint32Array(1);
    const code = (crypto.getRandomValues(array)[0] % 9000000) + 1000000;

    const hash = await bcryptPasswordHash(code.toString());
    const challenge = {codeHash: hash, email};
    
    await redis.setex(`${REDIS_PREFIX}:uid-${userId}`, 10*60, challenge);
    
}
