namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicule extends Model
{
    protected $table = 'vehicules';
    protected $primaryKey = 'idvehicule';
    public $timestamps = false;

    protected $fillable = [
        'immatriculation',
        'type',
    ];

    public function livreur()
    {
        return $this->hasOne(Livreur::class, 'idvehicule', 'idvehicule');
    }
}