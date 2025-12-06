const formBtn = document.getElementById('showFormBtn');
const recipesBtn = document.getElementById('showRecipesBtn');
const formSection = document.getElementById('formSection');
const recipesSection = document.getElementById('recipesSection');
const recipeForm = document.getElementById('recipeForm');
const recipesList = document.getElementById('recipesList');
const cancelBtn = document.getElementById('cancelBtn');

let recipes = [];
let editingId = null;

loadRecipes();

formBtn.onclick = () => {
    formSection.classList.remove('hidden');
    recipesSection.classList.add('hidden');
    formBtn.classList.add('active');
    recipesBtn.classList.remove('active');
};

recipesBtn.onclick = () => {
    formSection.classList.add('hidden');
    recipesSection.classList.remove('hidden');
    formBtn.classList.remove('active');
    recipesBtn.classList.add('active');
    loadRecipes();
    recipesSection.scrollIntoView({ behavior: 'smooth' });
};

cancelBtn.onclick = () => {
    recipeForm.reset();
    editingId = null;
    document.getElementById('formTitle').textContent = 'Share Your Recipe';
    document.getElementById('submitBtnText').textContent = 'Post Recipe';
};

recipeForm.onsubmit = async (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        description: document.getElementById('description').value,
        ingredients: document.getElementById('ingredients').value.split('\n').filter(i => i.trim()),
        instructions: document.getElementById('instructions').value.split('\n').filter(i => i.trim()),
        prepTime: parseInt(document.getElementById('prepTime').value),
        cookTime: parseInt(document.getElementById('cookTime').value),
        servings: parseInt(document.getElementById('servings').value),
        category: document.getElementById('category').value
    };
    try {
        const url = editingId ? `/api/recipes/${editingId}` : '/api/recipes';
        const method = editingId ? 'PUT' : 'POST';

        console.log('Sending data:', data);

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        console.log('Response status:', res.status);

        if (!res.ok) {
            let errorMsg = 'Save failed';
            try {
                const errorData = await res.json();
                errorMsg = errorData.message || errorMsg;
                console.log('Server error:', errorData);
            } catch (e) {
                console.log('Could not parse error response');
            }
            throw new Error(errorMsg);
        }

        const result = await res.json();
        console.log('Success:', result);

        alert(editingId ? 'Updated!' : 'Posted!');
        recipeForm.reset();
        editingId = null;
        recipesBtn.click();
    } catch (err) {
        console.error('Full error:', err);
        alert('Error: ' + err.message);
    }
};

const searchInput = document.getElementById('searchInput');
searchInput.oninput = function () {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = recipes.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.author.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.ingredients.some(i => i.toLowerCase().includes(query)) ||
        r.instructions.some(i => i.toLowerCase().includes(query))
    );
    displayRecipes(filtered);
};

const searchBtn = document.getElementById('searchBtn');
searchBtn.onclick = function () {
    recipesSection.classList.remove('hidden');
    formSection.classList.add('hidden');
    formBtn.classList.remove('active');
    recipesBtn.classList.add('active');
    recipesSection.scrollIntoView({ behavior: 'smooth' });
};

const categoryFilter = document.getElementById('categoryFilter');
categoryFilter.onchange = function () {
    const selected = categoryFilter.value;
    let filtered = recipes;
    if (selected !== "") { // "" represents "All Categories"
        filtered = recipes.filter(r => r.category === selected);
    }
    displayRecipes(filtered);
};

async function loadRecipes() {
    try {
        const res = await fetch('/api/recipes');
        recipes = await res.json();
        displayRecipes(recipes);
    } catch (err) {
        recipesList.innerHTML = '<p class="error">Error loading recipes</p>';
    }
}

function displayRecipes(list) {
    if (list.length === 0) {
        recipesList.innerHTML = '<p class="no-recipes">No recipes yet!</p>';
        return;
    }
    recipesList.innerHTML = list.map(r => `
        <div class="recipe-card">
            <div class="recipe-header">
                <h3>${r.title}</h3>
                <span class="category-badge">${r.category}</span>
            </div>
            <p><strong>By:</strong> ${r.author}</p>
            <p>${r.description}</p>
            <div class="recipe-meta">
                <span>Prep: ${r.prepTime}m</span>
                <span>Cook: ${r.cookTime}m</span>
                <span>Serves: ${r.servings}</span>
            </div>
            <div class="recipe-details">
                <h4>Ingredients:</h4>
                <ul>${r.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
                <h4>Instructions:</h4>
                <ol>${r.instructions.map(i => `<li>${i}</li>`).join('')}</ol>
            </div>
            <div class="recipe-actions">
                <button onclick="editRecipe('${r._id}')" class="btn btn-edit">Edit</button>
                <button onclick="deleteRecipe('${r._id}')" class="btn btn-delete">Delete</button>
            </div>
        </div>
    `).join('');
}

async function editRecipe(id) {
    try {
        const res = await fetch(`/api/recipes/${id}`);
        const r = await res.json();
        document.getElementById('title').value = r.title;
        document.getElementById('author').value = r.author;
        document.getElementById('description').value = r.description;
        document.getElementById('ingredients').value = r.ingredients.join('\n');
        document.getElementById('instructions').value = r.instructions.join('\n');
        document.getElementById('prepTime').value = r.prepTime;
        document.getElementById('cookTime').value = r.cookTime;
        document.getElementById('servings').value = r.servings;
        document.getElementById('category').value = r.category;
        editingId = id;
        document.getElementById('formTitle').textContent = 'Edit Recipe';
        document.getElementById('submitBtnText').textContent = 'Update';
        formBtn.click();
    } catch (err) {
        alert('Error loading recipe');
    }
}

async function deleteRecipe(id) {
    if (!confirm('Delete this recipe?')) return;
    try {
        await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
        alert('Deleted!');
        loadRecipes();
    } catch (err) {
        alert('Error deleting');
    }
}

