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

    if (this.editingId()) {
      this.api.update({ ...value, id: this.editingId()! })
        .subscribe((g: Game) => {
          this.games.set(this.games().map(item => (item.id === g.id ? g : item)));
          this.cancel();
        });
    } else {
      this.api.create(value).subscribe((g: Game) => {
        this.games.set([g, ...this.games()]);
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
