async function carregarTodosChamados() {

    try {

        const res = await fetch("https://cachoeira-resolve.onrender.com/chamados")
        const lista = await res.json()

        let div = document.getElementById("todosChamados")

        if (lista.length === 0) {
            div.innerHTML = "Nenhum problema encontrado"
            return
        }

        div.innerHTML = ""

        lista.forEach(c => {

            let cor = "white"

            if (c.status === "Aberto") cor = "orange"
            if (c.status === "Andamento") cor = "blue"
            if (c.status === "Resolvido") cor = "green"
            if (c.status === "Rejeitado") cor = "red"

            div.innerHTML += `
                <div class="card">

                    ${c.foto ? `<img src="${c.foto}" style="width:100%;border-radius:8px;">` : ""}

                    <p><b>${c.categoriaSelecionada}</b></p>
                    <p>📍 ${c.local}</p>
                    <p style="color:${cor}">Status: ${c.status}</p>
                    <p>${c.descricaoTexto}</p>

                </div>
            `
        })

    } catch (erro) {
        console.log("Erro ao carregar")
    }

}

window.onload = carregarTodosChamados