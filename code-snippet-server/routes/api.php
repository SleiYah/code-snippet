<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\TagController;
use App\Http\Controllers\User\SnippetController;

Route::group(["prefix" => "v0.1"], function () {
	Route::group(["middleware" => "auth:api"], function () {
		Route::group(["prefix" => "user"], function () {
			Route::get('/getSnippets/{id}', [SnippetController::class, "getSnippets"]);
			Route::post('/addOrUpdateSnippet/{id?}', [SnippetController::class, "addOrUpdateSnippet"]);
			Route::post('/deleteSnippet/{id}', [SnippetController::class, "deleteSnippet"]);
			Route::post('/search', [SnippetController::class, "search"]);
			Route::get('/getTags/{id}', [TagController::class, "getTags"]);
			Route::post('/getSnippetsByTag/{tagId}', [TagController::class, "getSnippetsByTag"]);


		});
	});
	Route::group(["prefix" => "guest"], function(){
        Route::post('/login', [AuthController::class, "login"]);
        Route::post('/signup', [AuthController::class, "signup"]);

 });
});
