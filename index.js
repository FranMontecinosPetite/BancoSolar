const express = require ("express");
const cors = require ("cors")
const app = express();


app.listen(3000, console.log("SERVER ON"))
app.use(express.json())
app.use(cors());

/* Importing the functions from the consultas.js file. */
const {guardarUsuario, getUsuarios, editUsuario, eliminarusuario, registrarTransferencia, getTransferencias} = require ("./consultas")

/* Sending the index.html file to the browser. */
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

/* Creating a new user. */
app.post ("/usuario", async (req, res) => {
    try {
        const usuario = req.body
        const result = await guardarUsuario(usuario)
        res.json(result)
    } catch (error) {
        res.send(error)
    }
})

/* Getting the users from the database. */
app.get ("/usuarios", async (req, res) => {
    try {
        const usuarios = await getUsuarios();
        res.json(usuarios)
    } catch (error) {
        res.send(error)
    }
})

/* Updating the user. */
app.put ("/usuario", async (req, res) => {
    try {
        const usuario = req.body
        const {id}= req.query       
        const result = await editUsuario(usuario, id)
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

/* Deleting the user from the database. */
app.delete ("/usuario", async (req, res) => {
    try {
        const {id}= req.query 
        await eliminarusuario(id)
        res.send("Usuario eliminado con éxito")
    } catch (error) {
        res.send(error)
    }
})

/* Creating a new transfer. */
app.post ("/transferencia", async (req, res) => {
    try {
        const transferencia = req.body
        const result = await registrarTransferencia(transferencia)
        res.json(result)
    } catch (error) {
        res.send(error)
    }
})

/* Getting the transfers from the database. */
app.get ("/transferencias", async (req, res) => {
    try {
        const transferencias = await getTransferencias()
        res.json(transferencias)
    } catch (error) {
        res.send(error)
    }
})