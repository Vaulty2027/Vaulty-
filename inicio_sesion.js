// ==========================================
// FIREBASE
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ==========================================
// SISTEMA DE NOTIFICACIONES
// ==========================================

class NotificationSystem {
  constructor() {
    this.container = document.getElementById('notificationContainer');
    this.notifications = [];
    this.maxNotifications = 5;
  }

  show(options) {
    const {
      type = 'info',
      title = '',
      message = '',
      duration = 5000,
      icon = null
    } = options;

    while (this.container.children.length >= this.maxNotifications) {
      this.container.removeChild(this.container.firstChild);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    const iconContent = icon || icons[type] || 'ℹ';

    notification.innerHTML = `
      <span class="notification-icon">${iconContent}</span>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" aria-label="Cerrar notificación">✕</button>
      <div class="notification-progress">
        <div class="notification-progress-bar" style="width: 100%"></div>
      </div>
    `;

    this.container.appendChild(notification);

    requestAnimationFrame(() => {
      notification.style.animation = 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    });

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.close(notification);
    });

    const progressBar = notification.querySelector('.notification-progress-bar');
    let startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.max(0, 1 - elapsed / duration);
      progressBar.style.width = `${progress * 100}%`;

      if (progress > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);

    const timeoutId = setTimeout(() => {
      this.close(notification);
    }, duration);

    notification._timeoutId = timeoutId;

    return notification;
  }

  close(notification) {
    if (notification._removing) return;
    notification._removing = true;

    if (notification._timeoutId) {
      clearTimeout(notification._timeoutId);
    }

    notification.classList.add('removing');

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  success(title, message, duration = 4000) {
    return this.show({ type: 'success', title, message, duration });
  }

  error(title, message, duration = 5000) {
    return this.show({ type: 'error', title, message, duration });
  }

  warning(title, message, duration = 4000) {
    return this.show({ type: 'warning', title, message, duration });
  }

  info(title, message, duration = 4000) {
    return this.show({ type: 'info', title, message, duration });
  }
}

const notifications = new NotificationSystem();

// ==========================================
// CONFIGURACIÓN DE FIREBASE
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyBBepHzYPwHrw8wQuFNL_l1_AB5ESj9rio",
  authDomain: "vaulty-b424c.firebaseapp.com",
  projectId: "vaulty-b424c",
  storageBucket: "vaulty-b424c.firebasestorage.app",
  messagingSenderId: "809116620693",
  appId: "1:809116620693:web:392a1a0d9999f826c1489c",
  measurementId: "G-QKHD8GL492"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// FORMULARIO DE LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("loginPassword").value;
  const remember = document.getElementById("remember").checked;
  const submitButton = loginForm.querySelector(".submit-btn");

  // ==========================================
  // VALIDACIONES
  // ==========================================

  if (!identifier || !password) {
    notifications.warning(
      'Campos incompletos',
      'Completa tu correo/usuario y contraseña para iniciar sesión.'
    );
    return;
  }

  try {
    submitButton.disabled = true;
    submitButton.textContent = "Iniciando sesión...";

    // ==========================================
    // DEFINIR SI ES CORREO O USERNAME
    // ==========================================

    let emailToLogin = identifier;

    if (!identifier.includes("@")) {
      const username = identifier.toLowerCase();

      const usernameQuery = query(
        collection(db, "users"),
        where("username", "==", username)
      );

      const usernameSnapshot = await getDocs(usernameQuery);

      if (usernameSnapshot.empty) {
        notifications.error(
          'Usuario no encontrado',
          `No encontramos una cuenta con el nombre de usuario "${username}".`
        );
        submitButton.disabled = false;
        submitButton.textContent = "Iniciar sesión";
        return;
      }

      const userData = usernameSnapshot.docs[0].data();
      emailToLogin = userData.email;

      if (!emailToLogin) {
        notifications.error(
          'Error en la cuenta',
          'Esta cuenta no tiene un correo asociado. Contacta con soporte.'
        );
        submitButton.disabled = false;
        submitButton.textContent = "Iniciar sesión";
        return;
      }
    }

    // ==========================================
    // RECORDAR SESIÓN
    // ==========================================

    await setPersistence(
      auth,
      remember ? browserLocalPersistence : browserSessionPersistence
    );

    // ==========================================
    // INICIAR SESIÓN
    // ==========================================

    await signInWithEmailAndPassword(auth, emailToLogin, password);

    // ==========================================
    // LOGIN CORRECTO
    // ==========================================

    notifications.success(
      '¡Bienvenido de nuevo! 🎉',
      'Has iniciado sesión correctamente. Serás redirigido al inicio...'
    );

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);

  } catch (error) {
    console.error("Error de Firebase:", error);

    switch (error.code) {
      case "auth/invalid-credential":
        notifications.error(
          'Credenciales incorrectas',
          'El correo/usuario o la contraseña son incorrectos. Verifica tus datos.'
        );
        break;
      case "auth/user-not-found":
        notifications.error(
          'Usuario no encontrado',
          'No existe una cuenta con estos datos. ¿Deseas registrarte?'
        );
        break;
      case "auth/wrong-password":
        notifications.error(
          'Contraseña incorrecta',
          'La contraseña ingresada es incorrecta. Inténtalo de nuevo.'
        );
        break;
      case "auth/invalid-email":
        notifications.error(
          'Correo inválido',
          'El correo electrónico ingresado no es válido. Verifica el formato.'
        );
        break;
      case "auth/user-disabled":
        notifications.error(
          'Cuenta deshabilitada',
          'Esta cuenta ha sido deshabilitada. Contacta con soporte.'
        );
        break;
      case "auth/too-many-requests":
        notifications.error(
          'Demasiados intentos',
          'Has realizado demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
        );
        break;
      case "auth/network-request-failed":
        notifications.error(
          'Error de conexión',
          'No hay conexión con el servidor. Revisa tu conexión a Internet.'
        );
        break;
      default:
        notifications.error(
          'Error al iniciar sesión',
          'No se pudo iniciar sesión. Intenta nuevamente más tarde.'
        );
    }
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Iniciar sesión";
  }
});

