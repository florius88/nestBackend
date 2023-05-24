import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto, RegisterUserDto, UpdateAuthDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * Insertamos un usuario en bbdd
   * 
   * @param createUserDto 
   * @returns 
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  /**
   * Para registrar un usuario y hacer login
   * 
   * @param registerDto
   * @returns
   */
  @Post('/register')
  register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Para hacer login
   * 
   * @param loginDto 
   * @returns 
   */
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Devuelve todos los registros de bbdd
   * 
   * @param req
   * @returns una promesa con un array de usuarios
   */
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req: Request) {
    /* const user = req['user']
    return user */

    return this.authService.findAll();
  }

  /**
   * Verificamos el JWT
   * 
   * @params req
   * @returns LoginResponse
   */
  @UseGuards(AuthGuard)
  @Get('/check-token')
  checkToken(@Request() req: Request): LoginResponse {
    const user = req['user'] as User

    return {
      user,
      token: this.authService.getJwtToken({ id: user._id }),
    }
  }

  /*
  De momento no las vamos a utilizar

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  } 
  */
}
