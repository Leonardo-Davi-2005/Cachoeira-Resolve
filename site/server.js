const express = require("express")
const cors = require("cors")
const fs = require("fs")

const app = express()

app.use(cors())

// AUMENTAR LIMITE PARA FOTO
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

const arquivo = "chamados.json"


// PEGAR CHAMADOS
app.get("/chamados", (req, res) => {

    fs.readFile(arquivo, "utf8", (err, data) => {

        if (err) {
            return res.json([])
        }

        res.json(JSON.parse(data))

    })

})


// CRIAR CHAMADO
app.post("/chamados", (req, res) => {

    const novoChamado = req.body

    fs.readFile(arquivo, "utf8", (err, data) => {

        let chamados = []

        if (!err && data) {
            chamados = JSON.parse(data)
        }

        chamados.push(novoChamado)

        fs.writeFile(arquivo, JSON.stringify(chamados, null, 2), (erro) => {

            if (erro) {
                return res.status(500).send("Erro ao salvar")
            }

            res.send("Chamado salvo")

        })

    })

})


// ATUALIZAR CHAMADOS (ADM)
app.post("/salvar", (req, res) => {

    const chamados = req.body

    fs.writeFile(arquivo, JSON.stringify(chamados, null, 2), (erro) => {

        if (erro) {
            return res.status(500).send("Erro ao salvar")
        }

        res.send("Lista atualizada")

    })

})


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT)
})