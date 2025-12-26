import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Serie } from '../../series/entities/series.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) 
  password: string;

  @OneToMany(() => Serie, (serie) => serie.usuario)
  series: Serie[];
}