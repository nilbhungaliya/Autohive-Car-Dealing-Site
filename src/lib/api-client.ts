import ky,{type Options} from "ky";

export const api = {
    get: <T>(path: string, options?: Options) => ky.get(path, options).json<T>(),
    post: <T>(path: string, options?: Options) => ky.post(path, options).json<T>(),
}


