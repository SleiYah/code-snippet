<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\SnippetController;

Route::group(["prefix" => "v0.1"], function () {
	Route::group(["middleware" => "auth:api"], function () {
		Route::group(["prefix" => "user"], function () {
			Route::get('/getSnippets', [SnippetController::class, "getSnippets"]);

		});
	});
	Route::group(["prefix" => "guest"], function(){
        Route::post('/login', [AuthController::class, "login"]);
        Route::post('/signup', [AuthController::class, "signup"]);
 });
});
