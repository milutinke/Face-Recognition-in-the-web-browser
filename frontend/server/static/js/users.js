(async () => {
    let loadUsers = async () => {
        let users = await axios.get(window.appUrl + '/api/user/all')
            .then(response => { return response.data; })
            .catch(error => {
                console.log(error);
                throw new Error(error);
            });

        return users;
    }

    let processUsers = async () => {
        let users = await loadUsers();

        console.log(users);

        if (users.length > 0) {
            if(document.querySelector('#users-table') !== null)
                users.forEach(user => addUserToTheTable(user));

            if(document.querySelector('#images') !== null) {
                users.forEach(user => {
                    if(user.name !== getParameterByName('user'))
                        return;

                    user.photos.forEach(photo => {
                        const gallery = document.querySelector('#images');
                        const div = document.createElement('div');
                        div.classList = 'col s12 m6 l4';
                        const image = document.createElement('img');
                        image.id = '#gallery-image';
                        image.src = window.appUrl + '' + photo;
                        image.classList = 'materialbox responsive-img card';
                        image.width = 320;
                        image.height = 247;
                        div.appendChild(image);
                        gallery.appendChild(div);
                    });
                });
            }
        } else {
            console.log('Nema!')
        }
    };

    let addUserToTheTable = user => {
        if(document.querySelector('#users-table') === null)
            return;

        const table = document.querySelector('#users-table').children[1];
        let row = document.createElement('tr');

        const nameColumn = document.createElement('td');
        nameColumn.innerText = user.name;

        const picturesColumn = document.createElement('td');
        picturesColumn.innerHTML = `<a href="images.html?user=${user.name}">Слике</a>`;

        const buttonColumn = document.createElement('td');
        const buttonElement = document.createElement('a');
        buttonElement.classList = 'waves-effect waves-light btn-small';
        buttonElement.innerText = 'Обриши';
        buttonElement.href = '#';
        buttonElement.onclick = () => {
            if (confirm('Да ли стварно желиш да обришеш овог корисника?')) {
                removeUserFromTheTable(user);

                axios.delete(window.appUrl + '/api/user/delete', { name: user.name })
                    .this(response => {
                        if (response.data === 'ok') {
                            alert('Успешно обрисан корисник!');
                        } else alert('Дошло је до грешке: ' + response.data);
                    }).catch(error => alert('Дошло је до грешке: ' + error));
            }
        };

        buttonColumn.appendChild(buttonElement);

        row.appendChild(nameColumn);
        row.appendChild(picturesColumn);
        row.appendChild(buttonColumn);

        table.appendChild(row);
    };

    let removeUserFromTheTable = user => {
        const table = document.querySelector('#users-table').children[1];

        Array.from(table.children).forEach(row => {
            if (row.children[0].innerText === user.name) {
                table.removeChild(row);
                return;
            }
        });
    };

    let registerEvenLister = () => {
        if(document.querySelector('#add-user') === null)
            return;

        document.querySelector('#add-user').addEventListener('click', event => {
            const name = document.querySelector('#user-name').value.trim();

            if (!name.length) {
                alert('Молимо, унесите име!');
                document.querySelector('#user-name').focus();
                return;
            }

            let user = {name: name};
            addUserToTheTable(user);
            $('#add-user-modal').modal('close');

            axios.post(window.appUrl + '/api/user/add', { user: user })
                .then(() => console.log('Data successfully sent!'))
                .catch(error => console.log(error));
        });
    };

    let displayName = () => {
        if(document.querySelector('#user-name') !== undefined)
            document.querySelector('#user-name').innerText = getParameterByName('user');
    }

    let getParameterByName = name => {
        let url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');

        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        results = regex.exec(url);

        if (!results) return null;
        if (!results[2]) return '';

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    processUsers();
    registerEvenLister();
    displayName();
})();
