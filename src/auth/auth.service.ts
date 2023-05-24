import { BadGatewayException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import * as bcryptjs from 'bcryptjs'

import { CreateUserDto, LoginDto, RegisterUserDto, UpdateAuthDto } from './dto';

import { User } from './entities/user.entity';

import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';


@Injectable()
export class AuthService {

  /**
   * CONSTRUCTOR
   */
  constructor(
    /* @InjectModel(User.name, 'users') private userModel: Model<User> */
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  /**
   * 
   * @param createUserDto el objeto que quiero crear
   * @returns una promesa de un usuario
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    /* Esta es la forma básica de insertar 
    const newUser = new this.userModel(createUserDto);
    return newUser.save() */

    try {

      /* 1- Debemos encriptar la password */
      // Vamos a desectructurar el dto, separando la pass de lo demas
      const { password, ...userData } = createUserDto

      // Creamos el nuevo usuario encriptando la pass
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      })

      /* 2- Guardar el usuario */
      // El await es importante, ya que podría suceder el error estando 
      // fuera del método y no poder controlado
      await newUser.save()

      // No queremos que la password se muestre en el json junto al usuario
      const { password: _, ...returnUser } = newUser.toJSON()

      return returnUser

    } catch (error) {
      if (error.code === 11000) {
        throw new BadGatewayException(`${createUserDto.email} already exists`)
      }
      throw new InternalServerErrorException('Something terrible happened!')

    }

  }

  /**
   * Para registrar un usuario y hacer login
   * 
   * @returns una promesa 
   */
  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {

    /* Puesto que los dtos son los mismos que el createUserDto, nos acepta lo siguiente
    si este no fuera el caso, tendríamos que mandarlo desestructurado
    const user = await this.create({email: registerDto.email, name: registerDto.name, password: registerDto.password}) */
    const user = await this.create(registerDto)

    return {
      user: user,
      token: this.getJwtToken({ id: user._id, }),
    }

  }

  /**
   * Para el login 
   * 
   * @param loginDto 
   * @returns
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {

    const { email, password } = loginDto

    /* Verificamos si el usuario existe con el mail */
    const user = await this.userModel.findOne({ email })

    if (!user) {
      throw new UnauthorizedException('Not valid email')
    }

    /* Verificamos si la contraseña es correcta */
    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Not valid password')
    }

    // Si todo es correcto, desectructuramos el usuario
    const { password: _, ...rest } = user.toJSON()

    // Devolvemos el usuario sin password y el token de acceso
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id, }),
    }
  }

  /**
   * Generamos un JWT a partir de un payload
   * 
   * @param payload 
   * @returns un string con el token
   */
  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token
  }

  /**
   * 
   * @returns 
   */
  findAll() {
    return `This action returns all auth`;
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  /**
   * 
   * @param id 
   * @param updateAuthDto 
   * @returns 
   */
  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
