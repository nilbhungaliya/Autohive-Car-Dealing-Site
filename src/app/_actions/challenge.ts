"use server"

import { auth } from "@/auth";
import genericRateLimit from "@/lib/rate-limiter";

export const resendChallenge = async () => {
    const limitError = await genericRateLimit("otp");
    if (limitError) return limitError;

    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            message: "Unauthorized"
        }
    }

    


}
