// Es defineix la configuració de sequelize
const Sequelize = require('sequelize'); // Importa la llibreria Sequelize

const bcrypt = require('bcrypt'); // Importa la llibreria bcrypt per a encriptar contrasenyes

const sequelize = new Sequelize('bolets', 'root', 'admin', {
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
  created_at: {
    type: Sequelize.TIMESTAMP,
    allowNull: true, // Es permet valor nul per a la foto
  },
  udated_at: {
    type: Sequelize.TIMESTAMP,
    allowNull: true, // Es permet valor nul per a la foto
  },
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

// Usuario.hasMany(Tarea); // Un usuari pot tenir molts tareas
// Tarea.belongsTo(Usuario, { foreignKey: 'usuarios_id' }); // Una Tarea pertany a un únic usuari
// Usuario.hasMany(Tarea);
// Tarea.belongsTo(Usuario, { foreignKey: 'author_id' });

Usuario.

Usuario.hasMany(Tarea);

Usuario.hasMany(Comment);
Comment.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Tarea.hasMany(Comment);
Comment.belongsTo(Tarea, { foreignKey: 'tareas_id' });

Usuario.hasMany(Proyecto);
Proyecto.belongsTo(Usuario, { foreignKey: 'usuarios_id' });

Proyecto.hasMany(Tarea);
Tarea.belongsTo(Proyecto, { foreignKey: 'proyectos_id' });

async function iniBD() {
  await sequelize.sync({ force: true });
}

// iniBD();

// Exporta els models per a poder ser utilitzats en altres parts de l'aplicació
module.exports = {
  Usuario,
  Tarea,
  Tag,
  Comment,
  Proyecto,
};
