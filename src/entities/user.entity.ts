import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from 'src/entities/refresh-token.entity';
// import { Book } from 'src/books/entity/book.entity';
import { Admin } from 'src/entities/admin.entity';
import { Pembeli } from 'src/entities/pembeli.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ unique: true })
  num_phone: string;

  @Column()
  role: string;

  @Column({ default: false })
  emailVerified: boolean;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @OneToOne(() => Pembeli, (pembeli) => pembeli.user, {
    onDelete: 'CASCADE',
    eager: true,
  })
  pembeli: Pembeli;

  @OneToOne(() => Admin, (admin) => admin.user, {
    onDelete: 'CASCADE',
    eager: true,
  })
  admin: Admin;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    eager: true,
  })
  refreshTokens: RefreshToken[];

  // @OneToMany(() => Book, (book) => book.user)
  // books: Book[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
