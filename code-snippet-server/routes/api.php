<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(["prefix" => "v0.1"], function () {
	Route::group(["middleware" => "auth:api"], function () {

		Route::group(["prefix" => "user"], function () {
			
		});
	});
});
