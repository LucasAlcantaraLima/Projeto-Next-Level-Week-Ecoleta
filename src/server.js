const express = require("express")
const server = express()

// pegar o banco de dados
const db = require("./database/db")


// configurar pasta publica
server.use(express.static("public"))

// habilitar o uso do req.body na nossa aplicacao
server.use(express.urlencoded({ extended: true }))


// utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true 
})


// configurar caminhos da minha aplicacao
// pagina inicial
// req: Requisicao
// res: Resposta
server.get("/", (req, res) => {
    return res.render("index.html", { title: "Seu marketplace de coleta de resíduos"})
})

server.get("/create-point", (req, res) => {

    // req.query: Query Strings da nossa url
    /* console.log(req.query) */



    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    // req.body: corpo do nosso formulario
    // console.log(req.body)

    // inserir dados no banco de dados
    db.run(`
        CREATE TABLE IF NOT EXISTS places (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT,
            name TEXT,
            address TEXT,
            address2 TEXT,
            state TEXT,
            city TEXT,
            items TEXT
        );
    `)

    // 2 Inserir dados na tabela
    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);`
    
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items

    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return  res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true})
    }

    db.run(query, values, afterInsertData)

})





server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        // pesquisa vazia
        return res.render("search-results.html", {total: 0})
    }

    // pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city = '${search}'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        // mostar a pagina html com os dados de banco de dados
        return res.render("search-results.html", { places: rows, total: total})
    })
    
})




// ligar o servidor
server.listen(3000)