<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['title','description'];
    
    public function notes(){
        return $this->hasMany(Note::class);
    }
}
