import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>){}

  async create(createUserDto: CreateUserDto) {
    const exiting = await this.findByEmail(createUserDto.email);
    if(exiting){
      throw { name: "DuplicatedError" }
    }
    // hashPassword password
    const newUser = new this.userModel({ 
      email: createUserDto.email, 
      password: createUserDto.password, 
      firstName: createUserDto.firstName, 
      lastName: createUserDto.lastName, 
      role: createUserDto.role
    });
    return newUser.save();
  }

  findAll() {
    return this.userModel.find().select(['-password', '-__v']).exec();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({email}).select(['-password', '-__v']).exec();
  }

  findById(id: string) {
    return this.userModel.findOne({_id: id}).select(['-password', '-__v']).exec();
  }

  findUserForLogin(email: string) {
    return this.userModel.findOne({email}).select(['-__v']).exec();
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const existing = await this.findById(id);
    if(!existing){
      throw { name: "NotFoundError" }
    }
    await this.userModel.findByIdAndUpdate(id, {
      firstName: updateUserDto.firstName || existing.firstName, 
      lastName: updateUserDto.lastName || existing.lastName, 
      role: updateUserDto.role || existing.role
    })
  }

  async remove(id: string) {
    const existing = await this.findById(id);
    if(!existing){
      throw { name: "NotFoundError" }
    }
    return this.userModel.deleteOne({_id: id}).exec();
  }
}
