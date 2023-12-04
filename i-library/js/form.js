class Form {

    constructor() {
      this.allForms = null;
      this.className = 'i-form';
      this._requiredInputs = null;
      this._rangeInputs = null;
      this.errorCount = 0;
    }
    
    get requiredInputs() { return this._requiredInputs; }

    get rangeInputs() { return this._rangeInputs; }

    set requiredInputs(form) { this._requiredInputs = form.querySelectorAll('.i-form-input[i-form-required]');  }

    set rangeInputs(form) { this._rangeInputs = form.querySelectorAll('.i-form-input[i-form-min], .i-form-input[i-form-max]');  }

    createSelects(form) {

        const selects = form.querySelectorAll('.i-form-select');

        selects.forEach((select) => {
            this.createSelect(select, select.closest('.i-form-group'), select.options, select.getAttribute('i-form-placeholder'));
        });

    }

    createSelect(el, par, options, _placeholder) {

        const select = document.createElement('div');
        select.className = "i-form-select-container";

        const dropdown = document.createElement('div');
        dropdown.className = "i-form-select-dropdown";

        const area = document.createElement('div');
        area.className = "i-form-select-area";
        area.addEventListener('click', () => {
            dropdown.classList.toggle('i-show');
        })

        const placeholder = document.createElement('div');
        placeholder.className = "i-form-select-placeholder";
        placeholder.innerHTML = _placeholder;
        
        for (let i = 0; i < options.length; i++) {
            const option = document.createElement('button');
            option.className = "i-form-select-option";
            option.setAttribute('value', options[i].value);
            option.setAttribute('type', 'button');
            option.innerHTML = options[i].text;
            option.addEventListener('click', (e) => {
                for (let y = 0; y < options.length; y++) {
                    options[y].classList.remove('i-active')
                }
                e.target.classList.add('i-active');
                el.value = options[i].value;
            })
            dropdown.appendChild(option);
        }

        area.appendChild(placeholder);
        area.appendChild(dropdown)

        select.appendChild(area);

        
        par.appendChild(select);
    }

    handleRequirement(e) { this.isEmpty(e.target.value) ? this.setError(e.target, "i-form-required-error") : this.resetError(e.target, "i-form-required-error"); }

    handleRequirementOnSubmit(e) {
        this.requiredInputs.forEach((input) => {
            if (this.isEmpty(input.value) ) { 
                e.preventDefault();
                this.setError(input, "i-form-required-error"); 
            } 
        })
    }

    handleRange(e) {

        if (this.isOutOfRange(e.target)) {
            this.resetError(e.target, "i-form-required-error");
            this.setError(e.target, "i-form-range-error")
        } else this.resetError(e.target, "i-form-range-error");

    }

    isEmpty(val) { return val === "" ? true : false; }

    isOutOfRange(input) { 
        const val = input.value;
        const length = val.length;
        const min = input.getAttribute('i-form-min');
        const max = input.getAttribute('i-form-max');
        if (this.isEmpty(val)) return false;
        else if (min && length < min || max && length > max) return true;
        else return false;
    }

    setError(el, className) { 
        const field = el.closest('.i-form-group');
        if (!field.classList.contains(className)) ++this.errorCount;
        this.disableSubmit(el.closest('.i-form')); 
        field.classList.add(className); 
    }

    resetError(el, className) { 
        const field = el.closest('.i-form-group');
        if (field.classList.contains(className)) --this.errorCount;
        if (this.errorCount < 1) this.enableSubmit(el.closest('.i-form'));
        field.classList.remove(className); 
    }

    errorExists(el) {
        const field = el.closest('.i-form-group');
        const elSelfHasError = field.classList.contains('i-form-required-error') || field.classList.contains('i-form-range-error');
        const form = el.closest('.i-form');
        const errorFields = form.querySelectorAll('.i-form-required-error, .i-form-range-error');
        return errorFields.length > 1 && elSelfHasError || errorFields.length > 0 && !elSelfHasError ? true : false;
    }

    selectForms() { this.allForms = document.querySelectorAll(`.${this.className}`); }
    
    disableSubmit(form) { 
        const submit = form.querySelector('.i-form-group-submit');
        submit.setAttribute('disabled', '');
        submit.classList.add('i-btn-disabled');
    } 

    enableSubmit(form) { 
        const submit = form.querySelector('.i-form-group-submit');
        submit.removeAttribute('disabled');
        submit.classList.remove('i-btn-disabled');
    } 
}

const iForm = () => {

    const form = new Form();
    form.selectForms();

    const setActions = (el) => {
        // requirement
        form.requiredInputs = el;
        form.requiredInputs.forEach((input) => {
            input.addEventListener('input', form.handleRequirement.bind(form))
        })
        el.addEventListener('submit', form.handleRequirementOnSubmit.bind(form));
        
        // range
        form.rangeInputs = el;
        form.rangeInputs.forEach((input) => {
            input.addEventListener('input', form.handleRange.bind(form))
        })

        // selects
        const selects = form.createSelects(el); 
        // selects.forEach((select) => {
        //     console.log(select);
        // })
    }

    form.allForms.forEach((item) => { setActions(item); });

}

export default iForm;