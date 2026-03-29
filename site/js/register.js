function registrar() {

    let nome = document.getElementById("nome").value.trim()
    let email = document.getElementById("email").value.trim()
    let senha = document.getElementById("senha").value.trim()
    let confirmar = document.getElementById("confirmarSenha").value.trim()

    if (!nome || !email || !senha || !confirmar) {
        alert("Preencha todos os campos!")
        return
    }

    if (senha !== confirmar) {
        alert("As senhas não coincidem!")
        return
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

    // 🚨 evitar email duplicado
    let existe = usuarios.find(u => u.email === email)

    if (existe) {
        alert("Esse email já está cadastrado!")
        return
    }

    let usuario = {
        nome: nome,
        email: email,
        senha: senha
    }

    usuarios.push(usuario)

    localStorage.setItem("usuarios", JSON.stringify(usuarios))

    alert("Conta criada com sucesso!")

    window.location.href = "login.html"
}