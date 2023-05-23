import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';


@Injectable()
export class AuthService {

  /**
   * CONSTRUCTOR
   */
  constructor(
    /* @InjectModel(User.name, 'users') private userModel: Model<User> */
    @InjectModel(User.name) private userModel: Model<User>
  ) { }

  /**
   * 
   * @param createUserDto el objeto que quiero crear
   * @returns una promesa de un usuario
   */
  create(createUserDto: CreateUserDto): Promise<User> {
    /* Esta es la forma básica de insertar */
    const newUser = new this.userModel(createUserDto);
    return newUser.save()

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
