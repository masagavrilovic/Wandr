import { User } from "../entities/user.entity";

export class UserResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;

    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
    }
}

export class UserSummaryDto {
    firstName: string;
    lastName: string;

    constructor(user: User) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
    }
}