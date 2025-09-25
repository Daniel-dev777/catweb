import { Injectable } from '@angular/core';
import { Modal } from 'bootstrap';

export interface ConfirmOptions {
  title?: string;
  message?: string;
  okText?: string;
  cancelText?: string;
  okVariant?: 'primary' | 'danger' | 'warning' | 'success' | 'secondary';
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  confirm(opts: ConfirmOptions): Promise<boolean> {
    const {
      title = 'Confirmação',
      message = 'Deseja continuar?',
      okText = 'Confirmar',
      cancelText = 'Cancelar',
      okVariant = 'primary',
    } = opts || {};

    const el = document.createElement('div');
    el.className = 'modal fade';
    el.tabIndex = -1;
    el.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
          </div>
          <div class="modal-body"><p class="mb-0">${message}</p></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${cancelText}</button>
            <button type="button" class="btn btn-${okVariant}" data-confirm="ok">${okText}</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(el);

    return new Promise<boolean>((resolve) => {
      const modal = new Modal(el, { backdrop: 'static', keyboard: false });

      const cleanup = (result: boolean) => {
        resolve(result);
        modal.hide();
        el.addEventListener('hidden.bs.modal', () => {
          modal.dispose();
          el.remove();
        }, { once: true });
      };

      el.querySelector<HTMLButtonElement>('[data-confirm="ok"]')!
        .addEventListener('click', () => cleanup(true));
      el.addEventListener('hide.bs.modal', () => resolve(false), { once: true });

      modal.show();
    });
  }
}
