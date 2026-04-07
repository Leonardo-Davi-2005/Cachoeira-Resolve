async function carregarTodosChamados() {

    try {

        const res = await fetch("https://cachoeira-resolve.onrender.com/chamados")
        const lista = await res.json()

        let div = document.getElementById("todosChamados")

        if (lista.length === 0) {
            div.innerHTML = `
    <div style="text-align:center; padding:20px; opacity:0.7;">
        <h3>📭 Nenhum chamado ainda</h3>
        <p>Seja o primeiro a reportar um problema na cidade.</p>
    </div>
`
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

    function voltar() {
        window.history.back()
    }

}

window.onload = carregarTodosChamados