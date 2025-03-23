<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Snippet;
use App\Models\Tag;
use Illuminate\Http\Request;

class SnippetController extends Controller
{
    function getSnippets(string $id)
    {
        $snippets = Snippet::with('tags')->where('user_id', $id)->get();

        return response()->json([
            "success" => true,
            "snippets" => $snippets,
        ]);
    }
    function getSnippetById(string $id)
    {
        $snippet = Snippet::with('tags')->find($id);

        return response()->json([
            "success" => true,
            "snippet" => $snippet,
        ]);
    }
    function addOrUpdateSnippet(Request $request, $id = null)
    {

        if ($id === "add") {
            $snippet = new Snippet;
        } else {
            $snippet = Snippet::find($id);
        }

        $snippet->title = $request->title;
        $snippet->prefix = $request->prefix;
        $snippet->body = $request->body;
        $snippet->favorite = $request->favorite ?? false;
        $snippet->user_id = $request->user_id;

        $snippet->save();

        $tagNames = array_filter(array_map('trim', explode(' ', $request->tags)));

        if (empty($tagNames)) {
            return response()->json(['error' => 'At least one tag is required'], 422);
        }

        $tagIds = [];

        foreach ($tagNames as $tagName) {
            $tag = Tag::firstOrCreate(
                ['title' => $tagName, 'user_id' => $request->user_id]
            );

            $tagIds[] = $tag->id;
        }

        $snippet->tags()->sync($tagIds);
        $snippet = Snippet::with('tags')->find($snippet->id);


        return response()->json([
            'snippet' => $snippet,
        ]);
    }
    public function deleteSnippet($id)
    {
        Snippet::find($id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Snippet deleted successfully'
        ]);
    }
    public function search(Request $request)
{
    $search = $request->search;
    $userId = $request->user_id;
    
    $snippets = Snippet::where('user_id', $userId);
    
    if (!empty($search)) {
        $snippets->where(function($query) use ($search) {
            $query->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('prefix', 'LIKE', "%{$search}%")
                  ->orWhere('body', 'LIKE', "%{$search}%");
        });
    }
    
    $results = $snippets->with('tags')->get();
    
    return response()->json([
        'success' => true,
        'results' =>$results
    ]);
}
}
