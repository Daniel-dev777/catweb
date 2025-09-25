import { Component, OnInit, AfterViewInit, effect, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { GamesService } from '../../service/games.service';
import { Game } from '../../models/game';
import { Tooltip } from 'bootstrap';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, DecimalPipe],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css'],
})
export class GamesComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private api = inject(GamesService);

  trackById = (_index: number, g: Game) => g?.id ?? _index;

  loading = signal<boolean>(false);
  editingId = signal<number | null>(null);
  games = signal<Game[]>([]);

  form = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.minLength(2)]],
    objective: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  // -------- Tooltips (Bootstrap) ----------
private initTooltips() {
  const els = document.querySelectorAll<HTMLElement>('[data-bs-toggle="tooltip"]');

  els.forEach(el => {
    // evita duplicação
    Tooltip.getInstance(el)?.dispose();

    // lê placement dos atributos data-bs-*
    type Placement = Tooltip.Options['placement'];
    const placement =
      (el.getAttribute('data-bs-placement') as Placement) || 'top';

    // cria o tooltip Bootstrap
    new Tooltip(el, {
      placement,
      trigger: 'hover focus',
      container: 'body',
      // o 'title' pode vir do atributo title do próprio elemento
    });
  });
}

  ngAfterViewInit(): void {
    this.initTooltips();
  }

  constructor() {
    effect(() => {
      const _list = this.games();
      const _mode = this.editingId();
      queueMicrotask(() => this.initTooltips());
    });
  }
  // ---------------------------------------

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
      const id = this.editingId()!;
      this.api.update({ ...value, id }).subscribe((resp: Game | null | undefined) => {
        const updated: Game = resp ?? { ...value, id };
        this.games.set(this.games().map((it) => (it.id === id ? updated : it)));
        this.cancel();
      });
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
      this.games.set(this.games().filter((g) => g.id !== id));
      if (this.editingId() === id) this.cancel();
    });
  }

  cancel(): void {
    this.editingId.set(null);
    this.form.reset({ id: null, name: '', objective: '', price: 0 });
  }
}
