// src/app/service/games.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private baseUrl = 'api/games';

  constructor(private http: HttpClient) {}

  list(): Observable<Game[]> {
    return this.http.get<Game[]>(this.baseUrl);
  }

  create(game: Game): Observable<Game> {
    return this.http.post<Game>(this.baseUrl, game);
  }

  // ⬇️ Aqui está o ponto chave: union type com | null
  update(game: Game): Observable<Game | null> {
    return this.http.put<Game | null>(`${this.baseUrl}/${game.id}`, game);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
