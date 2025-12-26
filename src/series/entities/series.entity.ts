import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Episodio } from '../../episodios/entities/episodio.entity';

@Entity()
export class Serie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  genero: string;

  @Column({ type: 'text' })
  sinopsis: string;

  @Column()
  urlPortada: string;

  @OneToMany(() => Episodio, (episodio) => episodio.serie)
  episodios: Episodio[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
