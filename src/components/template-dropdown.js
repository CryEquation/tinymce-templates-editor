class TemplateDropdown extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.select = document.createElement('select');
    this.select.setAttribute('data-template-component', '');
    this.shadowRoot.appendChild(this.select);
  }

  connectedCallback() {
    const values = JSON.parse(this.getAttribute('data-values') || '[]');
    this.setTemplates(values);
  }

  setTemplates(values) {
    const currentValue = this.select.value;
    this.select.innerHTML = '';

    if (!Array.isArray(values)) return;

    values.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      this.select.appendChild(option);
    });

    if (!values.includes(currentValue)) {
      this.select.innerHTML = '<option>ERROR</option>';
    } else {
      this.select.value = currentValue;
    }
  }
}

customElements.define('template-dropdown', TemplateDropdown);
