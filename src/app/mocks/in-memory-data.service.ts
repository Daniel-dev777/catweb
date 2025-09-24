import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Game } from '../models/game';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const games: Game[] = [
      { id: 1, name: 'Chess',            objective: 'Checkmate the king',       price: 0 },
      { id: 2, name: "Baldur's Gate 3",  objective: 'Salvar o mundo em Faerûn', price: 299.90 },
    ];
    return { games };
  }
  genId(col: { id: number }[]) {
    return col.length ? Math.max(...col.map(i => i.id)) + 1 : 1;
  }
}
