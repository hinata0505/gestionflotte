<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicules extends Model
{
    protected $table = 'vehicules';
    protected $primaryKey = 'idvehicule';
    public $timestamps = false;

    protected $fillable = ['immatriculation', 'type'];

    public function livreur()
    {
        return $this->hasOne(Livreurs::class, 'idvehicule', 'idvehicule');
    }
}