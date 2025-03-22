<?php

namespace App\Http\Controllers\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SnippetController extends Controller
{
        function getSnippets() {

            return response()->json([
                "success" =>true
            ]);

        }

}
