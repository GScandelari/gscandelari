import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, get, set, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCGAy-FgqttT29D3SGQpejYC1dDc64gD-A",
    authDomain: "gscandelari-8890.firebaseapp.com",
    databaseURL: "https://gscandelari-8890-default-rtdb.firebaseio.com",
    projectId: "gscandelari-8890",
    storageBucket: "gscandelari-8890.appspot.com",
    messagingSenderId: "794313971390",
    appId: "1:794313971390:web:b6760f03b9b18bd8a970ef",
    measurementId: "G-EYYZFWJW6K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const loginForm = document.getElementById('loginForm');
    const errorMessageElement = document.getElementById('error-message');
    const logoutButton = document.getElementById('logoutButton');

    // Função para verificar se o usuário está autenticado
    function checkAuth() {
        onAuthStateChanged(auth, async (user) => {
            const isLoginPage = window.location.pathname === '/index.html';

            if (!user && !isLoginPage) {
                // Usuário não está autenticado e não está na página de login
                window.location.href = "index.html";
            } else if (user) {
                // Usuário autenticado
                if (window.location.pathname === '/profile.html') {
                    // Buscar dados do usuário do Firebase
                    const userRef = ref(db, `users/${user.uid}`);
                    try {
                        const snapshot = await get(userRef);
                        if (snapshot.exists()) {
                            const userData = snapshot.val();
                            document.getElementById('firstName').value = userData.firstName || '';
                            document.getElementById('lastName').value = userData.lastName || '';
                            document.getElementById('email').value = userData.email || '';
                        } else {
                            console.error('No data available');
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    }
                }
            }

            if (profileForm) {
                profileForm.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const firstName = document.getElementById('firstName').value;
                    const lastName = document.getElementById('lastName').value;
                    const email = document.getElementById('email').value;

                    try {
                        const existingEmailQuery = query(ref(db, 'users'), orderByChild('email'), equalTo(email));
                        const snapshot = await get(existingEmailQuery);

                        if (snapshot.exists() && snapshot.val()[user.uid] === undefined) {
                            alert('Email already in use by another account.');
                            return;
                        }

                        const userRef = ref(db, `users/${user.uid}`);
                        await set(userRef, {
                            firstName,
                            lastName,
                            email
                        });
                        alert('Profile updated successfully!');
                    } catch (error) {
                        console.error('Error updating profile:', error);
                    }
                });
            }
        });
    }

    // Verificar autenticação ao carregar a página
    checkAuth();


    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Limpar mensagens de erro anteriores
            errorMessageElement.textContent = '';

            const email = document.getElementById('floatingInput').value;
            const password = document.getElementById('floatingPassword').value;

            signInWithEmailAndPassword(auth, email, password)
                .then(_userCredential => {
                    window.location.href = "home.html";
                })
                .catch(error => {
                    // Tratar e exibir mensagens de erro
                    let errorMessage = 'An error occurred. Please try again.';
                    switch (error.code) {
                        case 'auth/invalid-email':
                            errorMessage = 'Please get in touch with the inviter. Case LG01';
                            break;
                        case 'auth/user-disabled':
                            errorMessage = 'Please get in touch with the inviter. Case LG02';
                            break;
                        case 'auth/user-not-found':
                            errorMessage = 'Please get in touch with the inviter. Case LG03';
                            break;
                        case 'auth/wrong-password':
                            errorMessage = 'Please get in touch with the inviter. Case LG04';
                            break;
                        case 'auth/invalid-login-credentials':
                            errorMessage = 'Please get in touch with the inviter. Case LG05';
                            break;
                        default:
                            errorMessage = 'Error signing in: ' + error.message;
                            break;
                    }
                    errorMessageElement.textContent = errorMessage;
                });
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            auth.signOut().then(() => {
                // Redirecionar para a página de login após o logout
                window.location.href = "index.html";
            }).catch((error) => {
                console.error("Error signing out: ", error);
            });
        });
    }

});
