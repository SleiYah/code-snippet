<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['title', 'user_id'];

    public function snippets(){
        return $this->belongsToMany(Snippet::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }
}
