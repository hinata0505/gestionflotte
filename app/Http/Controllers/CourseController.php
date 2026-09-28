<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CourseController extends Controller
{
    public function index()
    {
        return response()->json(Course::with('livreur')->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'adresse_depart' => 'required|string',
            'adresse_arrivee' => 'required|string',
            'montant' => 'required|numeric|min:0',
            'livreur_id' => 'nullable|exists:livreurs,id'
        ]);

        $course = Course::create([
            'adresse_depart' => $validated['adresse_depart'],
            'adresse_arrivee' => $validated['adresse_arrivee'],
            'montant' => $validated['montant'],
            'statut' => 'en_attente',
            'livreur_id' => $validated['livreur_id'] ?? null,
        ]);

        return response()->json($course, 201);
    }

    public function updateStatut(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $nouveauStatut = $request->input('statut');

        if ($course->statut === 'en_attente' && $nouveauStatut === 'prise_en_charge') {
            $course->statut = 'prise_en_charge';
            $course->date_prise_en_charge = Carbon::now();
        } elseif ($course->statut === 'prise_en_charge' && $nouveauStatut === 'livree') {
            $course->statut = 'livree';
            $course->date_livraison = Carbon::now();
        } elseif (in_array($course->statut, ['en_attente', 'prise_en_charge']) && $nouveauStatut === 'annulee') {
            $course->statut = 'annulee';
            $course->date_annulation = Carbon::now();
        } else {
            return response()->json(['error' => 'Changement de statut non autorisé selon la séquence'], 422);
        }

        $course->save();
        return response()->json($course, 200);
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        
        if ($course->statut === 'livree') {
            return response()->json(['error' => 'Impossible de supprimer une course déjà livrée'], 403);
        }

        $course->delete();
        return response()->json(['message' => 'Course supprimée avec succès'], 200);
    }

    public function chiffreAffaires()
    {
        $total = Course::where('statut', 'livree')->sum('montant');

        return response()->json([
            'chiffre_affaires_total' => $total,
            'devise' => 'FCFA'
        ], 200);
    }
}