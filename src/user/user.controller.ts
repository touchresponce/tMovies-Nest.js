import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth()
  async profile(@CurrentUser('id') id: string) {
    return this.userService.getProfile(id);
  }

  @Put('/update')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  async updateProfile(@CurrentUser('id') id: string, @Body() dto: UserDto) {
    return this.userService.update(id, dto);
  }

  @Put('/save')
  @HttpCode(200)
  @Auth()
  async saveMovie(
    @CurrentUser('id') userId: string,
    @Body('movieId') movieId: number,
  ) {
    return this.userService.saveMovie(userId, movieId);
  }

  @Put('/delete')
  @HttpCode(200)
  @Auth()
  async deleteMovie(
    @CurrentUser('id') userId: string,
    @Body('movieId') movieId: number,
  ) {
    return this.userService.deleteMovie(userId, movieId);
  }
}
