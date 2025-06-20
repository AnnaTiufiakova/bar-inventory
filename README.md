# Bar Inventory app project

## Setting up the environment and creating django project

1. Install Django and Django REST Framework
```
pip install django djangorestframework
```
2. Create Django Project

django-admin startproject backend .
3. Create Inventory App

python manage.py startapp inventory

4. Add Apps to INSTALLED_APPS
Edit backend/settings.py:

INSTALLED_APPS = [
    ...
    'rest_framework',
    'inventory',
]
5. Initial Database Setup
```
python manage.py migrate
```
6. Create Superuser (for admin access)

python manage.py createsuperuser
7. Run Development Server
```
python manage.py runserver
```
Now the backend is live at: http://127.0.0.1:8000/


## Defining the data model

1. Open models.py:
Go to: /inventory/models.py

2. Describe what data the app will store in the database in the models.py file

3. Turn the models into database tables:
```
python manage.py makemigrations
python manage.py migrate
```
## Register the models in the Django admin panel 

1. Register models in admin.py
Open the file "/inventory/admin.py". And add the following:

from django.contrib import admin
from .models import Category, Item

admin.site.register(Category)
admin.site.register(Item)

2. Access the Admin Panel
Start the server (if it's not running):
```
python manage.py runserver
```
3. Open your browser and go to:

http://127.0.0.1:8000/admin
Log in using your superuser credentials. You should see: Category, Item
You can now add inventory items manually via the web interface.

## Adding Categories and Items via Admin Panel

1. Open the admin panel:
Go to http://127.0.0.1:8000/admin and log in with your superuser credentials.

2. Add a few categories:
Click "Categories" → "Add Category"
Examples:
Liquor
Beer
Wine
Soft Drinks
Glassware, ect.

3. Add inventory items:
Click "Items" → "Add Item"

Example item:
Name: Vodka
Category: Liquor
Unit: ml
Quantity: 1000
Cost per unit: 0.75

Repeat this to add several test items under different categories.


## Admin panel CRUD
1. Customize Item admin form based on category

Glassware → name, category, quantity

Beer → name, category, unit, quantity

Wine / Liquor → name, category, unit, quantity, empty_bottle

NB! Django does not handle dynamic form rendering, but it can be achieved together with JS

2. Update  Item model with the new field empty_bottle in inventory/models.py

Then run:

python manage.py makemigrations
python manage.py migrate

## Public/facing CRUD views

1. Create urls.py inside the inventory app folder

bar_inventory/inventory/urls.py

2. Link the app URLs in the project-level urls.py (in the backend folder)

bar_inventory/backend/urls.py

3. Create views in inventory/views.py

4. Create a form for Item in inventory/forms.py

5. Create a templates folder
In the inventory app folder create a folder named templates. Inside it, create a subfolder named inventory.

Inside inventory, create these 3 files:

inventory/
│
├── templates/
│   └── inventory/
│       ├── item_list.html            – list all items
│       ├── item_form.html            – form for create & update items
│       └── item_confirm_delete.html   – confirm before deleting an item


6. Add URLs to inventory/urls.py to connect those templates to the Django app via URL patterns.


## Set up React for the Frontend

1. Install Django REST framework
```
pip install djangorestframework
```
2. I the settings.py add 'rest_framework' to INSTALLED_APPS

## Create serializers (serializers convert Django models into JSON data)

1. Create inventory/serializer.py

## Create API view 

1. In the views.py create classes ViewSet for category and item / to expose full CRUD endpoints for both models

## Add API URLs using a Router

1. create inventory/api_urls.py 
2. In the backend/urls.py include API

At this moment we have:
http://127.0.0.1:8000/ current THML interface
http://127.0.0.1:8000/api/items API (for React to use)


## React + Django integration for frontend
 - Create the React frontend app using create-react-app.
 - Cleane up boilerplate files from src/.
 - Install and configured django-cors-headers in Django to allow frontend-backend communication.
 - Confirm that both Django (localhost:8000) and React (localhost:3000) can run independently.
 - Verify API endpoints are working from Django backend.

1. To use React, we need Node.js, which includes both npm and npx.

Go to the official website: https://nodejs.org

Download the LTS version (recommended for most users)

Run the installer:

Check the box that says “Add to PATH” during installation

Finish the installation

2. Verify installation
After installation, restart the terminal and run:
```
node -v
npm -v
npx -v
```
You should see version numbers for each.

3. Set up the React app
Navigate to the root of the Django project (same level as manage.py):
```
npx create-react-app frontend
```
This creates a frontend/ directory with the React code.

4. Clean up React boilerplate
Inside the new frontend folder, remove unneeded files:
```
cd frontend
del src\logo.svg
del src\App.test.js
del src\reportWebVitals.js
del src\setupTests.js
```
Edit src/App.js file to a minimal version:
```
import React from "react";

function App() {
  return (
    <div className="App">
      <h1>Bar Inventory App</h1>
    </div>
  );
}

export default App;
```
You can also delete the logo and adjust App.css or index.css later.

4. In the file src\index.js delete the following lines:
```
import reportWebVitals from './reportWebVitals';
reportWebVitals();
```
5. Start React Dev Server
```
npm start
```
It will launch the React app on http://localhost:3000.

6. Install axios for AIP  requests
```
npm install axios
```
7.  Create a basic component to fetch and display items
Inside frontend/src, create a new folder components, and inside it files ItemList.js and Categories.js.

8. Render the ItemList and Categories components
Open src/App.js and add these line to the code:
```
import ItemList from "./components/ItemList";
import Categories from "./components/Categories";
<Categories />
```

9. Enable CORS in Django
So React can talk to Django, install CORS headers in the backend (same level as manage.py):
```
pip install django-cors-headers
```
Then add in the settings.py:

```
INSTALLED_APPS = [
    ...
    "corsheaders",
    ...
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    ...
]

CORS_ALLOW_ALL_ORIGINS = True  # for development only!
```

Then restart the Django server:
```
python manage.py runserver
```

10. Add to App.js the line to use ItemList:
```
import './Apps.css'
```

11. Run the React App from the frontend folder:
```
npm start
```
This should open http://localhost:3000, and if your Django server is running on port 8000 and django-cors-headers is configured correctly, you’ll see your inventory items.


## Manage Categories in UI

1. Install React Router
In the frontend folder (bar_inventory/frontend), run:
```
npm install react-router-dom
```
2. Update App.js to use routing.


## Add Category Creation from the React Frontend
This means creating a simple form in React so the user can add a new category through the frontend UI instead of the Django admin.

🧱 Steps:
Create CategoryForm.js inside src/components/

Add the form UI + logic to send data to the backend

Add a new route /categories/create to use this form

1. Create CategoryForm.js inside src/components/

2. Update App.js to Add This Form
Add this import and route:
```
import CategoryForm from './components/CategoryForm';

// Inside <Routes>:
<Route path="/categories/create" element={<CategoryForm />} />

```
And a link in the <nav> to go there:

```
<li><Link to="/categories/create">Add Category</Link></li>
```

## Implementing Delete and Edit Category
1. Update the src/components/Categories.js and modify it to include a Delete button for each category.

2. Create CategoryEditForm.js in src/components/

3. Add Route in App.js
Open the App.js and add:

```
import CategoryEditForm from "./components/CategoryEditForm";
```
Then in the <Routes> block:
```
<Route path="/categories/:id/edit" element={<CategoryEditForm />} />
```

## Apply the same CRUD structure to the Item model.

## Polishing UI

✅ 1. Finalized the High-Level UI Structure

You described your idea for a side navigation layout with the following sections:
 • HOME (center area with an image)
 • INVENTORY (view last closed inventory, close inventory)
 • REPORTS (view statistics)
 • ITEM/CATEGORY (CRUD for items and categories)
 • SETTINGS (optional)

✅ 2. Set Up Folder Structure for Pages and Components

We reorganized your React frontend:
 • Created components/pages/ for your main page views (Home.js, Inventory.js, etc.)
 • Created components/ItemCategory/ and moved your existing item/category files there (e.g., ItemForm.js, CategoryList.js, etc.)

✅ 3. Merged CRUD Components into the ItemCategory Page

You chose Option B: import your existing item/category management components into a unified ItemCategory.js view for easier navigation and grouping.

✅ 4. Updated Your Routes

We updated App.js to reflect the new structure and added a proper route for each page:

<Route path="/" element={<Home />} />
<Route path="/inventory" element={<Inventory />} />
<Route path="/reports" element={<Reports />} />
<Route path="/item-category" element={<ItemCategory />} />
<Route path="/settings" element={<Settings />} />

✅ 5. Fixed Sidebar Navigation

You didn’t see the “Home” link at first, so we:
 • Updated Sidebar.js to include a <NavLink to="/" end>Home</NavLink>
 • Ensured all pages are easily navigable from the left-hand sidebar

✅ 6. Verified Layout Works

You ran the app, saw the sidebar and navigation links working, and confirmed the “Home” page is now displaying correctly.



##17.06.2025

Great! Here’s a clear summary of what we’ve done so far for your React app layout with a collapsible sidebar:

✅ 1. Sidebar Component
 • Created a reusable <Sidebar /> component with navigation links using react-router-dom.
 • Added support for a collapsed and expanded state using the isOpen prop.
 • Passed a closeSidebar callback to auto-hide the sidebar when a link is clicked (on smaller screens).

✅ 2. Sidebar CSS Styling
 • Styled the sidebar with .sidebar, .collapsed, .active-link, and hover styles.
 • Used media queries to:
 • Slide the sidebar off-canvas on small screens (transform: translateX(-100%)).
 • Show it when open using a class toggle (.sidebar.open).
 • Collapse the sidebar width on large screens (width: 60px).

✅ 3. Toggle Button (☰ Hamburger)
 • Added a fixed-position button (.menu-toggle) to toggle sidebar visibility.
 • Ensured it stays visible on all screen sizes, not just mobile.

✅ 4. App Layout
 • Updated App.js:
 • Used useState to track sidebar state (sidebarOpen).
 • Rendered <Sidebar isOpen={sidebarOpen} closeSidebar={...} />.
 • Handled routes using react-router-dom.
 • Moved the toggle button outside of the sidebar so it’s always accessible.

✅ 5. Responsiveness
 • Sidebar behaves properly:
 • On small screens, it slides in/out.
 • On larger screens, it collapses but is still visible with only icons or short width.
 • The main content area adjusts based on sidebar state.


## 18.06.2025
✅ Backend: Django
 • Image support implemented:
 • Added ImageField to the Item model.
 • Installed Pillow to support image uploads.
 • Updated MEDIA_URL and MEDIA_ROOT in settings.py.
 • Verified that uploaded images are saved correctly and can be accessed via http://localhost:8000/media/....
 • Serializers:
 • Confirmed that both CategorySerializer and ItemSerializer correctly expose the image field.
 • No changes needed — serializers are working as expected.
 • URLs:
 • Media URL routing (static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)) was correctly added in backend/urls.py.

