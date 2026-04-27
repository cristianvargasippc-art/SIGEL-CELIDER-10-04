// userManagement.js - Sistema de roles para jueces
// Usa las mismas referencias de Firebase que index.html

// Función para crear un JUEZ con rol específico
async function crearJuez(email, password, nombreCompleto, comision) {
  try {
    // 1. Crear usuario en Firebase Authentication
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;
    
    // 2. Guardar en Realtime Database con ROL DE JUEZ
    await firebase.database().ref('admins/' + uid).set({
      role: 'comadmin',  // ← ROL DE JUEZ (en tu sistema se llama comadmin)
      comision: comision,
      nombre: nombreCompleto,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      activo: true
    });
    
    console.log('✅ Juez creado exitosamente:', email);
    return { 
      success: true, 
      uid: uid,
      message: `Juez ${nombreCompleto} creado para ${comision}` 
    };
    
  } catch (error) {
    console.error('❌ Error creando juez:', error);
    
    // Mensajes de error en español
    const errorMessages = {
      'auth/email-already-in-use': 'Este email ya está registrado',
      'auth/invalid-email': 'Email inválido',
      'auth/weak-password': 'Contraseña muy débil (mínimo 6 caracteres)',
      'auth/operation-not-allowed': 'Operación no permitida'
    };
    
    return { 
      success: false, 
      error: errorMessages[error.code] || error.message 
    };
  }
}

// Función para verificar si un usuario es juez/admin
async function esJuez(uid) {
  try {
    const snapshot = await firebase.database().ref('admins/' + uid).once('value');
    const data = snapshot.val();
    return data && (data.role === 'comadmin' || data.role === 'superadmin');
  } catch (error) {
    console.error('Error verificando rol:', error);
    return false;
  }
}

// Función para obtener la comisión asignada a un juez
async function getComisionJuez(uid) {
  try {
    const snapshot = await firebase.database().ref('admins/' + uid).once('value');
    const data = snapshot.val();
    return data ? data.comision : null;
  } catch (error) {
    console.error('Error obteniendo comisión:', error);
    return null;
  }
}

// Exportar las funciones (si usas módulos)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { crearJuez, esJuez, getComisionJuez };
}