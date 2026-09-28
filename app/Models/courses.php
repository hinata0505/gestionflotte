<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Courses extends Model
{
    protected $table = 'courses';
    protected $primaryKey = 'idcourse';
    public $timestamps = false;

    protected $fillable = [
        'adresse_depart',
        'adresse_arrivee',
        'montant',
        'statut',
        'idlivreur',
        'date_creation',
        'date_prise_en_charge',
        'date_livraison',
        'date_annulation'
    ];

    public function livreur()
    {
        return $this->belongsTo(Livreurs::class, 'idlivreur', 'idlivreur');
    }
}