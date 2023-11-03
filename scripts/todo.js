document.addEventListener('DOMContentLoaded', function () {
    const listingItems = document.querySelector('.todo-subcontainer-row3-listing-items');
    const add = document.querySelector('.todo-add-button');
    const clearall=document.querySelector('.todo-clearall-button');
    const logout = document.querySelector('.todo-logout');
    clearall.addEventListener('click',(event) => clearAll())
    logout.addEventListener('click',(event) => signOut())
    function signOut(){
        token = localStorage.getItem('token')
        token = localStorage.removeItem('token');
        window.location.href = 'home.html';
    }
    function clearAll(){
        const token=localStorage.getItem('token');
        console.log(token);
        fetch(`http://127.0.0.1:8000/clearall`, {
            method: 'DELETE',
            headers: {
                'Authorization':`Bearer ${token}`,
                'Content-Type': 'application/json',
        },
        })
        .then(response => {
            const clearall=document.querySelector('.todo-subcontainer-row3-listing-items');
            clearall.remove();
        })
        .catch(error => {
            console.error('Error', error);
        });
    }
    function refreshList() {
        const token=localStorage.getItem('token');
        fetch('http://127.0.0.1:8000/fetchallitems',{
            method: 'GET',
            headers: {
                'Authorization':`Bearer ${token}`,
                'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => new Date(a.date) - new Date(b.date));
            listingItems.innerHTML = '';
            data.forEach(item => {
                const newDiv = document.createElement('div');
                // newDiv.textContent = JSON.stringify(item);
                newDiv.textContent = ``;
                newDiv.classList.add('todo-item');
                newDiv.setAttribute('item-id', item.id);

                // const checkbox = document.createElement('input');
                // checkbox.setAttribute('type', 'checkbox');

                const dateElement = document.createElement('div');
                dateElement.textContent = `${item.date}`;
                dateElement.classList.add('todo-date');
                dateElement.setAttribute('date-id', item.id);

                const workElement = document.createElement('div');
                workElement.textContent = `${item.work}`;
                workElement.classList.add('todo-work');
                workElement.setAttribute('work-id', item.id);

                newDiv.appendChild(dateElement);
                newDiv.appendChild(workElement);

                const editElement = document.createElement('div');
                const editButton = document.createElement('button');
                editButton.innerHTML = '<img src="styles/images/edit-icon.png" alt="Edit" />';
                // editButton.textContent = 'Edit';
                editElement.classList.add('div-edit');
                editButton.classList.add('edit-button');
                editButton.setAttribute('edit-id', item.id);
                editButton.addEventListener('click', (event) => editItem(event.target.getAttribute('edit-id')));
                // editButton.addEventListener('click', function(event) {
                //     event.preventDefault(); // Prevent the default action
                //     editItem(event.target.getAttribute('edit-id'), event);
                // });
                // editButton.addEventListener('click', () => editItem(item.id)); // Assuming you have an ID for each item
                newDiv.appendChild(editElement);
                editElement.appendChild(editButton);

                const buttonElement = document.createElement('div');
                const deleteButton = document.createElement('button');
                buttonElement.classList.add('div-delete');
                // deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-button');
                deleteButton.setAttribute('delete-id', item.id); 
                deleteButton.innerHTML = '<img src="styles/images/delete-icon.png" alt="Delete" />';
                deleteButton.addEventListener('click', (event) => deleteItem(event.target.getAttribute('delete-id')));    
                newDiv.appendChild(buttonElement);
                buttonElement.appendChild(deleteButton);
                listingItems.appendChild(newDiv);
            });
        })
        .catch(error => {
            console.error('Error', error);
        });
    }
    function editItem(id) {
        console.log(id)
        var itemDiv = document.querySelector(`[item-id="${id}"]`);
        console.log(itemDiv)
        var textElement = itemDiv.querySelector('.todo-work'); 
        var content = textElement.textContent;
        console.log(content)
        var newContent = prompt("Edit your item:", content);
        if (newContent !== null) {
            fetch(`http://127.0.0.1:8000/editwork/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    work: newContent, 
                    date: textElement.parentNode.querySelector('.todo-date').textContent
                }), 
            })
            .then(response => {
                textElement.textContent = newContent;
            })
            .catch(error => {
                console.error('Error', error);
            });
        }
    }

    function deleteItem(id){
        fetch(`http://127.0.0.1:8000/deletework/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            const itemDiv = document.querySelector(`[delete-id="${id}"]`);
            if (itemDiv) {
                const del = itemDiv.parentNode.parentNode;
                del.remove();
            }
        })
        .catch(error => {
            console.error('Error', error);
        });
    }

    function addButton(event) {
        event.preventDefault(); 
        const work = document.querySelector('.todo-textbox').value;
        const date = document.querySelector('.todo-date').value;
        const token = localStorage.getItem('token');
        const data = {
            work: work,
            date: date,
            token : token
        };
        console.log(data)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`,
            },
            body: JSON.stringify(data)
        };
        fetch('http://127.0.0.1:8000/addwork', options)
            .then(response => response.json())
            .then(data => {
                refreshList(); 
            })
            .catch(error => {
                console.error('Error', error);
            });
    }
    add.addEventListener('click', addButton);
    refreshList();
});











// const listingItems = document.querySelector('.todo-subcontainer-row3-listing-items');
// function addButton(){
//     const work = document.querySelector('.todo-textbox').value;
//     const date = document.querySelector('.todo-date').value;
//     const data = {
//         work: work,
//         date: date
//     };
//     const options= {
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data)
//     }
//     fetch('http://127.0.0.1:8000/addwork',options)
//     .then(response => response.json())
//     // .then(response => {
//     //     console.log(response.status);
//     //     return response.json();
//     // })
//     // .then(response => response.json().then(data => console.log(data)))
//     // .then(response => {
//     //     return Promise.all([response.json(), response.status]); // return an array of response data and status
//     // })
//     // .then(data => console.log(data))
//     .then(data => {
//         listingItems.innerHTML = '';
//         data.forEach(data => {
//             const newDiv = document.createElement('div');
//             newDiv.textContent = JSON.stringify(data);
//             listingItems.appendChild(newDiv);
//         });
//         // Append the new div to the listingItems div
//         listingItems.appendChild(newDiv);
//     })
//     .catch(error => {
//         console.error('Error',error)
//     })
// }
// document.addEventListener('DOMContentLoaded', function () {
//     const add = document.querySelector('.todo-add-button');
//     function refresh(){
//         fetch('http://127.0.0.1:8000')
//         .then(response => response.json())
//         .then(data => {
//             const listingItems = document.querySelector('.todo-subcontainer-row3-listing-items');
//             // Clear previous content
//             listingItems.innerHTML = '';
//             // Render each item in the data array
//             data.forEach(item => {
//                 const newDiv = document.createElement('div');
//                 newDiv.textContent = JSON.stringify(item);
//                 listingItems.appendChild(newDiv);
//             });
//         })
//         .catch(error => {
//             console.error('Error', error);
//         });
//     }
    
//     add.addEventListener('click', function() {
//         addButton();
//     }); 
    
//     refresh();
// });





// async function addButton() {
//     const work = document.querySelector('.todo-textbox').value;
//     const date = document.querySelector('.todo-date').value;
//     const data = {
//         work: work,
//         date: date
//     };
//     try {
//         const response = await fetch('http://127.0.0.1:8000/addwork', {
//             method: 'POST',
//             // mode: "cors",
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 "Access-Control-Allow-Origin": "*",
//             },
//             body: JSON.stringify(data)
//         });
//         console.log(response.status);
//         if (response.status === 201) {
//             console.log('Data added successfully');
//             const responseData = await response.json();
//             console.log(responseData);
//             // const text = await response.text();
//             // console.log(text);
//             document.querySelector('.todo-subcontainer-row3-listing-items').innerHTML=responseData;
//             // Handle the response as needed
//         } else {
//             console.error('Failed to add data. Status:', response.status);
//         }
//         // if (!response.ok) {
//         //     throw new Error('Network response was not ok');
//         // }

        

//     } catch (error) {
//         console.error('Error', error);
//     }
    
// }


