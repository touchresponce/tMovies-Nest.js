import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Некорректный формат электронной почты.',
    },
  )
  email: string;

  @IsOptional()
  @IsString({
    message: 'Пароль должен быть строкой.',
  })
  @MinLength(6, {
    message: 'Пароль должен быть не менее 6 символов.',
  })
  password: string;
}
