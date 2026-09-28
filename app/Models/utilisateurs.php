<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Utilisateurs extends Model
{
    protected $table = 'utilisateurs';
    protected $primaryKey = 'idutilisateur';
    public $timestamps = false;

    protected $fillable = ['nom', 'email', 'mot_de_passe'];

    protected $hidden = ['mot_de_passe'];
}