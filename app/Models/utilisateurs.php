namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Utilisateur extends Authenticatable
{
    protected $table = 'utilisateurs';
    protected $primaryKey = 'idutilisateur';
    public $timestamps = false;

    protected $fillable = ['nom', 'email', 'mot_de_passe'];
    protected $hidden = ['mot_de_passe'];

    // Permet à Laravel Auth d'utiliser 'mot_de_passe' au lieu de 'password'
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }
}