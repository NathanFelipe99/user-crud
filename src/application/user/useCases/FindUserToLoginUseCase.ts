import { compare, hash } from "bcrypt";
import { IAuthInput } from "src/application/auth/DTOs/IAuthInput";
import { IAuthOutput } from "src/application/auth/DTOs/IAuthOutput";
import { IUserRepository } from "src/base/user.repository";
import { AppError } from "src/shared/errors/AppError";

export class FindUserToLoginUseCase {
    constructor(
        private readonly _userRepository: IUserRepository
    ) { }

    async execute(data: IAuthInput): Promise<IAuthOutput> {
        const foundUser = await this._userRepository.getUserCredentials(data.username);
        if (!foundUser) throw new AppError("User not found!", 401);
        const dataPasswordHashed = await hash(data.password, 10);
        const isPasswordValid = await compare(dataPasswordHashed, foundUser.password);
        if (!isPasswordValid) throw new AppError("Invalid credentials!", 401);
        delete foundUser.password;

        return foundUser;
    }
}