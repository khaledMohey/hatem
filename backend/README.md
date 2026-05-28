# ATHR CORE Backend

Django REST Framework backend for the ATHR storefront. It stores products, product colors/sizes, and checkout orders.

## Local setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed_athr
python manage.py createsuperuser
python manage.py runserver
```

The API will run at `http://127.0.0.1:8000/api`.

Frontend env values:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_ADMIN_API_TOKEN=dev-admin-token
```

Keep `ATHR_ADMIN_TOKEN` in the backend and `VITE_ADMIN_API_TOKEN` in the frontend the same value for product admin actions.

## API

- `GET /api/products/`
- `GET /api/products/<id>/`
- `POST /api/products/` with `X-Admin-Token`
- `PUT/PATCH /api/products/<id>/` with `X-Admin-Token`
- `DELETE /api/products/<id>/` with `X-Admin-Token`
- `POST /api/orders/`
- `GET /api/orders/` with `X-Admin-Token`

Product filters:

- `category=Hoodies`
- `sale=1`
- `q=hoodie`
- `sort=low` or `sort=high`

## PythonAnywhere deployment

1. Upload or clone the repository on PythonAnywhere.
2. Open a Bash console and create a virtualenv:

```bash
cd ~/obsidian-storefront-main/backend
python3.10 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

3. Configure environment variables in the PythonAnywhere Web app page, or export them in the WSGI file:

```bash
DJANGO_SECRET_KEY=replace-with-a-long-random-secret
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=yourusername.pythonanywhere.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
ATHR_ADMIN_TOKEN=replace-with-a-private-token
```

For a single PythonAnywhere deployment where Django also serves built frontend static files later, set `CORS_ALLOWED_ORIGINS` to your PythonAnywhere domain.

4. Run database setup:

```bash
python manage.py migrate
python manage.py seed_athr
python manage.py createsuperuser
python manage.py collectstatic
```

Payment screenshots are stored in `backend/media/payment-screenshots/` locally. On PythonAnywhere, add a static files mapping for uploaded media:

- URL: `/media/`
- Directory: `/home/yourusername/obsidian-storefront-main/backend/media`

5. In the PythonAnywhere Web app config:

- Source code: `/home/yourusername/obsidian-storefront-main/backend`
- Working directory: `/home/yourusername/obsidian-storefront-main/backend`
- Virtualenv: `/home/yourusername/obsidian-storefront-main/backend/.venv`
- WSGI file should import `athr_backend.wsgi.application`.

Example WSGI file:

```python
import os
import sys

path = "/home/yourusername/obsidian-storefront-main/backend"
if path not in sys.path:
    sys.path.insert(0, path)

os.environ["DJANGO_SETTINGS_MODULE"] = "athr_backend.settings"
os.environ["DJANGO_SECRET_KEY"] = "replace-with-a-long-random-secret"
os.environ["DJANGO_DEBUG"] = "False"
os.environ["DJANGO_ALLOWED_HOSTS"] = "yourusername.pythonanywhere.com"
os.environ["CORS_ALLOWED_ORIGINS"] = "https://your-frontend-domain.com"
os.environ["ATHR_ADMIN_TOKEN"] = "replace-with-a-private-token"

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

6. Reload the web app, then test:

```bash
curl https://yourusername.pythonanywhere.com/api/products/
```

## Notes

- SQLite is the default database and is fine for a small catalog. PythonAnywhere MySQL can be added later by changing `DATABASES` in `athr_backend/settings.py`.
- Product images are URL fields. The easiest way to use an image from your device is to upload it to a public image host, then paste the direct image URL in the product color image field. Good options: Cloudinary, Imgur, Postimages, or a GitHub repository raw file. The URL should end with an image file or return an image directly, for example `https://res.cloudinary.com/.../hoodie.jpg`.
- Do not use local paths like `C:\Users\...\image.jpg` for product images. Browsers cannot load those paths for other users or from PythonAnywhere.
- The storefront keeps cart and wishlist in the browser, then sends a final order to Django on checkout.
- Checkout supports cash on delivery and InstaPay. InstaPay orders require a payment screenshot upload.
