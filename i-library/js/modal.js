class Modal {

    constructor() {
      this.buttons = null;
      this.modals = null;
      this.btnClassName = 'i-modal-btn';
      this.modalClassName = 'i-modal';
    }

    selectButtons() { this.buttons = document.querySelectorAll(`.${this.btnClassName}`); }
    
    selectModals() { this.modals = document.querySelectorAll(`.${this.modalClassName}`); }

    showModal() {
        const modal = document.querySelector(`${this.getAttribute('i-target')}`);
        if (modal) modal.classList.add('i-show');
    }

    modalActions(modal) {
        
        const content = modal.querySelector('.i-modal-content');
        const close = modal.querySelector('.i-modal-close');
        const contentClose = modal.querySelector('.i-modal-content-close');
        const cancel = modal.querySelector('.i-modal-cancel');
        const ok = modal.querySelector('.i-modal-ok');
        
        if (close) close.addEventListener('click', () => { modal.classList.remove('i-show'); })
        if (contentClose) contentClose.addEventListener('click', () => { modal.classList.remove('i-show'); })
        if (cancel) cancel.addEventListener('click', () => { modal.classList.remove('i-show'); }) 
        if (ok) ok.addEventListener('click', () => { modal.classList.remove('i-show'); }) 

        if (modal.hasAttribute('i-close-on-bg-click')) {
            modal.addEventListener('click', () => { modal.classList.remove('i-show') })
            content.addEventListener('click', (e) => { e.stopPropagation(); })
        }
    }
}

const iModal = () => {

    const modal = new Modal();
    modal.selectButtons();
    modal.selectModals();
    modal.buttons.forEach((item) => { item.addEventListener('click', modal.showModal.bind(item)) }) 
    modal.modals.forEach((item) => { modal.modalActions(item) }) 

}

export default iModal;