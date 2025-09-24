import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { GamesService } from '../../service/games.service';
import { Game } from '../../models/game';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, DecimalPipe],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css'],
})
export class GamesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(GamesService);

  loading = signal<boolean>(false);
  editingId = signal<number | null>(null);
  games = signal<Game[]>([]);

  form = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.minLength(2)]],
    objective: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.api.list().subscribe({
      next: (data: Game[]) => this.games.set(data),
      error: () => {},
      complete: () => this.loading.set(false),
    });
  }

 submit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const value = this.form.getRawValue() as Game;

  // EDITAR
  if (this.editingId()) {
    const id = this.editingId()!;

    this.api.update({ ...value, id })
      .subscribe((resp: Game | null | undefined) => {
        // se o mock devolver null/undefined, usa o que enviamos
        const updated: Game = resp ?? { ...value, id };

        this.games.set(
          this.games().map(it => (it.id === id ? updated : it))
        );

        this.cancel();
      });

  // CRIAR
  } else {
    this.api.create(value).subscribe((created: Game) => {
      this.games.set([created, ...this.games()]);
      this.form.reset({ id: null, name: '', objective: '', price: 0 });
    });
  }
}


  edit(item: Game): void {
    this.editingId.set(item.id!);
    this.form.patchValue(item);
  }

  remove(id: number): void {
    this.api.remove(id).subscribe(() => {
      this.games.set(this.games().filter(g => g.id !== id));
      if (this.editingId() === id) this.cancel();
    });
  }

  cancel(): void {
    this.editingId.set(null);
    this.form.reset({ id: null, name: '', objective: '', price: 0 });
  }
}
