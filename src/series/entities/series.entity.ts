import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Episodio } from '../../episodios/entities/episodio.entity';
import { User } from '../../users/entities/user.entity'

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

  @Column({ type: 'varchar', nullable: true }) 
  urlPortada: string | null;

  @OneToMany(() => Episodio, (episodio) => episodio.serie, {
    cascade: false 
  })
  episodios: Episodio[];
  @ManyToOne(() => User, (usuario) => usuario.series)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}