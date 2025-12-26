import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Serie } from '../../series/entities/series.entity';

@Entity()
@Index(['serieId', 'numeroCapitulo'], { unique: true }) 
@Index(['serieId', 'titulo'], { unique: true }) 
export class Episodio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'int' }) // Duración en minutos (ejemplo: 60 = 1 hora, 25 = 25 minutos)
  duracion: number;

  @Column({ type: 'int' })
  numeroCapitulo: number;

  @ManyToOne(() => Serie, (serie) => serie.episodios, { 
    nullable: false,
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'serieId' })
  serie: Serie;

  @Column({ type: 'int', nullable: false })
  serieId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
