document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('nameInput');
  const phoneInput = document.getElementById('phoneInput');
  const contactList = document.getElementById('contactList');
  const errorMessage = document.getElementById('errorMessage');

  loadContacts();

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();


    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();


    if (!validateName(name)) {
      showError('Please enter the name (at least 5 characters).');
      return;
    }


    if (!validatePhone(phone)) {
      showError('Please enter a valid  phone number.');
      return;
    }

    const formattedPhone = formatPhone(phone);


    const contact = { name, phone: formattedPhone };


    try {
      await addContact(contact);
      contactForm.reset();
      nameInput.focus();
    } catch (error) {
      showError(error.message || 'Failed to add contact. Please try again.');
      console.error(error);
    }
  });

  function validatePhone(phone) {
    const regex = /^(?:\+91[\-\s]?|91[\-\s]?|0)?[6-9]\d{9}$/;
    return regex.test(phone);
  }

  function validateName(name) {
    return name.length >= 5;
  }

  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.style.display = 'block';
  }

  function clearError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
  }

  function loadContacts() {
    const contactsJSON = localStorage.getItem('contacts');
    const contacts = contactsJSON ? JSON.parse(contactsJSON) : [];
    renderContacts(contacts);
  }

  function saveContacts(contacts) {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }

  async function addContact(contact) {

    await new Promise((resolve) => setTimeout(resolve, 300));


    const contactsJSON = localStorage.getItem('contacts');
    const contacts = contactsJSON ? JSON.parse(contactsJSON) : [];

    if (contacts.some(c => c.phone === contact.phone)) {
      throw new Error('Phone number already exists.');
    }


    contacts.push({ id: Date.now(), ...contact });
    saveContacts(contacts);
    renderContacts(contacts);
  }

  async function deleteContact(id) {

    await new Promise((resolve) => setTimeout(resolve, 200));


    let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    contacts = contacts.filter((c) => c.id !== id);
    saveContacts(contacts);
    renderContacts(contacts);
  }

  function renderContacts(contacts) {
    contactList.innerHTML = '';
    if (contacts.length === 0) {
      contactList.innerHTML = '<li class="list-group-item text-center text-muted">No contacts found</li>';
      return;
    }


    contacts.forEach(({ id, name, phone }) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.dataset.id = id;


      li.innerHTML = `
        <div>
          <strong>${escapeHTML(name)}</strong> - <span>${escapeHTML(phone)}</span>
        </div>
        <button class="btn btn-sm btn-danger delete-btn" aria-label="Delete contact">Delete</button>
      `;


      // Attach the delete event handler
      li.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm(`Delete contact "${name}"?`)) {
          deleteContact(id).catch((err) => {
            showError('Failed to delete contact. Please try again.');
            console.error(err);
          });
        }
      });


      contactList.appendChild(li);
    });
  }

  function formatPhone(phone) {

    phone = phone.replace(/[\s\-\(\)]/g, '');


    if (phone.startsWith('+91')) {
      phone = phone.slice(3);
    } else if (phone.startsWith('91')) {
      phone = phone.slice(2);
    } else if (phone.startsWith('0')) {
      phone = phone.slice(1);
    }

    phone = phone.slice(-10);

    return '+91 ' + phone;
  }

  function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
message.txt