// ==========================================
// GOOGLE
// ==========================================

const googleButton = document.querySelector('[data-provider="Google"]');

if (googleButton) {
  googleButton.addEventListener("click", async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      notifications.success(
        '¡Bienvenido! 👋',
        'Has iniciado sesión con Google correctamente.'
      );

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);

    } catch (error) {
      console.error("Error con Google:", error);

      if (error.code !== "auth/popup-closed-by-user") {
        notifications.error(
          'Error con Google',
          'No se pudo iniciar sesión con Google. Inténtalo de nuevo.'
        );
      }
    }
  });
}

// ==========================================
// RECUPERAR CONTRASEÑA
// ==========================================

const forgotLink = document.querySelector(".forgot-link");

if (forgotLink) {
  forgotLink.addEventListener("click", async (event) => {
    event.preventDefault();

    const identifier = document.getElementById("identifier").value.trim();

    if (!identifier) {
      notifications.warning(
        'Correo requerido',
        'Escribe primero tu correo electrónico para recuperar tu contraseña.'
      );
      document.getElementById("identifier").focus();
      return;
    }

    if (!identifier.includes("@")) {
      notifications.warning(
        'Correo inválido',
        'Para recuperar tu contraseña debes escribir un correo electrónico válido.'
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, identifier);
      
      notifications.success(
        'Correo enviado 📧',
        'Te enviamos un correo con las instrucciones para restablecer tu contraseña.'
      );
    } catch (error) {
      console.error("Error recuperando contraseña:", error);

      switch (error.code) {
        case "auth/user-not-found":
          notifications.error(
            'Usuario no encontrado',
            'No existe una cuenta con ese correo electrónico.'
          );
          break;
        case "auth/invalid-email":
          notifications.error(
            'Correo inválido',
            'El correo electrónico ingresado no es válido.'
          );
          break;
        default:
          notifications.error(
            'Error al enviar correo',
            'No se pudo enviar el correo de recuperación. Intenta nuevamente.'
          );
      }
    }
  });
}

// ==========================================
// MOSTRAR / OCULTAR CONTRASEÑA
// ==========================================

document.querySelectorAll(".toggle-visibility").forEach(button => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.target;
    const input = document.getElementById(targetId);

    if (input.type === "password") {
      input.type = "text";
      button.setAttribute("aria-label", "Ocultar contraseña");
    } else {
      input.type = "password";
      button.setAttribute("aria-label", "Mostrar contraseña");
    }
  });
});