import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(dto: AuthDto) {
    const user = {
      email: dto.email,
      password: await hash(dto.password),
    };

    return this.prisma.user.create({
      data: user,
    });
  }

  async update(id: string, dto: UserDto) {
    let data = dto;

    if (dto.password) {
      data = { ...dto, password: await hash(dto.password) };
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async saveMovie(userId: string, movieId: number) {
    // Проверяем, существует ли уже фильм
    let movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      // Если фильма нет, создаем новый
      movie = await this.prisma.movie.create({
        data: { id: movieId },
      });
    }

    // Пытаемся найти существующую связь между пользователем и фильмом
    const existingUserMovie = await this.prisma.userMovie.findUnique({
      where: {
        userId_movieId: { userId: userId, movieId: movie.id },
      },
    });

    // Если связь не найдена, создаем новую
    if (!existingUserMovie) {
      await this.prisma.userMovie.create({
        data: {
          userId: userId,
          movieId: movie.id,
        },
      });
    }

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        savedMovies: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            movie: true,
          },
        },
      },
    });

    return updatedUser;
  }

  async deleteMovie(userId: string, movieId: number) {
    await this.prisma.userMovie.delete({
      where: {
        userId_movieId: { userId: userId, movieId: movieId },
      },
    });

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        savedMovies: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            movie: true,
          },
        },
      },
    });

    return updatedUser;
  }

  async getProfile(id: string) {
    const profile = await this.prisma.user.findUnique({
      where: { id },
      include: {
        savedMovies: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            movie: true,
          },
        },
      },
    });
    return profile;
  }
}
