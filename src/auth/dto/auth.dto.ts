import { IsEmail, IsString, MinLength } from 'class-validator';

const pasLength = 6;

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString({
    message: 'Пароль должен быть строкой.',
  })
  @MinLength(pasLength, {
    message: `Пароль должен быть не менее ${pasLength} символов.`,
  })
  password: string;
}
