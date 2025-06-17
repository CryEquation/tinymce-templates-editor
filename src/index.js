import './style.css';
import './components/template-dropdown.js';

let templates = [
  { name: 'template 1', content: '' },
  { name: 'template 2', content: '' },
  { name: 'template 3', content: '' }
];
let selectedTemplateIndex = 0;
let editorInstance = null;

const templateList = document.getElementById('templateList');
const editTemplate = document.getElementById('editTemplate');

function renderTemplateList() {
  templateList.innerHTML = '';
  templates.forEach((t, i) => {
    const li = document.createElement('li');
    li.textContent = t.name;
    if (i === selectedTemplateIndex) li.classList.add('selected');
    li.addEventListener('click', () => {
      selectedTemplateIndex = i;
      editTemplate.value = templates[i].name;
      if (editorInstance) {
        editorInstance.setContent(templates[i].content);
      }
      renderTemplateList();
    });
    templateList.appendChild(li);
  });
}

function updateTemplate(newName) {
  templates[selectedTemplateIndex].name = newName;
  renderTemplateList();
  document.querySelectorAll('template-dropdown').forEach(el => el.setTemplates(templates.map(t => t.name)));
}

document.getElementById('addTemplate').onclick = () => {
  templates.push({ name: 'template', content: '' });
  selectedTemplateIndex = templates.length - 1;
  renderTemplateList();
  editTemplate.value = 'template';
  document.querySelectorAll('template-dropdown').forEach(el => el.setTemplates(templates.map(t => t.name)));
};

document.getElementById('removeTemplate').onclick = () => {
  if (templates.length > 0) {
    templates.splice(selectedTemplateIndex, 1);
    selectedTemplateIndex = Math.max(0, selectedTemplateIndex - 1);
    renderTemplateList();
    editTemplate.value = templates[selectedTemplateIndex]?.name || '';
    document.querySelectorAll('template-dropdown').forEach(el => el.setTemplates(templates.map(t => t.name)));
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
    
    const saveContent = () => {
      const content = editor.getContent();
      templates[selectedTemplateIndex].content = content;
      renderTemplateList();
    };
    
    editor.on('keydown', (e) => {
      if (e.key === 'Insert') {
        saveContent();
        e.preventDefault();
      }
    });

    document.getElementById('insert-template').onclick = () => {
      saveContent();
      const html = `<template-dropdown data-values='${JSON.stringify(templates.map(t => t.name))}'></template-dropdown>`;
      editor.insertContent(html);
    };
  }
});

renderTemplateList();
editTemplate.value = templates[selectedTemplateIndex].name;
