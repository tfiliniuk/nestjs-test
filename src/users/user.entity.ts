import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Playlist } from 'src/playlists/playlist.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Jane',
    description: 'provide the first name of the user',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'provide the last name of the user',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'janedoe@gmail.com',
    description: 'provide the email of the user',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'provide the password of the user',
  })
  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, type: 'text' })
  twoFASecret: string;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @Column()
  apiKey: string;

  /**
   * A user can create many playLists
   */
  @OneToMany(() => Playlist, (playList) => playList.user)
  playLists: Playlist[];
}
