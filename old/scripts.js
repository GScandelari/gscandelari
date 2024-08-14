document.addEventListener("DOMContentLoaded", function() {
    // Carregar o menu
    fetch("menu.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("menu").innerHTML = data;
        });

    // Função para limpar o formulário
    window.clearForm = function() {
        document.getElementById("user-form").reset();
    };

    // Função para alternar a exibição de uma seção
    function toggleSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            if (section.style.display === "none" || section.style.display === "") {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        } else {
            console.error(`Section with id '${sectionId}' not found.`);
        }
    }
    
    // Tornar a função toggleSection acessível globalmente
    window.toggleSection = toggleSection;

    // Função para carregar conteúdo dinâmico
    function loadContent(sectionId, url) {
        const section = document.getElementById(sectionId);
        if (section) {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text();
                })
                .then(data => {
                    section.innerHTML = data;
                })
                .catch(error => {
                    console.error('Failed to load content:', error);
                });
        } else {
            console.error(`Section with id '${sectionId}' not found.`);
        }
    }

    window.addEventListener('load', function() {
        loadContent('sobre-content', 'cv-sobre.html');
        loadContent('exp-prof-content', 'cv-exp-prof.html');
        loadContent('formacao-content', 'cv-formacao.html');
    });

    // Função para salvar o usuário (placeholder)
    window.saveUser = function() {
        const firstName = document.getElementById("first-name").value;
        const lastName = document.getElementById("last-name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (firstName && lastName && email && password) {
            const userList = document.getElementById("user-list");

            const userDiv = document.createElement("div");
            userDiv.className = "user";

            const userInfo = document.createElement("p");
            userInfo.textContent = `${firstName} ${lastName} - ${email}`;
            userDiv.appendChild(userInfo);

            const statusLabel = document.createElement("label");
            statusLabel.className = "switch";

            const statusCheckbox = document.createElement("input");
            statusCheckbox.type = "checkbox";
            statusCheckbox.checked = true;

            const statusSlider = document.createElement("span");
            statusSlider.className = "slider";

            statusLabel.appendChild(statusCheckbox);
            statusLabel.appendChild(statusSlider);

            userDiv.appendChild(statusLabel);
            userList.appendChild(userDiv);

            clearForm();
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    };
});
