import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,  UpdateDateColumn} from "typeorm";

@Entity('cities')
export class City {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ default: false })
    isActive: boolean; // Si tiene pico y placa activo

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
