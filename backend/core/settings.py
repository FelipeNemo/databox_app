from pathlib import Path
from celery.schedules import crontab

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-_5^d-v9u3_e8p_7cb2^nkkuxry!kn$62a1tbb+p2=s#s6q&&w#'
DEBUG = True
ALLOWED_HOSTS = ["*"]  # Em dev, pode deixar assim. Em prod, especifique os domínios.

# ---------------------------
# Apps
# ---------------------------
INSTALLED_APPS = [
    # Terceiros
    "jazzmin",
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "channels",
    "django_crontab",

    # Apps internos
    "userauths.apps.UserauthsConfig",
    "api",
    "notifications.apps.NotificationsConfig",

    # Django default
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

# ---------------------------
# Middlewares
# ---------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # precisa vir antes do CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ---------------------------
# Autenticação
# ---------------------------
AUTH_USER_MODEL = "userauths.User"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}

CORS_ALLOW_ALL_ORIGINS = True  # Em prod, troque para lista específica

# ---------------------------
# URLs e Templates
# ---------------------------
ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"
ASGI_APPLICATION = "core.asgi.application"

# ---------------------------
# Banco de dados
# ---------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ---------------------------
# Channels (WebSockets)
# ---------------------------
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],  # precisa ter Redis rodando
        },
    },
}

# ---------------------------
# Celery e Crontab
# ---------------------------
CRONJOBS = [
    ("0 8 * * *", "notifications.tasks.notificar_todos_bom_dia"),
]

CELERY_BEAT_SCHEDULE = {
    "notificacao_bom_dia": {
        "task": "notifications.tasks.enviar_notificacoes_bom_dia",
        "schedule": crontab(hour=8, minute=0),
    },
}

# ---------------------------
# Segurança e Senhas
# ---------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ---------------------------
# Localização
# ---------------------------
LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True

# ---------------------------
# Arquivos estáticos e mídia
# ---------------------------
STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------------------
# Jazzmin Admin
# ---------------------------
JAZZMIN_SETTINGS = {
    "site_title": "Databox",
    "site_header": "Databox",
    "site_brand": "Databox",
    "welcome_sign": "Bem-vindo ao Databox admin",
    "copyright": "Databox © 2025 Alright Reserved",
    "search_model": "auth.User",
    "user_avatar": "profile.image",
    "topmenu_links": [
        {"name": "Início", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Site Público", "url": "/", "new_window": True},
        {"name": "Documentação", "url": "https://docs.djangoproject.com/", "new_window": True},
    ],
    "icons": {
        "auth": "fas fa-users-cog",
        "userauths.User": "fas fa-user",
        "userauths.Profile": "fas fa-id-badge",
    },
    "related_modal_active": True,
    "show_ui_builder": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "order_with_respect_to": ["auth", "userauths"],
    "custom_css": None,
    "custom_js": None,
    "changeform_format": "horizontal_tabs",
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": True,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-dark",
    "accent": "accent-info",
    "navbar": "navbar-dark",
    "no_navbar_border": False,
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": False,
    "sidebar": "sidebar-dark-info",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": False,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "darkly",
    "dark_mode_theme": "darkly",
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success",
    },
    "actions_sticky_top": True,
}
