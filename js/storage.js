/**
 * storage.js
 * ============================================
 * Capa de persistencia de Banca 360.
 *
 * El proyecto no permite backend ni base de datos,
 * así que usamos el localStorage del navegador como
 * "base de datos" simulada.
 *
 * REGLA IMPORTANTE:
 * El resto de la app (auth.js, dashboard.js, theme.js,
 * etc.) NUNCA debe llamar a localStorage directamente.
 * Siempre pasa por este módulo. Así:
 *   - No esparcimos strings mágicos por el código.
 *   - Centralizamos la conversión a/desde JSON.
 *   - Si mañana cambiamos el backend, cambiamos solo
 *     este archivo.
 * ============================================
 */

const Storage = {

  /* --------- Claves usadas en localStorage ---------
     Prefijo "banca360." para no chocar con otras apps
     en el mismo dominio (importante en GitHub Pages). */
  KEYS: {
    THEME:        'banca360.theme',
    USERS:        'banca360.users',
    SESSION:      'banca360.session',
    TRANSACTIONS: 'banca360.transactions'
  },

  /* ============================================
     HELPERS INTERNOS
     localStorage solo guarda strings, por eso todo
     entra/sale con JSON.stringify / JSON.parse.
  ============================================ */
  _get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      console.warn('Storage: error leyendo', key, e);
      return fallback;
    }
  },

  _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage: error escribiendo', key, e);
    }
  },

  /* ============================================
     TEMA  (lo usa theme.js)
  ============================================ */
  getTheme() {
    return this._get(this.KEYS.THEME, 'light');
  },

  setTheme(theme) {
    this._set(this.KEYS.THEME, theme);
  },

  /* ============================================
     USUARIOS
     Estructura de un usuario:
     {
       id:        "id-..."         (autogenerado, único)
       cedula:    "V-12345678"
       email:     "juan@mail.com"
       fullName:  "Juan Pérez"
       password:  "123456"          (6 dígitos numéricos)
       balance:   1500.00
       securityQuestions: [
         { question: "...", answer: "..." },
         { question: "...", answer: "..." }
       ],
       createdAt: ISO string
     }
  ============================================ */
  getUsers() {
    return this._get(this.KEYS.USERS, []);
  },

  saveUser(user) {
    const users = this.getUsers();
    users.push(user);
    this._set(this.KEYS.USERS, users);
    return user;
  },

  /** Busca un usuario por cédula O por email.
   *  Retorna el usuario o undefined. */
  findUser(identifier) {
    if (!identifier) return undefined;
    const id = identifier.trim().toLowerCase();
    return this.getUsers().find(u =>
      u.cedula.toLowerCase() === id ||
      u.email.toLowerCase()  === id
    );
  },

  /** Aplica un patch parcial sobre un usuario existente.
   *  Útil para cambio de contraseña, ajustes de saldo, etc. */
  updateUser(userId, patch) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...patch };
    this._set(this.KEYS.USERS, users);
    return users[idx];
  },

  /** ¿Ya existe alguien con esa cédula o email?
   *  Úsalo al registrar para impedir duplicados. */
  userExists(identifier) {
    return Boolean(this.findUser(identifier));
  },

  /* ============================================
     SESIÓN (quién está logueado ahora mismo)
     Solo guardamos el ID; al consultarlo cruzamos
     con la lista de usuarios.
  ============================================ */
  setSession(userId) {
    this._set(this.KEYS.SESSION, {
      userId,
      loginAt: new Date().toISOString()
    });
  },

  getSession() {
    return this._get(this.KEYS.SESSION, null);
  },

  clearSession() {
    localStorage.removeItem(this.KEYS.SESSION);
  },

  /** Atajo cómodo: usuario actualmente logueado o null.
   *  Lo usarás en TODAS las pantallas internas para
   *  saber a quién mostrarle datos. */
  getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;
    return this.getUsers().find(u => u.id === session.userId) || null;
  },

  /* ============================================
     TRANSACCIONES
     Estructura:
     {
       id:           "id-..."
       userId:       "id-..."           (dueño de la cuenta)
       type:         'transfer' | 'mobile_payment' | 'deposit'
       direction:    'in' | 'out'        (clave para los filtros)
       amount:       250.00
       date:         ISO string
       description:  "Pago de alquiler"
       counterparty: "María Pérez"       (a quién / de quién)
       reference:    "REF-1023"
     }
  ============================================ */
  getTransactions(userId) {
    const all = this._get(this.KEYS.TRANSACTIONS, []);
    if (!userId) return all;
    return all.filter(tx => tx.userId === userId);
  },

  addTransaction(tx) {
    const all = this._get(this.KEYS.TRANSACTIONS, []);
    all.push(tx);
    this._set(this.KEYS.TRANSACTIONS, all);
    return tx;
  },
  createTransaction(data) {
  const amount = Number(data.amount);

  if (!data.userId) {
    return {
      ok: false,
      message: 'No se indicó el usuario de la transacción.'
    };
  }

  if (!amount || amount <= 0) {
    return {
      ok: false,
      message: 'El monto debe ser mayor a cero.'
    };
  }

  const user = this.getUsers().find(u => u.id === data.userId);

  if (!user) {
    return {
      ok: false,
      message: 'Usuario no encontrado.'
    };
  }

  const direction = data.direction;

  if (direction === 'out' && user.balance < amount) {
    return {
      ok: false,
      message: 'Saldo insuficiente.'
    };
  }

  const tx = {
    id: this.uuid(),
    userId: data.userId,
    type: data.type,
    direction: data.direction,
    amount,
    date: new Date().toISOString(),
    description: data.description,
    counterparty: data.counterparty,
    reference: 'REF-' + Math.floor(100000 + Math.random() * 900000)
  };

  this.addTransaction(tx);

  const newBalance = direction === 'in'
    ? user.balance + amount
    : user.balance - amount;

  const updatedUser = this.updateUser(user.id, {
    balance: Number(newBalance.toFixed(2))
  });

  return {
    ok: true,
    transaction: tx,
    user: updatedUser
  };
},

  /* ============================================
     UTILIDADES
  ============================================ */

  /** Genera IDs únicos sin librerías externas. */
  uuid() {
    return 'id-' + Date.now().toString(36) + '-' +
           Math.random().toString(36).slice(2, 9);
  },

  /** Borra absolutamente todo. Solo para desarrollo. */
  resetAll() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
    console.info('Storage: todo borrado.');
  },

  /** Siembra un usuario demo con transacciones de prueba.
   *  Llámalo desde la consola del navegador (Storage.seed())
   *  para no tener que registrarte cada vez que limpies
   *  localStorage durante el desarrollo. */
  seed() {
    if (this.getUsers().length > 0) {
      console.info('Storage: ya hay usuarios, no se siembra.');
      return;
    }
    const demo = {
      id:        this.uuid(),
      cedula:    'V-12345678',
      email:     'demo@banca360.com',
      fullName:  'Demo Banca360',
      password:  '123456',
      balance:   1500.00,
      securityQuestions: [
        { question: '¿Color favorito?',    answer: 'azul'     },
        { question: '¿Nombre de mascota?', answer: 'firulais' }
      ],
      createdAt: new Date().toISOString()
    };
    this.saveUser(demo);

    [
      { type: 'deposit',        direction: 'in',  amount: 500, description: 'Depósito en taquilla',      counterparty: 'Cajero #14'   },
      { type: 'transfer',       direction: 'out', amount: 120, description: 'Pago alquiler',             counterparty: 'María Pérez'  },
      { type: 'mobile_payment', direction: 'out', amount:  35, description: 'Pago móvil — supermercado', counterparty: '0414-1234567' },
      { type: 'transfer',       direction: 'in',  amount: 200, description: 'Reembolso',                 counterparty: 'Luis Gómez'   }
    ].forEach((data, i) => {
      this.addTransaction({
        id:        this.uuid(),
        userId:    demo.id,
        date:      new Date(Date.now() - i * 86400000).toISOString(),
        reference: 'REF-' + (1000 + i),
        ...data
      });
    });

    console.info('Storage: usuario demo creado. Login con V-12345678 / 123456');
  }
};
window.BancaStorage = Storage;