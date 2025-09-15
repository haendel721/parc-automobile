<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Route::middleware(['auth', 'verified', 'role:utilisateur'])->group(function () {
//     Route::get('/dashboard', fn() => Inertia::render('dashboard'))
//         ->name('dashboard');
// });

Route::middleware(['auth', 'verified', 'role:direction'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('dashboard'))
        ->name('dashboard');
});


// Routes produits accessibles par admin uniquement
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/products', [ProductController::class, 'index'])
        ->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])
        ->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])
        ->name('products.store');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])
        ->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])
        ->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])
        ->name('products.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
