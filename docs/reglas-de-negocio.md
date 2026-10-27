# Reglas de negocio (borrador v0.1)

Completar con el dominio del proyecto. Este documento es la fuente de verdad de lo que el sistema debe hacer: Claude Code lo lee antes de implementar cada funcionalidad.

Convenciones:

- Cada regla tiene un código (RN-001, RN-002...) para poder citarla en tareas, tests y commits.
- Cada vista tiene un código según quién la usa: VP (pública), VU (usuario con sesión), VA (administración).
- Lo marcado como **[A DEFINIR]** todavía no está decidido. No se implementa hasta resolverlo.

Las reglas y vistas de abajo ya las cumple el template: ajustalas o borralas según el proyecto.

---

## 1. Roles

| Rol           | Qué puede hacer                                 |
| ------------- | ----------------------------------------------- |
| Administrador | Todo                                            |
| Usuario       | Usar el sitio con su cuenta; no administra nada |
| [A DEFINIR]   | Roles propios del proyecto, con sus permisos    |

- **RN-001** El Administrador tiene acceso total al sistema.
- **RN-002** Un usuario puede tener varios roles a la vez.
- **RN-003** El ingreso es con Google. No hay registro aparte: el primer ingreso crea la cuenta con el rol Usuario, con el nombre y la foto de Google.
- **RN-004** Una cuenta sin roles está suspendida: solo ve un aviso con el formulario de contacto y puede cerrar sesión.

## 2. Reglas del dominio

- **RN-010** [A DEFINIR]

## 3. Vistas

### Públicas

- **VP-01** Portada. [A DEFINIR]
- **VP-02** Páginas de texto editables: preguntas frecuentes, quiénes somos y términos.
- **VP-03** Contacto: formulario, email y WhatsApp.

### Usuario

- **VU-01** Mi perfil: nombre y foto.

### Administración

- **VA-01** Usuarios y roles: cambiar roles, bloquear y dejar una nota interna.
- **VA-02** Mensajes de contacto.
- **VA-03** Contenido de las páginas de texto.
- **VA-04** Apariencia: paleta de colores para modo claro y oscuro, con control de contraste.

## 4. Preguntas abiertas

1. [A DEFINIR]