⸻

✅ Frontend: React
 • Image Upload via Form:
 • Updated ItemForm.js to include <input type="file" /> for uploading images.
 • Used FormData to send both text fields and images in the POST request to the backend.
 • Image state (setImage) is handled properly.
 • Item Display (ItemList):
 • Added a preview <img /> tag to display each item’s uploaded image.
 • Confirmed correct JSX syntax with backticks and dynamic src.
 • Reactivity:
 • Tied item creation to a refresh trigger using a refreshItems toggle in BarItem.js, ensuring the list updates after a new item is added.

⸻

⚠️ Outstanding Issue
 • Although the image uploads work and the path is valid (you verified http://localhost:8000/media/item_images/... works in the browser), the image still appears broken in the frontend.
 • This is likely not related to your React JSX code, which is correct.
 • We’ll revisit this later — possibly caching, fetch timing, or environmental issue.

## 19.06.2025
✅ Backend (Django):
 1. Models:
 • Confirmed and finalized Category, Item, Recipe, and RecipeIngredient models.
 • Added UNIT_CHOICES and image field for Item.
 • Implemented unit choices (ml, gr, units) for ingredients in recipes.
 2. Serializers:
 • Created serializers for Category, Item, RecipeIngredient, and Recipe.
 • Supported nested creation of Recipe with ingredients.
 3. Views:
 • Created ViewSets for Category and Item.
 • Added ListCreateAPIView for Recipe.
 4. URLs:
 • Set up API routing using api_urls.py.
 • Connected everything through the project’s main urls.py.
 5. Admin:
 • Customized ItemAdminForm to show/hide fields based on category.
 • Registered Recipe and RecipeIngredient models in admin.

⸻

✅ Frontend (React):
 1. Sidebar & Routing:
 • Added /recipe path and button in sidebar.
 • Linked RecipeForm component to router.
 2. Recipe Page (RecipeForm):
 • Built a form for creating a recipe with multiple ingredients.
 • Supported:
 • Dynamic ingredient rows.
 • Unit selection.
 • Form toggle with ➕ / Cancel button.
 • Success message and refresh after creation.
 • Display of saved recipes with filtering by name.
 3. BarItem Page:
 • Implemented search logic similar to the RecipeForm.
 • Fixed state and prop mismatch (searchTerm vs searchQuery).
 • Improved item form creation toggle behavior.
 4. CSS & Styling:
 • Created RecipeForm.css with dark transparent background and white text.
 • Applied consistent layout using .recipe-container.