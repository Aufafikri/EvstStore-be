import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    public async validate(payload: any) {
        const user = await this.usersService.getUserById(payload.sub)

        if(!user) {
            throw new UnauthorizedException()
        }

        return { ...user, roles: [user.role] }
        // { id: user.id, email: user.email, role: user.role }
    }
}