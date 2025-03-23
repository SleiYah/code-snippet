<?php

namespace App\Http\Controllers\User;

use App\Models\Snippet;
use App\Models\Tag;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function getTags($id)
    {
        $tags = Tag::where('user_id', $id)
            ->whereHas('snippets')
            ->get();

        return response()->json([
            'success' => true,
            'tags' => $tags
        ]);
    }
    public function getSnippetsByTag(Request $request, $tagId)
    {
        $tag = Tag::find($tagId);
        $snippets = $tag->snippets()
            ->where('user_id', $request->user_id)
            ->with('tags')
            ->get();

        return response()->json([
            'success' => true,
            'tag' => $tag,
            'snippets' => $snippets
        ]);
    }
}
