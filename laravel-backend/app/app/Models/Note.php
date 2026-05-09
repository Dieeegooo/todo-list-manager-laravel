<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = ['task_id','name','state'];
    public function task(){
        return $this->belongsTo(Task::class);
    }
}
