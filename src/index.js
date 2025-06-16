import './style.css';
import './components/template-dropdown.js';

let templates = ['template 1', 'template 2', 'template 3'];
let selectedTemplateIndex = 0;
let editorInstance = null;

const templateList = document.getElementById('templateList');
const editTemplate = document.getElementById('editTemplate');

function renderTemplateList() {
  templateList.innerHTML = '';
  templates.forEach((t, i) => {
    const li = document.createElement('li');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = t;
    li.textContent = tempDiv.textContent;
    if (i === selectedTemplateIndex) li.classList.add('selected');
    li.addEventListener('click', () => {
      selectedTemplateIndex = i;
      editTemplate.value = templates[i];
      if (editorInstance) {
        editorInstance.setContent(templates[i]);
      }
      renderTemplateList();
    });
    templateList.appendChild(li);
  });
}

function updateTemplate(newText) {
  templates[selectedTemplateIndex] = newText;
  renderTemplateList();
  document.querySelectorAll('template-dropdown').forEach(el => el.setTemplates(templates));
}

document.getElementById('addTemplate').onclick = () => {
  templates.push('template');
  selectedTemplateIndex = templates.length - 1;
  renderTemplateList();
  editTemplate.value = 'template';
  document.querySelectorAll('template-dropdown').forEach(el => el.setTemplates(templates));
};

document.getElementById('removeTemplate').onclick = () => {
  if (templates.length > 0) {
    const removed = templates.splice(selectedTemplateIndex, 1)[0];
    selectedTemplateIndex = Math.max(0, selectedTemplateIndex - 1);
    renderTemplateList();
    editTemplate.value = templates[selectedTemplateIndex] || '';
    document.querySelectorAll('template-dropdown').forEach(el => el.setTemplates(templates));
  }
};

editTemplate.addEventListener('change', e => updateTemplate(e.target.value));
editTemplate.addEventListener('blur', e => updateTemplate(e.target.value));
editTemplate.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    updateTemplate(e.target.value);
    e.preventDefault();
  }
});

tinymce.init({
  selector: '#editor',
  toolbar: false,
  menubar: false,
  plugins: 'autoresize',
  setup: editor => {
    editorInstance = editor;
    
    editor.on('keydown', (e) => {
      if (e.key === 'Insert') {
        const content = editor.getContent();
        templates[selectedTemplateIndex] = content;
        editTemplate.value = content;
        renderTemplateList();
        e.preventDefault();
      }
    });

    editor.on('change', () => {
      if (selectedTemplateIndex >= 0) {
        templates[selectedTemplateIndex] = editor.getContent();
        editTemplate.value = editor.getContent();
      }
    });

    document.getElementById('insert-template').onclick = () => {
      const html = `<template-dropdown data-values='${JSON.stringify(templates)}'></template-dropdown>`;
      editor.insertContent(html);
    };
  }
});

renderTemplateList();
editTemplate.value = templates[selectedTemplateIndex];
