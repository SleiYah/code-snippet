<?php

namespace App\Models;

use Carbon\Carbon;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements JWTSubject{
    use HasFactory, Notifiable;

    const UPDATED_AT = null;


    protected $hidden = [
        'password',
        'username',
    ];

  

    public function getJWTIdentifier(){
        return $this->getKey();
    }

    public function getJWTCustomClaims(){
        return [];
    }

   
    public function snippets(){
        return $this->hasMany(Snippet::class);
    }
    public function tags(){
        return $this->hasMany(Tag::class);
    }

}
