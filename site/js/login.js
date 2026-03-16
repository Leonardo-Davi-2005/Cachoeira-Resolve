function entrar(){

    let email = document.getElementById("email").value
    let senha = document.getElementById("senha").value

    if(email === "admin" && senha === "2026"){
        window.location.href = "../site/administrator.html"
        return
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

    let usuario = usuarios.find(u => u.email === email && u.senha === senha)

    if(usuario){

        localStorage.setItem("usuarioNome", usuario.nome)

        window.location.href = "../site/called.html"

    }else{

        alert("Usuário ou senha incorretos")

    }

}