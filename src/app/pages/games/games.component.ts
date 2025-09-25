import { Component, OnInit, AfterViewInit, effect, signal, inject, HostListener } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { GamesService } from '../../services/games.service'; // ajuste se sua pasta for "services"
import { Game } from '../../models/game';
import { Tooltip } from 'bootstrap';
import { ModalService } from '../../services/modal.service';

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
  private modal = inject(ModalService);

  trackById = (_: number, g: Game) => g?.id ?? _;

  loading = signal(false);
  editingId = signal<number | null>(null);
  games = signal<Game[]>([]);

  form = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.minLength(2)]],
    objective: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  // ---------- Tooltips (Bootstrap) ----------
  private initTooltips() {
    document.querySelectorAll<HTMLElement>('[data-bs-toggle="tooltip"]').forEach((el) => {
      Tooltip.getInstance(el)?.dispose();
      type Placement = Tooltip.Options['placement'];
      const placement = (el.getAttribute('data-bs-placement') as Placement) || 'top';
      new Tooltip(el, { placement, trigger: 'hover focus', container: 'body' });
    });
  }

  ngAfterViewInit() { this.initTooltips(); }

  constructor() {
    // Recria tooltips quando mudar a lista ou alternar Add/Salvar
    effect(() => {
      this.games();
      this.editingId();
      queueMicrotask(() => this.initTooltips());
    });
  }
  // -----------------------------------------

  ngOnInit() { this.fetch(); }

  fetch() {
    this.loading.set(true);
    this.api.list().subscribe({
      next: (data) => this.games.set(data),
      error: () => {},
      complete: () => this.loading.set(false),
    });
  }

  // ----- Confirmar antes de salvar (Add/Salvar) -----
  async submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const ok = await this.modal.confirm({
      title: 'Confirmar alterações',
      message: 'Deseja confirmar as alterações?',
      okText: 'Salvar',
      okVariant: 'primary',
    });
    if (!ok) return;

    const value = this.form.getRawValue() as Game;

    if (this.editingId()) {
      const id = this.editingId()!;
      this.api.update({ ...value, id }).subscribe((resp) => {
        const updated: Game = resp ?? { ...value, id };
        this.games.set(this.games().map(i => i.id === id ? updated : i));
        this.cancel();
      });
    } else {
      this.api.create(value).subscribe((created) => {
        this.games.set([created, ...this.games()]);
        this.form.reset({ id: null, name: '', objective: '', price: 0 });
      });
    }
  }

  edit(item: Game) {
    this.editingId.set(item.id!);
    this.form.patchValue(item);
  }

  // ----- Confirmar antes de excluir -----
  async remove(id: number) {
    const ok = await this.modal.confirm({
      title: 'Excluir',
      message: 'Deseja confirmar a exclusão?',
      okText: 'Excluir',
      okVariant: 'danger',
    });
    if (!ok) return;

    this.api.remove(id).subscribe(() => {
      this.games.set(this.games().filter(g => g.id !== id));
      if (this.editingId() === id) this.cancel();
    });
  }

  cancel() {
    this.editingId.set(null);
    this.form.reset({ id: null, name: '', objective: '', price: 0 });
  }

  // ======= Guard de saída (CanDeactivate) + beforeunload =======
  private hasPendingChanges(): boolean {
    return this.form.dirty || this.editingId() !== null;
  }

  // usado pelo guard em app.routes.ts
  async canDeactivate(): Promise<boolean> {
    if (!this.hasPendingChanges()) return true;
    return this.modal.confirm({
      title: 'Sair sem salvar?',
      message: 'Deseja sair sem salvar as alterações?',
      okText: 'Sair',
      okVariant: 'warning',
    });
  }

  // cobre refresh/fechar aba/digitar outra URL
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.hasPendingChanges()) {
      event.preventDefault();
      event.returnValue = ''; // necessário para o Chrome/Edge exibirem o diálogo nativo
    }
  }
  // =============================================================
}
