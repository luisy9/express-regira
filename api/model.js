// Es defineix la configuració de sequelize
const Sequelize = require('sequelize'); // Importa la llibreria Sequelize

const bcrypt = require('bcrypt'); // Importa la llibreria bcrypt per a encriptar contrasenyes

const sequelize = new Sequelize('regira', 'root', 'my-secret-pw', {
  //host: 'localhost',
  host: 'localhost', //IP de la base de dades
  dialect: 'mysql', // connectem a mysql
  port: 3306,
});

// Es defineix el model de Proyecto
const Proyecto = sequelize.define('proyecto', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false, // No es permet valor nul per al nom
  },
  descripcion: {
    type: Sequelize.STRING,
    allowNull: true, // Es permet valor nul per a la descripció
  },
  active: {
    type: Sequelize.TINYINT, // Només es permeten aquests valors
    allowNull: false, // No es permet valor nul per al tipus
  },
  // created_at: {
  //   type: Sequelize.DataTypes.DATE,
  //   allowNull: true, // Es permet valor nul per a la foto
  //   defaultValue: Sequelize.DataTypes.NOW,
  // },
  // udated_at: {
  //   type: Sequelize.DataTypes.DATE,
  //   allowNull: true, // Es permet valor nul per a la foto
  //   defaultValue: Sequelize.DataTypes.NOW,
  // },
});

// Es defineix el model de Comment
const Comment = sequelize.define('comment', {
  title: {
    type: Sequelize.STRING,
    unique: true, // El nom del tag ha de ser únic
    allowNull: false, // No es permet valor nul per al nom
  },
});

// Es defineix el model d'usuari
const Usuario = sequelize.define('usuario', {
  email: {
    type: Sequelize.STRING,
    allowNull: false, // No es permet valor nul per al nom
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false, // No es permet valor nul per a l'email
    unique: true, // L'email ha de ser únic
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

const Tarea = sequelize.define('tarea', {
  tipo: {
    type: Sequelize.ENUM('feature', 'bug', 'task', 'history'),
    allowNull: false,
    unique: false,
  },

  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },

  prioridad: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },

  estado: {
    type: Sequelize.ENUM('doing', 'finished', 'paused'),
    allowNull: false,
    unique: false,
  },
});

const Tag = sequelize.define('tag', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },
});

// hook per encriptar la contrasenya abans de desar un nou usuari
Usuario.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10); // Encripta la contrasenya amb bcrypt
  user.password = hashedPassword;
});

// Establint relacions entre models
//Relaciones de muchos a muchos
Tarea.belongsToMany(Tag, { through: 'tareas_has_tags' }); // Relació de molts a molts entre Tareas i Tag
Tag.belongsToMany(Tarea, { through: 'tareas_has_tags' }); // Relació de molts a molts entre Tag i Tareas

Usuario.hasMany(Tarea, { foreignKey: 'usuarios_id' }); // Un usuari pot tenir molts tareas
Tarea.belongsTo(Usuario, { foreignKey: 'usuarios_id' }); // Una Tarea pertany a un únic usuari
Usuario.hasMany(Tarea, { foreignKey: 'author_id' });
Tarea.belongsTo(Usuario, { foreignKey: 'author_id' });

// Usuario.Usuario.hasMany(Tarea);

/* Crear relacion de un Usuario, un Usuario puede tener 
muchos comentarios y un comentario esta asignado a un usuario */
Usuario.hasMany(Comment, { foreignKey: 'usuario_id' });
Comment.belongsTo(Usuario, { foreignKey: 'usuario_id' });

/* Una Tarea puede tener muchos comentarios, pero un comentario esta solo en una Tarea */
Tarea.hasMany(Comment, { foreignKey: 'tareas_id' });
Comment.belongsTo(Tarea, { foreignKey: 'tareas_id' });

Usuario.hasMany(Proyecto, { foreignKey: 'usuarios_id' });
Proyecto.belongsTo(Usuario, { foreignKey: 'usuarios_id' });

Proyecto.hasMany(Tarea, { foreignKey: 'proyectos_id' });
Tarea.belongsTo(Proyecto, { foreignKey: 'proyectos_id' });

async function iniBD() {
  await sequelize.sync({ force: true });
}

//Comentamos para que no se sobreescriban las tablas
// iniBD();

// Exporta els models per a poder ser utilitzats en altres parts de l'aplicació
module.exports = {
  Usuario,
  Tarea,
  Tag,
  Comment,
  Proyecto,
};
