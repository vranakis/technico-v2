export type User = {
    id?: string;
    name?: string;
    surname?: string;
    vatNumber?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
    type?: string;
}

export type UserUpdate = {
    name?: string;
    surname?: string;
    address?: string;
    phoneNumber?: string;
}

export type UserResponse = {
    id: string;
    name?: string;
    surname?: string;
}

export type UserResponse_Upgrade = {
    name?: string;
    surname?: string;
    email?: string;
    vatNumber?: string;
}

