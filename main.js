console.info('Script: --- LoginForm@Maksim.Tsvetkov ---');

const LOGIN_TIMEOUT_MS = 500;

const submitButton = document.querySelector('button');
const form = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const responseContainer = document.getElementById('response');

// init state
submitButton.disabled = true;
const formState = {
    email: { touched: false, valid: true },
    password: { touched: false, valid: true },
}

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Prevent twice submitting
    submitButton.disabled = true;
    submitButton.autocomplete = 'off';
    submitButton.textContent = 'Sending...';
    responseContainer.textContent = 'Wait...';
    if (responseContainer.classList.contains('error')) {
        responseContainer.classList.remove('error');
    }

    try {
        const response = await mockFetch(
            JSON.stringify({ email: email.value, password: password.value }),
            LOGIN_TIMEOUT_MS
        );
        if (response === 'ok') {
            form.reset();
            responseContainer.textContent = 'Logged in successfully';
        }
    } catch (error) {
        responseContainer.textContent = 'Auth error';
        responseContainer.classList.add('error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Log in';
    }
});

email.addEventListener('input', () => validate(email, markFieldOnInput));
email.addEventListener('change', () => validate(email, markFieldOnChange));
password.addEventListener('input', () => validate(password, markFieldOnInput));
password.addEventListener('change', () => validate(password, markFieldOnChange));

function mockFetch(payload, timeoutInMs) {
    const shouldResolve = Math.ceil(Math.random() * 10) % 2 === 0;
    console.log('Request payload: ', payload);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldResolve) {
                resolve('ok');
            } else {
                reject('nok');
            }
        }, timeoutInMs);
    });
}

function validate(el, callback) {
    switch (el.name) {
        case 'email':
            // update form state
            formState.email = { touched: true, valid: el.value.includes('@')};

            callback(el, formState.email.valid)
            break;
        case 'password':
            // update form state
            formState.password = { touched: true, valid: el.value.length > 0};

            callback(el, formState.password.valid);
            break;
        default:
    }
    updateSubmitButtonState();
}

function markFieldOnInput(el, isValid) {
    if (isValid) {
        el.setAttribute("aria-invalid", "false");
    }
}

function markFieldOnChange(el, isValid) {
    el.setAttribute("aria-invalid", isValid ? "false" : "true");
}

function updateSubmitButtonState() {
    const { email, password } = formState;

    console.log(formState)

    if (email.valid && email.touched && password.valid && password.touched) {
        submitButton.disabled = false;
    }
}