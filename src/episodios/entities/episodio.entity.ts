import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Serie } from '../../series/entities/series.entity';

@Entity()
export class Episodio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'int' })
  duracion: number;

  @Column({ type: 'int' })
  numeroCapitulo: number;

  @ManyToOne(() => Serie, (serie) => serie.episodios, { nullable: false })
  @JoinColumn({ name: 'serieId' })
  serie: Serie;

  @Column({ type: 'int' })
  serieId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
