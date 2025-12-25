import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Serie } from '../../series/entities/series.entity';

@Entity()
export class Episodio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'int' })
  duracion: number; // minutos

  @Column({ type: 'int' })
  numeroCapitulo: number;

  @ManyToOne(() => Serie, (serie) => serie.episodios, { onDelete: 'CASCADE' })
  serie: Serie;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
