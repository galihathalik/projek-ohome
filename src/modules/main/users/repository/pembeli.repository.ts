import { Pembeli } from "src/entities/pembeli.entity";
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(Pembeli)
export class PembeliRepository extends Repository<Pembeli> {
    
}