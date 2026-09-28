<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Livreurs extends Model
{
    protected $table = 'livreurs';
    protected $primaryKey = 'idlivreur';
    public $timestamps = false;

    protected $fillable = ['nom', 'prenom', 'telephone', 'idzone', 'idvehicule'];

    public function zone()
    {
        return $this->belongsTo(Zones::class, 'idzone', 'idzone');
    }

    public function vehicule()
    {
        return $this->belongsTo(Vehicules::class, 'idvehicule', 'idvehicule');
    }

    public function courses()
    {
        return $this->hasMany(Courses::class, 'idlivreur', 'idlivreur');
    }
}