// CREACIÓN DE TABLAS EN POSTGRES
// CREATE TABLE transferencias (id SERIAL PRIMARY KEY, emisor varchar(50), receptor
// varchar(50), monto FLOAT, fecha TIMESTAMP, FOREIGN KEY (emisor) REFERENCES
// usuarios(nombre), FOREIGN KEY (receptor) REFERENCES usuarios(nombre));

// CREATE TABLE usuarios (id SERIAL, nombre VARCHAR(50) PRIMARY KEY,
// balance FLOAT CHECK (balance >= 0));

const { Pool } = require("pg")

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "abcdefg",
    database: "bancosolar",
    port: 5432
})

const guardarUsuario = async (usuario) => {
    const values = Object.values(usuario)
    const consulta = {
        text: "INSERT INTO usuarios (nombre, balance) values ($1, $2)",
        values
    }
    const result = await pool.query(consulta)
    return result
}

const getUsuarios = async () => {
    const { rows } = await pool.query("SELECT * FROM usuarios")
    return rows
}

const editUsuario = async (usuario, id) => {
    const values = Object.values(usuario)
    const consulta = {
        text: `UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = ${id} RETURNING *`,
        values
    } 
    const { rows } = await pool.query(consulta)
    return rows
}

const eliminarusuario = async (id) => {
    const { rows } = await pool.query(`DELETE FROM usuarios WHERE id = ${id}`)
    return rows
}

const registrarTransferencia = async (transferencia) => {
    const values = Object.values(transferencia)
    const registroTransferencia = {
        text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) values ($1, $2, $3, CURRENT_TIMESTAMP(0))",
        values
    }
    const descuentoTransferencia = {
        text: "UPDATE usuarios SET balance = balance - $1 where nombre = $2",
        values: [Number(values[2]), values[0]]
    }
    const sumaTransferencia = {
    text: "UPDATE usuarios SET balance = balance + $1 where nombre = $2",
    values: [Number(values[2]), values[1]]
    }
    try {
        await pool.query("BEGIN");
        await pool.query(registroTransferencia);
        await pool.query(descuentoTransferencia);
        await pool.query(sumaTransferencia);
        await pool.query("COMMIT");
        return true;
    } catch (error) {
        await pool.query("ROLLBACK");
        throw error
    }
}

const getTransferencias = async () => {
    const consulta = {
        text: "SELECT * FROM transferencias",
        rowMode: "array"
    }
    const { rows } = await pool.query(consulta)
    return rows
}

module.exports = {guardarUsuario, getUsuarios, editUsuario, eliminarusuario, registrarTransferencia, getTransferencias}