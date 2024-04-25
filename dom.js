const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z ]*$/;
const NUMBER_REGEX = /^[0](412|212|424|426|414|416)[0-9]{7}$/;

const nameInput = document.querySelector('#input-name');
const numberInput = document.querySelector('#input-number');
const formBtn = document.querySelector('#form-btn');
const form = document.querySelector('#form');
const list = document.querySelector('#list');




// Validations
let nameValidation = false;
let numberValidation = false;

// Functions
const validateInput = (input, validation) => {
  const infoText = input.parentElement.children[2];
  if (input.value === '') {
    input.classList.remove('incorrect');
    input.classList.remove('correct');
    infoText.classList.remove('show');
  } else if (validation) {
    input.classList.add('correct');
    input.classList.remove('incorrect');
    infoText.classList.remove('show');
  } else {
    input.classList.add('incorrect');
    input.classList.remove('correct');
    infoText.classList.add('show');
  }

  if (nameValidation && numberValidation) {
    formBtn.disabled = false;
  } else {
    formBtn.disabled = true;
  }
}

const renderContacts = () => {
  list.innerHTML = '';
  contacts.forEach(contact => {
    const li = document.createElement('li');
    li.classList.add('contact');
    li.id = contact.id;
    li.innerHTML = `
      <button class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="delete-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>        
      </button>
      <p>${contact.name}</p>
      <p>${contact.number}</p>
      <button class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
    `;
    list.append(li)
  });
}

// Data
let contacts = [];

nameInput.addEventListener('input', e => {
  nameValidation = NAME_REGEX.test(nameInput.value);
  validateInput(nameInput, nameValidation);
});

numberInput.addEventListener('input', e => {
  numberValidation = NUMBER_REGEX.test(numberInput.value);
  validateInput(numberInput, numberValidation);
});

form.addEventListener('submit', e => {
  e.preventDefault();
  // Verificar si las validaciones son verdaderas
  if (!nameValidation || !numberValidation) return;
  // Crear contacto
  const newContact = {
    id: crypto.randomUUID(),
    name: nameInput.value,
    number: numberInput.value,
  }
  // Agregar el contacto al array
  contacts = contacts.concat(newContact);
  // Guardar en el navegador
  localStorage.setItem('contacts', JSON.stringify(contacts));

  renderContacts();
  form.reset();
  nameInput.classList.remove('correct');
  numberInput.classList.remove('correct');
  nameValidation = false;
  numberValidation = false;
});


list.addEventListener('click', e => {
  const deleteBtn = e.target.closest('.delete-btn');
  const editBtn = e.target.closest('.edit-btn');
  // Eliminar
  if (deleteBtn) {
    const id = deleteBtn.parentElement.id;
    contacts = contacts.filter(contact => {
      if (contact.id !== id) {
        return contact;
      }
    });
    localStorage.setItem('contacts', JSON.stringify(contacts));
    renderContacts();
  }

  // Editar
  if (editBtn) {
    const li = editBtn.parentElement;
    const nameEdit = li.children[1];
    const numberEdit = li.children[2];
    const NombreEditado = NAME_REGEX.test(nameEdit.innerHTML);
    const NumeroEditado = NUMBER_REGEX.test(numberEdit.innerHTML);

    if (editBtn){
      nameEdit.classList.add('border-edit');
      numberEdit.classList.add('border-edit');
    }
    if (!NombreEditado){
      nameEdit.classList.add('incorrect');
      numberEdit.classList.add('correct');
      nameEdit.classList.remove('border-edit');
      numberEdit.classList.remove('border-edit');
      alert('Solo nombre y apellido. Ambos tienen que comenzar con mayusculas.')
    }
    if(!NumeroEditado){
      nameEdit.classList.add('correct');
      numberEdit.classList.add('incorrect');
      nameEdit.classList.remove('border-edit');
      numberEdit.classList.remove('border-edit');
      alert('Verifique que sea un numero venezolano valido.')
    }
    if(NombreEditado === true & NumeroEditado == false ) {
      numberEdit.classList.add('incorrect');
      numberEdit.classList.remove('correct');
      numberEdit.classList.remove('border-edit');
      nameEdit.classList.add('correct');
      nameEdit.classList.remove('incorrect');
      nameEdit.classList.remove('border-edit');
    }
    if(NombreEditado === false & NumeroEditado == true) {
      numberEdit.classList.remove('incorrect');
      numberEdit.classList.add('correct');
      numberEdit.classList.remove('border-edit');
      nameEdit.classList.remove('correct');
      nameEdit.classList.add('incorrect');
      nameEdit.classList.remove('border-edit');
    }

    if (li.classList.contains('editando')) {
      console.log(NombreEditado, NumeroEditado);
      if (!NombreEditado || !NumeroEditado){
        return;
      }
      
      li.classList.remove('editando');
      nameEdit.removeAttribute('contenteditable');
      numberEdit.removeAttribute('contenteditable');  
      editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
      `;
      contacts = contacts.map(contact => {
        if (contact.id === li.id) {
          return {...contact, name: nameEdit.innerHTML, number: numberEdit.innerHTML};
        } else {
          return contact;
        }
      });
      localStorage.setItem('contacts', JSON.stringify(contacts));
      renderContacts();
    } else {
      li.classList.add('editando');
      nameEdit.setAttribute('contenteditable', true);
      numberEdit.setAttribute('contenteditable', true);
      editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
      </svg>
      `;
    }
  }
});

(() => {
  const contactsLocal = localStorage.getItem('contacts');
  if (contactsLocal) {
    const contactsArray = JSON.parse(contactsLocal);
    contacts = contactsArray;
    renderContacts();
  }
})();
