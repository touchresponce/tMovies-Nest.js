import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserDto {
  // @IsEmail(
  //   {},
  //   {
  //     message: 'Некорректный формат электронной почты.',
  //   },
  // )
  @IsEmail()
  @IsOptional()
  email: string;

  // @IsString({
  //   message: 'Пароль должен быть строкой.',
  // })

  @IsString()
  @IsOptional()
  @MinLength(6, {
    message: 'Пароль должен быть не менее 6 символов.',
  })
  password: string;
}
