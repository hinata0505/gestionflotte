namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    protected $table = 'zones';
    protected $primaryKey = 'idzone';
    public $timestamps = false;

    protected $fillable = [
        'nom',
    ];

    public function livreurs()
    {
        return $this->hasMany(Livreur::class, 'idzone', 'idzone');
    }
}