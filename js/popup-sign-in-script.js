const button = document.querySelector('button');

button.addEventListener('mouseover', () => {
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.transform = 'scale(1.3)';

    document.querySelector('form').style.backgroundColor = '#5465fc';

    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'black';
        input.style.color = 'white';
        input.style.transform = 'scale(0.7)';
    });
});

button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.transform = 'scale(1)';

    document.querySelector('form').style.backgroundColor = '#5465fc';

    document.querySelector('#username').classList.remove('white_placeholder');
    document.querySelector('#password').classList.remove('white_placeholder');

    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'white';
        input.style.color = 'black';
        input.style.transform = 'scale(1)';
    });
});

document.querySelector('form').addEventListener('submit',(event) => {
    event.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    if (username && password) {
        chrome.runtime.sendMessage({message:"login",payload: {username , password}},function(response){
            if(response == 'success') window.location.replace('./popup.html');
        });
    } else {
        document.querySelector('#username').placeholder = 'Enter a username.';
        document.querySelector('#password').placeholder = 'Enter a password.';
        document.querySelector('#username').style.backgroundColor = 'red';
        document.querySelector('#password').style.backgroundColor = 'red';
        document.querySelector('#username').classList.add('white_placeholder');
        document.querySelector('#password').classList.add('white_placeholder');
    }
});