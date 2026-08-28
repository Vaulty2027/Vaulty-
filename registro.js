import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
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
      type = 'info', // success, error, warning, info
      title = '',
      message = '',
      duration = 5000,
      icon = null
    } = options;

    // Si hay muchas notificaciones, eliminar la más antigua
    while (this.container.children.length >= this.maxNotifications) {
      this.container.removeChild(this.container.firstChild);
    }

    // Crear la notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Iconos predeterminados según tipo
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

    // Agregar al contenedor
    this.container.appendChild(notification);

    // Animación de entrada
    requestAnimationFrame(() => {
      notification.style.animation = 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    });

    // Evento para cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.close(notification);
    });

    // Barra de progreso
    const progressBar = notification.querySelector('.notification-progress-bar');
    let startTime = Date.now();
    let remaining = duration;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.max(0, 1 - elapsed / duration);
      progressBar.style.width = `${progress * 100}%`;

      if (progress > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    // Iniciar animación de progreso
    requestAnimationFrame(updateProgress);

    // Auto-cerrar después de la duración
    const timeoutId = setTimeout(() => {
      this.close(notification);
    }, duration);

    // Guardar referencia para poder cancelar
    notification._timeoutId = timeoutId;

    return notification;
  }

  close(notification) {
    if (notification._removing) return;
    notification._removing = true;

    // Cancelar el timeout
    if (notification._timeoutId) {
      clearTimeout(notification._timeoutId);
    }

    // Animación de salida
    notification.classList.add('removing');

    // Eliminar después de la animación
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

// Inicializar el sistema de notificaciones
const notifications = new NotificationSystem();

// ==========================================
// FIREBASE
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
// FORMULARIO
// ==========================================

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // ==========================================
  // OBTENER DATOS
  // ==========================================

  const fullName = document.getElementById("fullName").value.trim();
  const username = document.getElementById("username").value.trim().toLowerCase();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const birthdate = document.getElementById("birthdate").value;
  const country = document.getElementById("country").value;
  const phone = document.getElementById("phone").value.trim();
  const terms = document.getElementById("terms").checked;
  const privacy = document.getElementById("privacy").checked;
  const captcha = document.getElementById("captcha").checked;

  // ==========================================
  // VALIDACIONES CON NOTIFICACIONES
  // ==========================================

  if (!fullName || !username || !email || !password || !confirmPassword) {
    notifications.warning(
      'Campos incompletos',
      'Por favor, completa todos los campos obligatorios.'
    );
    return;
  }

  if (password !== confirmPassword) {
    notifications.error(
      'Contraseñas no coinciden',
      'Las contraseñas ingresadas no son iguales. Verifica e inténtalo de nuevo.'
    );
    return;
  }

  if (password.length < 8) {
    notifications.warning(
      'Contraseña demasiado corta',
      'La contraseña debe tener mínimo 8 caracteres.'
    );
    return;
  }

  if (!/[A-Z]/.test(password)) {
    notifications.warning(
      'Falta una mayúscula',
      'La contraseña debe incluir al menos una letra mayúscula.'
    );
    return;
  }

  if (!/[0-9]/.test(password)) {
    notifications.warning(
      'Falta un número',
      'La contraseña debe incluir al menos un número.'
    );
    return;
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    notifications.warning(
      'Falta un símbolo',
      'La contraseña debe incluir al menos un símbolo especial (ej: @, #, $, etc).'
    );
    return;
  }

  if (!terms || !privacy) {
    notifications.warning(
      'Acepta los términos',
      'Debes aceptar los Términos y Condiciones y la Política de Privacidad.'
    );
    return;
  }

  if (!captcha) {
    notifications.warning(
      'Verificación requerida',
      'Por favor, confirma que no eres un robot.'
    );
    return;
  }

  const submitButton = signupForm.querySelector(".submit-btn");

  try {
    submitButton.disabled = true;
    submitButton.textContent = "Creando cuenta...";

    // ==========================================
    // COMPROBAR USERNAME
    // ==========================================

    const usernameQuery = query(
      collection(db, "users"),
      where("username", "==", username)
    );

    const usernameSnapshot = await getDocs(usernameQuery);

    if (!usernameSnapshot.empty) {
      notifications.error(
        'Nombre de usuario no disponible',
        `El nombre de usuario "${username}" ya está en uso. Por favor, elige otro.`
      );
      submitButton.disabled = false;
      submitButton.textContent = "Crear cuenta";
      return;
    }

    // ==========================================
    // CREAR USUARIO EN FIREBASE AUTH
    // ==========================================

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // ==========================================
    // GUARDAR NOMBRE EN AUTH
    // ==========================================

    await updateProfile(user, {
      displayName: fullName
    });

    // ==========================================
    // GUARDAR INFORMACIÓN EN FIRESTORE
    // ==========================================

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        fullName: fullName,
        username: username,
        email: email,
        birthdate: birthdate || null,
        country: country || null,
        phone: phone || null,
        createdAt: serverTimestamp()
      }
    );

    // ==========================================
    // ÉXITO
    // ==========================================

    notifications.success(
      '¡Cuenta creada con éxito! 🎉',
      'Bienvenido a Vaulty+. Serás redirigido al inicio...'
    );

    // Esperar un momento antes de redirigir
    setTimeout(() => {
      window.location.href = "index-inicio.html";
    }, 2500);

  } catch (error) {
    console.error("Error Firebase:", error);

    switch (error.code) {
      case "auth/email-already-in-use":
        notifications.error(
          'Correo ya registrado',
          'Este correo electrónico ya tiene una cuenta asociada. ¿Deseas iniciar sesión?'
        );
        break;
      case "auth/invalid-email":
        notifications.error(
          'Correo inválido',
          'El correo electrónico ingresado no es válido. Por favor, verifica el formato.'
        );
        break;
      case "auth/weak-password":
        notifications.error(
          'Contraseña débil',
          'La contraseña es demasiado débil. Intenta con una combinación más segura.'
        );
        break;
      case "auth/network-request-failed":
        notifications.error(
          'Error de conexión',
          'No se pudo conectar con el servidor. Revisa tu conexión a internet.'
        );
        break;
      default:
        notifications.error(
          'Error al crear la cuenta',
          'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.'
        );
    }
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Crear cuenta";
  }
});

// ==========================================
// MOSTRAR / OCULTAR CONTRASEÑA
// ==========================================

document.querySelectorAll(".toggle-visibility").forEach(button => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.target);

    if (target.type === "password") {
      target.type = "text";
      button.setAttribute("aria-label", "Ocultar contraseña");
    } else {
      target.type = "password";
      button.setAttribute("aria-label", "Mostrar contraseña");
    }
  });
});

// ==========================================
// GOOGLE
// ==========================================

const googleButton = document.querySelector('[data-provider="Google"]');

if (googleButton) {
  googleButton.addEventListener("click", async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          fullName: user.displayName || "",
          email: user.email || "",
          username: user.email ? user.email.split("@")[0].toLowerCase() : "",
          createdAt: serverTimestamp()
        },
        {
          merge: true
        }
      );

      notifications.success(
        '¡Bienvenido! 👋',
        'Has iniciado sesión con Google correctamente.'
      );

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);

    } catch (error) {
      console.error(error);
      if (error.code !== "auth/popup-closed-by-user") {
        notifications.error(
          'Error con Google',
          'No se pudo iniciar sesión con Google. Inténtalo de nuevo.'
        );
      }
    }
  });
}

// Exportar el sistema de notificaciones para uso en otros módulos
export { notifications };