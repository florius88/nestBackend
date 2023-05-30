import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User, UserSchema } from './entities/user.entity';


@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    // Para poder usar las variables de entorno
    ConfigModule.forRoot(),

    // Configuración de Mongoose
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      }
    ]),

    // Configuración de JWT
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '6h' },
    }),
  ],
})
export class AuthModule { }
