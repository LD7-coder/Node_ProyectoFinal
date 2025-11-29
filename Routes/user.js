const express = require("express");
const jwt = require("jsonwebtoken");
const user = express.Router();
const db = require("../config/database");
const auth = require("../middleware/auth");


user.post("/signin",async (req,res,next)=>{
    const {user_name,user_mail,user_password} = req.body;
    if(user_name && user_mail && user_password){
        let query = `INSERT INTO \`users\`(user_name,user_mail,user_password)`;
        query += `VALUES ('${user_name}','${user_mail}','${user_password}')`;
        const rows = await db.query(query);

        if(rows.affectedRows == 1){
            return res.status(201).json({code:201,message:"Usuario registrado correctamente"});
        }
        return res.status(500).json({code:500,message:"Ocurrió un error"});
    }else{
        return res.status(500).json({code:500,message:"Campos incorrectos"});
    }
    
});

user.post("/login", async (req, res) => {
    try {
        const { user_name, user_password } = req.body;

        const query = `SELECT * FROM \`users\` WHERE user_name='${user_name}' AND user_password='${user_password}'`;
        const rows = await db.query(query);
        if (rows.length === 1) {
            const user = rows[0];  
            const token = jwt.sign(
                {
                    user_id: user.user_id,
                    user_name: user.user_name
                },
                "debugkey"
            );

            return res.status(200).json({ code: 200, message: token });
        } else {
            return res.status(401).json({ code: 401, message: "Usuario y/o contraseña incorrectos" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ code: 500, message: "Error en el servidor" });
    }
});


user.get("/", async(req,res,next)=>{
    const query = "SELECT * FROM \`users\`";
    const rows = await db.query(query);

    return res.status(200).json({code:200,message:rows});
});


// Agregar empleado
user.post("/add", auth, async (req, res) => {
    const { nombre_usuarios, correo_usuarios, contra_usuarios } = req.body;
    const query = `INSERT INTO usuarios (nombre_usuarios, correo_usuarios, contra_usuarios)
                   VALUES ('${nombre_usuarios}', '${correo_usuarios}', '${contra_usuarios}')`;

    const result = await db.query(query);
    return res.status(201).json({ message: "Empleado agregado", result });
});

// Modificar empleado
user.put("/modify/:id", auth, async (req, res) => {
    const { id } = req.params;
    const { nombre_usuarios, correo_usuarios, contra_usuarios } = req.body;

    const query = `UPDATE usuarios SET nombre_usuarios='${nombre_usuarios}', correo_usuarios='${correo_usuarios}', contra_usuarios='${contra_usuarios}'
                   WHERE id_usuarios = ${id}`;

    const result = await db.query(query);
    return res.status(200).json({ message: "Empleado modificado", result });
});

// Eliminar empleado
user.delete("/delete/:id", auth, async (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM usuarios WHERE id_usuarios = ${id}`;
    const result = await db.query(query);

    return res.status(200).json({ message: "Empleado eliminado" });
});

// Buscar empleado
user.get("/search/:name", auth, async (req, res) => {
    const { name } = req.params;
    const query = `SELECT * FROM usuarios WHERE nombre_usuarios LIKE '%${name}%'`;
    const result = await db.query(query);

    return res.status(200).json(result);
});

module.exports = user;