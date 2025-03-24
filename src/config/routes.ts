import { MultiStepForEnum } from "./types";

export const routes = {
    home : "/",
    singleClassified : (slug: string) => `/inventory/${slug}`,
    reserve : (slug: string, step: MultiStepForEnum) => `/inventory/${slug}/reserve?step=${step}`,
}
