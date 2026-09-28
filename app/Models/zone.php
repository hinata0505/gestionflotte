<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zones extends Model
{
    protected $table = 'zones';
    protected $primaryKey = 'idzone';
    public $timestamps = false;

    protected $fillable = ['nom'];

    public function livreurs()
    {
        return $this->hasMany(Livreurs::class, 'idzone', 'idzone');
    }
}