import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../Usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from '../Usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUsuarioDto: CreateUsuarioDto) {
    const { username, email, password } = createUsuarioDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userToCreate = {
      username,
      email,
      password: hashedPassword,
    };

    const newUser = await this.usuariosService.create(userToCreate as CreateUsuarioDto);
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }

  async login(email: string, passwordLogin: string) {
    const user = await this.usuariosService.findByEmail(email);

    // CORREGIDO: Se cambió 'pass' por 'passwordLogin' para que coincida con el controlador y el DTO.
    // Y se anidó la lógica para mayor claridad.
    if (user) {
        const isPasswordMatching = await bcrypt.compare(passwordLogin, user.password);
        if (isPasswordMatching) {
            const payload = { email: user.email, sub: user._id };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
    }
    
    // Si el usuario no existe o la contraseña no coincide, se lanza la misma excepción.
    throw new UnauthorizedException('Credenciales incorrectas');
  }
}
