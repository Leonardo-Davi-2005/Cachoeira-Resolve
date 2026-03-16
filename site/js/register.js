function registrar() {

    let nome = document.getElementById("nome").value
    let email = document.getElementById("email").value
    let senha = document.getElementById("senha").value
    let confirmar = document.getElementById("confirmarSenha").value

    if (senha !== confirmar) {
        alert("As senhas não coincidem!")
        return
    }

    let usuario = {
        nome: nome,
        email: email,
        senha: senha
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

    usuarios.push(usuario)

    localStorage.setItem("usuarios", JSON.stringify(usuarios))

    alert("Conta criada com sucesso!")

    window.location.href = "login.html"
}