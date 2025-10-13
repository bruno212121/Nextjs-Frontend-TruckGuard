export type RegisterDto = {
    name: string;
    surname: string;
    email: string;
    password: string;
    phone: string;
}

export type User = {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
}

export type LoginResponse = {
    access_token: string;
    id: number;
    name: string;
    surname: string;
    email: string;
}

