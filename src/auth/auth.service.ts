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
    // CORREGIDO: Extraemos el 'phone' del DTO
    const { username, email, password, phone } = createUsuarioDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // CORREGIDO: Añadimos el 'phone' al objeto que se va a crear
    const userToCreate = {
      username,
      email,
      password: hashedPassword,
      phone, // Se pasa el teléfono al servicio de usuarios
    };

    // El DTO aquí es solo para el tipado, el objeto ya tiene la estructura correcta
    const newUser = await this.usuariosService.create(userToCreate as CreateUsuarioDto);
    
    // Asumiendo que el servicio de usuarios devuelve un objeto con un método toObject()
    if (newUser && typeof newUser.toObject === 'function') {
      const { password: _, ...userWithoutPassword } = newUser.toObject();
      return userWithoutPassword;
    }
    
    return newUser; // Fallback por si no viene como se espera
  }

  async login(email: string, passwordLogin: string) {
    const user = await this.usuariosService.findByEmail(email);

    if (user) {
        const isPasswordMatching = await bcrypt.compare(passwordLogin, user.password);
        if (isPasswordMatching) {
            const payload = { email: user.email, sub: user._id };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
    }
    
    throw new UnauthorizedException('Credenciales incorrectas');
  }
}
